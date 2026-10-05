import PptxGenJS from 'pptxgenjs';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';
import { KnowledgeBaseEntry } from '../types.ts';
import { Language, translations } from './i18n.ts';

interface ExportReportOptions {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  kbMatch?: KnowledgeBaseEntry | null;
}

const FONT_FACE = 'Nirmala UI';
const COLOR_PRIMARY = '059669'; // Emerald 600
const COLOR_DARK = '1C1917'; // Stone 900
const COLOR_MUTED = '57534E'; // Stone 600
const COLOR_BG_LIGHT = 'F5FDF8'; // Soft emerald tint
const COLOR_CARD_BORDER = 'E7E5E4'; // Stone 200
const COLOR_CARD_BG = 'FFFFFF';

function getFormattedDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatLossRange(lossRange: any): string {
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

function formatTreatmentText(treatment: any): string {
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

/**
 * Generates and downloads a multi-slide PowerPoint (.pptx) report of the diagnostic result.
 * Executes entirely in-browser with zero server calls.
 */
export async function exportPlantReportToPPTX(options: ExportReportOptions): Promise<string> {
  const { result, imageSrc, language, kbMatch } = options;
  const t = translations[language] || translations.en;
  const dateStr = getFormattedDate();

  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'PhytoScan - AGRIMIND AI';
  pres.title = `PhytoScan Report - ${result.condition}`;

  // Helper to add header banner on slides
  const addSlideHeader = (slide: PptxGenJS.Slide, titleText: string, subtitleText?: string) => {
    slide.background = { color: 'FAFAF9' };

    // Header bar
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

    // Slide section title
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
  };

  // -------------------------------------------------------------
  // SLIDE 1: Title, scan date, photo, condition, confidence, severity
  // -------------------------------------------------------------
  const slide1 = pres.addSlide();
  addSlideHeader(slide1, t.resultsTitle, `Scan Date: ${dateStr}`);

  // Image block on left
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

  // Primary Metrics Card on Right
  slide1.addShape(pres.ShapeType.roundRect, {
    x: 4.4,
    y: 1.8,
    w: 5.0,
    h: 3.2,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });

  // Condition Label & Value
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

  // Confidence & Severity Sub-cards
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

  // Severity Card
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
  slide1.addText(result.severity || 'Moderate', {
    x: 7.1,
    y: 3.75,
    w: 1.9,
    h: 0.6,
    fontFace: FONT_FACE,
    fontSize: 16,
    bold: true,
    color: 'B45309',
    fit: 'shrink',
  });

  // -------------------------------------------------------------
  // SLIDE 2: Observations and Possible Causes
  // -------------------------------------------------------------
  const slide2 = pres.addSlide();
  addSlideHeader(slide2, `${t.whatWeObserved} & ${t.possibleCauses}`);

  // Observations Card (Left Column)
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

  const observationsBullets = (result.observations && result.observations.length > 0)
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

  // Possible Causes Card (Right Column)
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

  const causesBullets = (result.possibleCauses && result.possibleCauses.length > 0)
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

  // -------------------------------------------------------------
  // SLIDE 3: Recommended Actions and Prevention
  // -------------------------------------------------------------
  const slide3 = pres.addSlide();
  addSlideHeader(slide3, `${t.whatYouCanDo} & ${t.prevention}`);

  // Recommended Actions Card (Left Column)
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

  const actionsBullets = (result.recommendedActions && result.recommendedActions.length > 0)
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

  // Prevention Card (Right Column)
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

  const preventionBullets = (result.prevention && result.prevention.length > 0)
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

  // -------------------------------------------------------------
  // SLIDE 4 (Only if KB match exists): Known disease reference
  // -------------------------------------------------------------
  if (kbMatch) {
    const slide4 = pres.addSlide();
    addSlideHeader(slide4, 'Known disease reference', 'Reference data from agricultural knowledge base');

    // Disease & Pathogen Card
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

    // Typical Loss Range Card
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

    // Treatment Card
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

  // -------------------------------------------------------------
  // LAST SLIDE: Uncertainty note & First-level disclaimer
  // -------------------------------------------------------------
  const lastSlide = pres.addSlide();
  addSlideHeader(lastSlide, t.safetyNoteTitle, 'Important advisory regarding AI diagnostics');

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

  lastSlide.addText(result.uncertaintyNote || 'Please consult your local agricultural extension service for definitive confirmation.', {
    x: 0.9,
    y: 2.5,
    w: 8.2,
    h: 1.3,
    fontFace: FONT_FACE,
    fontSize: 11,
    color: '78350F',
    valign: 'top',
  });

  // Explicit mandatory disclaimer banner at the bottom
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

  // Trigger browser download entirely on client-side
  const fileName = `phytoscan-report-${dateStr}.pptx`;
  await pres.writeFile({ fileName });
  return fileName;
}
