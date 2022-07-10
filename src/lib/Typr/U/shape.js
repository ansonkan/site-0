import {codeToGlyph} from './codeToGlyph'

export function shape(font, str, ltr) {
  const gls = []
  for (let i = 0; i < str.length; i++) {
    const cc = str.codePointAt(i)
    if (cc > 0xffff) i++
    gls.push(codeToGlyph(font, cc))
  }

  const shape = []

  for (let i = 0; i < gls.length; i++) {
    const padj = getGlyphPosition(font, gls, i, ltr)
    const gid = gls[i]
    const ax = font.hmtx.aWidth[gid] + padj[2]
    shape.push({ g: gid, cl: i, dx: 0, dy: 0, ax: ax, ay: 0 })
    
  }

  return shape
}

function getGlyphPosition(font, gls, i1) {
  const g1 = gls[i1],
  const  g2 = gls[i1 + 1],
  const  kern = font.kern

  if (kern) {
    var ind1 = kern.glyph1.indexOf(g1)
    if (ind1 != -1) {
      var ind2 = kern.rval[ind1].glyph2.indexOf(g2)
      if (ind2 != -1) return [0, 0, kern.rval[ind1].vals[ind2], 0]
    }
  }

  // console.log('no kern')
  return [0, 0, 0, 0]
}
