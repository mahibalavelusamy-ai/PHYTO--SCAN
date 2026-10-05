import { grainDiseases } from './grains.ts';
import { vegetableDiseases } from './vegetables.ts';
import { fruitDiseases } from './fruits.ts';
import { ornamentalDiseases } from './ornamentals.ts';
import { specialtyDiseases } from './specialties.ts';
import { KnowledgeBaseEntry } from '../types.ts';

/**
 * Combined Knowledge Base array bringing together all five crop domains.
 */
export const knowledgeBase: KnowledgeBaseEntry[] = [
  ...grainDiseases,
  ...vegetableDiseases,
  ...fruitDiseases,
  ...ornamentalDiseases,
  ...specialtyDiseases,
];

// Re-export individual category arrays
export {
  grainDiseases,
  vegetableDiseases,
  fruitDiseases,
  ornamentalDiseases,
  specialtyDiseases,
};

// Aliases for compatibility
export const plantDiseaseKB = knowledgeBase;

export default knowledgeBase;
