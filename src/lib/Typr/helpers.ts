import { readUshort, readASCII, readUint } from './binary'

export function findTable(data: Uint8Array, tab: string, foff: number) {
  const numTables = readUshort(data, foff + 4)
  let offset = foff + 12

  for (let i = 0; i < numTables; i++) {
    const tag = readASCII(data, offset, 4)
    const checkSum = readUint(data, offset + 4)
    const toffset = readUint(data, offset + 8)
    const length = readUint(data, offset + 12)
    if (tag == tab) return [toffset, length]
    offset += 16
  }

  return null
}
