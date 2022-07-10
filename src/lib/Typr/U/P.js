export function MoveTo(p, x, y) {
  p.cmds.push('M')
  p.crds.push(x, y)
}

export function LineTo(p, x, y) {
  p.cmds.push('L')
  p.crds.push(x, y)
}

export function CurveTo(p, a, b, c, d, e, f) {
  p.cmds.push('C')
  p.crds.push(a, b, c, d, e, f)
}

export function qCurveTo(p, a, b, c, d) {
  p.cmds.push('Q')
  p.crds.push(a, b, c, d)
}

export function ClosePath(p) {
  p.cmds.push('Z')
}
