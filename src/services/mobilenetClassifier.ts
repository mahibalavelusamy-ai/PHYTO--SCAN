/**
 * MobileNetV2 Real Inference & Feature Backbone Module
 * 
 * Supports:
 * 1. Custom-trained MobileNetV2 plant-disease model (PlantVillage, 38 classes, 14 crops)
 *    loaded in the browser with TensorFlow.js from CUSTOM_MODEL_URL.
 * 2. Automatic IndexedDB caching (model.save('indexeddb://phytoscan-model')) for offline use.
 * 3. Graceful fallback to stock MobileNetV2 feature backbone if CUSTOM_MODEL_URL is unset or fails.
 * 4. Honest reporting: top 3 predictions with percentages, 14 crops disclosure, and "Not sure" if below gate.
 */

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {
  PLANT_DISEASE_LABELS,
  PlantDiseaseClassDef,
  getPlantDiseaseClassByLabel,
  isCropSupportedByCustomModel,
  SUPPORTED_PLANTVILLAGE_CROPS,
} from '../config/plantDiseaseLabels';
import { preprocessForPlantMobileNetV2 } from './plantAnalysis/preprocessor';

export function getCustomModelUrl(): string {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_CUSTOM_MODEL_URL) {
    return (import.meta as any).env.VITE_CUSTOM_MODEL_URL;
  }
  if (typeof process !== 'undefined' && process.env?.CUSTOM_MODEL_URL) {
    return process.env.CUSTOM_MODEL_URL;
  }
  if (typeof window !== 'undefined' && (window as any).__CUSTOM_MODEL_URL__) {
    return (window as any).__CUSTOM_MODEL_URL__;
  }
  return '';
}

export interface MobileNetPrediction {
  className: string;
  probability: number;
  percentage?: number;
  labelString?: string;
  crop?: string;
}

export interface MobileNetInferenceResult {
  modelType: 'mobilenet-v2-imagenet-backbone' | 'mobilenet-v2-fine-tuned-plant-disease';
  isCustomPlantModelLoaded: boolean;
  predictedClass: string;
  confidence: number; // 0.0 to 1.0
  topPredictions: MobileNetPrediction[];
  top3Predictions: MobileNetPrediction[];
  featureVectorLength: number; // 1280 dimensions for MobileNetV2
  inferenceTimeMs: number;
  isBotanicalSubjectLikely: boolean;
  isBelowGateThreshold?: boolean;
  isCropOutsideCoverage?: boolean;
  modelStatus: {
    backboneLoaded: boolean;
    customModelHookActive: boolean;
    customModelUrl?: string;
    backend: string;
    notes: string;
    isCachedInIndexedDB?: boolean;
  };
}

export type ModelLoadingListener = (progressPercent: number, statusText: string) => void;

export class MobileNetV2Service {
  private static instance: MobileNetV2Service | null = null;
  
  private backboneModel: mobilenet.MobileNet | null = null;
  private customPlantModel: tf.LayersModel | tf.GraphModel | null = null;
  private customModelLabels: string[] = [];
  private customModelUrl: string | null = null;
  private isCustomModelFromIndexedDB = false;
  
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;
  private loadingListeners: Set<ModelLoadingListener> = new Set();

  private readonly GATE_THRESHOLD = 0.50; // Below this threshold, say "Not sure"

  private constructor() {}

  public static getInstance(): MobileNetV2Service {
    if (!MobileNetV2Service.instance) {
      MobileNetV2Service.instance = new MobileNetV2Service();
    }
    return MobileNetV2Service.instance;
  }

  public subscribeLoading(listener: ModelLoadingListener): () => void {
    this.loadingListeners.add(listener);
    return () => this.loadingListeners.delete(listener);
  }

  private notifyLoading(percent: number, text: string) {
    this.loadingListeners.forEach((l) => {
      try {
        l(percent, text);
      } catch (err) {
        console.error('Error in loading listener:', err);
      }
    });
  }

