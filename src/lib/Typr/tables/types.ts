interface cmapDefaultTable {
  format: number
}

interface cmapTable0 extends cmapDefaultTable {
  map: number[]
}

interface cmapTable4 extends cmapDefaultTable {
  searchRange: number
  entrySelector: number
  rangeShift: number
  endCount: number[]
  startCount: number[]
  idDelta: number[]
  idRangeOffset: number[]
  glyphIdArray: number[]
}

interface cmapTable4 extends cmapDefaultTable {
  entryCount: number
  glyphIdArray: number[]
}

interface cmapTable12 extends cmapDefaultTable {
  groups: Uint32Array
}

export type cmapSubTable = cmapDefaultTable | cmapTable0 | cmapTable4 | cmapTable4 | cmapTable12

export interface cmap {
  tables: cmapSubTable[]
  ids: Record<string, number>
  off: number
}

export interface hmtx {
  aWidth: number
  lsBearing: number
}

export interface kern {
  glyph1: number[]
  rval: Array<{
    glyph2: number[]
    vals: number[]
  }>
}
