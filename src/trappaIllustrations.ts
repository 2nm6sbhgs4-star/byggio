import { isoBox, isoPost, isoShadow, isoPt, isoSvg, palette, type IsoColors } from './isoHelpers'

// Shared footprint: a schematic 4-step staircase rising from the ground
// (front, low y) up to a small landing/deck platform (back, high y).
const CX = 96
const CY = 128
const STAIR_W = 3
const DEPTH = 0.85
const STEP_H = 11 // pixels per riser
const STEPS = 4
const TOTAL_Y = STEPS * DEPTH
const TOTAL_Z = STEPS * STEP_H

const structColor: IsoColors = palette.wood
const treadColor: IsoColors = palette.planterWood
const riserColor: IsoColors = palette.oiledWood

function groundAndLanding() {
  return isoShadow(CX, CY, -0.6, -0.4, STAIR_W + 1.2, TOTAL_Y + 2, 0.1) +
    isoBox(CX, CY, -0.6, -0.4, 0, STAIR_W + 1.2, TOTAL_Y + 2, 2, palette.ground) +
    isoBox(CX, CY, -0.3, TOTAL_Y, TOTAL_Z, STAIR_W + 0.6, 1.3, 6, palette.planterWood)
}

function pt(x: number, y: number, z: number) {
  return isoPt(CX, CY, x, y, z)
}

// The x=0 side isn't normally visible from this fixed camera angle (isoBox
// only draws the front + right faces), but leaving it out makes the stairs
// look open/hollow on that side, so it's drawn in by hand here.
function leftSideFace(Y: number, H: number, fill: string) {
  const points = [pt(0, 0, 0), pt(0, Y, 0), pt(0, Y, H), pt(0, 0, H)]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return `<polygon points="${points}" fill="${fill}" stroke="#0f172a" stroke-width="1.4" stroke-linejoin="round"/>`
}

// Draws the staircase back-to-front so nearer (shorter) steps correctly sit
// in front of the taller ones behind them.
function stairBlocks(colors: IsoColors, steps: number) {
  let out = ''
  for (let i = steps - 1; i >= 0; i--) {
    const Y = (i + 1) * DEPTH
    const H = (i + 1) * STEP_H
    out += leftSideFace(Y, H, colors.right) + isoBox(CX, CY, 0, 0, 0, STAIR_W, Y, H, colors, 1.4)
  }
  return out
}

function railing() {
  let out = ''
  for (let i = 0; i <= STEPS; i++) {
    const y = i * DEPTH
    const z = i * STEP_H
    out += isoPost(CX, CY, STAIR_W, y, z, 14, '#0f172a', 2)
  }
  for (let i = 0; i < STEPS; i++) {
    const [x1, y1] = isoPt(CX, CY, STAIR_W, i * DEPTH, i * STEP_H + 14)
    const [x2, y2] = isoPt(CX, CY, STAIR_W, (i + 1) * DEPTH, (i + 1) * STEP_H + 14)
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0f172a" stroke-width="1.8"/>`
  }
  return out
}

function dashedLine(x: number, y0: number, y1: number, z0: number, z1: number, stroke = '#f97316') {
  const [x1, sy1] = isoPt(CX, CY, x, y0, z0)
  const [x2, sy2] = isoPt(CX, CY, x, y1, z1)
  return `<line x1="${x1.toFixed(1)}" y1="${sy1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${sy2.toFixed(1)}" stroke="${stroke}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>`
}

export const trappaIllustrations: string[] = [
  // 1. Mät höjd och bredd, bestäm antal steg
  isoSvg(
    groundAndLanding() +
    dashedLine(-0.5, 0, 0, 0, TOTAL_Z + 6) +
    dashedLine(-0.5, TOTAL_Y, TOTAL_Y, 0, TOTAL_Z + 6, '#94a3b8')
  ),
  // 2. Såga ut vangstyckena (sidobalkarna)
  isoSvg(
    isoShadow(CX, CY, 0, 0, STAIR_W + 1, 1.6, 0.1) +
    isoBox(CX, CY, 0, 0.2, 0, STAIR_W + 1, 0.5, 3, structColor) +
    isoBox(CX, CY, 0, 1.1, 0, STAIR_W + 1, 0.5, 3, structColor)
  ),
  // 3. Montera vangstyckena i rätt lutning
  isoSvg(
    groundAndLanding() +
    stairBlocks(structColor, STEPS)
  ),
  // 4. Skruva fast trappstegen
  isoSvg(
    groundAndLanding() +
    stairBlocks({ top: treadColor.top, left: structColor.left, right: structColor.right }, STEPS)
  ),
  // 5. Montera sättsteg (om trappan ska vara sluten)
  isoSvg(
    groundAndLanding() +
    stairBlocks({ top: treadColor.top, left: riserColor.left, right: structColor.right }, STEPS)
  ),
  // 6. Montera räcke eller ledstång
  isoSvg(
    groundAndLanding() +
    stairBlocks({ top: treadColor.top, left: riserColor.left, right: structColor.right }, STEPS) +
    railing()
  ),
]
