import { MoveTo, LineTo, CurveTo, ClosePath } from './P'

import { getCharString, glyphBySE } from '../tables/CFF'

export function drawCFF(cmds, state, font, pdct, p) {
  const stack = state.stack

  let nStems = state.nStems
  let haveWidth = state.haveWidth
  let width = state.width
  let open = state.open

  let i = 0
  let x = state.x
  let y = state.y
  let c1x = 0
  let c1y = 0
  let c2x = 0
  let c2y = 0
  let c3x = 0
  let c3y = 0
  let c4x = 0
  let c4y = 0
  let jpx = 0
  let jpy = 0

  const nominalWidthX = pdct.nominalWidthX
  const o = { val: 0, size: 0 }

  while (i < cmds.length) {
    getCharString(cmds, i, o)
    const v = o.val
    i += o.size

    if (v == 'o1' || v == 'o18') {
      /**
       *  hstem || hstemhm
       *  The number of stem operators on the stack is always even.
       *  If the value is uneven, that means a width is specified.
       */
      const hasWidthArg = stack.length % 2 !== 0
      if (hasWidthArg && !haveWidth) {
        width = stack.shift() + nominalWidthX
      }

      nStems += stack.length >> 1
      stack.length = 0
      haveWidth = true
    } else if (v == 'o3' || v == 'o23') {
      /**
       *  vstem || vstemhm
       *  The number of stem operators on the stack is always even.
       *  If the value is uneven, that means a width is specified.
       */
      const hasWidthArg = stack.length % 2 !== 0
      if (hasWidthArg && !haveWidth) {
        width = stack.shift() + nominalWidthX
      }

      nStems += stack.length >> 1
      stack.length = 0
      haveWidth = true
    } else if (v == 'o4') {
      if (stack.length > 1 && !haveWidth) {
        width = stack.shift() + nominalWidthX
        haveWidth = true
      }

      if (open) ClosePath(p)

      y += stack.pop()

      MoveTo(p, x, y)

      open = true
    } else if (v == 'o5') {
      while (stack.length > 0) {
        x += stack.shift()
        y += stack.shift()

        LineTo(p, x, y)
      }
    } else if (v == 'o6' || v == 'o7') {
      // hlineto || vlineto
      const count = stack.length
      let isX = v == 'o6'

      for (let j = 0; j < count; j++) {
        const sval = stack.shift()

        if (isX) x += sval
        else y += sval

        isX = !isX

        LineTo(p, x, y)
      }
    } else if (v == 'o8' || v == 'o24') {
      // rrcurveto || rcurveline
      const count = stack.length
      let index = 0

      while (index + 6 <= count) {
        c1x = x + stack.shift()
        c1y = y + stack.shift()
        c2x = c1x + stack.shift()
        c2y = c1y + stack.shift()
        x = c2x + stack.shift()
        y = c2y + stack.shift()

        CurveTo(p, c1x, c1y, c2x, c2y, x, y)

        index += 6
      }

      if (v == 'o24') {
        x += stack.shift()
        y += stack.shift()

        LineTo(p, x, y)
      }
    } else if (v == 'o11') break
    else if (v == 'o1234' || v == 'o1235' || v == 'o1236' || v == 'o1237') {
      // if ((v + '').slice(0, 3) == 'o12')
      if (v == 'o1234') {
        c1x = x + stack.shift() // dx1
        c1y = y // dy1
        c2x = c1x + stack.shift() // dx2
        c2y = c1y + stack.shift() // dy2
        jpx = c2x + stack.shift() // dx3
        jpy = c2y // dy3
        c3x = jpx + stack.shift() // dx4
        c3y = c2y // dy4
        c4x = c3x + stack.shift() // dx5
        c4y = y // dy5
        x = c4x + stack.shift() // dx6

        CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy)
        CurveTo(p, c3x, c3y, c4x, c4y, x, y)
      }
      if (v == 'o1235') {
        c1x = x + stack.shift() // dx1
        c1y = y + stack.shift() // dy1
        c2x = c1x + stack.shift() // dx2
        c2y = c1y + stack.shift() // dy2
        jpx = c2x + stack.shift() // dx3
        jpy = c2y + stack.shift() // dy3
        c3x = jpx + stack.shift() // dx4
        c3y = jpy + stack.shift() // dy4
        c4x = c3x + stack.shift() // dx5
        c4y = c3y + stack.shift() // dy5
        x = c4x + stack.shift() // dx6
        y = c4y + stack.shift() // dy6
        stack.shift() // flex depth

        CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy)
        CurveTo(p, c3x, c3y, c4x, c4y, x, y)
      }
      if (v == 'o1236') {
        c1x = x + stack.shift() // dx1
        c1y = y + stack.shift() // dy1
        c2x = c1x + stack.shift() // dx2
        c2y = c1y + stack.shift() // dy2
        jpx = c2x + stack.shift() // dx3
        jpy = c2y // dy3
        c3x = jpx + stack.shift() // dx4
        c3y = c2y // dy4
        c4x = c3x + stack.shift() // dx5
        c4y = c3y + stack.shift() // dy5
        x = c4x + stack.shift() // dx6

        CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy)
        CurveTo(p, c3x, c3y, c4x, c4y, x, y)
      }
      if (v == 'o1237') {
        c1x = x + stack.shift() // dx1
        c1y = y + stack.shift() // dy1
        c2x = c1x + stack.shift() // dx2
        c2y = c1y + stack.shift() // dy2
        jpx = c2x + stack.shift() // dx3
        jpy = c2y + stack.shift() // dy3
        c3x = jpx + stack.shift() // dx4
        c3y = jpy + stack.shift() // dy4
        c4x = c3x + stack.shift() // dx5
        c4y = c3y + stack.shift() // dy5

        if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
          x = c4x + stack.shift()
        } else {
          y = c4y + stack.shift()
        }

        CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy)
        CurveTo(p, c3x, c3y, c4x, c4y, x, y)
      }
    } else if (v == 'o14') {
      if (stack.length > 0 && !haveWidth) {
        width = stack.shift() + font['nominalWidthX']
        haveWidth = true
      }

      if (stack.length == 4) {
        // seac = standard encoding accented character
        // var asb = 0
        const adx = stack.shift()
        const ady = stack.shift()
        const bchar = stack.shift()
        const achar = stack.shift()

        const bind = glyphBySE(font, bchar)
        const aind = glyphBySE(font, achar)

        // console.log(bchar, bind)
        // console.log(achar, aind)
        // state.x = x
        // state.y = y
        // state.nStems = nStems
        // state.haveWidth = haveWidth
        // state.width = width
        // state.open = open

        drawCFF(font.CharStrings[bind], state, font, pdct, p)

        state.x = adx
        state.y = ady

        drawCFF(font.CharStrings[aind], state, font, pdct, p)

        //x=state.x; y=state.y; nStems=state.nStems; haveWidth=state.haveWidth; width=state.width;  open=state.open;
      }
      if (open) {
        ClosePath(p)
        open = false
      }
    } else if (v == 'o19' || v == 'o20') {
      var hasWidthArg

      // The number of stem operators on the stack is always even.
      // If the value is uneven, that means a width is specified.
      hasWidthArg = stack.length % 2 !== 0
      if (hasWidthArg && !haveWidth) {
        width = stack.shift() + nominalWidthX
      }

      nStems += stack.length >> 1
      stack.length = 0
      haveWidth = true

      i += (nStems + 7) >> 3
    } else if (v == 'o21') {
      if (stack.length > 2 && !haveWidth) {
        width = stack.shift() + nominalWidthX
        haveWidth = true
      }

      y += stack.pop()
      x += stack.pop()

      if (open) ClosePath(p)
      MoveTo(p, x, y)

      open = true
    } else if (v == 'o22') {
      if (stack.length > 1 && !haveWidth) {
        width = stack.shift() + nominalWidthX
        haveWidth = true
      }

      x += stack.pop()

      if (open) ClosePath(p)
      MoveTo(p, x, y)

      open = true
    } else if (v == 'o25') {
      while (stack.length > 6) {
        x += stack.shift()
        y += stack.shift()

        LineTo(p, x, y)
      }

      c1x = x + stack.shift()
      c1y = y + stack.shift()
      c2x = c1x + stack.shift()
      c2y = c1y + stack.shift()
      x = c2x + stack.shift()
      y = c2y + stack.shift()

      CurveTo(p, c1x, c1y, c2x, c2y, x, y)
    } else if (v == 'o26') {
      if (stack.length % 2) {
        x += stack.shift()
      }

      while (stack.length > 0) {
        c1x = x
        c1y = y + stack.shift()
        c2x = c1x + stack.shift()
        c2y = c1y + stack.shift()
        x = c2x
        y = c2y + stack.shift()

        CurveTo(p, c1x, c1y, c2x, c2y, x, y)
      }
    } else if (v == 'o27') {
      if (stack.length % 2) {
        y += stack.shift()
      }

      while (stack.length > 0) {
        c1x = x + stack.shift()
        c1y = y
        c2x = c1x + stack.shift()
        c2y = c1y + stack.shift()
        x = c2x + stack.shift()
        y = c2y

        CurveTo(p, c1x, c1y, c2x, c2y, x, y)
      }
    } else if (v == 'o10' || v == 'o29') {
      // callsubr || callgsubr
      const obj = v == 'o10' ? pdct : font

      if (stack.length == 0) {
        console.log('error: empty stack')
      } else {
        const ind = stack.pop()
        const subr = obj.Subrs[ind + obj.Bias]

        state.x = x
        state.y = y
        state.nStems = nStems
        state.haveWidth = haveWidth
        state.width = width
        state.open = open

        drawCFF(subr, state, font, pdct, p)

        x = state.x
        y = state.y
        nStems = state.nStems
        haveWidth = state.haveWidth
        width = state.width
        open = state.open
      }
    } else if (v == 'o30' || v == 'o31') {
      // vhcurveto || hvcurveto
      let count
      const count1 = stack.length

      let index = 0
      let alternate = v == 'o31'

      count = count1 & ~2
      index += count1 - count

      while (index < count) {
        if (alternate) {
          c1x = x + stack.shift()
          c1y = y
          c2x = c1x + stack.shift()
          c2y = c1y + stack.shift()
          y = c2y + stack.shift()

          if (count - index == 5) {
            x = c2x + stack.shift()
            index++
          } else x = c2x

          alternate = false
        } else {
          c1x = x
          c1y = y + stack.shift()
          c2x = c1x + stack.shift()
          c2y = c1y + stack.shift()
          x = c2x + stack.shift()
          if (count - index == 5) {
            y = c2y + stack.shift()
            index++
          } else y = c2y
          alternate = true
        }

        CurveTo(p, c1x, c1y, c2x, c2y, x, y)

        index += 4
      }
    } else if ((v + '').charAt(0) == 'o') {
      console.log('Unknown operation: ' + v, cmds)
      throw v
    } else stack.push(v)
  }

  state.x = x
  state.y = y
  state.nStems = nStems
  state.haveWidth = haveWidth
  state.width = width
  state.open = open
}
