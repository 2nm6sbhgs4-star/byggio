import { isoBox, isoFrameBorder, isoDot, isoOutline, isoShadow, isoPt, isoSvg, palette } from './isoHelpers'

// Shared footprint for the planter-box illustrations.
const CX = 100
const CY = 116
const BX = 3.6
const BY = 1.8
const POST = 0.3
const H_FULL = 13

function post(x0: number, y0: number, z0: number, H: number) {
  return isoBox(CX, CY, x0, y0, z0, POST, POST, H, palette.oiledWood)
}

function fourPosts(z0: number, H: number) {
  return post(0, 0, z0, H) + post(BX - POST, 0, z0, H) + post(BX - POST, BY - POST, z0, H) + post(0, BY - POST, z0, H)
}

// Horizontal plank seams overlaid on the box's two visible faces.
function boardSeams(z0: number, H: number, rows: number, stroke = '#8a6238') {
  let out = ''
  for (let i = 1; i < rows; i++) {
    const z = z0 + (H / rows) * i
    const [lx1, ly1] = isoPt(CX, CY, 0, 0, z)
    const [lx2, ly2] = isoPt(CX, CY, BX, 0, z)
    const [rx1, ry1] = isoPt(CX, CY, BX, 0, z)
    const [rx2, ry2] = isoPt(CX, CY, BX, BY, z)
    out += `<line x1="${lx1.toFixed(1)}" y1="${ly1.toFixed(1)}" x2="${lx2.toFixed(1)}" y2="${ly2.toFixed(1)}" stroke="${stroke}" stroke-width="1"/>`
    out += `<line x1="${rx1.toFixed(1)}" y1="${ry1.toFixed(1)}" x2="${rx2.toFixed(1)}" y2="${ry2.toFixed(1)}" stroke="${stroke}" stroke-width="1"/>`
  }
  return out
}

function angleMark() {
  // Fixed in the empty bottom-left corner: a carpenter's square icon, clear of the box.
  return `<path d="M20 138 v-24 h24" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="square"/>` +
    `<path d="M20 122 h10 M32 138 v-10" stroke="#f97316" stroke-width="1.5"/>` +
    `<path d="M12 138 a8 8 0 0 1 8 -8" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="2 2"/>`
}

function spiritLevel() {
  const [x, y] = isoPt(CX, CY, BX / 2, BY / 2, H_FULL + 8)
  return `<rect x="${(x - 17).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="34" height="10" rx="5" fill="none" stroke="#0f172a" stroke-width="2"/>` +
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#38bdf8"/>`
}

function paintBrush() {
  // Fixed in the empty top-left corner, well clear of the box silhouette.
  return `<g transform="rotate(-30 34 40)">` +
    `<rect x="28" y="14" width="9" height="26" rx="2" fill="#e7c9a0" stroke="#0f172a" stroke-width="1.5"/>` +
    `<rect x="26" y="36" width="13" height="12" rx="2" fill="#f97316" stroke="#0f172a" stroke-width="1.5"/>` +
    `</g>`
}

function sprout() {
  const [x, y] = isoPt(CX, CY, BX / 2, BY / 2, H_FULL)
  return `<path d="M${x.toFixed(1)} ${(y - 2).toFixed(1)} v-16" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" fill="none"/>` +
    `<path d="M${x.toFixed(1)} ${(y - 12).toFixed(1)} q-10 -4 -12 -14 q12 2 14 12 z" fill="#22c55e"/>` +
    `<path d="M${x.toFixed(1)} ${(y - 15).toFixed(1)} q10 -2 13 -11 q-11 0 -14 9 z" fill="#4ade80"/>`
}

export const blomladorIllustrations: string[] = [
  // 1. Kapa hörnreglar i lådans höjd, fyra per låda
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, POST * 4 + 0.6, 0.08) +
    post(0, 0, 0, H_FULL) +
    post(1.1, 0, 0, H_FULL) +
    post(2.2, 0, 0, H_FULL) +
    post(3.3, 0, 0, H_FULL) +
    (() => {
      const [x1, y1] = isoPt(CX, CY, 3.3 + POST + 0.35, 0, 0)
      const [x2, y2] = isoPt(CX, CY, 3.3 + POST + 0.35, 0, H_FULL)
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0f172a" stroke-width="2"/>` +
        `<line x1="${(x1 - 5).toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(x1 + 5).toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#0f172a" stroke-width="2"/>` +
        `<line x1="${(x2 - 5).toFixed(1)}" y1="${y2.toFixed(1)}" x2="${(x2 + 5).toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0f172a" stroke-width="2"/>`
    })()
  ),
  // 2. Första brädraden runt hörnreglarna, kontrollera vinkelhake
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    fourPosts(0, H_FULL) +
    isoFrameBorder(CX, CY, 0, 0, 0, BX, BY, 2.2, 0.22, palette.planterWood) +
    angleMark()
  ),
  // 3. Bygg på med resterande rader, kontrollera vattenpass
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    fourPosts(0, H_FULL) +
    isoFrameBorder(CX, CY, 0, 0, 0, BX, BY, H_FULL, 0.22, palette.planterWood) +
    boardSeams(0, H_FULL, 5) +
    spiritLevel()
  ),
  // 4. Borra dräneringshål i botten
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    fourPosts(0, H_FULL) +
    isoFrameBorder(CX, CY, 0, 0, 0, BX, BY, H_FULL, 0.22, palette.planterWood) +
    boardSeams(0, H_FULL, 5) +
    isoDot(CX, CY, 0.9, 0, 0.9, 2.4, '#0f172a') +
    isoDot(CX, CY, 1.8, 0, 0.9, 2.4, '#0f172a') +
    isoDot(CX, CY, 2.7, 0, 0.9, 2.4, '#0f172a')
  ),
  // 5. Klossar eller markduk under lådan
  isoSvg(
    isoShadow(CX, CY, -0.4, -0.4, BX + 0.8, BY + 0.8, 0.1) +
    isoOutline(CX, CY, -0.4, -0.4, 0, BX + 0.8, BY + 0.8, '#0f172a', { dash: '5 4', strokeWidth: 1.6 }) +
    isoBox(CX, CY, 0.1, 0.1, 0, 0.5, 0.5, 2, palette.gravel) +
    isoBox(CX, CY, BX - 0.6, BY - 0.6, 0, 0.5, 0.5, 2, palette.gravel) +
    fourPosts(2, H_FULL) +
    isoFrameBorder(CX, CY, 0, 0, 2, BX, BY, H_FULL, 0.22, palette.planterWood) +
    boardSeams(2, H_FULL, 5)
  ),
  // 6. Olja virket, fyll med jord och plantera
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY) +
    fourPosts(0, H_FULL) +
    isoFrameBorder(CX, CY, 0, 0, 0, BX, BY, H_FULL, 0.22, palette.oiledWood) +
    boardSeams(0, H_FULL, 5, '#5c4a3a') +
    isoBox(CX, CY, 0.35, 0.35, H_FULL - 2.5, BX - 0.7, BY - 0.7, 2, palette.soil) +
    paintBrush() +
    sprout()
  ),
]
