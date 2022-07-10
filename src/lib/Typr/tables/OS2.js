import { readUshort, readShort, readBytes, readUint, readASCII } from '../binary'

/**
 *
 * @param {Uint8Array} data
 * @param {number} offset
 * @returns
 */
export function parseTab(data, offset) {
  const ver = readUshort(data, offset)
  offset += 2

  const obj = {}
  if (ver == 0) version0(data, offset, obj)
  else if (ver == 1) version1(data, offset, obj)
  else if (ver == 2 || ver == 3 || ver == 4) version2(data, offset, obj)
  else if (ver == 5) version5(data, offset, obj)
  else throw 'unknown OS/2 table version: ' + ver

  return obj
}

function version0(data, offset, obj) {
  // prettier-ignore
  {
    obj.xAvgCharWidth = readShort(data, offset);       offset += 2;
    obj.usWeightClass = readUshort(data, offset);      offset += 2;
    obj.usWidthClass = readUshort(data, offset);       offset += 2;
    obj.fsType = readUshort(data, offset);             offset += 2;
    obj.ySubscriptXSize = readShort(data, offset);     offset += 2;
    obj.ySubscriptYSize = readShort(data, offset);     offset += 2;
    obj.ySubscriptXOffset = readShort(data, offset);   offset += 2;
    obj.ySubscriptYOffset = readShort(data, offset);   offset += 2;
    obj.ySuperscriptXSize = readShort(data, offset);   offset += 2;
    obj.ySuperscriptYSize = readShort(data, offset);   offset += 2;
    obj.ySuperscriptXOffset = readShort(data, offset); offset += 2;
    obj.ySuperscriptYOffset = readShort(data, offset); offset += 2;
    obj.yStrikeoutSize = readShort(data, offset);      offset += 2;
    obj.yStrikeoutPosition = readShort(data, offset);  offset += 2;
    obj.sFamilyClass = readShort(data, offset);        offset += 2;
    obj.panose = readBytes(data, offset, 10);          offset += 10;
    obj.ulUnicodeRange1 = readUint(data, offset);      offset += 4;
    obj.ulUnicodeRange2 = readUint(data, offset);      offset += 4;
    obj.ulUnicodeRange3 = readUint(data, offset);      offset += 4;
    obj.ulUnicodeRange4 = readUint(data, offset);      offset += 4;
    obj.achVendID = readASCII(data, offset, 4);        offset += 4;
    obj.fsSelection = readUshort(data, offset);        offset += 2;
    obj.usFirstCharIndex = readUshort(data, offset);   offset += 2;
    obj.usLastCharIndex = readUshort(data, offset);    offset += 2;
    obj.sTypoAscender = readShort(data, offset);       offset += 2;
    obj.sTypoDescender = readShort(data, offset);      offset += 2;
    obj.sTypoLineGap = readShort(data, offset);        offset += 2;
    obj.usWinAscent = readUshort(data, offset);        offset += 2;
    obj.usWinDescent = readUshort(data, offset);       offset += 2;
  }

  return offset
}

function version1(data, offset, obj) {
  offset = version0(data, offset, obj)

  // prettier-ignore
  {
    obj.ulCodePageRange1 = readUint(data, offset); offset += 4;
    obj.ulCodePageRange2 = readUint(data, offset); offset += 4;
  }

  return offset
}

function version2(data, offset, obj) {
  offset = version1(data, offset, obj)

  // prettier-ignore
  {
    obj.sxHeight = readShort(data, offset);      offset += 2;
    obj.sCapHeight = readShort(data, offset);    offset += 2;
    obj.usDefault = readUshort(data, offset);    offset += 2;
    obj.usBreak = readUshort(data, offset);      offset += 2;
    obj.usMaxContext = readUshort(data, offset); offset += 2;
  }

  return offset
}

function version5(data, offset, obj) {
  offset = version2(data, offset, obj)

  // prettier-ignore
  {
    obj.usLowerOpticalPointSize = readUshort(data, offset); offset += 2;
    obj.usUpperOpticalPointSize = readUshort(data, offset); offset += 2;
  }

  return offset
}
