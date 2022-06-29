import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'

import { Font } from '@fredli74/typr'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ASSETS_DIR = join(__dirname, '..', 'src', 'assets')
const getFont = (filename: string) => join(ASSETS_DIR, 'fonts', filename)
const FONT_GETTERS = {
  NotoSans: () => getFont('NotoSans-Regular.ttf'),
  NotoSansTC: () => getFont('NotoSansTC-Regular.otf'),
  LibreBarcode39: () => getFont('LibreBarcode39-Regular.ttf'),
  PressStart2P: () => getFont('PressStart2P-Regular.ttf')
}

const TARGET_STRING = "Hello! I'm Anson Kan 政諱 :D"
const OUTPUT_FILEPATH = join(ASSETS_DIR, 'paths', `${new Date().valueOf()}.json`)

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

console.log(font)

const glyphs = font.stringToGlyphs(TARGET_STRING)
const paths = font.glyphsToPath(glyphs)

writeFileSync(OUTPUT_FILEPATH, JSON.stringify(paths), { flag: 'wx' })
