export const plattaIllustrations: string[] = [
  // 1. Mät upp och markera ytan
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="50" width="100" height="60" fill="none" stroke="#f97316" stroke-width="3" stroke-dasharray="8 6"/>
    <path d="M30 50 v60" stroke="#0f172a" stroke-width="2"/>
    <path d="M24 50 h12 M24 110 h12" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="125" x2="180" y2="125" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 2. Schakta bort matjord, packa bärlager
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="110" x2="180" y2="110" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <rect x="50" y="95" width="100" height="15" fill="#cbd5e1"/>
    <path d="M140 80 l25 -20 M165 60 l-8 2 M165 60 l-2 8" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
    <ellipse cx="130" cy="95" rx="10" ry="4" fill="#475569"/>
  </svg>`,
  // 3. Bygg formsättning i trä
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="55" width="110" height="55" fill="none" stroke="#f97316" stroke-width="6"/>
    <line x1="45" y1="55" x2="35" y2="45" stroke="#0f172a" stroke-width="3"/>
    <line x1="155" y1="55" x2="165" y2="45" stroke="#0f172a" stroke-width="3"/>
  </svg>`,
  // 4. Lägg armeringsnät med distansklossar
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="55" width="110" height="55" fill="none" stroke="#475569" stroke-width="2"/>
    <line x1="45" y1="70" x2="155" y2="70" stroke="#f97316" stroke-width="2"/>
    <line x1="45" y1="85" x2="155" y2="85" stroke="#f97316" stroke-width="2"/>
    <line x1="45" y1="100" x2="155" y2="100" stroke="#f97316" stroke-width="2"/>
    <line x1="70" y1="55" x2="70" y2="110" stroke="#f97316" stroke-width="2"/>
    <line x1="100" y1="55" x2="100" y2="110" stroke="#f97316" stroke-width="2"/>
    <line x1="130" y1="55" x2="130" y2="110" stroke="#f97316" stroke-width="2"/>
    <rect x="65" y="105" width="10" height="8" fill="#0f172a"/>
    <rect x="125" y="105" width="10" height="8" fill="#0f172a"/>
  </svg>`,
  // 5. Blanda och gjut betongen, jämna med rätskiva
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="70" width="110" height="40" fill="#cbd5e1"/>
    <path d="M60 60 l70 0 l-10 15 l-50 0 z" fill="#94a3b8"/>
    <line x1="45" y1="70" x2="155" y2="70" stroke="#f97316" stroke-width="4"/>
    <path d="M100 70 v-25" stroke="#0f172a" stroke-width="2"/>
    <path d="M92 45 h16" stroke="#0f172a" stroke-width="2"/>
  </svg>`,
  // 6. Låt härda, håll fuktig
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="70" width="110" height="35" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="70" cy="55" r="4" fill="#38bdf8"/>
    <circle cx="100" cy="45" r="4" fill="#38bdf8"/>
    <circle cx="130" cy="55" r="4" fill="#38bdf8"/>
    <path d="M155 60 a15 15 0 1 1 -0.1 0" fill="none" stroke="#f97316" stroke-width="2"/>
    <path d="M155 53 v8 l6 4" stroke="#f97316" stroke-width="2" fill="none"/>
  </svg>`,
]

export const husgrundIllustrations: string[] = [
  // 1. Schakta ur till fast botten, packa bärlager
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="90" width="120" height="20" fill="#cbd5e1"/>
    <path d="M40 90 h120 l-10 -15 h-100 z" fill="#94a3b8"/>
    <line x1="20" y1="110" x2="180" y2="110" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 2. Lägg ut cellplastisolering
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="85" width="110" height="14" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="45" y="70" width="110" height="14" fill="#7dd3fc" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="20" y1="99" x2="180" y2="99" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 3. Montera kantelement, lägg armeringsnät
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="55" width="110" height="55" fill="none" stroke="#f97316" stroke-width="6"/>
    <line x1="45" y1="75" x2="155" y2="75" stroke="#475569" stroke-width="2"/>
    <line x1="45" y1="92" x2="155" y2="92" stroke="#475569" stroke-width="2"/>
    <line x1="80" y1="55" x2="80" y2="110" stroke="#475569" stroke-width="2"/>
    <line x1="120" y1="55" x2="120" y2="110" stroke="#475569" stroke-width="2"/>
  </svg>`,
  // 4. Dra in rör för VA/el
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="55" width="110" height="55" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <path d="M60 110 v-30 q0 -10 15 -10 h20" fill="none" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M140 110 v-20 q0 -10 -15 -10 h-15" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
  </svg>`,
  // 5. Gjut plattan, jämna ytan
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="70" width="110" height="40" fill="#cbd5e1"/>
    <line x1="45" y1="70" x2="155" y2="70" stroke="#f97316" stroke-width="4"/>
    <path d="M60 60 l70 0 l-10 15 l-50 0 z" fill="#94a3b8"/>
  </svg>`,
  // 6. Låt härda, skydda mot uttorkning/frost
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="70" width="110" height="35" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <path d="M45 70 q55 -15 110 0" fill="none" stroke="#f97316" stroke-width="3" stroke-dasharray="6 5"/>
    <path d="M100 30 l0 15 M92 40 l16 0" stroke="#0f172a" stroke-width="2"/>
  </svg>`,
]

export const murIllustrations: string[] = [
  // 1. Gräv ur, lägg stabil grund/fundament
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="95" width="110" height="15" fill="#cbd5e1"/>
    <path d="M45 95 h110 l-8 -12 h-94 z" fill="#94a3b8"/>
    <line x1="20" y1="110" x2="180" y2="110" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 2. Bygg formsättning på båda sidor
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="70" y="35" width="12" height="80" fill="#f97316"/>
    <rect x="118" y="35" width="12" height="80" fill="#f97316"/>
    <line x1="20" y1="115" x2="180" y2="115" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 3. Placera armeringsnät/armeringsjärn centrerat
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="70" y="35" width="12" height="80" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <rect x="118" y="35" width="12" height="80" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <line x1="95" y1="40" x2="95" y2="110" stroke="#0f172a" stroke-width="3"/>
    <line x1="105" y1="40" x2="105" y2="110" stroke="#0f172a" stroke-width="3"/>
    <line x1="90" y1="55" x2="110" y2="55" stroke="#0f172a" stroke-width="3"/>
    <line x1="90" y1="90" x2="110" y2="90" stroke="#0f172a" stroke-width="3"/>
  </svg>`,
  // 4. Gjut i omgångar, vibrera bort luft
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="70" y="35" width="12" height="80" fill="#f97316"/>
    <rect x="118" y="35" width="12" height="80" fill="#f97316"/>
    <rect x="82" y="60" width="36" height="55" fill="#cbd5e1"/>
    <path d="M100 60 q6 -8 0 -16 q-6 8 0 16" stroke="#0f172a" stroke-width="2" fill="none"/>
  </svg>`,
  // 5. Låt formen sitta kvar några dygn
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="70" y="35" width="12" height="80" fill="#f97316"/>
    <rect x="118" y="35" width="12" height="80" fill="#f97316"/>
    <rect x="82" y="35" width="36" height="80" fill="#cbd5e1"/>
    <path d="M150 55 a15 15 0 1 1 -0.1 0" fill="none" stroke="#0f172a" stroke-width="2"/>
    <path d="M150 48 v8 l6 4" stroke="#0f172a" stroke-width="2" fill="none"/>
  </svg>`,
  // 6. Dränering bakom muren
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="90" y="35" width="16" height="80" fill="#94a3b8"/>
    <circle cx="130" cy="90" r="3" fill="#475569"/>
    <circle cx="140" cy="95" r="3" fill="#475569"/>
    <circle cx="132" cy="100" r="3" fill="#475569"/>
    <circle cx="145" cy="85" r="3" fill="#475569"/>
    <path d="M120 105 h60" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
]
