import type { cmap } from './tables/cmap'

export interface Font {
  _data: Uint8Array
  _index: number
  _offset: number
  cmap?: cmap
  head?: unknown
  hhea?: unknown
  maxp?: unknown
  hmtx?: unknown
  name?: unknown
  OS2?: unknown
  post?: unknown
  loca?: unknown
  kern?: unknown
  glyf?: null[]
  CFF?: unknown
  SVG?: unknown
}
