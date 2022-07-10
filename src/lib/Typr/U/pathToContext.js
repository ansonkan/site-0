export function pathToContext({ cmds, crds }, ctx) {
  let c = 0

  for (let j = 0; j < cmds.length; j++) {
    const cmd = cmds[j]

    if (cmd == 'M') {
      ctx.moveTo(crds[c], crds[c + 1])
      c += 2
    } else if (cmd == 'L') {
      ctx.lineTo(crds[c], crds[c + 1])
      c += 2
    } else if (cmd == 'C') {
      ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5])
      c += 6
    } else if (cmd == 'Q') {
      ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3])
      c += 4
    } else if (cmd.charAt(0) == '#') {
      ctx.beginPath()
      ctx.fillStyle = cmd
    } else if (cmd == 'Z') {
      ctx.closePath()
    } else if (cmd == 'X') {
      ctx.fill()
    }
  }
}
