import { readUshort, readShort } from '../binary'

/**
 *
 * @param {Uint8Array} data
 * @param {number} offset
 * @param {number} length
 * @param {*} font
 * @returns
 */
export function parseTab(data, offset, length, font) {
  const aWidth = []
  const lsBearing = []

  const nG = font.maxp.numGlyphs
  const nH = font.hhea.numberOfHMetrics

  let aw = 0
  let lsb = 0
  let i = 0

  while (i < nH) {
    aw = readUshort(data, offset + (i << 2))
    lsb = readShort(data, offset + (i << 2) + 2)
    aWidth.push(aw)
    lsBearing.push(lsb)
    i++
  }

  while (i < nG) {
    aWidth.push(aw)
    lsBearing.push(lsb)
    i++
  }

  return { aWidth, lsBearing }
}
