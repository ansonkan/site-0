import { readShort, readUshort, readBytes, readInt8, readF2dot14 } from '../binary'
import { findTable } from '../helpers'

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
  const ng = font.maxp.numGlyphs

  for (let g = 0; g < ng; g++) obj.push(null)

  return obj
}

export function parseGlyf(font, g) {
  const data = font._data
  const loca = font.loca

  if (loca[g] == loca[g + 1]) return null

  let offset = findTable(data, 'glyf', font._offset)[0] + loca[g]

  const gl = {}

  gl.noc = readShort(data, offset)
  offset += 2 // number of contours
  gl.xMin = readShort(data, offset)
  offset += 2
  gl.yMin = readShort(data, offset)
  offset += 2
  gl.xMax = readShort(data, offset)
  offset += 2
  gl.yMax = readShort(data, offset)
  offset += 2

  if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null

  if (gl.noc > 0) {
    gl.endPts = []
    for (let i = 0; i < gl.noc; i++) {
      gl.endPts.push(readUshort(data, offset))
      offset += 2
    }

    const instructionLength = readUshort(data, offset)
    offset += 2
    if (data.length - offset < instructionLength) return null
    gl.instructions = readBytes(data, offset, instructionLength)
    offset += instructionLength

    const crdnum = gl.endPts[gl.noc - 1] + 1
    gl.flags = []
    for (let i = 0; i < crdnum; i++) {
      const flag = data[offset]
      offset++
      gl.flags.push(flag)
      if ((flag & 8) != 0) {
        const rep = data[offset]
        offset++
        for (let j = 0; j < rep; j++) {
          gl.flags.push(flag)
          i++
        }
      }
    }

    gl.xs = []
    for (let i = 0; i < crdnum; i++) {
      const i8 = (gl.flags[i] & 2) != 0
      const same = (gl.flags[i] & 16) != 0
      if (i8) {
        gl.xs.push(same ? data[offset] : -data[offset])
        offset++
      } else {
        if (same) gl.xs.push(0)
        else {
          gl.xs.push(readShort(data, offset))
          offset += 2
        }
      }
    }

    gl.ys = []
    for (let i = 0; i < crdnum; i++) {
      const i8 = (gl.flags[i] & 4) != 0
      const same = (gl.flags[i] & 32) != 0
      if (i8) {
        gl.ys.push(same ? data[offset] : -data[offset])
        offset++
      } else {
        if (same) gl.ys.push(0)
        else {
          gl.ys.push(readShort(data, offset))
          offset += 2
        }
      }
    }

    let x = 0
    let y = 0

    for (let i = 0; i < crdnum; i++) {
      x += gl.xs[i]
      y += gl.ys[i]
      gl.xs[i] = x
      gl.ys[i] = y
    }
  } else {
    const ARG_1_AND_2_ARE_WORDS = 1 << 0
    const ARGS_ARE_XY_VALUES = 1 << 1
    // const ROUND_XY_TO_GRID = 1 << 2
    const WE_HAVE_A_SCALE = 1 << 3
    // const RESERVED = 1 << 4
    const MORE_COMPONENTS = 1 << 5
    const WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6
    const WE_HAVE_A_TWO_BY_TWO = 1 << 7
    const WE_HAVE_INSTRUCTIONS = 1 << 8
    // const USE_MY_METRICS = 1 << 9
    // const OVERLAP_COMPOUND = 1 << 10
    // const SCALED_COMPONENT_OFFSET = 1 << 11
    // const UNSCALED_COMPONENT_OFFSET = 1 << 12

    gl.parts = []
    let flags
    do {
      flags = readUshort(data, offset)
      offset += 2
      const part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 }
      gl.parts.push(part)
      part.glyphIndex = readUshort(data, offset)
      offset += 2

      const updatePart = (arg1, arg2) => {
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1
          part.m.ty = arg2
        } else {
          part.p1 = arg1
          part.p2 = arg2
        }
      }

      if (flags & ARG_1_AND_2_ARE_WORDS) {
        const arg1 = readShort(data, offset)
        offset += 2
        const arg2 = readShort(data, offset)
        offset += 2

        updatePart(arg1, arg2)
      } else {
        const arg1 = readInt8(data, offset)
        offset++
        const arg2 = readInt8(data, offset)
        offset++

        updatePart(arg1, arg2)
      }

      // part.m.tx = arg1;  part.m.ty = arg2;
      // else { throw "params are not XY values"; }

      if (flags & WE_HAVE_A_SCALE) {
        part.m.a = part.m.d = readF2dot14(data, offset)
        offset += 2
      } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
        part.m.a = readF2dot14(data, offset)
        offset += 2
        part.m.d = readF2dot14(data, offset)
        offset += 2
      } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
        part.m.a = readF2dot14(data, offset)
        offset += 2
        part.m.b = readF2dot14(data, offset)
        offset += 2
        part.m.c = readF2dot14(data, offset)
        offset += 2
        part.m.d = readF2dot14(data, offset)
        offset += 2
      }
    } while (flags & MORE_COMPONENTS)
    if (flags & WE_HAVE_INSTRUCTIONS) {
      const numInstr = readUshort(data, offset)
      offset += 2
      gl.instr = []
      for (let i = 0; i < numInstr; i++) {
        gl.instr.push(data[offset])
        offset++
      }
    }
  }
  return gl
}
