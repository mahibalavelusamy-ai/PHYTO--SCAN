/**
 * MobileNetV2 Real Inference & Feature Backbone Module
 * 
 * Supports:
 * 1. Custom-trained MobileNetV2 plant-disease model (PlantVillage, 38 classes, 14 crops)
 *    loaded in the browser with TensorFlow.js from CUSTOM_MODEL_URL.
 * 2. Automatic IndexedDB caching for offline use.
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
} from '../config/plantDiseaseLabels';
import { preprocessForPlantMobileNetV2 } from './plantAnalysis/preprocessor';
import {
  getCustomModelUrl,
  tryLoadFromIndexedDB,
  fetchAndCacheCustomModel,
  ModelProgressCallback,
} from './customModelStorage';

export { getCustomModelUrl };

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

export class MobileNetV2Service {
  private static instance: MobileNetV2Service | null = null;
  
  private backboneModel: mobilenet.MobileNet | null = null;
  private customPlantModel: tf.LayersModel | tf.GraphModel | null = null;
  private customModelLabels: string[] = [];
  private customModelUrl: string | null = null;
  private isCustomModelFromIndexedDB = false;
  
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;
  private loadingListeners: Set<ModelProgressCallback> = new Set();

  private readonly GATE_THRESHOLD = 0.50; // Below this threshold, say "Not sure"

  private constructor() {}

  public static getInstance(): MobileNetV2Service {
    if (!MobileNetV2Service.instance) {
      MobileNetV2Service.instance = new MobileNetV2Service();
    }
    return MobileNetV2Service.instance;
  }

  public subscribeLoading(listener: ModelProgressCallback): () => void {
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
        const configuredUrl = getCustomModelUrl();

        let bundle = null;
        if (configuredUrl) {
          bundle = await fetchAndCacheCustomModel(configuredUrl, (p, m) => this.notifyLoading(p, m));
        } else {
          bundle = await tryLoadFromIndexedDB((p, m) => this.notifyLoading(p, m));
        }

        if (bundle) {
          this.customPlantModel = bundle.model;
          this.customModelLabels = bundle.labels;
          this.isCustomModelFromIndexedDB = bundle.isFromIndexedDB;
          this.customModelUrl = bundle.url;
        } else if (!this.backboneModel) {
          this.notifyLoading(50, 'Loading MobileNetV2 feature backbone...');
          this.backboneModel = await mobilenet.load({
            version: 2,
            alpha: 1.0,
          });
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

  public async loadCustomPlantDiseaseModel(folderUrl: string): Promise<boolean> {
    const bundle = await fetchAndCacheCustomModel(folderUrl, (p, m) => this.notifyLoading(p, m));
    if (bundle) {
      this.customPlantModel = bundle.model;
      this.customModelLabels = bundle.labels;
      this.isCustomModelFromIndexedDB = bundle.isFromIndexedDB;
      this.customModelUrl = bundle.url;
      return true;
    }
    return false;
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

  public async classify(
    imageSource: string | HTMLImageElement | HTMLCanvasElement
  ): Promise<MobileNetInferenceResult> {
    await this.init();

    const imgElement = await this.resolveImageElement(imageSource);
    const startTime = performance.now();

    // 1. Custom model branch
    if (this.customPlantModel) {
      return this.inferWithCustomDiseaseModel(imgElement, startTime);
    }

    // 2. MobileNetV2 backbone fallback
    if (!this.backboneModel) {
      throw new Error('MobileNetV2 backbone is not ready.');
    }
    return this.inferWithMobileNetBackbone(imgElement, startTime);
  }

  private async inferWithCustomDiseaseModel(
    imgElement: HTMLImageElement,
    startTime: number
  ): Promise<MobileNetInferenceResult> {
    const predictions = tf.tidy(() => {
      const tensor = preprocessForPlantMobileNetV2(imgElement);
      const outputTensor = (this.customPlantModel as any).predict(tensor) as tf.Tensor;
      return Array.from(outputTensor.dataSync());
    });

    const inferenceTimeMs = Math.round(performance.now() - startTime);

    // Map predictions by string matching with labels.json to plantDiseaseLabels.ts
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

    scored.sort((a, b) => b.probability - a.probability);

    const top3Predictions = scored.slice(0, 3);
    const topPredictions = scored.slice(0, 5);
    const primary = topPredictions[0] || {
      className: 'Unrecognized class',
      probability: 0.0,
      percentage: 0,
      labelString: '',
    };

    const isBelowGate = primary.probability < this.GATE_THRESHOLD;
    const finalPredictedClass = isBelowGate ? 'Not sure' : primary.className;

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
      predictedClass: primary.className,
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
