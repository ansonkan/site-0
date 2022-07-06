import { readUshort, readShort } from '../binary'

import type { Font } from '../types'

export function parseTab(data: Uint8Array, offset: number, length: number, font: Font) {
  const aWidth: number[] = []
  const lsBearing: number[] = []

  const nG = font['maxp']['numGlyphs']
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
