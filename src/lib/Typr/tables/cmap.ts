import { readUint, readUshort, readUshorts, readShort } from '../binary'

interface DefaultFormat {
  format: number
}

type SubTable =
  | DefaultFormat
  | ReturnType<typeof parse0>
  | ReturnType<typeof parse4>
  | ReturnType<typeof parse6>
  | ReturnType<typeof parse12>

export interface cmap {
  tables: SubTable[]
  ids: Record<string, number>
  off: number
}

export function parseTab(data: Uint8Array, offset: number, length: number) {
  const obj: cmap = { tables: [], ids: {}, off: offset }
  data = new Uint8Array(data.buffer, offset, length)
  offset = 0

  const version = readUshort(data, offset)
  offset += 2
  const numTables = readUshort(data, offset)
  offset += 2

  //console.log(version, numTables);

  const offs = []

  for (let i = 0; i < numTables; i++) {
    const platformID = readUshort(data, offset)
    offset += 2
    const encodingID = readUshort(data, offset)
    offset += 2
    const noffset = readUint(data, offset)
    offset += 4

    const id = 'p' + platformID + 'e' + encodingID

    //console.log("cmap subtable", platformID, encodingID, noffset);

    let tind = offs.indexOf(noffset)

    if (tind == -1) {
      tind = obj.tables.length
      const format = readUshort(data, noffset)
      offs.push(noffset)
      // var time = Date.now()

      let subt: SubTable = { format }

      if (format == 0) subt = parse0(data, noffset)
      // else if (format == 2) subt.off = noffset
      else if (format == 4) subt = parse4(data, noffset)
      else if (format == 6) subt = parse6(data, noffset)
      else if (format == 12) subt = parse12(data, noffset)
      // else console.log('unknown format: ' + format, platformID, encodingID, noffset)
      // console.log(format, Date.now() - time)
      obj.tables.push(subt)
    }

    if (obj.ids[id] != null) throw 'multiple tables for one platform+encoding'
    obj.ids[id] = tind
  }
  return obj
}

function parse0(data: Uint8Array, offset: number) {
  offset += 2

  const len = readUshort(data, offset)
  offset += 2

  const lang = readUshort(data, offset)
  offset += 2

  const map: number[] = []
  for (let i = 0; i < len - 6; i++) map.push(data[offset + i])

  return { format: 0, map }
}

function parse4(data: Uint8Array, offset: number) {
  const offset0 = offset
  offset += 2

  const length = readUshort(data, offset)
  offset += 2

  const language = readUshort(data, offset)
  offset += 2

  const segCountX2 = readUshort(data, offset)
  offset += 2

  const segCount = segCountX2 >>> 1
  const searchRange = readUshort(data, offset)
  offset += 2

  const entrySelector = readUshort(data, offset)
  offset += 2

  const rangeShift = readUshort(data, offset)
  offset += 2

  const endCount = readUshorts(data, offset, segCount)
  offset += segCount * 2
  offset += 2

  const startCount = readUshorts(data, offset, segCount)
  offset += segCount * 2

  const idDelta: number[] = []
  for (let i = 0; i < segCount; i++) {
    idDelta.push(readShort(data, offset))
    offset += 2
  }

  const idRangeOffset = readUshorts(data, offset, segCount)
  offset += segCount * 2

  const glyphIdArray = readUshorts(data, offset, (offset0 + length - offset) >>> 1)
  // offset += segCount * 2

  return {
    format: 4,
    searchRange,
    entrySelector,
    rangeShift,
    endCount,
    startCount,
    idDelta,
    idRangeOffset,
    glyphIdArray
  }
}

function parse6(data: Uint8Array, offset: number) {
  offset += 2

  const length = readUshort(data, offset)
  offset += 2

  const language = readUshort(data, offset)
  offset += 2

  const firstCode = readUshort(data, offset)
  offset += 2

  const entryCount = readUshort(data, offset)
  offset += 2

  const glyphIdArray: number[] = []
  for (let i = 0; i < entryCount; i++) {
    glyphIdArray.push(readUshort(data, offset))
    offset += 2
  }

  return {
    format: 6,
    entryCount,
    glyphIdArray
  }
}

function parse12(data: Uint8Array, offset: number) {
  offset += 4

  const length = readUint(data, offset)
  offset += 4

  const lang = readUint(data, offset)
  offset += 4

  const nGroups = readUint(data, offset) * 3
  offset += 4

  const gps = new Uint32Array(nGroups) // new Uint32Array(data.slice(offset, offset + nGroups * 12).buffer)

  for (let i = 0; i < nGroups; i += 3) {
    gps[i] = readUint(data, offset + (i << 2))
    gps[i + 1] = readUint(data, offset + (i << 2) + 4)
    gps[i + 2] = readUint(data, offset + (i << 2) + 8)
  }
  return { format: 12, groups: gps }
}
