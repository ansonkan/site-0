import { MoveTo, LineTo, qCurveTo, ClosePath } from './P'

export function simpleGlyph(gl, p) {
  for (let c = 0; c < gl.noc; c++) {
    const i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1
    const il = gl.endPts[c]

    for (let i = i0; i <= il; i++) {
      const pr = i == i0 ? il : i - 1
      const nx = i == il ? i0 : i + 1
      const onCurve = gl.flags[i] & 1
      const prOnCurve = gl.flags[pr] & 1
      const nxOnCurve = gl.flags[nx] & 1

      const x = gl.xs[i]
      const y = gl.ys[i]

      if (i == i0) {
        if (onCurve) {
          if (prOnCurve) MoveTo(p, gl.xs[pr], gl.ys[pr])
          else {
            MoveTo(p, x, y)
            continue /*  will do CurveTo at il  */
          }
        } else {
          if (prOnCurve) MoveTo(p, gl.xs[pr], gl.ys[pr])
          else MoveTo(p, Math.floor((gl.xs[pr] + x) * 0.5), Math.floor((gl.ys[pr] + y) * 0.5))
        }
      }

      if (onCurve) {
        if (prOnCurve) LineTo(p, x, y)
      } else {
        if (nxOnCurve) qCurveTo(p, x, y, gl.xs[nx], gl.ys[nx])
        else qCurveTo(p, x, y, Math.floor((x + gl.xs[nx]) * 0.5), Math.floor((y + gl.ys[nx]) * 0.5))
      }
    }

    ClosePath(p)
  }
}
