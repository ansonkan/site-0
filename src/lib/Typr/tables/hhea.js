import { readFixed, readUshort, readShort } from '../binary'

const keys = [
  'ascender',
  'descender',
  'lineGap',
  'advanceWidthMax',
  'minLeftSideBearing',
  'minRightSideBearing',
  'xMaxExtent',
  'caretSlopeRise',
  'caretSlopeRun',
  'caretOffset',
  'res0',
  'res1',
  'res2',
  'res3',
  'metricDataFormat',
  'numberOfHMetrics'
]

/**
 *
 * @param {Uint8Array} data
 * @param {number} offset
 * @returns
 */
export function parseTab(data, offset) {
  const obj = {}
  const tableVersion = readFixed(data, offset)
  offset += 4

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const func = key == 'advanceWidthMax' || key == 'numberOfHMetrics' ? readUshort : readShort
    obj[key] = func(data, offset + i * 2)
  }

  return obj
}
