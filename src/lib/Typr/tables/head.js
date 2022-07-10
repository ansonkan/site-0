import { readFixed, readUint, readUshort, readUint64, readShort } from '../binary'

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

  // prettier-ignore
  {
    obj.fontRevision = readFixed(data, offset);        offset += 4;
    const checkSumAdjustment = readUint(data, offset); offset += 4;
    const magicNumber = readUint(data, offset);        offset += 4;
    obj.flags = readUshort(data, offset);              offset += 2;
    obj.unitsPerEm = readUshort(data, offset);         offset += 2;
    obj.created = readUint64(data, offset);            offset += 8;
    obj.modified = readUint64(data, offset);           offset += 8;
    obj.xMin = readShort(data, offset);                offset += 2;
    obj.yMin = readShort(data, offset);                offset += 2;
    obj.xMax = readShort(data, offset);                offset += 2;
    obj.yMax = readShort(data, offset);                offset += 2;
    obj.macStyle = readUshort(data, offset);           offset += 2;
    obj.lowestRecPPEM = readUshort(data, offset);      offset += 2;
    obj.fontDirectionHint = readShort(data, offset);   offset += 2;
    obj.indexToLocFormat = readShort(data, offset);    offset += 2;
    obj.glyphDataFormat = readShort(data, offset);     offset += 2;
  }

  return obj
}
