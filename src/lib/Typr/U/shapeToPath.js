import { glyphToPath } from './glyphToPath'

export function shapeToPath(font, shape, clr) {
  const tpath = { cmds: [], crds: [] }

  let x = 0
  let y = 0

  for (let i = 0; i < shape.length; i++) {
    const it = shape[i]
    const path = glyphToPath(font, it['g'])
    const crds = path.crds

    for (let j = 0; j < crds.length; j += 2) {
      tpath.crds.push(crds[j] + x + it['dx'])
      tpath.crds.push(crds[j + 1] + y + it['dy'])
    }

    if (clr) tpath.cmds.push(clr)

    for (var j = 0; j < path['cmds'].length; j++) tpath.cmds.push(path['cmds'][j])

    const clen = tpath.cmds.length
    if (clr) if (clen != 0 && tpath.cmds[clen - 1] != 'X') tpath.cmds.push('X') // SVG fonts might contain "X". Then, nothing would stroke non-SVG glyphs.

    x += it['ax']
    y += it['ay']
  }

  return tpath
}
