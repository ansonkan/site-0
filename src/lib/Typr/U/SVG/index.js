import { concat, multArray } from './M'
import { bracketSplit } from './bracketSplit'
import { readTrnsAttr } from './readTrnsAttr'

export function cssMap(str) {
  const pts = bracketSplit(str, '{', '}')
  const css = {}

  for (let i = 0; i < pts.length; i += 2) {
    const cn = pts[i].split(',')

    for (let j = 0; j < cn.length; j++) {
      const cnj = cn[j].trim()

      if (css[cnj] == null) css[cnj] = ''
      css[cnj] += pts[i + 1]
    }
  }

  return css
}

export function readTrnf(trna) {
  const pts = bracketSplit(trna, '(', ')')
  let m = [1, 0, 0, 1, 0, 0]

  for (let i = 0; i < pts.length; i += 2) {
    const om = m
    m = readTrnsAttr(pts[i], pts[i + 1])
    concat(m, om)
  }

  return m
}

export function toPath(str) {
  const pth = { cmds: [], crds: [] }
  if (str == null) return pth

  const prsr = new DOMParser()
  const doc = prsr.parseFromString(str, 'image/svg+xml')

  // var svg = doc.firstChild
  // while (svg.tagName != 'svg') svg = svg.nextSibling
  const svg = doc.getElementsByTagName('svg')[0]
  let vb = svg.getAttribute('viewBox')

  if (vb) vb = vb.trim().split(' ').map(parseFloat)
  else vb = [0, 0, 1000, 1000]

  toPathHelper(svg.children, pth)

  for (let i = 0; i < pth.crds.length; i += 2) {
    let x = pth.crds[i]
    let y = pth.crds[i + 1]

    x -= vb[0]
    y -= vb[1]
    y = -y

    pth.crds[i] = x
    pth.crds[i + 1] = y
  }

  return pth
}

export function toPathHelper(nds, pth, fill) {
  for (let ni = 0; ni < nds.length; ni++) {
    const nd = nds[ni]
    const tn = nd.tagName
    let cfl = nd.getAttribute('fill')

    if (cfl == null) cfl = fill

    if (tn == 'g') {
      const tp = { crds: [], cmds: [] }
      toPathHelper(nd.children, tp, cfl)

      const trf = nd.getAttribute('transform')
      if (trf) {
        const m = readTrnf(trf)
        multArray(m, tp.crds)
      }

      pth.crds = pth.crds.concat(tp.crds)
      pth.cmds = pth.cmds.concat(tp.cmds)
    } else if (tn == 'path' || tn == 'circle' || tn == 'ellipse') {
      pth.cmds.push(cfl ? cfl : '#000000')

      let d
      if (tn == 'path') d = nd.getAttribute('d') //console.log(d);
      if (tn == 'circle' || tn == 'ellipse') {
        const vls = [0, 0, 0, 0]
        const nms = ['cx', 'cy', 'rx', 'ry', 'r']

        for (let i = 0; i < 5; i++) {
          let V = nd.getAttribute(nms[i])
          if (V) {
            V = parseFloat(V)
            if (i < 4) vls[i] = V
            else vls[2] = vls[3] = V
          }
        }

        const cx = vls[0]
        const cy = vls[1]
        const rx = vls[2]
        const ry = vls[3]

        d = [
          'M',
          cx - rx,
          cy,
          'a',
          rx,
          ry,
          0,
          1,
          0,
          rx * 2,
          0,
          'a',
          rx,
          ry,
          0,
          1,
          0,
          -rx * 2,
          0
        ].join(' ')
      }

      svgToPath(d, pth)
      pth.cmds.push('X')
    }
    // else if (tn == 'defs') {
    // } else console.log(tn, nd)
  }
}

function tokens(d) {
  const ts = []
  let off = 0
  let rn = false
  let cn = ''
  let pc = '' // reading number, current number, prev char

  while (off < d.length) {
    const cc = d.charCodeAt(off)
    const ch = d.charAt(off)
    off++

    const isNum = (48 <= cc && cc <= 57) || ch == '.' || ch == '-' || ch == 'e' || ch == 'E'

    if (rn) {
      if ((ch == '-' && pc != 'e') || (ch == '.' && cn.indexOf('.') != -1)) {
        ts.push(parseFloat(cn))
        cn = ch
      } else if (isNum) {
        cn += ch
      } else {
        ts.push(parseFloat(cn))
        if (ch != ',' && ch != ' ') ts.push(ch)
        rn = false
      }
    } else {
      if (isNum) {
        cn = ch
        rn = true
      } else if (ch != ',' && ch != ' ') ts.push(ch)
    }

    pc = ch
  }

  if (rn) ts.push(parseFloat(cn))

  return ts
}

