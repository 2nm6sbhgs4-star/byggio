import { isoBox, isoPost, isoPipe, isoPt, isoSvg, palette, type IsoColors } from './isoHelpers'

type PreviewSection = { langd: number; bredd: number }

const WALL_H = 56
const ROOF_H = 8
const ROOF_OVERHANG = 0.35
const DECK_H = 7
const RAIL_H = 16
const RAIL_GAP = 0.9

const GROUND_H = 3
const GROUND_MARGIN = 0.8

const wallColor: IsoColors = { top: '#f1ede6', left: '#e2ddd3', right: '#c9c2b4' }
const roofColor: IsoColors = { top: '#94a3b8', left: '#64748b', right: '#475569' }
const grassColor: IsoColors = { top: '#9ccb8a', left: '#80af6d', right: '#638e53' }

function pt(x: number, y: number, z: number) {
  return isoPt(0, 0, x, y, z)
}

function poly(points: [number, number][], fill: string, opacity = 1) {
  const p = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const op = opacity < 1 ? ` fill-opacity="${opacity}"` : ''
  return `<polygon points="${p}" fill="${fill}" stroke="#0f172a" stroke-width="1.5" stroke-linejoin="round"${op}/>`
}

// A short run of railing (posts + top rail) along a straight edge from
// (xFrom,y) to (xTo,y), standing up from height z0.
function railing(xFrom: number, xTo: number, y: number, z0: number) {
  let out = ''
  const span = xTo - xFrom
  const posts = Math.max(2, Math.round(span / RAIL_GAP) + 1)
  for (let i = 0; i < posts; i++) {
    const x = xFrom + (span / (posts - 1)) * i
    out += isoPost(0, 0, x, y, z0, RAIL_H, '#0f172a', 1.8)
  }
  out += isoPipe(0, 0, xFrom, xTo, y, z0 + RAIL_H, '#0f172a', 1.6)
  return out
}

