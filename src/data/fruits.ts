import { KnowledgeBaseEntry } from '../types.ts';

/**
 * Fruit Diseases Knowledge Base
 * Covering Apple, Grape, Peach, Strawberry, Cherry, and Citrus.
 */
export const fruitDiseases: KnowledgeBaseEntry[] = [
  {
    id: 'apple_scab',
    plant: 'Apple',
    disease: 'Apple Scab',
    pathogen: 'Venturia inaequalis',
    severity: 'Moderate',
    lossRange: '20% - 60%',
    period: ['Foliage emergence', 'Fruit set'],
    symptoms: [
      'Olive-green to velvety brown circular lesions on upper leaf surface',
      'Leaves become distorted, puckered, and drop prematurely',
      'Scabby, corky dark blemishes on developing apples',
    ],
    treatment: {
      organic: ['Sulfur or lime sulfur sprays', 'Flail mowing and shredding fallen autumn leaves'],
      chemical: ['Captan', 'Myclobutanil', 'Mancozeb'],
      preventive: ['Apply copper spray before green tip bud stage'],
    },
    prevention: ['Plant scab-resistant cultivars and prune tree canopy for fast drying'],
  },
  {
    id: 'apple_black_rot',
    plant: 'Apple',
    disease: 'Black Rot',
    pathogen: 'Botryosphaeria obtusa',
    severity: 'Moderate',
    lossRange: '15% - 40%',
    period: ['Blossom', 'Fruit ripening'],
    symptoms: [
      'Frog-eye leaf spots with tan centers and purple margins',
      'Dark sunken cankers on tree limbs',
      'Rotting apples turn black, shrivel into mummies adhering to twigs',
    ],
    treatment: {
      organic: ['Prune out dead wood and remove all mummified fruit'],
      chemical: ['Captan', 'Thiophanate-methyl'],
      preventive: ['Sanitation and fire blight management'],
    },
    prevention: ['Protect trees from winter injury and mechanical branch damage'],
  },
  {
    id: 'apple_cedar_rust',
    plant: 'Apple',
    disease: 'Cedar Apple Rust',
    pathogen: 'Gymnosporangium juniperi-virginianae',
    severity: 'Mild',
    lossRange: '10% - 25%',
    period: ['Spring foliage'],
    symptoms: [
      'Bright yellow-orange spots on upper leaf surfaces that enlarge',
      'Tiny black fruiting bodies in center of orange spots',
      'Tube-like projection aecia on leaf underside and fruit calyx',
    ],
    treatment: {
      organic: ['Sulfur sprays starting at pink bud stage', 'Remove eastern red cedar trees nearby'],
      chemical: ['Myclobutanil', 'Mancozeb'],
      preventive: ['Plant immune apple varieties'],
    },
    prevention: ['Avoid planting within 1 km of Juniperus virginiana'],
  },
  {
    id: 'grape_black_rot',
    plant: 'Grape',
    disease: 'Black Rot',
    pathogen: 'Guignardia bidwellii',
    severity: 'Severe',
    lossRange: '30% - 80%',
    period: ['Shoots', 'Berry touch'],
    symptoms: [
      'Reddish-brown circular spots with dark borders on foliage',
      'Infected berries turn brown, soften, and shrivel into hard black wrinkled mummies',
      'Black pycnidia dots dotting the shriveled fruit clusters',
    ],
    treatment: {
      organic: ['Copper hydroxide foliar sprays', 'Complete destruction of cane cankers and mummies'],
      chemical: ['Mancozeb', 'Myclobutanil', 'Ziram'],
      preventive: ['Canopy canopy leaf pulling to maximize direct sunlight on fruit bunches'],
    },
    prevention: ['Prune vines to open umbrella canopy for rapid drying'],
  },
  {
    id: 'citrus_greening',
    plant: 'Citrus',
    disease: 'Citrus Greening (Huanglongbing)',
    pathogen: 'Candidatus Liberibacter asiaticus',
    severity: 'Severe',
    lossRange: '50% - 100%',
    period: ['All stages'],
    symptoms: [
      'Asymmetrical blotchy mottle chlorosis on leaves that crosses leaf veins',
      'Yellow shoot flushes on single branches',
      'Small, lopsided bitter fruits that remain green at stylar end',
      'Severe tree decline, twig dieback, and root decay',
    ],
    treatment: {
      organic: ['Control Asian citrus psyllid vector with horticultural oils and predatory wasps'],
      chemical: ['Systemic insecticides (Imidacloprid) for psyllid vector suppression'],
      preventive: ['Use certified disease-free nursery stock in screened facilities'],
    },
    prevention: ['Immediate rogueing and removal of confirmed infected trees'],
  },
  {
    id: 'peach_bacterial_spot',
    plant: 'Peach',
    disease: 'Bacterial Spot',
    pathogen: 'Xanthomonas arboricola pv. pruni',
    severity: 'Moderate',
    lossRange: '20% - 50%',
    period: ['Spring foliage', 'Fruit development'],
    symptoms: [
      'Water-soaked angular dark spots on leaves that turn purple-black and drop out (shot-hole)',
      'Leaves turn yellow at tips and drop prematurely',
      'Cracking and sunken pitted lesions with bacterial gum on peach fruit',
    ],
    treatment: {
      organic: ['Dormant copper sprays', 'Oxytetracycline where registered'],
      chemical: ['Low-rate copper hydroxide during growing season'],
      preventive: ['Plant windbreaks in sandy soils to prevent abrasive wind injury'],
    },
    prevention: ['Select resistant peach cultivars'],
  },
  {
    id: 'strawberry_leaf_scorch',
    plant: 'Strawberry',
    disease: 'Leaf Scorch',
    pathogen: 'Diplocarpon earlianum',
    severity: 'Mild',
    lossRange: '10% - 30%',
    period: ['Spring to Autumn'],
    symptoms: [
      'Irregular purplish blotches on upper leaf surfaces with indistinct borders',
      'Blotches coalesce until entire leaf turns brown, scorched, and curled upward',
    ],
    treatment: {
      organic: ['Post-harvest renovation mowing and leaf removal', 'Copper sprays'],
      chemical: ['Captan', 'Thiram'],
      preventive: ['Drip irrigation and clean straw bedding'],
    },
    prevention: ['Plant certified disease-free crowns in well-drained soil'],
  },
];

export const fruitsKB = fruitDiseases;
export default fruitDiseases;
