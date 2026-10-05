/**
 * Plant Disease Knowledge Base Type Definitions
 */

export interface KnowledgeBaseEntry {
  id?: string;
  plant: string;
  period?: string[] | string;
  disease: string;
  pathogen?: string;
  symptoms: string[] | string;
  lossRange?: string | number | [number, number] | { min?: number; max?: number };
  severity?: string;
  treatment?: string[] | string | {
    organic?: string[];
    chemical?: string[];
    preventive?: string[];
  };
  // Optional / backward-compatible properties
  stages?: string[] | string;
  growthStage?: string[] | string;
  treatments?: any;
  causes?: string[] | string;
  prevention?: string[];
  category?: string;
  [key: string]: any;
}

// Runtime token to ensure compatibility with non-type-only `import { KnowledgeBaseEntry } from "../types"`
export const KnowledgeBaseEntry = class {};

// Backward-compatible aliases
export type KBEntry = KnowledgeBaseEntry;
export const KBEntry = KnowledgeBaseEntry;

export interface KBSearchResult {
  entry: KnowledgeBaseEntry;
  score: number;
  matchDetails?: {
    plantMatch: boolean;
    stageMatch: boolean;
    matchedKeywords: string[];
  };
}