function HousePreview({ houseWidth, houseDepth, sections }: {
  houseWidth: number
  houseDepth: number
  sections: PreviewSection[]
}) {
  const validSections = sections.filter((s) => s.langd > 0 && s.bredd > 0)
  if (houseWidth <= 0 || houseDepth <= 0 || validSections.length === 0) return null

  const deckWidth = validSections.reduce((sum, s) => sum + s.langd, 0)
  const deckMaxDepth = Math.max(...validSections.map((s) => s.bredd))

  const houseX0 = Math.max(0, (deckWidth - houseWidth) / 2)
  const deckX0 = Math.max(0, (houseWidth - deckWidth) / 2)

  // Increasing y moves further from the viewer in this projection, so the
  // house sits at the back (high y) and the deck sticks out toward the
  // viewer (low y), flush against the house's near wall at y = houseY0.
  const houseY0 = deckMaxDepth
  const houseX1 = houseX0 + houseWidth

  // A single ground slab spans the full footprint so the house and deck
  // visibly share the same base level instead of reading as two objects
  // floating at different heights.
  const groundX0 = Math.min(houseX0, deckX0) - GROUND_MARGIN
  const groundX1 = Math.max(houseX1, deckX0 + deckWidth) + GROUND_MARGIN
  const groundY0 = -GROUND_MARGIN
  const groundY1 = houseY0 + houseDepth + GROUND_MARGIN

  // Bounding box of every extreme corner, in grid units, to size the viewBox.
  const corners: [number, number, number][] = [
    [groundX0, groundY0, -GROUND_H], [groundX1, groundY0, -GROUND_H],
    [groundX1, groundY1, -GROUND_H], [groundX0, groundY1, -GROUND_H],
    [houseX0 - ROOF_OVERHANG, houseY0 + houseDepth + ROOF_OVERHANG, WALL_H + ROOF_H],
    [houseX1 + ROOF_OVERHANG, houseY0 + houseDepth + ROOF_OVERHANG, WALL_H + ROOF_H],
    [deckX0, 0, DECK_H + RAIL_H], [deckX0 + deckWidth, 0, DECK_H + RAIL_H],
  ]
  const projected = corners.map(([x, y, z]) => isoPt(0, 0, x, y, z))
  const xs = projected.map((p) => p[0])
  const ys = projected.map((p) => p[1])
  const PAD = 24
  const minX = Math.min(...xs) - PAD
  const maxX = Math.max(...xs) + PAD
  const minY = Math.min(...ys) - PAD
  const maxY = Math.max(...ys) + PAD
  // Scale text to the drawing's own size so labels stay readable however
  // large or small the house/deck combination ends up.
  const fontScale = Math.max(maxX - minX, maxY - minY)
  const sectionFontSize = fontScale * 0.04

  // Deck sections, plank seams and outer railings.
  let cursorX = deckX0
  let deckMarkup = ''
  validSections.forEach((s) => {
    const x = cursorX
    cursorX += s.langd
    const y0 = houseY0 - s.bredd
    deckMarkup += isoBox(0, 0, x, y0, 0, s.langd, s.bredd, DECK_H, palette.planterWood, 1.5)

    const seamRows = Math.max(2, Math.round(s.bredd / 0.45))
    for (let r = 1; r < seamRows; r++) {
      const y = y0 + (s.bredd / seamRows) * r
      const [sx1, sy1] = pt(x, y, DECK_H)
      const [sx2, sy2] = pt(x + s.langd, y, DECK_H)
      deckMarkup += `<line x1="${sx1.toFixed(1)}" y1="${sy1.toFixed(1)}" x2="${sx2.toFixed(1)}" y2="${sy2.toFixed(1)}" stroke="#b8834f" stroke-width="1"/>`
    }

    // Front (outer) edge railing on every section.
    deckMarkup += railing(x, x + s.langd, y0, DECK_H)

    const [lx, ly] = pt(x + s.langd / 2, y0 + s.bredd / 2, DECK_H)
    deckMarkup += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="${sectionFontSize.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="#3f3226" font-weight="700">${s.langd.toFixed(1)}×${s.bredd.toFixed(1)} m</text>`
  })

  // Side railings need posts placed along a fixed-x edge (varying y), which
  // isoPost/isoPipe already support since they take arbitrary (x,y).
  function sideRailing(x: number, yFrom: number, yTo: number, z0: number) {
    let out = ''
    const span = yTo - yFrom
    const posts = Math.max(2, Math.round(span / RAIL_GAP) + 1)
    for (let i = 0; i < posts; i++) {
      const y = yFrom + (span / (posts - 1)) * i
      out += isoPost(0, 0, x, y, z0, RAIL_H, '#0f172a', 1.8)
    }
    const [x1, y1] = pt(x, yFrom, z0 + RAIL_H)
    const [x2, y2] = pt(x, yTo, z0 + RAIL_H)
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0f172a" stroke-width="1.6"/>`
    return out
  }
  const first = validSections[0]
  const last = validSections[validSections.length - 1]
  const firstX = deckX0
  const lastX = deckX0 + deckWidth
  deckMarkup += sideRailing(firstX, houseY0 - first.bredd, houseY0, DECK_H)
  deckMarkup += sideRailing(lastX, houseY0 - last.bredd, houseY0, DECK_H)

  // House: walls, a door and two windows on the wall facing the deck, and a
  // simple gable roof (front slope + one visible gable end).
  const doorW = Math.min(1.0, houseWidth * 0.18)
  const doorH = WALL_H * 0.62
  const doorCx = houseX0 + houseWidth / 2
  const doorMarkup = poly([
    pt(doorCx - doorW / 2, houseY0, 0), pt(doorCx + doorW / 2, houseY0, 0),
    pt(doorCx + doorW / 2, houseY0, doorH), pt(doorCx - doorW / 2, houseY0, doorH),
  ], '#8a6238')

  let windowMarkup = ''
  if (houseWidth >= 5) {
    const winW = Math.min(0.9, houseWidth * 0.14)
    const winH = WALL_H * 0.28
    const winZ0 = WALL_H * 0.4
    const winCentres = [houseX0 + houseWidth * 0.22, houseX0 + houseWidth * 0.78]
    for (const wcx of winCentres) {
      windowMarkup += poly([
        pt(wcx - winW / 2, houseY0, winZ0), pt(wcx + winW / 2, houseY0, winZ0),
        pt(wcx + winW / 2, houseY0, winZ0 + winH), pt(wcx - winW / 2, houseY0, winZ0 + winH),
      ], '#bae6fd')
    }
  }

  const roofCap = isoBox(
    0, 0, houseX0 - ROOF_OVERHANG, houseY0 - ROOF_OVERHANG, WALL_H,
    houseWidth + ROOF_OVERHANG * 2, houseDepth + ROOF_OVERHANG * 2, ROOF_H, roofColor
  )

  // The far (left) gable wall isn't normally visible from this fixed camera
  // angle, but drawing it anyway reads much more clearly as "a whole house"
  // than leaving that side open.
  const leftWall = poly([
    pt(houseX0, houseY0, 0), pt(houseX0, houseY0 + houseDepth, 0),
    pt(houseX0, houseY0 + houseDepth, WALL_H), pt(houseX0, houseY0, WALL_H),
  ], wallColor.right)

  const inner = isoBox(0, 0, groundX0, groundY0, -GROUND_H, groundX1 - groundX0, groundY1 - groundY0, GROUND_H, grassColor) +
    leftWall +
    isoBox(0, 0, houseX0, houseY0, 0, houseWidth, houseDepth, WALL_H, wallColor, 1.5, 1, false) +
    doorMarkup + windowMarkup +
    roofCap +
    deckMarkup

  const svg = isoSvg(inner, `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`)

  return (
    <div className="house-preview">
      <p className="house-preview-label">Förhandsvisning</p>
      <div className="house-preview-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="disclaimer">Schematisk skiss i skala utifrån husets och altanens mått – exakt placering och husform kan avvika.</p>
    </div>
  )
}
export default HousePreview
