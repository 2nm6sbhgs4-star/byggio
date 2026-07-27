import { isoBox, isoPost, isoDot, isoOutline, isoShadow, isoPt, isoSvg, palette } from './isoHelpers'

// Shared footprint for the deck illustrations.
const CX = 108
const CY = 122
const BX = 4.2
const BY = 3
const PIER_H = 10
const BARLINA_H = 6
const MELLANREGEL_H = 5
const TRALL_H = 4

function piers() {
  const xs = [0.3, BX / 2, BX - 0.3]
  const ys = [0.3, BY - 0.3]
  let out = ''
  for (const y of ys) {
    for (const x of xs) {
      out += isoBox(CX, CY, x - 0.17, y - 0.17, 0, 0.34, 0.34, PIER_H, palette.concrete)
    }
  }
  return out
}

function barlinor() {
  return isoBox(CX, CY, 0, 0.3 - 0.16, PIER_H, BX, 0.32, BARLINA_H, palette.wood) +
    isoBox(CX, CY, 0, BY - 0.3 - 0.16, PIER_H, BX, 0.32, BARLINA_H, palette.wood)
}

function mellanreglar() {
  let out = ''
  const stepsX = 5
  for (let i = 0; i <= stepsX; i++) {
    const x = (BX / stepsX) * i
    out += isoBox(CX, CY, x - 0.09, 0, PIER_H + BARLINA_H, 0.18, BY, MELLANREGEL_H, palette.wood, 1.2)
  }
  return out
}

const TRALL_Z = PIER_H + BARLINA_H + MELLANREGEL_H

function trallSeams() {
  let out = ''
  const boards = 9
  for (let i = 1; i < boards; i++) {
    const y = (BY / boards) * i
    const [x1, y1] = isoPt(CX, CY, 0, y, TRALL_Z + TRALL_H)
    const [x2, y2] = isoPt(CX, CY, BX, y, TRALL_Z + TRALL_H)
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#b8834f" stroke-width="1"/>`
  }
  return out
}

function circularSaw() {
  const [px, py] = isoPt(CX, CY, BX * 0.72, -0.35, TRALL_Z + TRALL_H + 14)
  return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9" fill="none" stroke="#0f172a" stroke-width="2"/>` +
    `<rect x="${(px - 3).toFixed(1)}" y="${(py + 6).toFixed(1)}" width="6" height="12" rx="1.5" fill="#f97316" stroke="#0f172a" stroke-width="1.5"/>`
}

export const altanIllustrations: string[] = [
  // 1. Markera altanens läge
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY, 0.1) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    isoOutline(CX, CY, 0.25, 0.25, 2.3, BX - 0.5, BY - 0.5, '#f97316', { dash: '5 4' }) +
    isoPost(CX, CY, 0.25, 0.25, 2, 16, '#0f172a', 3) +
    isoPost(CX, CY, BX - 0.25, BY - 0.25, 2, 16, '#0f172a', 3)
  ),
  // 2. Gräv och lägg plintar
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY, 0.1) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    piers()
  ),
  // 3. Montera bärlinorna på plintarna
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY, 0.12) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    piers() +
    barlinor()
  ),
  // 4. Lägg mellanreglarna tvärs över
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY, 0.12) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    piers() +
    barlinor() +
    mellanreglar()
  ),
  // 5. Skruva fast trallen
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY, 0.12) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    piers() +
    barlinor() +
    mellanreglar() +
    isoBox(CX, CY, 0, 0, TRALL_Z, BX, BY, TRALL_H, palette.planterWood) +
    trallSeams() +
    isoDot(CX, CY, 1.2, 0.9, TRALL_Z + TRALL_H, 1.8, '#5c4a3a') +
    isoDot(CX, CY, 2.6, 1.9, TRALL_Z + TRALL_H, 1.8, '#5c4a3a')
  ),
  // 6. Såga kanter, montera kantlist
  isoSvg(
    isoShadow(CX, CY, 0, 0, BX, BY, 0.12) +
    isoBox(CX, CY, 0, 0, 0, BX, BY, 2, palette.ground) +
    piers() +
    barlinor() +
    mellanreglar() +
    isoBox(CX, CY, 0, 0, TRALL_Z, BX, BY, TRALL_H, palette.planterWood) +
    trallSeams() +
    isoOutline(CX, CY, 0, 0, TRALL_Z + TRALL_H + 0.5, BX, 0.05, '#f97316', { strokeWidth: 3, fill: '#f97316' }) +
    circularSaw()
  ),
]
