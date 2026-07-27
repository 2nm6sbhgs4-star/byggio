import { isoBox, isoPost, isoDot, isoShadow, isoPt, isoSvg, palette } from './isoHelpers'

// Shared footprint: one bay of fence between two posts.
const CX = 90
const CY = 126
const SPAN = 4.2
const POST = 0.28
const POST_H = 40 // pixels
const POST_Y = 0.5

function post(x0: number, h: number) {
  return isoBox(CX, CY, x0, POST_Y, 0, POST, POST, h, palette.wood)
}

function twoPosts(h: number) {
  return post(0, h) + post(SPAN - POST, h)
}

function concreteCollar() {
  const collar = (x0: number) => isoBox(CX, CY, x0 - 0.12, POST_Y - 0.12, 0, POST + 0.24, POST + 0.24, 7, palette.concrete)
  return collar(0) + collar(SPAN - POST)
}

function dashedLine(x0: number, x1: number, y: number, z: number, stroke: string, width = 2) {
  const [ax1, ay1] = isoPt(CX, CY, x0, y, z)
  const [ax2, ay2] = isoPt(CX, CY, x1, y, z)
  return `<line x1="${ax1.toFixed(1)}" y1="${ay1.toFixed(1)}" x2="${ax2.toFixed(1)}" y2="${ay2.toFixed(1)}" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="6 5" stroke-linecap="round"/>`
}

function hole(x0: number) {
  const [cx, cy] = isoPt(CX, CY, x0 + POST / 2, POST_Y + POST / 2, 0)
  return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="13" ry="6" fill="none" stroke="#475569" stroke-width="2.5"/>` +
    dashedLine(x0 + POST / 2, x0 + POST / 2, POST_Y + POST / 2, -22, '#475569', 2)
}

function spiritLevel(x: number) {
  const [px, py] = isoPt(CX, CY, x, POST_Y - 0.5, POST_H * 0.55)
  return `<rect x="${(px - 17).toFixed(1)}" y="${(py - 5).toFixed(1)}" width="34" height="10" rx="5" fill="none" stroke="#0f172a" stroke-width="2" transform="rotate(-14 ${px.toFixed(1)} ${py.toFixed(1)})"/>` +
    `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" fill="#38bdf8" transform="rotate(-14 ${px.toFixed(1)} ${py.toFixed(1)})"/>`
}

function rails(h1: number, h2: number) {
  return isoBox(CX, CY, 0, POST_Y + 0.04, h1, SPAN, 0.2, 5, palette.wood) +
    isoBox(CX, CY, 0, POST_Y + 0.04, h2, SPAN, 0.2, 5, palette.wood)
}

function boards() {
  let out = ''
  const step = 0.34
  for (let x = 0.1; x < SPAN - 0.1; x += step) {
    out += isoBox(CX, CY, x, POST_Y - 0.14, 0, 0.22, 0.12, POST_H, palette.planterWood, 1.2)
  }
  return out
}

export const staketIllustrations: string[] = [
  // 1. Markera sträckning med snöre, mät ut stolpplacering
  isoSvg(
    isoShadow(CX, CY, -0.4, 0, SPAN + 0.8, 1.2, 0.1) +
    isoBox(CX, CY, -0.4, 0, 0, SPAN + 0.8, 1.2, 2, palette.ground) +
    dashedLine(0.15, SPAN - 0.15, POST_Y + POST / 2, 3, '#f97316', 2.2) +
    isoPost(CX, CY, 0.15, POST_Y + POST / 2, 2, 15, '#0f172a', 3) +
    isoPost(CX, CY, SPAN - 0.15, POST_Y + POST / 2, 2, 15, '#0f172a', 3)
  ),
  // 2. Gräv eller borra hål för stolparna
  isoSvg(
    isoShadow(CX, CY, -0.4, 0, SPAN + 0.8, 1.2, 0.1) +
    isoBox(CX, CY, -0.4, 0, 0, SPAN + 0.8, 1.2, 2, palette.ground) +
    hole(0) +
    hole(SPAN - POST)
  ),
  // 3. Sätt stolparna i våg, gjut eller packa fast
  isoSvg(
    isoShadow(CX, CY, -0.4, 0, SPAN + 0.8, 1.2, 0.12) +
    isoBox(CX, CY, -0.4, 0, 0, SPAN + 0.8, 1.2, 2, palette.ground) +
    concreteCollar() +
    twoPosts(POST_H)
  ),
  // 4. Låt stolparna stå stadigt innan du fortsätter
  isoSvg(
    isoShadow(CX, CY, -0.4, 0, SPAN + 0.8, 1.2, 0.12) +
    isoBox(CX, CY, -0.4, 0, 0, SPAN + 0.8, 1.2, 2, palette.ground) +
    concreteCollar() +
    twoPosts(POST_H) +
    spiritLevel(SPAN * 0.5)
  ),
  // 5. Montera vågräta reglar mellan stolparna
  isoSvg(
    isoShadow(CX, CY, -0.4, 0, SPAN + 0.8, 1.2, 0.12) +
    isoBox(CX, CY, -0.4, 0, 0, SPAN + 0.8, 1.2, 2, palette.ground) +
    twoPosts(POST_H) +
    rails(8, 28)
  ),
  // 6. Skruva fast brädorna med jämna mellanrum
  isoSvg(
    isoShadow(CX, CY, -0.4, 0, SPAN + 0.8, 1.2, 0.12) +
    isoBox(CX, CY, -0.4, 0, 0, SPAN + 0.8, 1.2, 2, palette.ground) +
    twoPosts(POST_H) +
    rails(8, 28) +
    boards() +
    isoDot(CX, CY, 0.4, POST_Y - 0.08, 8, 1.6, '#0f172a') +
    isoDot(CX, CY, 1.5, POST_Y - 0.08, 28, 1.6, '#0f172a') +
    isoDot(CX, CY, 2.9, POST_Y - 0.08, 8, 1.6, '#0f172a')
  ),
]
