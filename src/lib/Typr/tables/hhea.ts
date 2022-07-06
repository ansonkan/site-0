import { readFixed, readUshort, readShort } from '../binary'

export function parseTab(data: Uint8Array, offset: number) {
  const obj = {
    ascender: 0,
    descender: 0,
    lineGap: 0,
    advanceWidthMax: 0,
    minLeftSideBearing: 0,
    minRightSideBearing: 0,
    xMaxExtent: 0,
    caretSlopeRise: 0,
    caretSlopeRun: 0,
    caretOffset: 0,
    res0: 0,
    res1: 0,
    res2: 0,
    res3: 0,
    metricDataFormat: 0,
    numberOfHMetrics: 0
  }
  const keys = Object.keys(obj)

  const tableVersion = readFixed(data, offset)
  offset += 4

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const func = key == 'advanceWidthMax' || key == 'numberOfHMetrics' ? readUshort : readShort
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[key] = func(data, offset + i * 2)
  }
  return obj
}
