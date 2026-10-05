import PptxGenJS from 'pptxgenjs';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';
import { KnowledgeBaseEntry } from '../types.ts';
import {
  FONT_FACE,
  COLOR_PRIMARY,
  COLOR_DARK,
  COLOR_MUTED,
  COLOR_CARD_BORDER,
  COLOR_CARD_BG,
  addSlideHeader,
} from './reportSlideBuilders.ts';

export function formatLossRange(lossRange: any): string {
  if (!lossRange && lossRange !== 0) return 'N/A';
  if (typeof lossRange === 'string') {
    return lossRange.includes('%') ? lossRange : `${lossRange}%`;
  }
  if (typeof lossRange === 'number') {
    return `${lossRange}%`;
  }
  if (Array.isArray(lossRange)) {
    if (lossRange.length === 2) return `${lossRange[0]}% - ${lossRange[1]}%`;
    return `${lossRange.join('-')}%`;
  }
  if (typeof lossRange === 'object' && ('min' in lossRange || 'max' in lossRange)) {
    return `${lossRange.min ?? 0}% - ${lossRange.max ?? 100}%`;
  }
  return `${String(lossRange)}%`;
}

export function formatTreatmentText(treatment: any): string {
  if (!treatment) return 'None specified';
  if (Array.isArray(treatment)) {
    return treatment.map((t) => `• ${t}`).join('\n');
  }
  if (typeof treatment === 'object') {
    const parts: string[] = [];
    if (treatment.organic) {
      const org = Array.isArray(treatment.organic) ? treatment.organic.join(', ') : treatment.organic;
      parts.push(`Organic: ${org}`);
    }
    if (treatment.chemical) {
      const chem = Array.isArray(treatment.chemical) ? treatment.chemical.join(', ') : treatment.chemical;
      parts.push(`Chemical: ${chem}`);
    }
    if (treatment.preventive) {
      const prev = Array.isArray(treatment.preventive) ? treatment.preventive.join(', ') : treatment.preventive;
      parts.push(`Preventive: ${prev}`);
    }
    return parts.length > 0 ? parts.join('\n\n') : JSON.stringify(treatment);
  }
  return String(treatment);
}

export function buildSlide4(pres: PptxGenJS, kbMatch: KnowledgeBaseEntry) {
  const slide4 = pres.addSlide();
  addSlideHeader(pres, slide4, 'Known disease reference', 'Reference data from agricultural knowledge base');

  slide4.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 1.8,
    w: 8.8,
    h: 1.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.08,
  });

  slide4.addText('DISEASE', {
    x: 0.9,
    y: 1.95,
    w: 4.0,
    h: 0.2,
    fontFace: FONT_FACE,
    fontSize: 8,
    bold: true,
    color: COLOR_MUTED,
  });
  slide4.addText(`${kbMatch.disease}${kbMatch.plant ? ` (${kbMatch.plant})` : ''}`, {
    x: 0.9,
    y: 2.15,
    w: 4.0,
    h: 0.4,
    fontFace: FONT_FACE,
    fontSize: 14,
    bold: true,
    color: COLOR_DARK,
  });

  slide4.addText('PATHOGEN', {
    x: 5.2,
    y: 1.95,
    w: 4.0,
    h: 0.2,
    fontFace: FONT_FACE,
    fontSize: 8,
    bold: true,
    color: COLOR_MUTED,
  });
  slide4.addText(kbMatch.pathogen || kbMatch.scientificName || 'Not specified', {
    x: 5.2,
    y: 2.15,
    w: 4.0,
    h: 0.4,
    fontFace: FONT_FACE,
    fontSize: 13,
    italic: true,
    color: COLOR_DARK,
  });

  slide4.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 3.05,
    w: 8.8,
    h: 0.65,
    fill: { color: 'FEF3C7' },
    line: { color: 'FCD34D', width: 1 },
    rectRadius: 0.06,
  });
  slide4.addText('TYPICAL LOSS RANGE:', {
    x: 0.9,
    y: 3.2,
    w: 3.0,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 9,
    bold: true,
    color: '92400E',
  });
  slide4.addText(formatLossRange(kbMatch.lossRange), {
    x: 3.8,
    y: 3.2,
    w: 5.0,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 12,
    bold: true,
    color: 'B45309',
  });

  slide4.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 3.85,
    w: 8.8,
    h: 1.3,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.08,
  });
  slide4.addText('TREATMENT:', {
    x: 0.9,
    y: 3.95,
    w: 8.2,
    h: 0.25,
    fontFace: FONT_FACE,
    fontSize: 9,
    bold: true,
    color: COLOR_PRIMARY,
  });
  slide4.addText(formatTreatmentText(kbMatch.treatment || kbMatch.treatments), {
    x: 0.9,
    y: 4.25,
    w: 8.2,
    h: 0.8,
    fontFace: FONT_FACE,
    fontSize: 10,
    color: COLOR_DARK,
    valign: 'top',
  });
}

export function buildLastSlide(pres: PptxGenJS, result: PlantAnalysisResult, t: any) {
  const lastSlide = pres.addSlide();
  addSlideHeader(pres, lastSlide, t.safetyNoteTitle, 'Important advisory regarding AI diagnostics');

  lastSlide.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 1.8,
    w: 8.8,
    h: 2.2,
    fill: { color: 'FFFBEB' },
    line: { color: 'FDE68A', width: 1 },
    rectRadius: 0.1,
  });

  lastSlide.addText('Advisory Guidance:', {
    x: 0.9,
    y: 2.1,
    w: 8.2,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 13,
    bold: true,
    color: '92400E',
  });

  lastSlide.addText(
    result.uncertaintyNote ||
      'Please consult your local agricultural extension service for definitive confirmation.',
    {
      x: 0.9,
      y: 2.5,
      w: 8.2,
      h: 1.3,
      fontFace: FONT_FACE,
      fontSize: 11,
      color: '78350F',
      valign: 'top',
    }
  );

  lastSlide.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 4.2,
    w: 8.8,
    h: 0.8,
    fill: { color: 'FEE2E2' },
    line: { color: 'FCA5A5', width: 1 },
    rectRadius: 0.08,
  });

  lastSlide.addText('First-level assistance only, not a laboratory diagnosis.', {
    x: 0.9,
    y: 4.4,
    w: 8.2,
    h: 0.4,
    fontFace: FONT_FACE,
    fontSize: 12,
    bold: true,
    color: '991B1B',
    align: 'center',
  });
}
