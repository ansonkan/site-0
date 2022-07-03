import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

import { Font } from '@fredli74/typr'
import { Bezier } from 'bezier-js'

import type { Path } from '@fredli74/typr'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const hasher = createHash('md5')

const ASSETS_DIR = join(__dirname, '..', 'src', 'assets')
const getFont = (filename: string) => join(ASSETS_DIR, 'fonts', filename)
const FONT_GETTERS = {
  NotoSans: () => getFont('NotoSans-Regular.ttf'),
  NotoSansTC: () => getFont('NotoSansTC-Regular.otf'),
  LibreBarcode39: () => getFont('LibreBarcode39-Regular.ttf'),
  PressStart2P: () => getFont('PressStart2P-Regular.ttf')
}

const params: Array<{ fontName: keyof typeof FONT_GETTERS; text: string }> = [
  {
    fontName: 'NotoSansTC',
    text: "Hello! I'm Anson Kan 政諱 :D ypQq"
  },
  {
    fontName: 'NotoSans',
    text: "Hello! I'm Anson Kan :D ypQq"
  }
]

const paramIndex = 1
const { fontName, text } = params[paramIndex]

const OUTPUT = {
  paths: join(
    ASSETS_DIR,
    'paths',
    `${fontName}-${hasher.update(text).digest('hex').substring(0, 5)}.json`
  ),
  parsedFonts: join(ASSETS_DIR, 'parsed-fonts', `${fontName}.json`)
}

const data = readFileSync(FONT_GETTERS.NotoSans())
const font = new Font(toArrayBuffer(data))

writeFileSync(OUTPUT.parsedFonts, JSON.stringify(font))

const glyphs = font.stringToGlyphs(text)
const paths = font.glyphsToPath(glyphs)

writeFileSync(OUTPUT.paths, JSON.stringify({ ...paths, bbox: getBoundingBox(paths) }))

function toArrayBuffer(buf: Buffer) {
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

function getBoundingBox({ cmds, crds }: Path) {
  let c = 0
  let last = {
    x: 0,
    y: 0
  }
  const bbox = {
    x: {
      min: Infinity,
      max: -Infinity
    },
    y: {
      min: Infinity,
      max: -Infinity
    }
  }

  const minMax = (value: number, { min, max }: { min: number; max: number }) => ({
    min: value < min ? value : min,
    max: value > max ? value : max
  })

  const minMaxX = (value: number) => {
    bbox.x = minMax(value, bbox.x)
  }

  const minMaxY = (value: number) => {
    bbox.y = minMax(value, bbox.y)
  }

  const minMaxCord = (x: number, y: number) => {
    minMaxX(x)
    minMaxY(y)
  }

  for (let j = 0; j < cmds.length; j++) {
    const cmd = cmds[j]
    if (cmd == 'M') {
      // Move
      minMaxCord(crds[c], crds[c + 1])
      last = { x: crds[c], y: crds[c + 1] }

      c += 2
    } else if (cmd == 'L') {
      // Line
      minMaxCord(crds[c], crds[c + 1])
      last = { x: crds[c], y: crds[c + 1] }

      c += 2
    } else if (cmd == 'C') {
      // Cubic bézier curve
      const cubic = new Bezier(
        last.x,
        last.y,
        crds[c],
        crds[c + 1],
        crds[c + 2],
        crds[c + 3],
        crds[c + 4],
        crds[c + 5]
      )
      const bbox = cubic.bbox()

      // console.log('Cubic bézier curve --------')
      // console.log([
      //   last.x,
      //   last.y,
      //   crds[c],
      //   crds[c + 1],
      //   crds[c + 2],
      //   crds[c + 3],
      //   crds[c + 4],
      //   crds[c + 5]
      // ])
      // console.log(bbox)
      // console.log()

      minMaxCord(bbox.x.min, bbox.y.min)
      minMaxCord(bbox.x.max, bbox.y.min)
      minMaxCord(bbox.x.max, bbox.y.max)
      minMaxCord(bbox.x.min, bbox.y.max)

      c += 6
    } else if (cmd == 'Q') {
      // Quadratic bézier curve
      const quadratic = new Bezier(last.x, last.y, crds[c], crds[c + 1], crds[c + 2], crds[c + 3])
      const bbox = quadratic.bbox()

      // console.log('Quadratic bézier curve --------')
      // console.log([last.x, last.y, crds[c], crds[c + 1], crds[c + 2], crds[c + 3]])
      // console.log(bbox)
      // console.log()

      minMaxCord(bbox.x.min, bbox.y.min)
      minMaxCord(bbox.x.max, bbox.y.min)
      minMaxCord(bbox.x.max, bbox.y.max)
      minMaxCord(bbox.x.min, bbox.y.max)

      c += 4
    }
  }

  return bbox
}
