import PptxGenJS from 'pptxgenjs';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';
import { KnowledgeBaseEntry } from '../types.ts';
import { Language, translations } from './i18n.ts';
import {
  getFormattedDate,
  buildSlide1,
  buildSlide2,
  buildSlide3,
  buildSlide4,
  buildLastSlide,
} from './reportSlideBuilders.ts';

interface ExportReportOptions {
  result: PlantAnalysisResult;
  imageSrc: string;
  language: Language;
  kbMatch?: KnowledgeBaseEntry | null;
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

  // Slide 1: Primary summary (title, date, leaf image, condition, confidence, severity)
  buildSlide1(pres, result, imageSrc, t, dateStr);

  // Slide 2: Observations and Possible Causes
  buildSlide2(pres, result, t);

  // Slide 3: Recommended Actions and Prevention
  buildSlide3(pres, result, t);

  // Slide 4 (Only if KB match exists): Known disease reference
  if (kbMatch) {
    buildSlide4(pres, kbMatch);
  }

  // Last Slide: Uncertainty note & First-level diagnosis disclaimer
  buildLastSlide(pres, result, t);

  // Trigger browser download entirely on client-side
  const fileName = `phytoscan-report-${dateStr}.pptx`;
  await pres.writeFile({ fileName });
  return fileName;
}
