export const staketIllustrations: string[] = [
  // 1. Markera sträckning med snöre, mät ut stolpplacering
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="110" x2="180" y2="110" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <line x1="30" y1="105" x2="170" y2="105" stroke="#f97316" stroke-width="2" stroke-dasharray="6 5"/>
    <rect x="26" y="95" width="8" height="15" fill="#0f172a"/>
    <rect x="166" y="95" width="8" height="15" fill="#0f172a"/>
    <path d="M90 80 v-15 M82 65 h16" stroke="#475569" stroke-width="2"/>
  </svg>`,

  // 2. Gräv eller borra hål för stolparna
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="115" x2="180" y2="115" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="100" cy="115" rx="22" ry="7" fill="none" stroke="#475569" stroke-width="3"/>
    <path d="M78 115 q22 22 44 0" fill="none" stroke="#475569" stroke-width="3"/>
    <path d="M100 60 v45" stroke="#0f172a" stroke-width="3" stroke-dasharray="4 4"/>
    <path d="M92 60 h16" stroke="#0f172a" stroke-width="2"/>
  </svg>`,

  // 3. Sätt stolparna i våg, gjut eller packa fast
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="93" y="30" width="14" height="85" fill="#f97316"/>
    <ellipse cx="100" cy="112" rx="26" ry="8" fill="#cbd5e1"/>
    <circle cx="65" cy="45" r="10" fill="none" stroke="#0f172a" stroke-width="2"/>
    <path d="M60 45 h10 M65 40 v10" stroke="#0f172a" stroke-width="2"/>
  </svg>`,

  // 4. Låt stolparna stå stadigt innan du fortsätter
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="53" y="30" width="14" height="85" fill="#f97316"/>
    <rect x="133" y="30" width="14" height="85" fill="#f97316"/>
    <ellipse cx="60" cy="112" rx="24" ry="7" fill="#cbd5e1"/>
    <ellipse cx="140" cy="112" rx="24" ry="7" fill="#cbd5e1"/>
    <path d="M155 55 a15 15 0 1 1 -0.1 0" fill="none" stroke="#0f172a" stroke-width="2"/>
    <path d="M155 48 v8 l6 4" stroke="#0f172a" stroke-width="2" fill="none"/>
  </svg>`,

  // 5. Montera vågräta reglar mellan stolparna
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="25" width="14" height="90" fill="#94a3b8"/>
    <rect x="151" y="25" width="14" height="90" fill="#94a3b8"/>
    <rect x="35" y="45" width="130" height="10" fill="#f97316"/>
    <rect x="35" y="95" width="130" height="10" fill="#f97316"/>
  </svg>`,

  // 6. Skruva fast brädorna med jämna mellanrum
  `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="55" width="160" height="8" fill="#94a3b8"/>
    <rect x="20" y="95" width="160" height="8" fill="#94a3b8"/>
    <rect x="30" y="25" width="16" height="90" fill="#f97316"/>
    <rect x="58" y="25" width="16" height="90" fill="#f97316"/>
    <rect x="86" y="25" width="16" height="90" fill="#f97316"/>
    <rect x="114" y="25" width="16" height="90" fill="#f97316"/>
    <rect x="142" y="25" width="16" height="90" fill="#f97316"/>
    <circle cx="38" cy="59" r="2" fill="#0f172a"/>
    <circle cx="66" cy="59" r="2" fill="#0f172a"/>
    <circle cx="94" cy="59" r="2" fill="#0f172a"/>
    <circle cx="122" cy="59" r="2" fill="#0f172a"/>
    <circle cx="150" cy="59" r="2" fill="#0f172a"/>
  </svg>`,
]