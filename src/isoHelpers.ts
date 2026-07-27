// Small helper library for building pseudo-3D (isometric) SVG illustrations
// out of plain template strings. Each shape is projected onto a 2:1 isometric
// grid, anchored at a shared screen-space origin (cx, cy) representing grid
// point (0,0,0), so multiple shapes can be stacked/offset by grid coordinates
// (x0, y0, z0) instead of hand-picking pixel points.

export type IsoColors = { top: string; left: string; right: string }

const EX = { x: 22, y: -11 } // one unit along the "x" grid axis
const EY = { x: -22, y: -11 } // one unit along the "y" grid axis

export function isoPt(cx: number, cy: number, x: number, y: number, z: number): [number, number] {
  return [cx + x * EX.x + y * EY.x, cy + x * EX.y + y * EY.y - z]
}

function poly(points: [number, number][]) {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

export function isoBox(
  cx: number, cy: number,
  x0: number, y0: number, z0: number,
  X: number, Y: number, H: number,
  c: IsoColors, strokeWidth = 1.5, opacity = 1, includeTop = true
) {
  const p = (x: number, y: number, z: number) => isoPt(cx, cy, x0 + x, y0 + y, z0 + z)
  const top = poly([p(0, 0, H), p(X, 0, H), p(X, Y, H), p(0, Y, H)])
  const right = poly([p(X, 0, 0), p(X, Y, 0), p(X, Y, H), p(X, 0, H)])
  const left = poly([p(0, 0, 0), p(X, 0, 0), p(X, 0, H), p(0, 0, H)])
  const op = opacity < 1 ? ` fill-opacity="${opacity}"` : ''
  return `<polygon points="${left}" fill="${c.left}" stroke="#0f172a" stroke-width="${strokeWidth}" stroke-linejoin="round"${op}/>` +
    `<polygon points="${right}" fill="${c.right}" stroke="#0f172a" stroke-width="${strokeWidth}" stroke-linejoin="round"${op}/>` +
    (includeTop ? `<polygon points="${top}" fill="${c.top}" stroke="#0f172a" stroke-width="${strokeWidth}" stroke-linejoin="round"${op}/>` : '')
}

// A hollow rectangular border made of four beams (formwork, edge elements, frames).
export function isoFrameBorder(
  cx: number, cy: number,
  x0: number, y0: number, z0: number,
  X: number, Y: number, H: number, t: number,
  c: IsoColors, strokeWidth = 1.5
) {
  const bars: [number, number, number, number][] = [
    [0, 0, X, t],
    [0, Y - t, X, t],
    [0, t, t, Y - 2 * t],
    [X - t, t, t, Y - 2 * t],
  ]
  return bars.map(([ox, oy, bx, by]) => isoBox(cx, cy, x0 + ox, y0 + oy, z0, bx, by, H, c, strokeWidth)).join('')
}

// A flat grid of lines lying on the plane at height z (rebar mesh, panel seams).
export function isoGrid(
  cx: number, cy: number,
  x0: number, y0: number, z: number,
  X: number, Y: number, stepsX: number, stepsY: number,
  stroke: string, strokeWidth = 1.6
) {
  let out = ''
  for (let i = 0; i <= stepsX; i++) {
    const x = x0 + (X / stepsX) * i
    const [x1, y1] = isoPt(cx, cy, x, y0, z)
    const [x2, y2] = isoPt(cx, cy, x, y0 + Y, z)
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`
  }
  for (let j = 0; j <= stepsY; j++) {
    const y = y0 + (Y / stepsY) * j
    const [x1, y1] = isoPt(cx, cy, x0, y, z)
    const [x2, y2] = isoPt(cx, cy, x0 + X, y, z)
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`
  }
  return out
}

// A thin vertical post/bar standing up from the plane (rebar rod, stake).
export function isoPost(cx: number, cy: number, x: number, y: number, z0: number, h: number, stroke: string, strokeWidth = 2.4) {
  const [x1, y1] = isoPt(cx, cy, x, y, z0)
  const [x2, y2] = isoPt(cx, cy, x, y, z0 + h)
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`
}

// A short horizontal pipe/beam lying flat on the plane, from (x0,y,z) to (x1,y,z).
export function isoPipe(cx: number, cy: number, xFrom: number, xTo: number, y: number, z: number, stroke: string, strokeWidth = 5) {
  const [x1, y1] = isoPt(cx, cy, xFrom, y, z)
  const [x2, y2] = isoPt(cx, cy, xTo, y, z)
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`
}

// A rectangular loop standing in the Y-Z plane at fixed x (a rebar stirrup/bygel
// seen end-on, wrapping around the cross-section of a beam running along x).
export function isoStirrup(cx: number, cy: number, x: number, y0: number, z0: number, Y: number, H: number, stroke: string, strokeWidth = 2) {
  const p = (y: number, z: number) => isoPt(cx, cy, x, y0 + y, z0 + z)
  const pts = [p(0, 0), p(Y, 0), p(Y, H), p(0, H)]
  return `<polygon points="${poly(pts)}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
}

// A small dot marker on the plane (distansklossar, screws, rivets).
export function isoDot(cx: number, cy: number, x: number, y: number, z: number, r: number, fill: string) {
  const [px, py] = isoPt(cx, cy, x, y, z)
  return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r}" fill="${fill}"/>`
}

// A dashed outline on the plane (marking rope, tarp/cover edge).
export function isoOutline(cx: number, cy: number, x0: number, y0: number, z: number, X: number, Y: number, stroke: string, opts: { dash?: string; fill?: string; strokeWidth?: number } = {}) {
  const pts: [number, number][] = [
    isoPt(cx, cy, x0, y0, z),
    isoPt(cx, cy, x0 + X, y0, z),
    isoPt(cx, cy, x0 + X, y0 + Y, z),
    isoPt(cx, cy, x0, y0 + Y, z),
  ]
  return `<polygon points="${poly(pts)}" fill="${opts.fill ?? 'none'}" stroke="${stroke}" stroke-width="${opts.strokeWidth ?? 2}" ${opts.dash ? `stroke-dasharray="${opts.dash}"` : ''}/>`
}

// Soft contact shadow under a volume with footprint (X,Y) placed at (x0,y0).
export function isoShadow(cx: number, cy: number, x0: number, y0: number, X: number, Y: number, opacity = 0.12) {
  const [sx, sy] = isoPt(cx, cy, x0 + X / 2, y0 + Y / 2, 0)
  const rx = (X + Y) * 9
  const ry = rx * 0.38
  return `<ellipse cx="${sx.toFixed(1)}" cy="${(sy + 3).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#0f172a" opacity="${opacity}"/>`
}

export function isoSvg(inner: string, viewBox = '0 0 220 150') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`
}

export const palette = {
  gravel: { top: '#cbd5e1', left: '#94a3b8', right: '#64748b' } as IsoColors,
  ground: { top: '#a6805a', left: '#8a6a48', right: '#6b5138' } as IsoColors,
  concrete: { top: '#e8edf3', left: '#cbd5e1', right: '#94a3b8' } as IsoColors,
  wetConcrete: { top: '#e2e8f0', left: '#cbd5e1', right: '#94a3b8' } as IsoColors,
  wood: { top: '#fdba74', left: '#f97316', right: '#c2410c' } as IsoColors,
  insulation: { top: '#bae6fd', left: '#7dd3fc', right: '#38bdf8' } as IsoColors,
  planterWood: { top: '#e7c9a0', left: '#d4a574', right: '#b8834f' } as IsoColors,
  oiledWood: { top: '#c99a63', left: '#a97b46', right: '#8a6238' } as IsoColors,
  soil: { top: '#7a6552', left: '#5c4a3a', right: '#453729' } as IsoColors,
}