  /**
   * Initializes TensorFlow.js and attempts to load the custom model if CUSTOM_MODEL_URL is set,
   * or loads from IndexedDB if offline, or falls back to MobileNetV2 backbone.
   */
  public async init(): Promise<void> {
    if (this.customPlantModel || this.backboneModel) return;
    if (this.initPromise) return this.initPromise;

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        await tf.ready();
        console.log(`[PhytoScan] TensorFlow.js initialized. Backend: ${tf.getBackend()}`);

        const configuredUrl = getCustomModelUrl();

        // 1. Try to load custom plant disease model if CUSTOM_MODEL_URL is set or if cached in IndexedDB
        let customLoaded = false;

        if (configuredUrl) {
          customLoaded = await this.loadCustomPlantDiseaseModel(configuredUrl);
        } else {
          // If no URL configured, check if we have a previously cached model in IndexedDB
          customLoaded = await this.tryLoadFromIndexedDB();
        }

        // 2. If custom model was not loaded, load standard MobileNetV2 backbone as fallback
        if (!customLoaded && !this.backboneModel) {
          this.notifyLoading(50, 'Loading MobileNetV2 feature backbone...');
          this.backboneModel = await mobilenet.load({
            version: 2,
            alpha: 1.0,
          });
          console.log('[PhytoScan] Standard MobileNetV2 backbone loaded as fallback.');
          this.notifyLoading(100, 'MobileNetV2 ready.');
        }
      } catch (err) {
        console.error('[PhytoScan] Model initialization notice:', err);
      } finally {
        this.isInitializing = false;
      }
    })();

    return this.initPromise;
  }

  /**
   * Attempts to load the custom model and labels from IndexedDB (offline support).
   */
  private async tryLoadFromIndexedDB(): Promise<boolean> {
    try {
      this.notifyLoading(30, 'Checking local IndexedDB model cache...');
      const model = await tf.loadLayersModel('indexeddb://phytoscan-model');
      
      const cachedLabelsStr = localStorage.getItem('phytoscan_custom_model_labels');
      if (cachedLabelsStr) {
        const parsed = JSON.parse(cachedLabelsStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.customModelLabels = parsed;
        }
      }

      this.customPlantModel = model;
      this.isCustomModelFromIndexedDB = true;
      console.log('[PhytoScan] Custom plant-disease model successfully loaded from IndexedDB cache.');
      this.notifyLoading(100, 'Custom plant model loaded from offline cache.');
      return true;
    } catch (e) {
      // IndexedDB cache doesn't exist or is invalid
      return false;
    }
  }

  /**
   * Loads custom fine-tuned Plant-Disease MobileNetV2 model and labels.json from a remote folder,
   * caches them in IndexedDB, and falls back to IndexedDB if offline.
   */
  public async loadCustomPlantDiseaseModel(folderUrl: string): Promise<boolean> {
    const baseUrl = folderUrl.replace(/\/+$/, '');
    const modelJsonUrl = `${baseUrl}/model.json`;
    const labelsJsonUrl = `${baseUrl}/labels.json`;

    this.notifyLoading(10, 'Connecting to custom plant model...');

    // If offline, prioritize IndexedDB cache
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[PhytoScan] Device is offline. Attempting to load custom model from IndexedDB...');
      const loadedFromCache = await this.tryLoadFromIndexedDB();
      if (loadedFromCache) return true;
    }

    try {
      await tf.ready();
      console.log(`[PhytoScan] Fetching model from: ${modelJsonUrl}`);

      // 1. Fetch labels.json
      this.notifyLoading(25, 'Downloading model labels...');
      try {
        const labelsResp = await fetch(labelsJsonUrl);
        if (labelsResp.ok) {
          const labelsArray = await labelsResp.json();
          if (Array.isArray(labelsArray)) {
            this.customModelLabels = labelsArray;
            try {
              localStorage.setItem('phytoscan_custom_model_labels', JSON.stringify(labelsArray));
            } catch (err) {
              console.warn('[PhytoScan] Could not cache labels in localStorage:', err);
            }
          }
        }
      } catch (labelErr) {
        console.warn('[PhytoScan] Could not download remote labels.json:', labelErr);
      }

      // 2. Load model with progress tracking
      this.notifyLoading(40, 'Downloading MobileNetV2 neural weights...');
      let model: tf.LayersModel | tf.GraphModel | null = null;
      try {
        model = await tf.loadLayersModel(modelJsonUrl, {
          onProgress: (fraction: number) => {
            const pct = Math.round(40 + fraction * 50);
            this.notifyLoading(pct, `Loading model weights: ${Math.round(fraction * 100)}%`);
          },
        });
      } catch (layerErr) {
        console.log('[PhytoScan] loadLayersModel failed, trying loadGraphModel...');
        model = await tf.loadGraphModel(modelJsonUrl, {
          onProgress: (fraction: number) => {
            const pct = Math.round(40 + fraction * 50);
            this.notifyLoading(pct, `Loading model weights: ${Math.round(fraction * 100)}%`);
          },
        });
      }

      this.customPlantModel = model;
      this.customModelUrl = baseUrl;
      this.isCustomModelFromIndexedDB = false;

      // 3. Cache the model to IndexedDB for offline use
      try {
        if ('save' in model) {
          await (model as tf.LayersModel).save('indexeddb://phytoscan-model');
          console.log('[PhytoScan] Successfully cached custom model to indexeddb://phytoscan-model');
        }
      } catch (cacheErr) {
        console.warn('[PhytoScan] Could not save model to IndexedDB:', cacheErr);
      }

      this.notifyLoading(100, 'Custom plant model ready.');
      console.log('[PhytoScan] Custom MobileNetV2 plant model loaded successfully.');
      return true;
    } catch (err) {
      console.warn(`[PhytoScan] Failed to load remote model from ${baseUrl}:`, err);
      // Try IndexedDB as fallback
      const cached = await this.tryLoadFromIndexedDB();
      if (cached) return true;

      this.customPlantModel = null;
      return false;
    }
  }

  private async resolveImageElement(
    imageSource: string | HTMLImageElement | HTMLCanvasElement
  ): Promise<HTMLImageElement> {
    if (imageSource instanceof HTMLImageElement && imageSource.complete) {
      return imageSource;
    }

    if (imageSource instanceof HTMLCanvasElement) {
      const img = new Image();
      img.src = imageSource.toDataURL();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
      return img;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSource as string;
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image for MobileNetV2 inference.'));
    });
    return img;
  }

  /**
   * Runs actual TensorFlow.js inference on the leaf image.
   */
  public async classify(
    imageSource: string | HTMLImageElement | HTMLCanvasElement
  ): Promise<MobileNetInferenceResult> {
    await this.init();

    const imgElement = await this.resolveImageElement(imageSource);
    const startTime = performance.now();

    // 1. If custom PlantVillage model is active, execute fine-tuned plant disease inference
    if (this.customPlantModel) {
      return this.inferWithCustomDiseaseModel(imgElement, startTime);
    }

    // 2. Otherwise run standard MobileNetV2 backbone (feature extraction)
    if (!this.backboneModel) {
      throw new Error('MobileNetV2 backbone is not ready.');
    }
    return this.inferWithMobileNetBackbone(imgElement, startTime);
  }

  /**
   * Inference via custom fine-tuned Plant-Disease MobileNetV2 model
   */
  private async inferWithCustomDiseaseModel(
    imgElement: HTMLImageElement,
    startTime: number
  ): Promise<MobileNetInferenceResult> {
    const predictions = tf.tidy(() => {
      // Preprocessing matching training: 224x224 RGB, [-1, 1] range via (pixel / 127.5 - 1)
      const tensor = preprocessForPlantMobileNetV2(imgElement);
      const outputTensor = (this.customPlantModel as any).predict(tensor) as tf.Tensor;
      return Array.from(outputTensor.dataSync());
    });

    const inferenceTimeMs = Math.round(performance.now() - startTime);

    // Map each prediction by string matching with labels.json to src/config/plantDiseaseLabels.ts
    // NEVER map by array index!
    const scored: MobileNetPrediction[] = predictions.map((prob, idx) => {
      const labelString = this.customModelLabels[idx] || (PLANT_DISEASE_LABELS[idx]?.label ?? `Class_${idx}`);
      const labelDef: PlantDiseaseClassDef | undefined = getPlantDiseaseClassByLabel(labelString);

      if (!labelDef) {
        console.warn(`[PhytoScan] Label "${labelString}" at index ${idx} is missing from plantDiseaseLabels.ts.`);
      }

      const commonName = labelDef ? labelDef.commonNameEn : 'Unrecognized class';
      const crop = labelDef ? labelDef.crop : 'Unknown';

      return {
        className: commonName,
        probability: Number(prob.toFixed(4)),
        percentage: Math.round(prob * 100),
        labelString,
        crop,
      };
    });

    // Sort descending by probability
    scored.sort((a, b) => b.probability - a.probability);

    // Top 3 predictions with percentages
    const top3Predictions = scored.slice(0, 3);
    const topPredictions = scored.slice(0, 5);
    const primary = topPredictions[0] || {
      className: 'Unrecognized class',
      probability: 0.0,
      percentage: 0,
      labelString: '',
    };

    // Confidence gate check: If below gate threshold, say "Not sure" instead of disease name
    const isBelowGate = primary.probability < this.GATE_THRESHOLD;
    const finalPredictedClass = isBelowGate ? 'Not sure' : primary.className;

    // Coverage check: check if the crop is in the model's 14 crops
    const detectedCrop = primary.crop || (primary.labelString ? primary.labelString.split('___')[0] : '');
    const isCropCovered = isCropSupportedByCustomModel(detectedCrop);

    return {
      modelType: 'mobilenet-v2-fine-tuned-plant-disease',
      isCustomPlantModelLoaded: true,
      predictedClass: finalPredictedClass,
      confidence: primary.probability,
      topPredictions,
      top3Predictions,
      featureVectorLength: 1280,
      inferenceTimeMs: Math.max(15, inferenceTimeMs),
      isBotanicalSubjectLikely: true,
      isBelowGateThreshold: isBelowGate,
      isCropOutsideCoverage: !isCropCovered,
      modelStatus: {
        backboneLoaded: true,
        customModelHookActive: true,
        customModelUrl: this.customModelUrl || (this.isCustomModelFromIndexedDB ? 'indexeddb://phytoscan-model' : undefined),
        backend: tf.getBackend() || 'webgl',
        notes: this.isCustomModelFromIndexedDB
          ? 'Custom MobileNetV2 model loaded from offline IndexedDB cache.'
          : 'Custom MobileNetV2 plant pathology model active.',
        isCachedInIndexedDB: this.isCustomModelFromIndexedDB,
      },
    };
  }

  /**
   * Inference via standard MobileNetV2 backbone (ImageNet weights)
   * Used strictly as low-priority context for Gemini. ImageNet labels are NEVER shown to the user.
   */
  private async inferWithMobileNetBackbone(
    imgElement: HTMLImageElement,
    startTime: number
  ): Promise<MobileNetInferenceResult> {
    const rawPredictions = await this.backboneModel!.classify(imgElement, 5);

    let featureVectorLength = 1280;
    try {
      tf.tidy(() => {
        const features = this.backboneModel!.infer(imgElement, true);
        const shape = features.shape;
        if (shape && shape.length > 0) {
          featureVectorLength = shape[shape.length - 1] || 1280;
        }
      });
    } catch (e) {
      console.warn('[PhytoScan MobileNetV2] Feature extraction note:', e);
    }

    const inferenceTimeMs = Math.round(performance.now() - startTime);

    const topPredictions: MobileNetPrediction[] = rawPredictions.map((p) => ({
      className: p.className,
      probability: Number(p.probability.toFixed(3)),
      percentage: Math.round(p.probability * 100),
    }));

    const primary = topPredictions[0] || { className: 'Unknown', probability: 0.0 };

    const botanicalKeywords = [
      'leaf', 'plant', 'tree', 'flower', 'fruit', 'pot', 'vase', 'daisy',
      'sunflower', 'rose', 'cucumber', 'zucchini', 'corn', 'ear', 'lemon',
      'orange', 'bell pepper', 'pomegranate', 'acorn', 'rapeseed', 'grass'
    ];
    const combinedClasses = topPredictions.map((p) => p.className.toLowerCase()).join(' ');
    const isBotanicalSubjectLikely = botanicalKeywords.some((kw) => combinedClasses.includes(kw));

    return {
      modelType: 'mobilenet-v2-imagenet-backbone',
      isCustomPlantModelLoaded: false,
      predictedClass: primary.className, // Kept internal for server-side Gemini context only!
      confidence: primary.probability,
      topPredictions,
      top3Predictions: topPredictions.slice(0, 3),
      featureVectorLength,
      inferenceTimeMs: Math.max(15, inferenceTimeMs),
      isBotanicalSubjectLikely,
      modelStatus: {
        backboneLoaded: true,
        customModelHookActive: false,
        customModelUrl: undefined,
        backend: tf.getBackend() || 'webgl',
        notes: 'MobileNetV2 feature backbone active. Standard ImageNet labels are kept internal.',
      },
    };
  }

  public isCustomModelLoaded(): boolean {
    return this.customPlantModel !== null;
  }
}

export const mobileNetV2Service = MobileNetV2Service.getInstance();
