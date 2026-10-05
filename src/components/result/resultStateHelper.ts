import { PlantAnalysisResult } from '../../services/plantAnalysis/types';

export type ResultState = 'healthy' | 'possible_condition' | 'uncertain' | 'unsupported';

export interface ResultStateMeta {
  id: ResultState;
  label: string;
  badgeLabel: string;
  description: string;
  colorClass: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    dot: string;
  };
}

/**
 * Determines which of the 4 result states an analysis falls into:
 * 1. Healthy - Plant foliage is vigorous with no disease or pathogen lesions
 * 2. Possible Condition - Specific disease, pest, or nutrient deficiency diagnosed
 * 3. Uncertain - Inconclusive, ambiguous symptoms, or below gate threshold; recommends retaking photo
 * 4. Unsupported - Non-leaf photograph, solid color, or outside botanical domain
 */
export function determineResultState(result: PlantAnalysisResult): ResultState {
  if (!result) return 'uncertain';

  const cond = (result.condition || '').toLowerCase().trim();
  const notes = (result.uncertaintyNote || '').toLowerCase();
  const obs = (result.observations || []).join(' ').toLowerCase();
  const causes = (result.possibleCauses || []).join(' ').toLowerCase();

  // 1. Check for Unsupported (Non-leaf, solid color, placeholder, or completely non-botanical)
  const isNonLeaf =
    cond.includes('insufficient image quality') ||
    cond.includes('not a plant') ||
    cond.includes('not a leaf') ||
    cond.includes('unsupported') ||
    cond.includes('solid color') ||
    cond.includes('placeholder') ||
    notes.includes('does not contain a visible plant leaf') ||
    notes.includes('cannot provide a plant health diagnosis because the image does not contain a leaf') ||
    notes.includes('not a plant') ||
    obs.includes('does not contain a visible plant leaf') ||
    obs.includes('solid color') ||
    obs.includes('not a real photograph') ||
    causes.includes('incorrect file uploaded') ||
    causes.includes('camera lens completely blocked') ||
    result.classifierMetadata?.modelStatusNotes?.toLowerCase().includes('non-botanical');

  if (isNonLeaf) {
    return 'unsupported';
  }

  // 2. Check for Uncertain (Inconclusive, Not sure, low confidence, or below gate threshold)
  const isExplicitlyUncertain =
    cond === 'not sure' ||
    cond === 'uncertain' ||
    cond === 'inconclusive' ||
    cond.includes('inconclusive') ||
    cond.includes('uncertain') ||
    cond.includes('indeterminate') ||
    cond.includes('unknown') ||
    result.isBelowGateThreshold === true;

  // Very low confidence when not healthy is also uncertain
  const isLowConfidence = result.confidence < 45 && !cond.includes('healthy');

  if (isExplicitlyUncertain || isLowConfidence) {
    return 'uncertain';
  }

  // 3. Check for Healthy (Plant is healthy, severity is None/Healthy, no pathology)
  const isExplicitlyHealthy =
    cond === 'healthy' ||
    cond.endsWith('healthy') ||
    cond.includes(' healthy') ||
    cond.includes('healthy ') ||
    cond.includes('no disease') ||
    cond.includes('vigor') ||
    ((cond.includes('normal') || cond.includes('health')) &&
      (result.severity?.toLowerCase() === 'none' || result.confidence >= 60));

  if (isExplicitlyHealthy) {
    return 'healthy';
  }

  // 4. Default: Possible Condition (Pathology detected)
  return 'possible_condition';
}

export const RESULT_STATE_METAS: Record<ResultState, ResultStateMeta> = {
  healthy: {
    id: 'healthy',
    label: 'Healthy Foliage',
    badgeLabel: 'Healthy • Prime Foliage',
    description: 'The leaf specimen shows vigorous vegetative growth, optimal green pigmentation, and healthy tissue structure.',
    colorClass: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600',
    },
  },
  possible_condition: {
    id: 'possible_condition',
    label: 'Possible Condition',
    badgeLabel: 'Condition Detected',
    description: 'A plant pathology or nutrient deficiency pattern has been identified.',
    colorClass: {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-900',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      dot: 'bg-rose-600',
    },
  },
  uncertain: {
    id: 'uncertain',
    label: 'Uncertain / Inconclusive',
    badgeLabel: 'Uncertain • Photo Retake Recommended',
    description: 'Image clarity or visual features are insufficient; severity is not determined and photo retake is recommended.',
    colorClass: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      dot: 'bg-amber-600',
    },
  },
  unsupported: {
    id: 'unsupported',
    label: 'Unsupported Subject',
    badgeLabel: 'Unsupported • Leaf Not Detected',
    description: 'The uploaded photo does not contain a recognizable plant leaf.',
    colorClass: {
      bg: 'bg-stone-100',
      border: 'border-stone-300',
      text: 'text-stone-900',
      badge: 'bg-stone-200 text-stone-800 border-stone-300',
      dot: 'bg-stone-600',
    },
  },
};
