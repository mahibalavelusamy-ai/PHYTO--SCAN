import PptxGenJS from 'pptxgenjs';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';

export const FONT_FACE = 'Nirmala UI';
export const COLOR_PRIMARY = '059669'; // Emerald 600
export const COLOR_DARK = '1C1917'; // Stone 900
export const COLOR_MUTED = '57534E'; // Stone 600
export const COLOR_BG_LIGHT = 'F5FDF8'; // Soft emerald tint
export const COLOR_CARD_BORDER = 'E7E5E4'; // Stone 200
export const COLOR_CARD_BG = 'FFFFFF';

export {
  formatLossRange,
  formatTreatmentText,
  buildSlide4,
  buildLastSlide,
} from './reportSlideRefBuilders.ts';

export function getFormattedDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function addSlideHeader(
  pres: PptxGenJS,
  slide: PptxGenJS.Slide,
  titleText: string,
  subtitleText?: string
) {
  slide.background = { color: 'FAFAF9' };

  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.8,
    fill: { color: COLOR_PRIMARY },
  });

  slide.addText('PhytoScan | AGRIMIND AI Report', {
    x: 0.5,
    y: 0.15,
    w: 9,
    h: 0.45,
    fontFace: FONT_FACE,
    fontSize: 14,
    bold: true,
    color: 'FFFFFF',
  });

  slide.addText(titleText, {
    x: 0.6,
    y: 0.95,
    w: 8.8,
    h: 0.45,
    fontFace: FONT_FACE,
    fontSize: 18,
    bold: true,
    color: COLOR_DARK,
  });

  if (subtitleText) {
    slide.addText(subtitleText, {
      x: 0.6,
      y: 1.4,
      w: 8.8,
      h: 0.3,
      fontFace: FONT_FACE,
      fontSize: 11,
      color: COLOR_MUTED,
    });
  }
}

export function buildSlide1(
  pres: PptxGenJS,
  result: PlantAnalysisResult,
  imageSrc: string,
  t: any,
  dateStr: string
) {
  const slide1 = pres.addSlide();
  addSlideHeader(pres, slide1, t.resultsTitle, `Scan Date: ${dateStr}`);

  if (imageSrc) {
    slide1.addImage({
      data: imageSrc,
      x: 0.6,
      y: 1.8,
      w: 3.5,
      h: 3.2,
      sizing: { type: 'contain', w: 3.5, h: 3.2 },
    });
  }

  slide1.addShape(pres.ShapeType.roundRect, {
    x: 4.4,
    y: 1.8,
    w: 5.0,
    h: 3.2,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });

  slide1.addText(t.possibleCondition.toUpperCase(), {
    x: 4.7,
    y: 2.0,
    w: 4.4,
    h: 0.25,
    fontFace: FONT_FACE,
    fontSize: 9,
    bold: true,
    color: COLOR_MUTED,
  });

  slide1.addText(result.condition, {
    x: 4.7,
    y: 2.3,
    w: 4.4,
    h: 0.8,
    fontFace: FONT_FACE,
    fontSize: 20,
    bold: true,
    color: COLOR_DARK,
    fit: 'shrink',
  });

  slide1.addShape(pres.ShapeType.roundRect, {
    x: 4.7,
    y: 3.3,
    w: 2.1,
    h: 1.4,
    fill: { color: COLOR_BG_LIGHT },
    line: { color: 'A7F3D0', width: 1 },
    rectRadius: 0.08,
  });
  slide1.addText(t.confidence.toUpperCase(), {
    x: 4.8,
    y: 3.45,
    w: 1.9,
    h: 0.2,
    fontFace: FONT_FACE,
    fontSize: 8,
    bold: true,
    color: '065F46',
  });
  slide1.addText(`${result.confidence}%`, {
    x: 4.8,
    y: 3.75,
    w: 1.9,
    h: 0.6,
    fontFace: FONT_FACE,
    fontSize: 24,
    bold: true,
    color: '047857',
  });

  slide1.addShape(pres.ShapeType.roundRect, {
    x: 7.0,
    y: 3.3,
    w: 2.1,
    h: 1.4,
    fill: { color: 'FFFBEB' },
    line: { color: 'FDE68A', width: 1 },
    rectRadius: 0.08,
  });
  slide1.addText(t.severity.toUpperCase(), {
    x: 7.1,
    y: 3.45,
    w: 1.9,
    h: 0.2,
    fontFace: FONT_FACE,
    fontSize: 8,
    bold: true,
    color: '92400E',
  });
  const isHealthy =
    result.condition?.toLowerCase().includes('healthy') ||
    result.severity?.toLowerCase() === 'none';
  const isUncertain =
    result.condition?.toLowerCase().includes('uncertain') ||
    result.condition?.toLowerCase().includes('not sure') ||
    result.condition?.toLowerCase().includes('inconclusive') ||
    result.severity?.toLowerCase().includes('not determined');

  const severityDisplay = isUncertain
    ? 'Not determined'
    : isHealthy
    ? 'None (Clean)'
    : (result.severity || 'Moderate');

  slide1.addText(severityDisplay, {
    x: 7.1,
    y: 3.75,
    w: 1.9,
    h: 0.6,
    fontFace: FONT_FACE,
    fontSize: isUncertain ? 12 : 16,
    bold: true,
    color: isUncertain ? 'B45309' : isHealthy ? '047857' : 'B45309',
    fit: 'shrink',
  });
}

