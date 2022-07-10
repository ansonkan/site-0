export function pathToSVG({ cmds, crds }, prec) {
  if (prec == null) prec = 5

  const out = []
  let co = 0
  const lmap = { M: 2, L: 2, Q: 4, C: 6 }

  for (let i = 0; i < cmds.length; i++) {
    const cmd = cmds[i]
    const cn = co + (lmap[cmd] ? lmap[cmd] : 0)
    out.push(cmd)

    while (co < cn) {
      const c = crds[co++]
      out.push(parseFloat(c.toFixed(prec)) + (co == cn ? '' : ' '))
    }
  }
  return out.join('')
}
