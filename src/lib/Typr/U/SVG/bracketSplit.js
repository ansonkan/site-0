export function bracketSplit(str, lbr, rbr) {
  const out = []
  let pos = 0
  let ci = 0
  let lvl = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const li = str.indexOf(lbr, ci)
    const ri = str.indexOf(rbr, ci)

    if (li == -1 && ri == -1) break
    if (ri == -1 || (li != -1 && li < ri)) {
      if (lvl == 0) {
        out.push(str.slice(pos, li).trim())
        pos = li + 1
      }

      lvl++
      ci = li + 1
    } else if (li == -1 || (ri != -1 && ri < li)) {
      lvl--

      if (lvl == 0) {
        out.push(str.slice(pos, ri).trim())
        pos = ri + 1
      }

      ci = ri + 1
    }
  }

  return out
}
