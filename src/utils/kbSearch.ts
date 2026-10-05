import { knowledgeBase } from '../data/index.ts';
import { KnowledgeBaseEntry, KBSearchResult } from '../types.ts';

// Common stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'is', 'are', 'was', 'were', 'it', 'this', 'that', 'these', 'those',
  'leaf', 'leaves', 'plant', 'plants', 'crop', 'crops', 'disease', 'symptom', 'symptoms',
  'very', 'more', 'most', 'some', 'any', 'not', 'can', 'may', 'affected', 'showing'
]);

/**
 * Normalizes a string by lowercasing, replacing punctuation with spaces, and trimming.
 */
function normalizeText(text: string): string {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
}

/**
 * Extracts distinct keywords from text, filtering out common stop words and short tokens.
 */
function extractKeywords(text: string): Set<string> {
  const normalized = normalizeText(text);
  const tokens = normalized.split(/\s+/).filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  return new Set(tokens);
}

/**
 * Converts array or string field values into a single unified search string.
 */
function fieldToString(field: unknown): string {
  if (!field) return '';
  if (Array.isArray(field)) {
    return field.join(' ');
  }
  if (typeof field === 'string') {
    return field;
  }
  return '';
}

/**
 * Searches the Knowledge Base for matches against plant name, growth stage / period, and symptoms text.
 * Case-insensitive scoring:
 * - Plant Name match (up to 50 pts)
 * - Growth Stage / Period match (up to 25 pts)
 * - Condition / Disease title match in symptomsText (up to 30 pts)
 * - Symptom keyword overlap (10 pts per matching symptom keyword)
 * 
 * Returns the top 5 KnowledgeBaseEntry matches sorted by score.
 */
export function findKnowledgeMatches(
  plantName: string,
  stage?: string,
  symptomsText?: string,
  customKB?: KnowledgeBaseEntry[]
): KBSearchResult[] {
  const kb = customKB || knowledgeBase;

  if (!kb || kb.length === 0) {
    return [];
  }

  const normPlant = normalizeText(plantName);
  const normStage = normalizeText(stage || '');
  const normSymptoms = normalizeText(symptomsText || '');
  const symptomKeywords = extractKeywords(symptomsText || '');

  const scoredResults: KBSearchResult[] = [];

  for (const entry of kb) {
    let score = 0;
    let plantMatch = false;
    let stageMatch = false;
    const matchedKeywords: string[] = [];

    // 1. Plant Name Scoring (case-insensitive)
    const entryPlant = normalizeText(entry.plant || entry.crop || '');
    const entryDisease = normalizeText(entry.disease || '');

    if (normPlant) {
      if (entryPlant === normPlant) {
        score += 50;
        plantMatch = true;
      } else if (entryPlant && (entryPlant.includes(normPlant) || normPlant.includes(entryPlant))) {
        score += 35;
        plantMatch = true;
      } else if (entryDisease && (entryDisease.includes(normPlant) || normPlant.includes(entryDisease))) {
        score += 20;
        plantMatch = true;
      }
    }

    // 2. Growth Stage / Period Scoring (case-insensitive)
    if (normStage) {
      const entryStages = normalizeText(
        fieldToString(entry.period || entry.stages || entry.growthStage || entry.stage)
      );

      if (entryStages) {
        if (entryStages.includes(normStage)) {
          score += 25;
          stageMatch = true;
        } else if (
          entryStages.includes('all') ||
          entryStages.includes('any') ||
          entryStages.includes('entire season') ||
          entryStages.includes('all stages')
        ) {
          score += 15;
          stageMatch = true;
        }
      }
    }

    // 3. Direct Disease Match in Symptoms / Condition Text
    if (normSymptoms && entryDisease) {
      if (normSymptoms === entryDisease) {
        score += 40;
      } else if (normSymptoms.includes(entryDisease) || entryDisease.includes(normSymptoms)) {
        score += 25;
      }
    }

    // 4. Symptom Keyword Overlap Scoring (case-insensitive)
    if (symptomKeywords.size > 0) {
      const entrySymptomsText = normalizeText(
        [
          fieldToString(entry.symptoms),
          fieldToString(entry.symptomsText),
          fieldToString(entry.description),
          fieldToString(entry.causes),
        ].join(' ')
      );

      for (const kw of symptomKeywords) {
        if (entrySymptomsText.includes(kw)) {
          score += 10;
          matchedKeywords.push(kw);
        }
      }
    }

    // Include entries with positive score
    if (score > 0) {
      scoredResults.push({
        entry,
        score,
        matchDetails: {
          plantMatch,
          stageMatch,
          matchedKeywords,
        },
      });
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  // Return top 5 matches with their scores
  return scoredResults.slice(0, 5);
}
