import * as tf from '@tensorflow/tfjs';

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

export interface CustomModelBundle {
  model: tf.LayersModel | tf.GraphModel;
  labels: string[];
  isFromIndexedDB: boolean;
  url: string;
}

export type ModelProgressCallback = (percent: number, message: string) => void;

export async function tryLoadFromIndexedDB(
  notify?: ModelProgressCallback
): Promise<CustomModelBundle | null> {
  try {
    notify?.(30, 'Checking local IndexedDB model cache...');
    const model = await tf.loadLayersModel('indexeddb://phytoscan-model');

    let labels: string[] = [];
    const cachedLabelsStr = localStorage.getItem('phytoscan_custom_model_labels');
    if (cachedLabelsStr) {
      const parsed = JSON.parse(cachedLabelsStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        labels = parsed;
      }
    }

    notify?.(100, 'Custom plant model loaded from offline cache.');
    return {
      model,
      labels,
      isFromIndexedDB: true,
      url: 'indexeddb://phytoscan-model',
    };
  } catch {
    return null;
  }
}

export async function fetchAndCacheCustomModel(
  folderUrl: string,
  notify?: ModelProgressCallback
): Promise<CustomModelBundle | null> {
  const baseUrl = folderUrl.replace(/\/+$/, '');
  const modelJsonUrl = `${baseUrl}/model.json`;
  const labelsJsonUrl = `${baseUrl}/labels.json`;

  notify?.(10, 'Connecting to custom plant model...');

  // If device is offline, prioritize IndexedDB cache
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const cached = await tryLoadFromIndexedDB(notify);
    if (cached) return cached;
  }

  try {
    await tf.ready();

    // 1. Download labels.json
    notify?.(25, 'Downloading model labels...');
    let labels: string[] = [];
    try {
      const labelsResp = await fetch(labelsJsonUrl);
      if (labelsResp.ok) {
        const labelsArray = await labelsResp.json();
        if (Array.isArray(labelsArray)) {
          labels = labelsArray;
          try {
            localStorage.setItem('phytoscan_custom_model_labels', JSON.stringify(labelsArray));
          } catch (e) {
            console.warn('[PhytoScan] Could not cache labels in localStorage:', e);
          }
        }
      }
    } catch (e) {
      console.warn('[PhytoScan] Remote labels download error:', e);
    }

    // 2. Download model weights
    notify?.(40, 'Downloading MobileNetV2 neural weights...');
    let model: tf.LayersModel | tf.GraphModel | null = null;
    try {
      model = await tf.loadLayersModel(modelJsonUrl, {
        onProgress: (fraction: number) => {
          const pct = Math.round(40 + fraction * 50);
          notify?.(pct, `Loading model weights: ${Math.round(fraction * 100)}%`);
        },
      });
    } catch {
      model = await tf.loadGraphModel(modelJsonUrl, {
        onProgress: (fraction: number) => {
          const pct = Math.round(40 + fraction * 50);
          notify?.(pct, `Loading model weights: ${Math.round(fraction * 100)}%`);
        },
      });
    }

    // 3. Cache in IndexedDB
    try {
      if ('save' in model) {
        await (model as tf.LayersModel).save('indexeddb://phytoscan-model');
        console.log('[PhytoScan] Custom model cached to indexeddb://phytoscan-model');
      }
    } catch (saveErr) {
      console.warn('[PhytoScan] Could not cache model to IndexedDB:', saveErr);
    }

    notify?.(100, 'Custom plant model ready.');
    return {
      model,
      labels,
      isFromIndexedDB: false,
      url: baseUrl,
    };
  } catch (err) {
    console.warn(`[PhytoScan] Failed to load remote model from ${baseUrl}:`, err);
    // Fall back to local cache if network request failed
    return tryLoadFromIndexedDB(notify);
  }
}