export function buildSlide2(pres: PptxGenJS, result: PlantAnalysisResult, t: any) {
  const slide2 = pres.addSlide();
  addSlideHeader(pres, slide2, `${t.whatWeObserved} & ${t.possibleCauses}`);

  slide2.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 1.8,
    w: 4.2,
    h: 3.2,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });
  slide2.addText(t.whatWeObserved, {
    x: 0.8,
    y: 2.0,
    w: 3.8,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 13,
    bold: true,
    color: COLOR_PRIMARY,
  });

  const observationsBullets =
    result.observations && result.observations.length > 0
      ? result.observations.map((item) => ({
          text: item,
          options: { bullet: true, fontFace: FONT_FACE, fontSize: 10, color: COLOR_DARK, breakLine: true },
        }))
      : [{ text: 'No specific lesion patterns detected.', options: { fontFace: FONT_FACE, fontSize: 10, color: COLOR_MUTED } }];

  slide2.addText(observationsBullets as any, {
    x: 0.8,
    y: 2.4,
    w: 3.8,
    h: 2.4,
    valign: 'top',
  });

  slide2.addShape(pres.ShapeType.roundRect, {
    x: 5.2,
    y: 1.8,
    w: 4.2,
    h: 3.2,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });
  slide2.addText(t.possibleCauses, {
    x: 5.4,
    y: 2.0,
    w: 3.8,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 13,
    bold: true,
    color: '9333EA',
  });

  const causesBullets =
    result.possibleCauses && result.possibleCauses.length > 0
      ? result.possibleCauses.map((item) => ({
          text: item,
          options: { bullet: true, fontFace: FONT_FACE, fontSize: 10, color: COLOR_DARK, breakLine: true },
        }))
      : [{ text: 'Environmental or physiological factors.', options: { fontFace: FONT_FACE, fontSize: 10, color: COLOR_MUTED } }];

  slide2.addText(causesBullets as any, {
    x: 5.4,
    y: 2.4,
    w: 3.8,
    h: 2.4,
    valign: 'top',
  });
}

export function buildSlide3(pres: PptxGenJS, result: PlantAnalysisResult, t: any) {
  const slide3 = pres.addSlide();
  addSlideHeader(pres, slide3, `${t.whatYouCanDo} & ${t.prevention}`);

  slide3.addShape(pres.ShapeType.roundRect, {
    x: 0.6,
    y: 1.8,
    w: 4.2,
    h: 3.2,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });
  slide3.addText(t.whatYouCanDo, {
    x: 0.8,
    y: 2.0,
    w: 3.8,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 13,
    bold: true,
    color: '047857',
  });

  const actionsBullets =
    result.recommendedActions && result.recommendedActions.length > 0
      ? result.recommendedActions.map((item) => ({
          text: item,
          options: { bullet: true, fontFace: FONT_FACE, fontSize: 10, color: COLOR_DARK, breakLine: true },
        }))
      : [{ text: 'Continue monitoring leaf development.', options: { fontFace: FONT_FACE, fontSize: 10, color: COLOR_MUTED } }];

  slide3.addText(actionsBullets as any, {
    x: 0.8,
    y: 2.4,
    w: 3.8,
    h: 2.4,
    valign: 'top',
  });

  slide3.addShape(pres.ShapeType.roundRect, {
    x: 5.2,
    y: 1.8,
    w: 4.2,
    h: 3.2,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });
  slide3.addText(t.prevention, {
    x: 5.4,
    y: 2.0,
    w: 3.8,
    h: 0.3,
    fontFace: FONT_FACE,
    fontSize: 13,
    bold: true,
    color: '1D4ED8',
  });

  const preventionBullets =
    result.prevention && result.prevention.length > 0
      ? result.prevention.map((item) => ({
          text: item,
          options: { bullet: true, fontFace: FONT_FACE, fontSize: 10, color: COLOR_DARK, breakLine: true },
        }))
      : [{ text: 'Adopt clean crop rotation and avoid leaf moisture.', options: { fontFace: FONT_FACE, fontSize: 10, color: COLOR_MUTED } }];

  slide3.addText(preventionBullets as any, {
    x: 5.4,
    y: 2.4,
    w: 3.8,
    h: 2.4,
    valign: 'top',
  });
}
