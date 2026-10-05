import { KnowledgeBaseEntry } from '../types.ts';

/**
 * Vegetable Diseases Knowledge Base
 * Covering Tomato, Potato, Pepper Bell, and Squash.
 */
export const vegetableDiseases: KnowledgeBaseEntry[] = [
  {
    id: 'tomato_early_blight',
    plant: 'Tomato',
    disease: 'Early Blight',
    pathogen: 'Alternaria solani',
    severity: 'Moderate',
    lossRange: '20% - 50%',
    period: ['Vegetative', 'Flowering', 'Fruiting'],
    symptoms: [
      'Dark brown to black necrotic spots with concentric rings (target-board pattern)',
      'Yellow chlorotic halos surrounding concentric lesions',
      'Lower leaves turn yellow and drop prematurely',
      'Stem collar rot on seedlings and fruit sunken leathery spots',
    ],
    treatment: {
      organic: [
        'Apply copper fungicide or Bacillus subtilis biopesticide at first symptom onset',
        'Prune and destroy infected lower foliage touching soil',
        'Neem oil spray (0.5% concentration) to suppress spore germination',
      ],
      chemical: [
        'Foliar spray of Mancozeb (75% WP @ 2g/L) or Chlorothalonil',
        'Azoxystrobin or Difenoconazole for systemic suppression in severe pressure',
      ],
      preventive: [
        'Practice 3-year crop rotation away from Solanaceae (tomato, potato, eggplant)',
        'Use drip irrigation instead of overhead watering to keep leaf surfaces dry',
        'Apply straw or plastic mulch to prevent soil splashing onto foliage',
      ],
    },
    prevention: [
      'Maintain 60cm row spacing for optimal air circulation',
      'Disinfect pruning tools between plants with 70% alcohol',
      'Plant certified disease-free seeds or resistant hybrids',
    ],
  },
  {
    id: 'tomato_late_blight',
    plant: 'Tomato',
    disease: 'Late Blight',
    pathogen: 'Phytophthora infestans',
    severity: 'Severe',
    lossRange: '50% - 100%',
    period: ['Flowering', 'Fruiting'],
    symptoms: [
      'Large, irregular water-soaked pale green to dark brown lesions',
      'White fluffy fungal growth on underside of leaves under humid conditions',
      'Rapid collapse and blackened vine rot during cool, damp weather',
      'Dark greasy brown rot on green and ripe fruits',
    ],
    treatment: {
      organic: [
        'Copper sulfate or Bordeaux mixture (1%) preventive sprays',
        'Immediately remove and incinerate infected vines',
      ],
      chemical: [
        'Metalaxyl + Mancozeb (Ridomil MZ @ 2.5g/L) or Cymoxanil',
        'Dimethomorph or Mandipropamid systemic fungicides',
      ],
      preventive: [
        'Avoid overhead irrigation; water at base in early morning',
        'Eliminate volunteer potato and nightshade plants nearby',
      ],
    },
    prevention: [
      'Ensure high field ventilation and well-drained raised beds',
      'Monitor relative humidity and apply preventive protection when humidity > 90%',
    ],
  },
  {
    id: 'tomato_leaf_mold',
    plant: 'Tomato',
    disease: 'Leaf Mold',
    pathogen: 'Passalora fulva',
    severity: 'Moderate',
    lossRange: '15% - 35%',
    period: ['Flowering', 'Fruiting'],
    symptoms: [
      'Pale green to yellowish spots on upper leaf surfaces',
      'Olive-green to velvety brown mold growth on lower leaf surfaces',
      'Leaves curl, wither, and drop prematurely in high greenhouse humidity',
    ],
    treatment: {
      organic: ['Copper hydroxide spray', 'Biofungicides containing Trichoderma harzianum'],
      chemical: ['Difenoconazole', 'Chlorothalonil'],
      preventive: ['Ventilate polyhouses to lower humidity below 85%'],
    },
    prevention: ['Increase plant spacing and prune lower suckers to promote air circulation'],
  },
  {
    id: 'tomato_septoria_leaf_spot',
    plant: 'Tomato',
    disease: 'Septoria Leaf Spot',
    pathogen: 'Septoria lycopersici',
    severity: 'Moderate',
    lossRange: '20% - 40%',
    period: ['Vegetative', 'Flowering'],
    symptoms: [
      'Numerous small circular spots (1-3mm) with greyish-white centers and dark borders',
      'Tiny black specks (pycnidia) visible inside central necrotic areas',
      'Rapid progressive yellowing and defoliation from bottom upward',
    ],
    treatment: {
      organic: ['Copper octanoate spray', 'Clean removal of infected ground debris'],
      chemical: ['Mancozeb', 'Chlorothalonil'],
      preventive: ['Mulch thoroughly and avoid wet foliage'],
    },
    prevention: ['Crop rotation and clean staking'],
  },
  {
    id: 'tomato_bacterial_spot',
    plant: 'Tomato',
    disease: 'Bacterial Spot',
    pathogen: 'Xanthomonas vesicatoria',
    severity: 'Severe',
    lossRange: '25% - 60%',
    period: ['Seedling', 'Vegetative', 'Fruiting'],
    symptoms: [
      'Small water-soaked dark spots that turn black and slightly raised',
      'Leaves develop a ragged or shot-hole appearance',
      'Rough, scabby raised black spots on fruits',
    ],
    treatment: {
      organic: ['Fixed copper bactericide mixed with mancozeb for synergistic efficacy'],
      chemical: ['Streptomycin sulfate (where permitted for seedlings)', 'Copper oxychloride'],
      preventive: ['Use hot-water treated or certified disease-free seeds'],
    },
    prevention: ['Avoid overhead sprinklers and working in wet fields'],
  },
  {
    id: 'tomato_healthy',
    plant: 'Tomato',
    disease: 'Healthy Leaf',
    pathogen: 'None (Healthy)',
    severity: 'None',
    lossRange: '0%',
    period: ['All stages'],
    symptoms: ['Vibrant deep green foliage with uniform turgor and no necrotic or chlorotic lesions'],
    treatment: {
      organic: ['Balanced organic compost tea and routine neem oil pest prophylaxis'],
      chemical: ['None required'],
      preventive: ['Maintain balanced N-P-K fertilization and consistent soil moisture'],
    },
    prevention: ['Routine weekly visual scouting'],
  },
  {
    id: 'potato_early_blight',
    plant: 'Potato',
    disease: 'Early Blight',
    pathogen: 'Alternaria solani',
    severity: 'Moderate',
    lossRange: '15% - 40%',
    period: ['Vegetative', 'Tuber bulking'],
    symptoms: [
      'Concentric target-like brown spots on mature foliage',
      'Yellow halos surrounding older leaf spots',
      'Premature defoliation reducing tuber yields',
    ],
    treatment: {
      organic: ['Copper hydroxide foliar sprays', 'Mulching'],
      chemical: ['Chlorothalonil', 'Mancozeb', 'Propiconazole'],
      preventive: ['Adequate nitrogen nutrition to delay crop senescence'],
    },
    prevention: ['Crop rotation away from nightshade crops'],
  },
  {
    id: 'potato_late_blight',
    plant: 'Potato',
    disease: 'Late Blight',
    pathogen: 'Phytophthora infestans',
    severity: 'Severe',
    lossRange: '50% - 100%',
    period: ['Tuber bulking', 'Maturation'],
    symptoms: [
      'Dark water-soaked lesions spreading rapidly during cool moist weather',
      'White spore mold on leaf undersides in high humidity',
      'Brown granular dry rot in potato tubers',
    ],
    treatment: {
      organic: ['Bordeaux mixture', 'Copper oxychloride'],
      chemical: ['Metalaxyl + Mancozeb', 'Cymoxanil', 'Fluopicolide'],
      preventive: ['Plant certified disease-free seed tubers'],
    },
    prevention: ['Hilling soil over tubers to prevent spore washdown'],
  },
  {
    id: 'pepper_bacterial_spot',
    plant: 'Pepper Bell',
    disease: 'Bacterial Spot',
    pathogen: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'Moderate',
    lossRange: '20% - 50%',
    period: ['Vegetative', 'Fruiting'],
    symptoms: [
      'Small, circular dark green water-soaked spots on leaves',
      'Spots turn purplish-brown with pale centers and crack open',
      'Blister-like rough lesions on bell peppers',
    ],
    treatment: {
      organic: ['Copper bactericides', 'Bacillus amyloliquefaciens'],
      chemical: ['Copper hydroxide + Mancozeb tank mix'],
      preventive: ['Disinfect seed with 10% trisodium phosphate'],
    },
    prevention: ['Drip irrigation and eradication of weeds'],
  },
  {
    id: 'squash_powdery_mildew',
    plant: 'Squash',
    disease: 'Powdery Mildew',
    pathogen: 'Podosphaera xanthii',
    severity: 'Moderate',
    lossRange: '15% - 35%',
    period: ['Vegetative', 'Fruiting'],
    symptoms: [
      'White talcum powder-like spots on upper and lower leaf surfaces',
      'Foliage turns chlorotic, dries out, and crisps prematurely',
      'Reduced fruit size and sunburn from canopy loss',
    ],
    treatment: {
      organic: ['Potassium bicarbonate spray (0.5%)', 'Neem oil or sulfur dust'],
      chemical: ['Myclobutanil', 'Trifloxystrobin'],
      preventive: ['Select resistant squash cultivars'],
    },
    prevention: ['Ensure full sun exposure and wide plant spacing'],
  },
];

export const vegetablesKB = vegetableDiseases;
export default vegetableDiseases;
