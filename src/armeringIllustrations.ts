import { isoBox, isoFrameBorder, isoGrid, isoPost, isoPipe, isoStirrup, isoDot, isoOutline, isoShadow, isoPt, isoSvg, palette } from './isoHelpers'

// Shared footprint for the "platta"/"husgrund" slab illustrations.
const CX = 108
const CY = 122
const BX = 4.2
const BY = 3

export const plattaIllustrations: string[] = [
  // 1. Mät upp och markera ytan
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    isoOutline(CX, CY, 0.25, 0.25, 2.3, BX - 0.5, BY - 0.5, '#f97316', { dash: '5 4' }) +
    isoPost(CX, CY, 0.25, 0.25, 2, 16, '#0f172a', 3) +
    isoPost(CX, CY, BX - 0.25, BY - 0.25, 2, 16, '#0f172a', 3)
  ),
  // 2. Schakta bort matjord, packa bärlager
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoGrid(CX, CY, 0, 0, 12, BX, BY, 5, 4, '#94a3b8', 1)
  ),
  // 3. Bygg formsättning i trä
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoFrameBorder(CX, CY, 0, 0, 12, BX, BY, 6, 0.35, palette.wood)
  ),
  // 4. Lägg armeringsnät, lyft med distansklossar
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoFrameBorder(CX, CY, 0, 0, 12, BX, BY, 6, 0.35, palette.wood) +
    isoDot(CX, CY, 0.5, 0.5, 12, 2, '#0f172a') +
    isoDot(CX, CY, BX - 0.5, BY - 0.5, 12, 2, '#0f172a') +
    isoGrid(CX, CY, 0.3, 0.3, 15, BX - 0.6, BY - 0.6, 4, 3, '#f97316', 1.6)
  ),
  // 5. Blanda och gjut betongen, jämna med rätskiva
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0.15, 0.15, 12, BX - 0.3, BY - 0.3, 6, palette.wetConcrete) +
    isoFrameBorder(CX, CY, 0, 0, 12, BX, BY, 6, 0.35, palette.wood) +
    isoBox(CX, CY, -0.3, 1.3, 18, BX + 0.6, 0.4, 1.2, palette.wood)
  ),
  // 6. Låt betongen härda, håll fuktig
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0, 0, 12, BX, BY, 6, palette.concrete) +
    isoDot(CX, CY, 0.8, 2.4, 26, 3, '#38bdf8') +
    isoDot(CX, CY, 2.1, 2.7, 30, 3, '#38bdf8') +
    isoDot(CX, CY, 3.2, 2.2, 24, 3, '#38bdf8')
  ),
]

// A cutaway detail of the kantbalk, showing the reinforcement cage through
// semi-transparent concrete: 4 longitudinal Ø12 bars + byglar cc 500.
// Note: X/Y are grid units (scaled ~22px each) but Z/height is in raw pixels,
// so the beam's pixel height must be chosen on that same ~22px-per-unit scale.
const KCX = 84
const KCY = 122
const KL = 5.3
const KW = 1.3
const KH = 28 // pixels - roughly KW * 22 so the beam reads as a square-ish beam, not a flat plank
const KCOVER_Y = 0.22
const KCOVER_Z = 6
const KSTIRRUP_INSET_Y = 0.12
const KSTIRRUP_INSET_Z = 3
const KBAR_OVERHANG = 0.3 // bars poke slightly past the concrete ends, like at a construction joint
const kantbalkDetail = isoSvg(
  isoShadow(KCX, KCY, 0, 0, KL, KW, 0.14) +
  isoPipe(KCX, KCY, -KBAR_OVERHANG, KL, KCOVER_Y, KCOVER_Z, '#334155', 2.8) +
  isoPipe(KCX, KCY, -KBAR_OVERHANG, KL, KW - KCOVER_Y, KCOVER_Z, '#334155', 2.8) +
  isoPipe(KCX, KCY, -KBAR_OVERHANG, KL, KW - KCOVER_Y, KH - KCOVER_Z, '#334155', 2.8) +
  isoPipe(KCX, KCY, -KBAR_OVERHANG, KL, KCOVER_Y, KH - KCOVER_Z, '#334155', 2.8) +
  [0.35, 1.7, 3.05, 4.4].map((x) =>
    isoStirrup(KCX, KCY, x, KSTIRRUP_INSET_Y, KSTIRRUP_INSET_Z, KW - 2 * KSTIRRUP_INSET_Y, KH - 2 * KSTIRRUP_INSET_Z, '#475569', 2)
  ).join('') +
  isoBox(KCX, KCY, 0, 0, 0, KL, KW, KH, palette.wetConcrete, 1.5, 0.55) +
  (() => {
    // "cc 500" callout with a dimension line between two stirrups, in the open space above the beam.
    const [ax1, ay1] = isoPt(KCX, KCY, 1.7, 0.3, KH + 4)
    const [ax2, ay2] = isoPt(KCX, KCY, 3.05, 0.3, KH + 4)
    const labelX = (ax1 + ax2) / 2
    const labelY = ay1 - 20
    return `<line x1="${ax1.toFixed(1)}" y1="${ay1.toFixed(1)}" x2="${labelX.toFixed(1)}" y2="${(labelY + 6).toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>` +
      `<line x1="${ax2.toFixed(1)}" y1="${ay2.toFixed(1)}" x2="${labelX.toFixed(1)}" y2="${(labelY + 6).toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>` +
      `<rect x="${(labelX - 30).toFixed(1)}" y="${(labelY - 11).toFixed(1)}" width="60" height="17" rx="4" fill="#ffffff" fill-opacity="0.9"/>` +
      `<text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">cc 500</text>`
  })() +
  (() => {
    // "Ø12" callout with a leader line pointing at the protruding bar ends.
    const [tipX, tipY] = isoPt(KCX, KCY, -KBAR_OVERHANG, KCOVER_Y, KCOVER_Z)
    const labelX = tipX - 30
    const labelY = tipY + 26
    return `<line x1="${tipX.toFixed(1)}" y1="${tipY.toFixed(1)}" x2="${(labelX + 8).toFixed(1)}" y2="${(labelY - 6).toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>` +
      `<rect x="${(labelX - 14).toFixed(1)}" y="${(labelY - 11).toFixed(1)}" width="60" height="17" rx="4" fill="#ffffff" fill-opacity="0.9"/>` +
      `<text x="${(labelX + 16).toFixed(1)}" y="${labelY.toFixed(1)}" font-size="13" font-weight="700" text-anchor="middle" fill="#0f172a">4×Ø12</text>`
  })(),
  '0 0 220 160'
)

