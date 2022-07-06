import { readFixed, readUint, readShort, readUshort, readUint64 } from '../binary'

export function parseTab(data: Uint8Array, offset: number) {
  const tableVersion = readFixed(data, offset)
  offset += 4

  const fontRevision = readFixed(data, offset)
  offset += 4
  const checkSumAdjustment = readUint(data, offset)
  offset += 4
  const magicNumber = readUint(data, offset)
  offset += 4
  const flags = readUshort(data, offset)
  offset += 2
  const unitsPerEm = readUshort(data, offset)
  offset += 2
  const created = readUint64(data, offset)
  offset += 8
  const modified = readUint64(data, offset)
  offset += 8
  const xMin = readShort(data, offset)
  offset += 2
  const yMin = readShort(data, offset)
  offset += 2
  const xMax = readShort(data, offset)
  offset += 2
  const yMax = readShort(data, offset)
  offset += 2
  const macStyle = readUshort(data, offset)
  offset += 2
  const lowestRecPPEM = readUshort(data, offset)
  offset += 2
  const fontDirectionHint = readShort(data, offset)
  offset += 2
  const indexToLocFormat = readShort(data, offset)
  offset += 2
  const glyphDataFormat = readShort(data, offset)
  offset += 2

  return {
    fontRevision,
    flags,
    unitsPerEm,
    created,
    modified,
    xMin,
    yMin,
    xMax,
    yMax,
    macStyle,
    lowestRecPPEM,
    fontDirectionHint,
    indexToLocFormat,
    glyphDataFormat
  }
}
