/**
 * High-fidelity sample leaf images rendered as data URLs
 * Enables instant one-click testing of PhytoScan's diagnostic pipeline.
 */

function createLeafSvgDataUrl(type: 'early_blight' | 'corn_rust' | 'healthy' | 'citrus_canker'): string {
  let svgContent = '';

  if (type === 'early_blight') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2a3328"/>
          <stop offset="100%" stop-color="#191f17"/>
        </radialGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#699635"/>
          <stop offset="50%" stop-color="#4e7826"/>
          <stop offset="100%" stop-color="#3c5e1c"/>
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3c220f"/>
          <stop offset="40%" stop-color="#6e421c"/>
          <stop offset="70%" stop-color="#b89327"/>
          <stop offset="100%" stop-color="#4e7826" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg)"/>
      <!-- Tomato leaf outline -->
      <path d="M 250,50 C 340,90 420,180 390,320 C 360,420 280,450 250,470 C 220,450 140,420 110,320 C 80,180 160,90 250,50 Z" fill="url(#leafGrad)" stroke="#324f18" stroke-width="4"/>
      <!-- Main stem & veins -->
      <path d="M 250,60 Q 252,260 250,465" stroke="#7bb33d" stroke-width="6" fill="none"/>
      <path d="M 250,150 Q 320,130 360,160" stroke="#6b9c34" stroke-width="3" fill="none"/>
      <path d="M 250,220 Q 330,200 375,250" stroke="#6b9c34" stroke-width="3" fill="none"/>
      <path d="M 250,290 Q 310,300 340,360" stroke="#6b9c34" stroke-width="3" fill="none"/>
      <path d="M 250,150 Q 180,130 140,160" stroke="#6b9c34" stroke-width="3" fill="none"/>
      <path d="M 250,220 Q 170,200 125,250" stroke="#6b9c34" stroke-width="3" fill="none"/>
      <path d="M 250,290 Q 190,300 160,360" stroke="#6b9c34" stroke-width="3" fill="none"/>
      
      <!-- Early Blight Concentric Bullseye Necrotic Spots with Chlorotic Yellow Halos -->
      <circle cx="210" cy="220" r="45" fill="url(#halo)"/>
      <circle cx="210" cy="220" r="28" fill="#4a2c13" stroke="#2b1709" stroke-width="2"/>
      <circle cx="210" cy="220" r="18" fill="#301c0a" stroke="#1d0d04" stroke-width="2"/>
      <circle cx="210" cy="220" r="8" fill="#1c0f06"/>

      <circle cx="310" cy="310" r="55" fill="url(#halo)"/>
      <circle cx="310" cy="310" r="35" fill="#4a2c13" stroke="#2b1709" stroke-width="3"/>
      <circle cx="310" cy="310" r="22" fill="#301c0a" stroke="#1d0d04" stroke-width="2"/>
      <circle cx="310" cy="310" r="10" fill="#1c0f06"/>

      <circle cx="280" cy="170" r="32" fill="url(#halo)"/>
      <circle cx="280" cy="170" r="18" fill="#4a2c13"/>
      <circle cx="280" cy="170" r="9" fill="#291507"/>
      
      <circle cx="160" cy="340" r="36" fill="url(#halo)"/>
      <circle cx="160" cy="340" r="20" fill="#4a2c13"/>
    </svg>`;
  } else if (type === 'corn_rust') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#243021"/>
          <stop offset="100%" stop-color="#141c12"/>
        </radialGradient>
        <linearGradient id="cornGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4f7d2b"/>
          <stop offset="50%" stop-color="#6fa33c"/>
          <stop offset="100%" stop-color="#446e24"/>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg2)"/>
      <!-- Long elongated corn leaf -->
      <path d="M 120,490 Q 240,250 250,20 Q 260,250 380,490 Z" fill="url(#cornGrad)" stroke="#32521a" stroke-width="3"/>
      <line x1="250" y1="20" x2="250" y2="490" stroke="#87c744" stroke-width="4"/>
      <!-- Parallel veins -->
      <line x1="210" y1="120" x2="170" y2="490" stroke="#5d8f30" stroke-width="1.5"/>
      <line x1="290" y1="120" x2="330" y2="490" stroke="#5d8f30" stroke-width="1.5"/>
      
      <!-- Rust pustules (reddish brown powdery pustules) -->
      <g fill="#993d0c" stroke="#542004" stroke-width="1">
        <ellipse cx="230" cy="180" rx="8" ry="4" transform="rotate(-15 230 180)"/>
        <ellipse cx="270" cy="195" rx="9" ry="5" transform="rotate(10 270 195)"/>
        <ellipse cx="240" cy="240" rx="12" ry="6"/>
        <ellipse cx="265" cy="265" rx="10" ry="5" fill="#b84c11"/>
        <ellipse cx="215" cy="300" rx="11" ry="6"/>
        <ellipse cx="285" cy="320" rx="13" ry="7" fill="#b84c11"/>
        <ellipse cx="250" cy="360" rx="14" ry="7"/>
        <ellipse cx="225" cy="390" rx="10" ry="5"/>
        <ellipse cx="270" cy="420" rx="12" ry="6"/>
        <ellipse cx="245" cy="450" rx="9" ry="5"/>
      </g>
    </svg>`;
  } else if (type === 'citrus_canker') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#212a1e"/>
          <stop offset="100%" stop-color="#121811"/>
        </radialGradient>
        <linearGradient id="citrusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b7428"/>
          <stop offset="100%" stop-color="#28521a"/>
        </linearGradient>
        <radialGradient id="cankerSpot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#544322"/>
          <stop offset="50%" stop-color="#7a5a22"/>
          <stop offset="80%" stop-color="#d6b820"/>
          <stop offset="100%" stop-color="#3b7428" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg3)"/>
      <path d="M 250,40 C 370,120 400,280 340,400 C 290,460 260,470 250,470 C 240,470 210,460 160,400 C 100,280 130,120 250,40 Z" fill="url(#citrusGrad)" stroke="#1a3810" stroke-width="4"/>
      <path d="M 250,45 Q 250,260 250,465" stroke="#5cb33b" stroke-width="5" fill="none"/>
      <!-- Raised corky lesions with water-soaked yellow margins -->
      <circle cx="210" cy="180" r="32" fill="url(#cankerSpot)"/>
      <circle cx="210" cy="180" r="16" fill="#38290f" stroke="#211807" stroke-width="2"/>
      <circle cx="300" cy="270" r="38" fill="url(#cankerSpot)"/>
      <circle cx="300" cy="270" r="19" fill="#38290f" stroke="#211807" stroke-width="2"/>
      <circle cx="190" cy="330" r="28" fill="url(#cankerSpot)"/>
      <circle cx="190" cy="330" r="14" fill="#38290f"/>
    </svg>`;
  } else {
    // Healthy pepper/chilli leaf
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#232e22"/>
          <stop offset="100%" stop-color="#131b12"/>
        </radialGradient>
        <linearGradient id="healthyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#62a832"/>
          <stop offset="50%" stop-color="#42871b"/>
          <stop offset="100%" stop-color="#2e6312"/>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg4)"/>
      <path d="M 250,30 C 370,120 390,300 320,410 C 280,455 255,475 250,480 C 245,475 220,455 180,410 C 110,300 130,120 250,30 Z" fill="url(#healthyGrad)" stroke="#23520d" stroke-width="4"/>
      <!-- Vibrant healthy leaf veins -->
      <path d="M 250,35 Q 252,260 250,475" stroke="#8ae046" stroke-width="5" fill="none"/>
      <path d="M 250,140 Q 320,120 350,160" stroke="#72ba36" stroke-width="2.5" fill="none"/>
      <path d="M 250,210 Q 330,195 365,245" stroke="#72ba36" stroke-width="2.5" fill="none"/>
      <path d="M 250,280 Q 315,280 340,335" stroke="#72ba36" stroke-width="2.5" fill="none"/>
      <path d="M 250,140 Q 180,120 150,160" stroke="#72ba36" stroke-width="2.5" fill="none"/>
      <path d="M 250,210 Q 170,195 135,245" stroke="#72ba36" stroke-width="2.5" fill="none"/>
      <path d="M 250,280 Q 185,280 160,335" stroke="#72ba36" stroke-width="2.5" fill="none"/>
    </svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export interface SamplePlant {
  id: string;
  nameEn: string;
  nameTa: string;
  conditionHint: string;
  dataUrl: string;
}

export type SampleLeaf = SamplePlant;

export const SAMPLE_PLANTS: SamplePlant[] = [
  {
    id: 'early_blight',
    nameEn: 'Tomato (Early Blight)',
    nameTa: 'தக்காளி (இலை கருகல் நோய்)',
    conditionHint: 'Alternaria solani concentric spots',
    dataUrl: createLeafSvgDataUrl('early_blight'),
  },
  {
    id: 'corn_rust',
    nameEn: 'Corn (Common Rust)',
    nameTa: 'சோளம் (துரு நோய்)',
    conditionHint: 'Puccinia sorghi brown pustules',
    dataUrl: createLeafSvgDataUrl('corn_rust'),
  },
  {
    id: 'citrus_canker',
    nameEn: 'Citrus (Canker Lesions)',
    nameTa: 'எலுமிச்சை (திட்டு நோய் / புண்)',
    conditionHint: 'Xanthomonas axonopodis lesions',
    dataUrl: createLeafSvgDataUrl('citrus_canker'),
  },
  {
    id: 'healthy',
    nameEn: 'Pepper (Healthy Plant)',
    nameTa: 'மிளகாய் (ஆரோக்கியமான தாவரம்)',
    conditionHint: 'No infection / Pristine foliage',
    dataUrl: createLeafSvgDataUrl('healthy'),
  },
];

export const SAMPLE_LEAVES = SAMPLE_PLANTS;
