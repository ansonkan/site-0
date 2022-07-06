import type { cmap, hmtx, kern } from './tables/types'
import type * as head from './tables/head'
import type * as hhea from './tables/hhea'
import type * as maxp from './tables/maxp'
import type * as name from './tables/name'
import type * as OS2 from './tables/OS2'
import type * as post from './tables/post'
import type * as SVG from './tables/SVG'

export interface Font {
  _data: Uint8Array
  _index: number
  _offset: number
  cmap: cmap
  head: ReturnType<typeof head['parseTab']>
  hhea: ReturnType<typeof hhea['parseTab']>
  maxp: ReturnType<typeof maxp['parseTab']>
  hmtx: hmtx
  name: ReturnType<typeof name['parseTab']>
  OS2: ReturnType<typeof OS2['parseTab']>
  post: ReturnType<typeof post['parseTab']>
  loca: number[]
  kern: kern
  glyf: null[]
  CFF?: unknown
  SVG: ReturnType<typeof SVG['parseTab']>
}
