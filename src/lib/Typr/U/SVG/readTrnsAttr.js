import { translate, rotate, scale } from './M'

export function readTrnsAttr(fnc, vls) {
  // console.log(vls)
  // vls = vls.replace(/\-/g, ' -').trim()

  let m = [1, 0, 0, 1, 0, 0]
  let gotSep = true
  for (let i = 0; i < vls.length; i++) {
    // matrix(.99915 0 0 .99915.418.552)   matrix(1 0 0-.9474-22.535 271.03)
    const ch = vls.charAt(i)
    if (ch == ',' || ch == ' ') gotSep = true
    else if (ch == '.') {
      if (!gotSep) {
        vls = vls.slice(0, i) + ',' + vls.slice(i)
        i++
      }

      gotSep = false
    } else if (ch == '-' && i > 0 && vls[i - 1] != 'e') {
      vls = vls.slice(0, i) + ' ' + vls.slice(i)
      i++
      gotSep = true
    }
  }

  vls = vls.split(/\s*[\s,]\s*/).map(parseFloat)
  if (fnc == 'translate') {
    if (vls.length == 1) translate(m, vls[0], 0)
    else translate(m, vls[0], vls[1])
  } else if (fnc == 'scale') {
    if (vls.length == 1) scale(m, vls[0], vls[0])
    else scale(m, vls[0], vls[1])
  } else if (fnc == 'rotate') {
    let tx = 0
    let ty = 0

    if (vls.length != 1) {
      tx = vls[1]
      ty = vls[2]
    }

    translate(m, -tx, -ty)
    rotate(m, (-Math.PI * vls[0]) / 180)
    translate(m, tx, ty)
  } else if (fnc == 'matrix') m = vls
  else console.log('unknown transform: ', fnc)

  return m
}
