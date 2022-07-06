import { readUshort, readUint, readUTF8 } from '../binary'

export function parseTab(data: Uint8Array, offset: number) {
  const entries: string[] = []

  const offset0 = offset

  const tableVersion = readUshort(data, offset)
  offset += 2
  const svgDocIndexOffset = readUint(data, offset)
  offset += 4
  const reserved = readUint(data, offset)
  offset += 4

  offset = svgDocIndexOffset + offset0

  const numEntries = readUshort(data, offset)
  offset += 2

  for (let i = 0; i < numEntries; i++) {
    const startGlyphID = readUshort(data, offset)
    offset += 2
    const endGlyphID = readUshort(data, offset)
    offset += 2
    const svgDocOffset = readUint(data, offset)
    offset += 4
    const svgDocLength = readUint(data, offset)
    offset += 4

    const sbuf = new Uint8Array(
      data.buffer,
      offset0 + svgDocOffset + svgDocIndexOffset,
      svgDocLength
    )
    const svg = readUTF8(sbuf, 0, sbuf.length)

    for (let f = startGlyphID; f <= endGlyphID; f++) {
      entries[f] = svg
    }
  }

  return { entries }
}
