import { readFixed, readShort } from '../binary'

export function parseTab(data: Uint8Array, offset: number) {
  const version = readFixed(data, offset)
  offset += 4
  const italicAngle = readFixed(data, offset)
  offset += 4
  const underlinePosition = readShort(data, offset)
  offset += 2
  const underlineThickness = readShort(data, offset)
  offset += 2

  return {
    version,
    italicAngle,
    underlinePosition,
    underlineThickness
  }
}