function getReps(ts, off, ps) {
  let i = off

  while (i < ts.length) {
    if (typeof ts[i] == 'string') break
    i += ps
  }

  return (i - off) / ps
}

export function svgToPath(d, pth) {
  const ts = tokens(d)

  let i = 0
  let x = 0
  let y = 0
  let ox = 0
  let oy = 0

  const oldo = pth.crds.length
  const pc = { M: 2, L: 2, H: 1, V: 1, T: 2, S: 4, A: 7, Q: 4, C: 6 }
  const cmds = pth.cmds
  const crds = pth.crds

  while (i < ts.length) {
    let cmd = ts[i]
    i++

    let cmu = cmd.toUpperCase()

    if (cmu == 'Z') {
      cmds.push('Z')
      x = ox
      y = oy
    } else {
      const ps = pc[cmu]
      const reps = getReps(ts, i, ps)

      for (let j = 0; j < reps; j++) {
        // If a moveto is followed by multiple pairs of coordinates, the subsequent pairs are treated as implicit lineto commands.
        if (j == 1 && cmu == 'M') {
          cmd = cmd == cmu ? 'L' : 'l'
          cmu = 'L'
        }

        let xi = 0
        let yi = 0

        if (cmd != cmu) {
          xi = x
          yi = y
        }

        if (cmu == 'M') {
          x = xi + ts[i++]
          y = yi + ts[i++]

          cmds.push('M')
          crds.push(x, y)
          ox = x
          oy = y
        } else if (cmu == 'L') {
          x = xi + ts[i++]
          y = yi + ts[i++]

          cmds.push('L')
          crds.push(x, y)
        } else if (cmu == 'H') {
          x = xi + ts[i++]

          cmds.push('L')
          crds.push(x, y)
        } else if (cmu == 'V') {
          y = yi + ts[i++]

          cmds.push('L')
          crds.push(x, y)
        } else if (cmu == 'Q') {
          const x1 = xi + ts[i++]
          const y1 = yi + ts[i++]
          const x2 = xi + ts[i++]
          const y2 = yi + ts[i++]

          cmds.push('Q')
          crds.push(x1, y1, x2, y2)

          x = x2
          y = y2
        } else if (cmu == 'T') {
          const co = Math.max(crds.length - 2, oldo)
          const x1 = x + x - crds[co]
          const y1 = y + y - crds[co + 1]
          const x2 = xi + ts[i++]
          const y2 = yi + ts[i++]

          cmds.push('Q')
          crds.push(x1, y1, x2, y2)

          x = x2
          y = y2
        } else if (cmu == 'C') {
          const x1 = xi + ts[i++]
          const y1 = yi + ts[i++]
          const x2 = xi + ts[i++]
          const y2 = yi + ts[i++]
          const x3 = xi + ts[i++]
          const y3 = yi + ts[i++]

          cmds.push('C')
          crds.push(x1, y1, x2, y2, x3, y3)

          x = x3
          y = y3
        } else if (cmu == 'S') {
          const co = Math.max(crds.length - (cmds[cmds.length - 1] == 'C' ? 4 : 2), oldo)
          const x1 = x + x - crds[co]
          const y1 = y + y - crds[co + 1]
          const x2 = xi + ts[i++]
          const y2 = yi + ts[i++]
          const x3 = xi + ts[i++]
          const y3 = yi + ts[i++]

          cmds.push('C')
          crds.push(x1, y1, x2, y2, x3, y3)

          x = x3
          y = y3
        } else if (cmu == 'A') {
          // convert SVG Arc to four cubic bézier segments "C"
          const x1 = x
          const y1 = y

          const rx = ts[i++]
          const ry = ts[i++]

          const phi = ts[i++] * (Math.PI / 180)
          const fA = ts[i++]
          const fS = ts[i++]

          const x2 = xi + ts[i++]
          const y2 = yi + ts[i++]

          if (x2 == x && y2 == y && rx == 0 && ry == 0) continue

          const hdx = (x1 - x2) / 2
          const hdy = (y1 - y2) / 2

          const cosP = Math.cos(phi)
          const sinP = Math.sin(phi)

          const x1A = cosP * hdx + sinP * hdy
          const y1A = -sinP * hdx + cosP * hdy

          const rxS = rx * rx
          const ryS = ry * ry

          const x1AS = x1A * x1A
          const y1AS = y1A * y1A

          const frc = (rxS * ryS - rxS * y1AS - ryS * x1AS) / (rxS * y1AS + ryS * x1AS)
          const coef = (fA != fS ? 1 : -1) * Math.sqrt(Math.max(frc, 0))
          const cxA = (coef * (rx * y1A)) / ry
          const cyA = (-coef * (ry * x1A)) / rx

          const cx = cosP * cxA - sinP * cyA + (x1 + x2) / 2
          const cy = sinP * cxA + cosP * cyA + (y1 + y2) / 2

          const vX = (x1A - cxA) / rx
          const vY = (y1A - cyA) / ry

          const theta1 = angl(1, 0, vX, vY)
          const dtheta = angl(vX, vY, (-x1A - cxA) / rx, (-y1A - cyA) / ry) % (2 * Math.PI)

          const gst = { pth: pth, ctm: [rx * cosP, rx * sinP, -ry * sinP, ry * cosP, cx, cy] }

          arc(gst, 0, 0, 1, theta1, theta1 + dtheta, fS == 0)

          x = x2
          y = y2
        } else console.log('Unknown SVG command ' + cmd)
      }
    }
  }
}

