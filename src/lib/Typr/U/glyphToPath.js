import { drawGlyf } from './drawGlyf'
import { drawCFF } from './drawCFF'
import { toPath } from './SVG'

export function glyphToPath(font, gid) {
  let path = { cmds: [], crds: [] }

  const SVG = font['SVG ']
  const CFF = font['CFF ']

  if (SVG && SVG.entries[gid]) {
    let p = SVG.entries[gid]

    if (p != null) {
      if (typeof p == 'string') {
        p = toPath(p)
        SVG.entries[gid] = p
      }

      path = p
    }
  } else if (CFF) {
    let pdct = CFF.Private

    const state = {
      x: 0,
      y: 0,
      stack: [],
      nStems: 0,
      haveWidth: false,
      width: pdct ? pdct['defaultWidthX'] : 0,
      open: false
    }

    if (CFF.ROS) {
      let gi = 0

      while (CFF.FDSelect[gi + 2] <= gid) gi += 2

      pdct = CFF.FDArray[CFF.FDSelect[gi + 1]].Private
    }

    drawCFF(CFF.CharStrings[gid], state, CFF, pdct, path)
  } else if (font.glyf) {
    drawGlyf(gid, font, path)
  }

  return path
}
