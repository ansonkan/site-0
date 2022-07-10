import { parseGlyf } from '../tables/glyf'

import { simpleGlyph } from './simpleGlyph'
import { compoGlyph } from './compoGlyph'

export function drawGlyf(gid, font, path) {
  let gl = font.glyf[gid]
  if (gl == null) gl = font.glyf[gid] = parseGlyf(font, gid)
  if (gl != null) {
    if (gl.noc > -1) simpleGlyph(gl, path)
    else compoGlyph(gl, font, path)
  }
}
