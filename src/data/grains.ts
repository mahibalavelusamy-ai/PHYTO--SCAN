import { KnowledgeBaseEntry } from '../types.ts';

/**
 * Grain & Field Crop Diseases Knowledge Base
 * Covering Corn and Soybean.
 */
export const grainDiseases: KnowledgeBaseEntry[] = [
  {
    id: 'corn_common_rust',
    plant: 'Corn',
    disease: 'Common Rust',
    pathogen: 'Puccinia sorghi',
    severity: 'Moderate',
    lossRange: '10% - 30%',
    period: ['Whorl', 'Tasseling', 'Silking'],
    symptoms: [
      'Golden-brown to cinnamon-brown powdery pustules on both leaf surfaces',
      'Pustules rupture epidermal surface releasing airborne urediniospores',
      'Chlorosis and necrosis around dense pustule clusters on older leaves',
    ],
    treatment: {
      organic: ['Sulfur dust application at early onset', 'Prompt residue burial post-harvest'],
      chemical: ['Azoxystrobin + Propiconazole (Quilt)', 'Pyraclostrobin (Headline)'],
      preventive: ['Plant rust-resistant hybrid corn lines with Rp resistance genes'],
    },
    prevention: ['Plant early in the season before airborne spore arrival from southern regions'],
  },
  {
    id: 'corn_northern_leaf_blight',
    plant: 'Corn',
    disease: 'Northern Leaf Blight',
    pathogen: 'Exserohilum turcicum',
    severity: 'Severe',
    lossRange: '30% - 50%',
    period: ['Silking', 'Grain fill'],
    symptoms: [
      'Long elliptical, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm)',
      'Dark olive velvety fungal spores in concentric zones inside lesions',
      'Entire canopy takes on a scorched, frost-damaged appearance',
    ],
    treatment: {
      organic: ['Crop residue management and deep tillage'],
      chemical: ['Azoxystrobin', 'Trifloxystrobin', 'Pyraclostrobin'],
      preventive: ['1-2 year rotation out of continuous corn'],
    },
    prevention: ['Select hybrids carrying Ht resistance genes'],
  },
  {
    id: 'corn_gray_leaf_spot',
    plant: 'Corn',
    disease: 'Gray Leaf Spot',
    pathogen: 'Cercospora zeae-maydis',
    severity: 'Moderate',
    lossRange: '15% - 40%',
    period: ['Tasseling', 'Maturity'],
    symptoms: [
      'Small, tan rectangular lesions strictly bordered by leaf veins',
      'Lesions expand into rectangular blocks 2-7 cm long',
      'Severe blighting and premature stalk lodging',
    ],
    treatment: {
      organic: ['Crop rotation and clean plowing of previous corn stubble'],
      chemical: ['Triazole or strobilurin fungicides at VT/R1 stage'],
      preventive: ['Plant tolerant hybrids and avoid high seeding densities'],
    },
    prevention: ['Avoid continuous no-till corn in high-humidity river valleys'],
  },
];

export const grainsKB = grainDiseases;
export default grainDiseases;