export const husgrundIllustrations: string[] = [
  // 1. Schakta ur till fast botten, packa bärlager
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoGrid(CX, CY, 0, 0, 12, BX, BY, 5, 4, '#94a3b8', 1)
  ),
  // 2. Lägg ut cellplastisolering
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0, 0, 12, BX, BY, 8, palette.insulation) +
    isoGrid(CX, CY, 0, 0, 20, BX, BY, 3, 2, '#0284c7', 1)
  ),
  // 3. Montera kantelement, lägg armeringsnät
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0, 0, 12, BX, BY, 8, palette.insulation) +
    isoFrameBorder(CX, CY, 0, 0, 20, BX, BY, 6, 0.35, palette.wood) +
    isoGrid(CX, CY, 0.3, 0.3, 23, BX - 0.6, BY - 0.6, 4, 3, '#f97316', 1.6)
  ),
  // 4. Kantbalkens armering i detalj
  kantbalkDetail,
  // 5. Dra in rör för VA/el
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0, 0, 12, BX, BY, 8, palette.insulation) +
    isoFrameBorder(CX, CY, 0, 0, 20, BX, BY, 6, 0.35, palette.wood) +
    isoPipe(CX, CY, 0.2, BX - 0.2, 1, 21, '#f97316') +
    isoPipe(CX, CY, 0.2, BX - 0.2, 2, 21, '#334155')
  ),
  // 6. Gjut plattan, jämna ytan
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0, 0, 12, BX, BY, 8, palette.insulation) +
    isoBox(CX, CY, 0.15, 0.15, 20, BX - 0.3, BY - 0.3, 6, palette.wetConcrete) +
    isoFrameBorder(CX, CY, 0, 0, 20, BX, BY, 6, 0.35, palette.wood) +
    isoBox(CX, CY, -0.3, 1.3, 26, BX + 0.6, 0.4, 1.2, palette.wood)
  ),
  // 7. Låt härda, skydda mot uttorkning/frost
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 12, palette.gravel) +
    isoBox(CX, CY, 0, 0, 12, BX, BY, 8, palette.insulation) +
    isoBox(CX, CY, 0, 0, 20, BX, BY, 6, palette.concrete) +
    isoOutline(CX, CY, -0.2, -0.2, 27, BX + 0.4, BY + 0.4, '#38bdf8', { dash: '5 4', fill: '#38bdf8', strokeWidth: 2 })
  ),
]

// The "stödmur" formwork is a cross-section (looking along the wall's
// length), drawn as a flat 2D diagram instead of isometric – it reads far
// more clearly this way, since studs, walers, ties and bracing are all
// most naturally shown as a side-on elevation rather than a 3D volume.
function murBase(extra = '') {
  return `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="10" y="95" width="180" height="35" fill="#a6805a"/>` +
    `<rect x="58" y="88" width="84" height="18" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>` +
    extra +
    `</svg>`
}

