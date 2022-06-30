import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

import { Font } from '@fredli74/typr'

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

// const fontName: keyof typeof FONT_GETTERS = 'NotoSansTC'
// const TARGET_STRING = "Hello! I'm Anson Kan 政諱 :D"

const fontName: keyof typeof FONT_GETTERS = 'NotoSans'
const TARGET_STRING = "Hello! I'm Anson Kan :D"

const OUTPUT = {
  paths: join(
    ASSETS_DIR,
    'paths',
    `${hasher.update(TARGET_STRING).digest('hex')}-${fontName}.json`
  ),
  parsedFonts: join(ASSETS_DIR, 'parsed-fonts', `${fontName}.json`)
}

function toArrayBuffer(buf: Buffer) {
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

const data = readFileSync(FONT_GETTERS.NotoSans())
const font = new Font(toArrayBuffer(data))

// console.log(font)
writeFileSync(OUTPUT.parsedFonts, JSON.stringify(font), { flag: 'wx' })

const glyphs = font.stringToGlyphs(TARGET_STRING)
const paths = font.glyphsToPath(glyphs)

writeFileSync(OUTPUT.paths, JSON.stringify(paths), { flag: 'wx' })
