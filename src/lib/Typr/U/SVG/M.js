export function getScale(m) {
  return Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]))
}

export function translate(m, x, y) {
  concat(m, [1, 0, 0, 1, x, y])
}

export function rotate(m, a) {
  concat(m, [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a), 0, 0])
}

export function scale(m, x, y) {
  concat(m, [x, 0, 0, y, 0, 0])
}

export function concat(m, w) {
  const a = m[0]
  const b = m[1]
  const c = m[2]
  const d = m[3]
  const tx = m[4]
  const ty = m[5]

  m[0] = a * w[0] + b * w[2]
  m[1] = a * w[1] + b * w[3]
  m[2] = c * w[0] + d * w[2]
  m[3] = c * w[1] + d * w[3]
  m[4] = tx * w[0] + ty * w[2] + w[4]
  m[5] = tx * w[1] + ty * w[3] + w[5]
}

export function invert(m) {
  const a = m[0]
  const b = m[1]
  const c = m[2]
  const d = m[3]
  const tx = m[4]
  const ty = m[5]
  const adbc = a * d - b * c

  m[0] = d / adbc
  m[1] = -b / adbc
  m[2] = -c / adbc
  m[3] = a / adbc
  m[4] = (c * ty - d * tx) / adbc
  m[5] = (b * tx - a * ty) / adbc
}

export function multPoint(m, p) {
  const x = p[0]
  const y = p[1]

  return [x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5]]
}

export function multArray(m, a) {
  for (let i = 0; i < a.length; i += 2) {
    const x = a[i]
    const y = a[i + 1]

    a[i] = x * m[0] + y * m[2] + m[4]
    a[i + 1] = x * m[1] + y * m[3] + m[5]
  }
}
