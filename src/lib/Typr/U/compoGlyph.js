import { drawGlyf } from './drawGlyf'

export function compoGlyph(gl, font, p) {
  for (let j = 0; j < gl.parts.length; j++) {
    const path = { cmds: [], crds: [] }
    const prt = gl.parts[j]

    drawGlyf(prt.glyphIndex, font, path)

    const m = prt.m
    for (let i = 0; i < path.crds.length; i += 2) {
      const x = path.crds[i]
      const y = path.crds[i + 1]
      p.crds.push(x * m.a + y * m.b + m.tx)
      p.crds.push(x * m.c + y * m.d + m.ty)
    }

    for (let i = 0; i < path.cmds.length; i++) p.cmds.push(path.cmds[i])
  }
}