function murFormPanels() {
  return `<rect x="70" y="30" width="6" height="65" fill="#f97316" stroke="#0f172a" stroke-width="1.5"/>` +
    `<rect x="124" y="30" width="6" height="65" fill="#f97316" stroke="#0f172a" stroke-width="1.5"/>`
}

// Vertical stud + horizontal waler assembly bracing each panel from outside.
// The studs are left taller than the panel itself so a top batten can be
// screwed across the two stud-tops – a cheap alternative to buying
// threaded through-ties to hold the form at the right width.
function murStudsAndWalers() {
  return `<rect x="58" y="18" width="8" height="77" fill="#c2410c"/>` +
    `<rect x="50" y="42" width="24" height="6" fill="#f97316" stroke="#0f172a" stroke-width="1"/>` +
    `<rect x="50" y="80" width="24" height="6" fill="#f97316" stroke="#0f172a" stroke-width="1"/>` +
    `<rect x="134" y="18" width="8" height="77" fill="#c2410c"/>` +
    `<rect x="126" y="42" width="24" height="6" fill="#f97316" stroke="#0f172a" stroke-width="1"/>` +
    `<rect x="126" y="80" width="24" height="6" fill="#f97316" stroke="#0f172a" stroke-width="1"/>`
}

// The top batten itself, screwed across both stud-tops.
function murTopBatten() {
  return `<rect x="58" y="14" width="84" height="7" fill="#f97316" stroke="#0f172a" stroke-width="1.5"/>` +
    `<circle cx="64" cy="17.5" r="2" fill="#0f172a"/><circle cx="136" cy="17.5" r="2" fill="#0f172a"/>`
}

function murBraces() {
  return `<line x1="58" y1="24" x2="28" y2="93" stroke="#475569" stroke-width="3" stroke-linecap="round"/>` +
    `<rect x="20" y="91" width="16" height="8" fill="#0f172a"/>` +
    `<line x1="142" y1="24" x2="172" y2="93" stroke="#475569" stroke-width="3" stroke-linecap="round"/>` +
    `<rect x="164" y="91" width="16" height="8" fill="#0f172a"/>`
}

// Two mesh layers (one near each face) for thicker walls, closed at the top
// with a C-shaped bygel so the two layers act together as a cage.
function murRebarDouble() {
  const mesh = (x0: number) => [x0, x0 + 8].map((x) => `<line x1="${x}" y1="38" x2="${x}" y2="88" stroke="#334155" stroke-width="2"/>`).join('') +
    [50, 65, 80].map((y) => `<line x1="${x0 - 4}" y1="${y}" x2="${x0 + 12}" y2="${y}" stroke="#334155" stroke-width="2"/>`).join('')
  return mesh(83) + mesh(105) +
    `<path d="M79 38 q0 -10 10 -10 h22 q10 0 10 10" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>`
}

export const murIllustrations: string[] = [
  // 1. Gräv ur, lägg stabil grund/fundament
  murBase(),
  // 2. Bygg formväggarna, förstärkta med stöttor och liggare
  murBase(murFormPanels() + murStudsAndWalers()),
  // 3. Släpp upp stolparna och skruva toppreglar, stötta med avstyvningar
  murBase(murFormPanels() + murStudsAndWalers() + murTopBatten() + murBraces()),
  // 4. Placera armeringsnät – dubbla lager med C-byglar för tjockare murar
  murBase(murFormPanels() + murStudsAndWalers() + murTopBatten() + murRebarDouble()),
  // 5. Gjut i omgångar, vibrera bort luft
  murBase(
    murFormPanels() +
    `<rect x="76" y="60" width="48" height="35" fill="#cbd5e1"/>` +
    `<path d="M85 60 q5 -6 0 -12 M100 60 q5 -6 0 -12 M115 60 q5 -6 0 -12" stroke="#94a3b8" stroke-width="2" fill="none"/>` +
    murStudsAndWalers() + murTopBatten()
  ),
  // 6. Låt formen sitta kvar några dygn
  murBase(murFormPanels() + `<rect x="76" y="30" width="48" height="65" fill="#cbd5e1"/>` + murStudsAndWalers() + murTopBatten()),
  // 7. Dränering bakom muren
  murBase(
    `<rect x="85" y="30" width="30" height="65" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>` +
    `<circle cx="130" cy="52" r="3" fill="#94a3b8"/><circle cx="141" cy="63" r="3" fill="#94a3b8"/>` +
    `<circle cx="132" cy="75" r="3" fill="#94a3b8"/><circle cx="145" cy="48" r="3" fill="#94a3b8"/>` +
    `<rect x="120" y="88" width="32" height="7" rx="2" fill="#f97316"/>`
  ),
]