function angl(ux, uy, vx, vy) {
  const lU = Math.sqrt(ux * ux + uy * uy)
  const lV = Math.sqrt(vx * vx + vy * vy)
  const num = (ux * vx + uy * vy) / (lU * lV)

  return (ux * vy - uy * vx >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, num)))
}

function rotate(m, angle) {
  const si = Math.sin(angle)
  const co = Math.cos(angle)

  const a = m[0]
  const b = m[1]
  const c = m[2]
  const d = m[3]

  m[0] = a * co + b * si
  m[1] = -a * si + b * co
  m[2] = c * co + d * si
  m[3] = -c * si + d * co
}

function multArr(m, a) {
  for (let j = 0; j < a.length; j += 2) {
    const x = a[j]
    const y = a[j + 1]

    a[j] = m[0] * x + m[2] * y + m[4]
    a[j + 1] = m[1] * x + m[3] * y + m[5]
  }
}

function concatA(a, b) {
  for (let j = 0; j < b.length; j++) a.push(b[j])
}

function concatP(p, r) {
  concatA(p.cmds, r.cmds)
  concatA(p.crds, r.crds)
}

function arc(gst, x, y, r, a0, a1, neg) {
  // circle from a0 counter-clock-wise to a1
  if (neg) while (a1 > a0) a1 -= 2 * Math.PI
  else while (a1 < a0) a1 += 2 * Math.PI

  const th = (a1 - a0) / 4

  const x0 = Math.cos(th / 2)
  const y0 = -Math.sin(th / 2)

  const x1 = (4 - x0) / 3
  const y1 = y0 == 0 ? y0 : ((1 - x0) * (3 - x0)) / (3 * y0)

  const x2 = x1
  const y2 = -y1

  const x3 = x0
  const y3 = -y0

  const ps = [x1, y1, x2, y2, x3, y3]

  const pth = { cmds: ['C', 'C', 'C', 'C'], crds: ps.slice(0) }
  const rot = [1, 0, 0, 1, 0, 0]

  rotate(rot, -th)

  for (let j = 0; j < 3; j++) {
    multArr(rot, ps)
    concatA(pth.crds, ps)
  }

  rotate(rot, -a0 + th / 2)

  rot[0] *= r
  rot[1] *= r
  rot[2] *= r
  rot[3] *= r
  rot[4] = x
  rot[5] = y

  multArr(rot, pth.crds)
  multArr(gst.ctm, pth.crds)
  concatP(gst.pth, pth)
}
