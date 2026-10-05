/**
 * Plant Disease Class Labels Configuration
 * 
 * Standard agricultural leaf disease ontology based on the PlantVillage dataset
 * and field pathology benchmarks for MobileNetV2 transfer learning.
 * 
 * When your fine-tuned MobileNetV2 model is loaded, the output softmax tensor
 * indices map directly to these class definitions.
 */

export interface PlantDiseaseClassDef {
  index: number;
  label: string;
  commonNameEn: string;
  commonNameTa: string;
  crop: string;
  pathogenType: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'healthy' | 'environmental' | 'unknown';
}

export const PLANT_DISEASE_LABELS: PlantDiseaseClassDef[] = [
  { index: 0, label: 'Apple___Apple_scab', commonNameEn: 'Apple Scab', commonNameTa: 'ஆப்பிள் செதில் நோய்', crop: 'Apple', pathogenType: 'fungal' },
  { index: 1, label: 'Apple___Black_rot', commonNameEn: 'Apple Black Rot', commonNameTa: 'ஆப்பிள் கறுப்பு அழுகல் நோய்', crop: 'Apple', pathogenType: 'fungal' },
  { index: 2, label: 'Apple___Cedar_apple_rust', commonNameEn: 'Cedar Apple Rust', commonNameTa: 'ஆப்பிள் துரு நோய்', crop: 'Apple', pathogenType: 'fungal' },
  { index: 3, label: 'Apple___healthy', commonNameEn: 'Apple (Healthy Leaf)', commonNameTa: 'ஆப்பிள் (ஆரோக்கியமான இலை)', crop: 'Apple', pathogenType: 'healthy' },
  { index: 4, label: 'Blueberry___healthy', commonNameEn: 'Blueberry (Healthy Leaf)', commonNameTa: 'புளூபெர்ரி (ஆரோக்கியமான இலை)', crop: 'Blueberry', pathogenType: 'healthy' },
  { index: 5, label: 'Cherry___Powdery_mildew', commonNameEn: 'Cherry Powdery Mildew', commonNameTa: 'செர்ரி சாம்பல் நோய்', crop: 'Cherry', pathogenType: 'fungal' },
  { index: 6, label: 'Cherry___healthy', commonNameEn: 'Cherry (Healthy Leaf)', commonNameTa: 'செர்ரி (ஆரோக்கியமான இலை)', crop: 'Cherry', pathogenType: 'healthy' },
  { index: 7, label: 'Corn___Cercospora_leaf_spot Gray_leaf_spot', commonNameEn: 'Corn Grey Leaf Spot', commonNameTa: 'சோளம் சாம்பல் இலைப்புள்ளி நோய்', crop: 'Corn', pathogenType: 'fungal' },
  { index: 8, label: 'Corn___Common_rust', commonNameEn: 'Corn Common Rust', commonNameTa: 'சோளம் துரு நோய்', crop: 'Corn', pathogenType: 'fungal' },
  { index: 9, label: 'Corn___Northern_Leaf_Blight', commonNameEn: 'Corn Northern Leaf Blight', commonNameTa: 'சோளம் இலை கருகல் நோய்', crop: 'Corn', pathogenType: 'fungal' },
  { index: 10, label: 'Corn___healthy', commonNameEn: 'Corn (Healthy Leaf)', commonNameTa: 'சோளம் (ஆரோக்கியமான இலை)', crop: 'Corn', pathogenType: 'healthy' },
  { index: 11, label: 'Grape___Black_rot', commonNameEn: 'Grape Black Rot', commonNameTa: 'திராட்சை கறுப்பு அழுகல்', crop: 'Grape', pathogenType: 'fungal' },
  { index: 12, label: 'Grape___Esca_(Black_Measles)', commonNameEn: 'Grape Esca (Black Measles)', commonNameTa: 'திராட்சை எஸ்கா நோய்', crop: 'Grape', pathogenType: 'fungal' },
  { index: 13, label: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', commonNameEn: 'Grape Leaf Blight', commonNameTa: 'திராட்சை இலை கருகல்', crop: 'Grape', pathogenType: 'fungal' },
  { index: 14, label: 'Grape___healthy', commonNameEn: 'Grape (Healthy Leaf)', commonNameTa: 'திராட்சை (ஆரோக்கியமான இலை)', crop: 'Grape', pathogenType: 'healthy' },
  { index: 15, label: 'Orange___Haunglongbing_(Citrus_greening)', commonNameEn: 'Citrus Greening (Huanglongbing)', commonNameTa: 'எலுமிச்சை பச்சை நோய் (HLB)', crop: 'Citrus', pathogenType: 'bacterial' },
  { index: 16, label: 'Peach___Bacterial_spot', commonNameEn: 'Peach Bacterial Spot', commonNameTa: 'பீச் பாக்டீரியா புள்ளி நோய்', crop: 'Peach', pathogenType: 'bacterial' },
  { index: 17, label: 'Peach___healthy', commonNameEn: 'Peach (Healthy Leaf)', commonNameTa: 'பீச் (ஆரோக்கியமான இலை)', crop: 'Peach', pathogenType: 'healthy' },
  { index: 18, label: 'Pepper_bell___Bacterial_spot', commonNameEn: 'Pepper Bell Bacterial Spot', commonNameTa: 'குடைமிளகாய் பாக்டீரியா புள்ளி', crop: 'Pepper Bell', pathogenType: 'bacterial' },
  { index: 19, label: 'Pepper_bell___healthy', commonNameEn: 'Pepper Bell (Healthy Leaf)', commonNameTa: 'குடைமிளகாய் (ஆரோக்கியமான இலை)', crop: 'Pepper Bell', pathogenType: 'healthy' },
  { index: 20, label: 'Potato___Early_blight', commonNameEn: 'Potato Early Blight', commonNameTa: 'உருளைக்கிழங்கு முன்கூட்டிய கருகல்', crop: 'Potato', pathogenType: 'fungal' },
  { index: 21, label: 'Potato___Late_blight', commonNameEn: 'Potato Late Blight', commonNameTa: 'உருளைக்கிழங்கு பின்கூட்டிய கருகல்', crop: 'Potato', pathogenType: 'fungal' },
  { index: 22, label: 'Potato___healthy', commonNameEn: 'Potato (Healthy Leaf)', commonNameTa: 'உருளைக்கிழங்கு (ஆரோக்கியமான இலை)', crop: 'Potato', pathogenType: 'healthy' },
  { index: 23, label: 'Raspberry___healthy', commonNameEn: 'Raspberry (Healthy Leaf)', commonNameTa: 'ராஸ்பெர்ரி (ஆரோக்கியமான இலை)', crop: 'Raspberry', pathogenType: 'healthy' },
  { index: 24, label: 'Soybean___healthy', commonNameEn: 'Soybean (Healthy Leaf)', commonNameTa: 'சோயாபீன் (ஆரோக்கியமான இலை)', crop: 'Soybean', pathogenType: 'healthy' },
  { index: 25, label: 'Squash___Powdery_mildew', commonNameEn: 'Squash Powdery Mildew', commonNameTa: 'பூசணி சாம்பல் நோய்', crop: 'Squash', pathogenType: 'fungal' },
  { index: 26, label: 'Strawberry___Leaf_scorch', commonNameEn: 'Strawberry Leaf Scorch', commonNameTa: 'ஸ்ட்ராபெர்ரி இலை தீய்ந்த நோய்', crop: 'Strawberry', pathogenType: 'fungal' },
  { index: 27, label: 'Strawberry___healthy', commonNameEn: 'Strawberry (Healthy Leaf)', commonNameTa: 'ஸ்ட்ராபெர்ரி (ஆரோக்கியமான இலை)', crop: 'Strawberry', pathogenType: 'healthy' },
  { index: 28, label: 'Tomato___Bacterial_spot', commonNameEn: 'Tomato Bacterial Spot', commonNameTa: 'தக்காளி பாக்டீரியா புள்ளி நோய்', crop: 'Tomato', pathogenType: 'bacterial' },
  { index: 29, label: 'Tomato___Early_blight', commonNameEn: 'Tomato Early Blight', commonNameTa: 'தக்காளி இலை கருகல் நோய்', crop: 'Tomato', pathogenType: 'fungal' },
  { index: 30, label: 'Tomato___Late_blight', commonNameEn: 'Tomato Late Blight', commonNameTa: 'தக்காளி பின்கூட்டிய கருகல் நோய்', crop: 'Tomato', pathogenType: 'fungal' },
  { index: 31, label: 'Tomato___Leaf_Mold', commonNameEn: 'Tomato Leaf Mold', commonNameTa: 'தக்காளி இலை பூஞ்சை நோய்', crop: 'Tomato', pathogenType: 'fungal' },
  { index: 32, label: 'Tomato___Septoria_leaf_spot', commonNameEn: 'Tomato Septoria Leaf Spot', commonNameTa: 'தக்காளி செப்டோரியா இலைப்புள்ளி', crop: 'Tomato', pathogenType: 'fungal' },
  { index: 33, label: 'Tomato___Spider_mites Two-spotted_spider_mite', commonNameEn: 'Tomato Spider Mites Infestation', commonNameTa: 'தக்காளி சிலந்திப் பேன் தாக்குதல்', crop: 'Tomato', pathogenType: 'pest' },
  { index: 34, label: 'Tomato___Target_Spot', commonNameEn: 'Tomato Target Spot', commonNameTa: 'தக்காளி இலக்கு புள்ளி நோய்', crop: 'Tomato', pathogenType: 'fungal' },
  { index: 35, label: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', commonNameEn: 'Tomato Yellow Leaf Curl Virus', commonNameTa: 'தக்காளி இலை சுருள் நச்சுயிரி', crop: 'Tomato', pathogenType: 'viral' },
  { index: 36, label: 'Tomato___Tomato_mosaic_virus', commonNameEn: 'Tomato Mosaic Virus', commonNameTa: 'தக்காளி மொசைக் நச்சுயிரி', crop: 'Tomato', pathogenType: 'viral' },
  { index: 37, label: 'Tomato___healthy', commonNameEn: 'Tomato (Healthy Leaf)', commonNameTa: 'தக்காளி (ஆரோக்கியமான இலை)', crop: 'Tomato', pathogenType: 'healthy' }
];

export function getPlantDiseaseClassByIndex(index: number): PlantDiseaseClassDef | undefined {
  return PLANT_DISEASE_LABELS.find((item) => item.index === index);
}

export function getPlantDiseaseClassByLabel(label: string): PlantDiseaseClassDef | undefined {
  if (!label) return undefined;
  const normalized = label.trim().toLowerCase();
  return PLANT_DISEASE_LABELS.find((item) => item.label.toLowerCase() === normalized);
}

/**
 * The 14 crops covered by the PlantVillage dataset on which the MobileNetV2 custom model is trained.
 */
export const SUPPORTED_PLANTVILLAGE_CROPS: readonly string[] = [
  'Apple',
  'Blueberry',
  'Cherry',
  'Corn',
  'Grape',
  'Citrus',
  'Peach',
  'Pepper Bell',
  'Potato',
  'Raspberry',
  'Soybean',
  'Squash',
  'Strawberry',
  'Tomato',
];

/**
 * Helper to check whether a given plant / crop name is within the custom on-device model's 14 crops.
 */
export function isCropSupportedByCustomModel(cropName?: string): boolean {
  if (!cropName) return false;
  const normalized = cropName.toLowerCase().replace(/[_-]/g, ' ').trim();
  return SUPPORTED_PLANTVILLAGE_CROPS.some((c) => {
    const cNorm = c.toLowerCase();
    return normalized.includes(cNorm) || cNorm.includes(normalized);
  });
}
