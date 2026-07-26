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
const KCX = 78
const KCY = 100
const KL = 5.3
const KW = 1.3
const KH = 28 // pixels - roughly KW * 22 so the beam reads as a square-ish beam, not a flat plank
const KCOVER_Y = 0.22
const KCOVER_Z = 6
const KSTIRRUP_INSET_Y = 0.12
const KSTIRRUP_INSET_Z = 3
const kantbalkDetail = isoSvg(
  isoShadow(KCX, KCY, 0, 0, KL, KW, 0.14) +
  isoPipe(KCX, KCY, 0, KL, KCOVER_Y, KCOVER_Z, '#334155', 2.8) +
  isoPipe(KCX, KCY, 0, KL, KW - KCOVER_Y, KCOVER_Z, '#334155', 2.8) +
  isoPipe(KCX, KCY, 0, KL, KW - KCOVER_Y, KH - KCOVER_Z, '#334155', 2.8) +
  isoPipe(KCX, KCY, 0, KL, KCOVER_Y, KH - KCOVER_Z, '#334155', 2.8) +
  [0.35, 1.7, 3.05, 4.4].map((x) =>
    isoStirrup(KCX, KCY, x, KSTIRRUP_INSET_Y, KSTIRRUP_INSET_Z, KW - 2 * KSTIRRUP_INSET_Y, KH - 2 * KSTIRRUP_INSET_Z, '#475569', 2)
  ).join('') +
  isoBox(KCX, KCY, 0, 0, 0, KL, KW, KH, palette.wetConcrete, 1.5, 0.55) +
  (() => {
    const [ax1, ay1] = isoPt(KCX, KCY, 1.7, 0, KH + 8)
    const [ax2, ay2] = isoPt(KCX, KCY, 3.05, 0, KH + 8)
    return `<line x1="${ax1.toFixed(1)}" y1="${ay1.toFixed(1)}" x2="${ax2.toFixed(1)}" y2="${ay2.toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>` +
      `<line x1="${ax1.toFixed(1)}" y1="${(ay1 - 3).toFixed(1)}" x2="${ax1.toFixed(1)}" y2="${(ay1 + 3).toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>` +
      `<line x1="${ax2.toFixed(1)}" y1="${(ay2 - 3).toFixed(1)}" x2="${ax2.toFixed(1)}" y2="${(ay2 + 3).toFixed(1)}" stroke="#0f172a" stroke-width="1.2"/>` +
      `<text x="${((ax1 + ax2) / 2).toFixed(1)}" y="${(ay1 - 6).toFixed(1)}" font-size="9" text-anchor="middle" fill="#0f172a">cc 500</text>`
  })() +
  `<text x="${(isoPt(KCX, KCY, 0.3, KW, KH / 2)[0] - 18).toFixed(1)}" y="${(isoPt(KCX, KCY, 0.3, KW, KH / 2)[1] + 4).toFixed(1)}" font-size="9" fill="#0f172a">4 st Ø12</text>`,
  '0 0 220 150'
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

// Wall footprint for the "stödmur" illustrations (length x thickness).
const WCX = 96
const WCY = 128
const WX = 5.5
const WYF = 2.64 // fundament width (wider than the wall itself)

export const murIllustrations: string[] = [
  // 1. Gräv ur, lägg stabil grund/fundament
  isoSvg(
    isoShadow(WCX, WCY, 0, 0, WX, WYF) +
    isoBox(WCX, WCY, 0, 0, 0, WX, WYF, 8, palette.gravel)
  ),
  // 2. Bygg formsättning på båda sidor
  isoSvg(
    isoShadow(WCX, WCY, 0, 0, WX, WYF) +
    isoBox(WCX, WCY, 0, 0, 0, WX, WYF, 8, palette.gravel) +
    isoBox(WCX, WCY, 0, 2.07, 8, WX, 0.22, 42, palette.wood) +
    isoBox(WCX, WCY, 0, 0.35, 8, WX, 0.22, 42, palette.wood)
  ),
  // 3. Placera armeringsnät/armeringsjärn centrerat
  isoSvg(
    isoShadow(WCX, WCY, 0, 0, WX, WYF) +
    isoBox(WCX, WCY, 0, 0, 0, WX, WYF, 8, palette.gravel) +
    isoBox(WCX, WCY, 0, 2.07, 8, WX, 0.22, 42, palette.wood) +
    isoPost(WCX, WCY, 0.7, 1.32, 8, 34, '#334155', 2.6) +
    isoPost(WCX, WCY, 2.1, 1.32, 8, 34, '#334155', 2.6) +
    isoPost(WCX, WCY, 3.5, 1.32, 8, 34, '#334155', 2.6) +
    isoPost(WCX, WCY, 4.9, 1.32, 8, 34, '#334155', 2.6) +
    isoBox(WCX, WCY, 0, 0.35, 8, WX, 0.22, 42, palette.wood)
  ),
  // 4. Gjut i omgångar, vibrera bort luft
  isoSvg(
    isoShadow(WCX, WCY, 0, 0, WX, WYF) +
    isoBox(WCX, WCY, 0, 0, 0, WX, WYF, 8, palette.gravel) +
    isoBox(WCX, WCY, 0, 2.07, 8, WX, 0.22, 42, palette.wood) +
    isoBox(WCX, WCY, 0.3, 0.57, 8, WX - 0.6, 1.5, 20, palette.wetConcrete) +
    isoBox(WCX, WCY, 0, 0.35, 8, WX, 0.22, 42, palette.wood)
  ),
  // 5. Låt formen sitta kvar några dygn
  isoSvg(
    isoShadow(WCX, WCY, 0, 0, WX, WYF) +
    isoBox(WCX, WCY, 0, 0, 0, WX, WYF, 8, palette.gravel) +
    isoBox(WCX, WCY, 0, 2.07, 8, WX, 0.22, 42, palette.wood) +
    isoBox(WCX, WCY, 0.3, 0.57, 8, WX - 0.6, 1.5, 42, palette.wetConcrete) +
    isoBox(WCX, WCY, 0, 0.35, 8, WX, 0.22, 42, palette.wood)
  ),
  // 6. Dränering bakom muren
  isoSvg(
    isoShadow(WCX, WCY, 0, 0, WX, WYF) +
    isoBox(WCX, WCY, 0, 0, 0, WX, WYF, 8, palette.gravel) +
    isoBox(WCX, WCY, 0.3, 0.57, 8, WX - 0.6, 1.5, 42, palette.concrete) +
    isoBox(WCX, WCY, 0.3, 2.1, 8, WX - 0.6, 0.5, 16, palette.gravel)
  ),
]
