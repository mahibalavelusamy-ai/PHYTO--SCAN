/**
 * Preprocessing module for MobileNetV3-Large pipeline.
 * Normalizes input plant image to 224x224 RGB dimensions and validates image exposure quality.
 */
import * as tf from '@tensorflow/tfjs';
import { PreprocessedImageData } from './types';

/**
 * Preprocesses an input image tensor for MobileNetV3-Large plant disease inference.
 * Resizes bilinear to 224x224 RGB and normalizes pixel intensities [-1, 1].
 */
export function preprocessForPlantMobileNetV3(
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

// Backward compatibility alias
export const preprocessForPlantMobileNetV2 = preprocessForPlantMobileNetV3;

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

        // MobileNetV3-Large standard input is 224x224 RGB
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable for image preprocessing.');
        }

        ctx.drawImage(img, 0, 0, 224, 224);
        const normalizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

        // Quality check on exposure, lighting, and contrast
        const imgData = ctx.getImageData(0, 0, 224, 224);
        const data = imgData.data;

        let totalBrightness = 0;
        const numPixels = data.length / 4;
        const sampleStep = 8;
        let samplesTaken = 0;

        for (let i = 0; i < data.length; i += 4 * sampleStep) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
          samplesTaken++;
        }

        const avgBrightness = totalBrightness / Math.max(1, samplesTaken);

        let varianceSum = 0;
        for (let i = 0; i < data.length; i += 4 * sampleStep) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          varianceSum += Math.pow(lum - avgBrightness, 2);
        }
        const contrast = Math.sqrt(varianceSum / Math.max(1, samplesTaken));

        const qualityIssues: string[] = [];
        const isDark = avgBrightness < 40;
        const isBlurry = contrast < 18;

        if (isDark) {
          qualityIssues.push('Low lighting detected on the plant subject.');
        } else if (avgBrightness > 225) {
          qualityIssues.push('Overexposed image lighting.');
        }

        if (isBlurry) {
          qualityIssues.push('Image may lack sufficient sharpness or focus.');
        }

        resolve({
          originalDataUrl: imageSource,
          normalizedDataUrl,
          width: originalWidth,
          height: originalHeight,
          targetResolution: { width: 224, height: 224 },
          colorProfile: {
            averageBrightness: Math.round(avgBrightness),
            contrast: Math.round(contrast),
            qualityIssues,
            isBlurry,
            isDark,
          },
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Unable to decode the plant photograph. Please try another image.'));
    };

    img.src = imageSource;
  });
}
