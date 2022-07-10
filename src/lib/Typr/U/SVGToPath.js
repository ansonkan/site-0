import { svgToPath } from './SVG'

export function SVGToPath(d) {
  const pth = { cmds: [], crds: [] }

  svgToPath(d, pth)

  return pth
}
