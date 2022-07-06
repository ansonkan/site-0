import { readUshort, readUint } from '../binary'

import type { Font } from '../types'

export function parseTab(data: Uint8Array, offset: number, length: number, font: Font) {
  const obj: number[] = []

  const ver = font.head.indexToLocFormat
  const len = font['maxp']['numGlyphs'] + 1

  if (ver == 0) for (let i = 0; i < len; i++) obj.push(readUshort(data, offset + (i << 1)) << 1)
  if (ver == 1) for (let i = 0; i < len; i++) obj.push(readUint(data, offset + (i << 2)))

  return obj
}
