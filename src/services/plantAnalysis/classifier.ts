/**
 * MobileNetV3-Large Plant Health Classifier Integration
 * 
 * Executes real TensorFlow.js inference using custom fine-tuned PlantVillage model
 * on MobileNetV3-Large architecture.
 */
import { PreprocessedImageData, ClassifierOutput, ClassifierPrediction } from './types';
import { mobileNetV3Service, MobileNetV3InferenceResult } from '../mobilenetClassifier';

export interface IMobileNetV3Classifier {
  loadModel?(modelUrl: string): Promise<boolean>;
  classify(preprocessed: PreprocessedImageData): Promise<ClassifierOutput>;
}

export class MobileNetV3Classifier implements IMobileNetV3Classifier {
  private readonly confidenceThreshold = 0.60;

  async loadModel(modelUrl: string): Promise<boolean> {
    return mobileNetV3Service.loadCustomPlantDiseaseModel(modelUrl);
  }

  async classify(preprocessed: PreprocessedImageData): Promise<ClassifierOutput> {
    const inferenceResult: MobileNetV3InferenceResult = await mobileNetV3Service.classify(
      preprocessed.normalizedDataUrl
    );

    const first = inferenceResult.topPredictions[0];
    const isHealthy = first?.isHealthy || first?.className?.toLowerCase().includes('healthy') || false;

    const primaryPrediction: ClassifierPrediction = {
      className: inferenceResult.predictedClass,
      probability: inferenceResult.confidence,
      percentage: Math.round(inferenceResult.confidence * 100),
      labelString: first?.labelString,
      crop: first?.crop,
      category: isHealthy ? 'healthy' : 'fungal',
    };

    const topPredictions: ClassifierPrediction[] = inferenceResult.topPredictions.map((p) => ({
      className: p.className,
      probability: p.probability,
      percentage: p.percentage ?? Math.round(p.probability * 100),
      labelString: p.labelString,
      crop: p.crop,
      category: p.isHealthy ? 'healthy' : 'fungal',
    }));

    const top3Predictions: ClassifierPrediction[] = inferenceResult.top3Predictions.map((p) => ({
      className: p.className,
      probability: p.probability,
      percentage: p.percentage ?? Math.round(p.probability * 100),
      labelString: p.labelString,
      crop: p.crop,
      category: p.isHealthy ? 'healthy' : 'fungal',
    }));

    const isConfident = !inferenceResult.isBelowGateThreshold && inferenceResult.confidence >= this.confidenceThreshold;

    return {
      primaryPrediction,
      topPredictions,
      top3Predictions,
      isConfident,
      featureVectorLength: inferenceResult.featureVectorLength,
      modelName: 'MobileNetV3-Large',
      modelType: inferenceResult.modelType,
      isCustomPlantModelLoaded: inferenceResult.isCustomPlantModelLoaded,
      isModelReady: inferenceResult.isModelReady,
      modelStatusMessage: inferenceResult.modelStatusMessage,
      inferenceTimeMs: inferenceResult.inferenceTimeMs,
      isBotanicalSubjectLikely: inferenceResult.isBotanicalSubjectLikely,
      modelStatusNotes: inferenceResult.modelStatus.notes,
      isBelowGateThreshold: inferenceResult.isBelowGateThreshold,
    };
  }
}

export const defaultMobileNetV3Classifier = new MobileNetV3Classifier();
// Backward compatibility exports
export const defaultMobileNetV2Classifier = defaultMobileNetV3Classifier;
export const MobileNetV2Classifier = MobileNetV3Classifier;
