import { findTable } from './helpers'

import type { Font } from './types'

// function readFont(data: Uint8Array, idx: number, offset: number, tmap: Record<number, any>) {
//   // var T = Typr['T']
//   const prsr = {
//     cmap: T.cmap,
//     head: T.head,
//     hhea: T.hhea,
//     maxp: T.maxp,
//     hmtx: T.hmtx,
//     name: T.name,
//     'OS/2': T.OS2,
//     post: T.post,

//     loca: T.loca,
//     kern: T.kern,
//     glyf: T.glyf,

//     'CFF ': T.CFF,
//     /*
//     "GPOS",
//     "GSUB",
//     "GDEF",*/

//     'SVG ': T.SVG
//     //"VORG",
//   }
//   const obj: Font = { _data: data, _index: idx, _offset: offset }

//   for (const t in prsr) {
//     const tab = findTable(data, t, offset)
//     if (tab) {
//       const off = tab[0]
//       const tobj = tmap[off]
//       if (tobj == null) tobj = prsr[t].parseTab(data, off, tab[1], obj)
//       obj[t] = tmap[off] = tobj
//     }
//   }
//   return obj
// }

// export function parse() {
//   var bin = Typr['B']
//   var data = new Uint8Array(buff)

//   var tmap = {}
//   var tag = bin.readASCII(data, 0, 4)
//   if (tag == 'ttcf') {
//     var offset = 4
//     var majV = bin.readUshort(data, offset)
//     offset += 2
//     var minV = bin.readUshort(data, offset)
//     offset += 2
//     var numF = bin.readUint(data, offset)
//     offset += 4
//     var fnts = []
//     for (var i = 0; i < numF; i++) {
//       var foff = bin.readUint(data, offset)
//       offset += 4
//       fnts.push(readFont(data, i, foff, tmap))
//     }
//     return fnts
//   } else return [readFont(data, 0, 0, tmap)]
// }
