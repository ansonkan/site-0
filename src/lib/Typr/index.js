import { readASCII, readUshort, readUint } from './binary'
import { findTable } from './helpers'

import * as cmap from './tables/cmap'
import * as head from './tables/head'
import * as hhea from './tables/hhea'
import * as maxp from './tables/maxp'
import * as hmtx from './tables/hmtx'
import * as name from './tables/name'
import * as OS2 from './tables/OS2'
import * as post from './tables/post'
import * as loca from './tables/loca'
import * as kern from './tables/kern'
import * as glyf from './tables/glyf'
import * as CFF from './tables/CFF'
import * as SVG from './tables/SVG'

const prsr = {
  cmap,
  head,
  hhea,
  maxp,
  hmtx,
  name,
  'OS/2': OS2,
  post,

  loca,
  kern,
  glyf,

  'CFF ': CFF,

  // "GPOS",
  // "GSUB",
  // "GDEF",

  'SVG ': SVG
  // "VORG",
}

/**
 *
 * @param {ArrayBuffer} buff
 * @returns
 */
export function parse(buff) {
  const data = new Uint8Array(buff)

  const tmap = {}
  const tag = readASCII(data, 0, 4)

  if (tag == 'ttcf') {
    let offset = 4

    const majV = readUshort(data, offset)
    offset += 2
    const minV = readUshort(data, offset)
    offset += 2
    const numF = readUint(data, offset)
    offset += 4

    const fnts = []
    for (let i = 0; i < numF; i++) {
      const foff = readUint(data, offset)
      offset += 4
      fnts.push(readFont(data, i, foff, tmap))
    }

    return fnts
  } else return [readFont(data, 0, 0, tmap)]
}

function readFont(data, idx, offset, tmap) {
  const obj = { _data: data, _index: idx, _offset: offset }

  for (const t in prsr) {
    const tab = findTable(data, t, offset)
    if (tab) {
      const off = tab[0]
      let tobj = tmap[off]

      if (tobj == null) tobj = prsr[t].parseTab(data, off, tab[1], obj)

      obj[t] = tmap[off] = tobj
    }
  }

  return obj
}
