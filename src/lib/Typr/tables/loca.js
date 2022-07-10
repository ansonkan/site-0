import { readUshort, readUint } from '../binary'

/**
 *
 * @param {Uint8Array} data
 * @param {number} offset
 * @param {number} length
 * @param {*} font
 * @returns
 */
export function parseTab(data, offset, length, font) {
  const obj = []

  const ver = font.head.indexToLocFormat
  const len = font.maxp.numGlyphs + 1

  if (ver == 0) for (let i = 0; i < len; i++) obj.push(readUshort(data, offset + (i << 1)) << 1)
  if (ver == 1) for (let i = 0; i < len; i++) obj.push(readUint(data, offset + (i << 2)))

  return obj
}
