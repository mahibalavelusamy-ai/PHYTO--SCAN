/**
 * MobileNetV2 Plant Health Classifier Integration
 * 
 * Executes real TensorFlow.js inference using custom fine-tuned PlantVillage model
 * or fallback MobileNetV2 backbone.
 */
import { PreprocessedImageData, ClassifierOutput, ClassifierPrediction } from './types';
import { mobileNetV2Service, MobileNetInferenceResult } from '../mobilenetClassifier';

export interface IMobileNetV2Classifier {
  loadModel?(modelUrl: string): Promise<boolean>;
  classify(preprocessed: PreprocessedImageData): Promise<ClassifierOutput>;
}

export class MobileNetV2Classifier implements IMobileNetV2Classifier {
  private readonly confidenceThreshold = 0.50;

  async loadModel(modelUrl: string): Promise<boolean> {
    return mobileNetV2Service.loadCustomPlantDiseaseModel(modelUrl);
  }

  async classify(preprocessed: PreprocessedImageData): Promise<ClassifierOutput> {
    const inferenceResult: MobileNetInferenceResult = await mobileNetV2Service.classify(
      preprocessed.normalizedDataUrl
    );

    const primaryPrediction: ClassifierPrediction = {
      className: inferenceResult.predictedClass,
      probability: inferenceResult.confidence,
      percentage: Math.round(inferenceResult.confidence * 100),
      labelString: inferenceResult.topPredictions[0]?.labelString,
      crop: inferenceResult.topPredictions[0]?.crop,
      category: inferenceResult.isCustomPlantModelLoaded ? 'fungal' : 'general',
    };

    const topPredictions: ClassifierPrediction[] = inferenceResult.topPredictions.map((p) => ({
      className: p.className,
      probability: p.probability,
      percentage: p.percentage ?? Math.round(p.probability * 100),
      labelString: p.labelString,
      crop: p.crop,
      category: inferenceResult.isCustomPlantModelLoaded ? 'fungal' : 'general',
    }));

    const top3Predictions: ClassifierPrediction[] = inferenceResult.top3Predictions.map((p) => ({
      className: p.className,
      probability: p.probability,
      percentage: p.percentage ?? Math.round(p.probability * 100),
      labelString: p.labelString,
      crop: p.crop,
      category: inferenceResult.isCustomPlantModelLoaded ? 'fungal' : 'general',
    }));

    const isConfident = !inferenceResult.isBelowGateThreshold && inferenceResult.confidence >= this.confidenceThreshold;

    return {
      primaryPrediction,
      topPredictions,
      top3Predictions,
      isConfident,
      featureVectorLength: inferenceResult.featureVectorLength,
      modelName: inferenceResult.isCustomPlantModelLoaded
        ? 'MobileNetV2-Custom-PlantVillage-38Classes'
        : 'MobileNetV2-ImageNet-Backbone',
      modelType: inferenceResult.modelType,
      isCustomPlantModelLoaded: inferenceResult.isCustomPlantModelLoaded,
      inferenceTimeMs: inferenceResult.inferenceTimeMs,
      isBotanicalSubjectLikely: inferenceResult.isBotanicalSubjectLikely,
      modelStatusNotes: inferenceResult.modelStatus.notes,
      isBelowGateThreshold: inferenceResult.isBelowGateThreshold,
    };
  }
}

export const defaultMobileNetV2Classifier = new MobileNetV2Classifier();
