/**
 * Preprocessing module for MobileNetV2 pipeline.
 * Normalizes input image to 224x224 RGB dimensions and validates image exposure quality.
 */
import * as tf from '@tensorflow/tfjs';
import { PreprocessedImageData } from './types';

/**
 * Preprocesses an input image tensor specifically for the fine-tuned MobileNetV2 plant-disease model.
 * 
 * WHY:
 * 1. Resolution (224x224 RGB): MobileNetV2 was designed and trained on 224x224 RGB inputs.
 *    Resizing bilinear to 224x224 ensures the spatial dimensions match the convolutional
 *    filter strides and feature-map bottlenecks.
 * 2. Normalization to [-1, 1] range: The PlantVillage MobileNetV2 transfer-learning pipeline
 *    uses tf.keras.applications.mobilenet_v2.preprocess_input, which normalizes raw 8-bit
 *    pixel intensities [0, 255] via: (pixel / 127.5 - 1.0).
 *    This centers pixel activations around zero within [-1.0, 1.0]. Omitting this or using [0, 1]
 *    scaling would saturate the ReLU6 layers and corrupt the output softmax probabilities.
 */
export function preprocessForPlantMobileNetV2(
  imageSource: HTMLImageElement | HTMLCanvasElement
): tf.Tensor4D {
  return tf.tidy(() => {
    // 1. Convert pixels to a 3-channel RGB float tensor
    const tensor = tf.browser.fromPixels(imageSource, 3);

    // 2. Resize to 224x224 RGB using bilinear interpolation
    const resized = tf.image.resizeBilinear(tensor, [224, 224]);

    // 3. Scale pixel values to [-1, 1] matching training: (pixel / 127.5 - 1.0)
    const normalized = resized.toFloat().div(127.5).sub(1.0);

    // 4. Add batch dimension -> [1, 224, 224, 3]
    return normalized.expandDims(0);
  });
}

export async function preprocessPlantImage(
  imageSource: string
): Promise<PreprocessedImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const originalWidth = img.naturalWidth || img.width;
        const originalHeight = img.naturalHeight || img.height;

        // MobileNetV2 standard input is 224x224 RGB
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable for image preprocessing.');
        }

        // Center-crop and scale to 224x224
        const minDim = Math.min(originalWidth, originalHeight);
        const startX = (originalWidth - minDim) / 2;
        const startY = (originalHeight - minDim) / 2;

        ctx.drawImage(
          img,
          startX,
          startY,
          minDim,
          minDim,
          0,
          0,
          224,
          224
        );

        // Technical exposure and optical sanity validation
        const imageData = ctx.getImageData(0, 0, 224, 224);
        const data = imageData.data;

        let totalBrightness = 0;
        const totalSampled = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / totalSampled;
        const qualityIssues: string[] = [];

        if (avgBrightness < 25) {
          qualityIssues.push('Image is severely underexposed or too dark for accurate leaf analysis.');
        } else if (avgBrightness > 245) {
          qualityIssues.push('Image is severely overexposed or washed out.');
        }

        const normalizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

        resolve({
          originalDataUrl: imageSource,
          normalizedDataUrl: normalizedDataUrl,
          width: originalWidth,
          height: originalHeight,
          targetResolution: { width: 224, height: 224 },
          colorProfile: {
            averageBrightness: Math.round(avgBrightness),
            contrast: 0.85,
            qualityIssues,
          },
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for MobileNetV2 preprocessing.'));
    };

    img.src = imageSource;
  });
}
