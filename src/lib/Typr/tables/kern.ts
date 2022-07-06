import { readUshort, readFixed, readUint, readShort } from '../binary'

import type { Font } from '../types'

export function parseTab(data: Uint8Array, offset: number) {
  const version = readUshort(data, offset)
  if (version == 1) return parseV1(data, offset)
  const nTables = readUshort(data, offset + 2)
  offset += 4

  const map = { glyph1: [], rval: [] }
  for (let i = 0; i < nTables; i++) {
    offset += 2 // skip version
    const length = readUshort(data, offset)
    offset += 2
    const coverage = readUshort(data, offset)
    offset += 2
    let format = coverage >>> 8
    /* I have seen format 128 once, that's why I do */
    format &= 0xf
    if (format == 0) offset = readFormat0(data, offset, map)
    //else throw "unknown kern table format: "+format;
  }
  return map
}

function parseV1(data: Uint8Array, offset: number) {
  const version = readFixed(data, offset) // 0x00010000
  const nTables = readUint(data, offset + 4)
  offset += 8

  const map = { glyph1: [], rval: [] }
  for (let i = 0; i < nTables; i++) {
    const length = readUint(data, offset)
    offset += 4
    const coverage = readUshort(data, offset)
    offset += 2
    const tupleIndex = readUshort(data, offset)
    offset += 2
    const format = coverage & 0xff
    if (format == 0) offset = readFormat0(data, offset, map)
    // else throw 'unknown kern table format: ' + format
  }
  return map
}

function readFormat0(data: Uint8Array, offset: number, map: Font['kern']) {
  let pleft = -1
  const nPairs = readUshort(data, offset)
  const searchRange = readUshort(data, offset + 2)
  const entrySelector = readUshort(data, offset + 4)
  const rangeShift = readUshort(data, offset + 6)
  offset += 8
  for (let j = 0; j < nPairs; j++) {
    const left = readUshort(data, offset)
    offset += 2
    const right = readUshort(data, offset)
    offset += 2
    const value = readShort(data, offset)
    offset += 2
    if (left != pleft) {
      map.glyph1.push(left)
      map.rval.push({ glyph2: [], vals: [] })
    }
    const rval = map.rval[map.rval.length - 1]
    rval.glyph2.push(right)
    rval.vals.push(value)
    pleft = left
  }
  return offset
}
