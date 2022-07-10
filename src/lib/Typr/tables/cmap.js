import { readShort, readUshort, readUint, readUshorts } from '../binary'

/**
 *
 * @param {Uint8Array} data
 * @param {number} offset
 * @param {number} length
 * @returns
 */
export function parseTab(data, offset, length) {
  const obj = { tables: [], ids: {}, off: offset }
  data = new Uint8Array(data.buffer, offset, length)
  offset = 0

  const version = readUshort(data, offset)
  offset += 2
  const numTables = readUshort(data, offset)
  offset += 2

  const offs = []

  for (let i = 0; i < numTables; i++) {
    const platformID = readUshort(data, offset)
    offset += 2
    const encodingID = readUshort(data, offset)
    offset += 2
    const noffset = readUint(data, offset)
    offset += 4

    const id = 'p' + platformID + 'e' + encodingID

    let tind = offs.indexOf(noffset)

    if (tind == -1) {
      tind = obj.tables.length
      let subt = {}
      offs.push(noffset)

      // var time = Date.now()

      const format = (subt.format = readUshort(data, noffset))
      if (format == 0) subt = parse0(data, noffset, subt)
      else if (format == 2) subt.off = noffset
      else if (format == 4) subt = parse4(data, noffset, subt)
      else if (format == 6) subt = parse6(data, noffset, subt)
      else if (format == 12) subt = parse12(data, noffset, subt)
      // console.log(format, Date.now() - time)
      // else console.log('unknown format: ' + format, platformID, encodingID, noffset)
      obj.tables.push(subt)
    }

    if (obj.ids[id] != null) throw 'multiple tables for one platform+encoding'
    obj.ids[id] = tind
  }
  return obj
}

function parse0(data, offset, obj) {
  offset += 2

  const len = readUshort(data, offset)
  offset += 2
  const lang = readUshort(data, offset)
  offset += 2

  obj.map = []
  for (let i = 0; i < len - 6; i++) obj.map.push(data[offset + i])

  return obj
}

function parse4(data, offset, obj) {
  let offset0 = offset
  offset += 2

  const length = readUshort(data, offset)
  offset += 2
  const language = readUshort(data, offset)
  offset += 2
  const segCountX2 = readUshort(data, offset)
  offset += 2
  const segCount = segCountX2 >>> 1

  obj.searchRange = readUshort(data, offset)
  offset += 2
  obj.entrySelector = readUshort(data, offset)
  offset += 2
  obj.rangeShift = readUshort(data, offset)
  offset += 2
  obj.endCount = readUshorts(data, offset, segCount)
  offset += segCount * 2
  offset += 2
  obj.startCount = readUshorts(data, offset, segCount)
  offset += segCount * 2

  obj.idDelta = []
  for (let i = 0; i < segCount; i++) {
    obj.idDelta.push(readShort(data, offset))
    offset += 2
  }

  obj.idRangeOffset = readUshorts(data, offset, segCount)
  offset += segCount * 2
  obj.glyphIdArray = readUshorts(data, offset, (offset0 + length - offset) >>> 1)
  // offset += segCount * 2
  return obj
}

function parse6(data, offset, obj) {
  offset += 2

  const length = readUshort(data, offset)
  offset += 2
  const language = readUshort(data, offset)
  offset += 2
  obj.firstCode = readUshort(data, offset)
  offset += 2
  const entryCount = readUshort(data, offset)
  offset += 2
  obj.glyphIdArray = []
  for (let i = 0; i < entryCount; i++) {
    obj.glyphIdArray.push(readUshort(data, offset))
    offset += 2
  }

  return obj
}

function parse12(data, offset, obj) {
  offset += 4

  const length = readUint(data, offset)
  offset += 4
  const lang = readUint(data, offset)
  offset += 4
  const nGroups = readUint(data, offset) * 3
  offset += 4

  const gps = (obj.groups = new Uint32Array(nGroups)) // new Uint32Array(data.slice(offset, offset + nGroups * 12).buffer)

  for (let i = 0; i < nGroups; i += 3) {
    gps[i] = readUint(data, offset + (i << 2))
    gps[i + 1] = readUint(data, offset + (i << 2) + 4)
    gps[i + 2] = readUint(data, offset + (i << 2) + 8)
  }

  return obj
}
