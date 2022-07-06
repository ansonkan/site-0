import { readUshort, readShort, readUint, readBytes, readASCII } from '../binary'

export function parseTab(data: Uint8Array, offset: number) {
  const ver = readUshort(data, offset)
  offset += 2

  if (ver == 0) return version0(data, offset)
  else if (ver == 1) return version1(data, offset)
  else if (ver == 2 || ver == 3 || ver == 4) return version2(data, offset)
  else if (ver == 5) return version5(data, offset)
  else throw 'unknown OS/2 table version: ' + ver
}

function version0(data: Uint8Array, offset: number) {
  const xAvgCharWidth = readShort(data, offset)
  offset += 2
  const usWeightClass = readUshort(data, offset)
  offset += 2
  const usWidthClass = readUshort(data, offset)
  offset += 2
  const fsType = readUshort(data, offset)
  offset += 2
  const ySubscriptXSize = readShort(data, offset)
  offset += 2
  const ySubscriptYSize = readShort(data, offset)
  offset += 2
  const ySubscriptXOffset = readShort(data, offset)
  offset += 2
  const ySubscriptYOffset = readShort(data, offset)
  offset += 2
  const ySuperscriptXSize = readShort(data, offset)
  offset += 2
  const ySuperscriptYSize = readShort(data, offset)
  offset += 2
  const ySuperscriptXOffset = readShort(data, offset)
  offset += 2
  const ySuperscriptYOffset = readShort(data, offset)
  offset += 2
  const yStrikeoutSize = readShort(data, offset)
  offset += 2
  const yStrikeoutPosition = readShort(data, offset)
  offset += 2
  const sFamilyClass = readShort(data, offset)
  offset += 2
  const panose = readBytes(data, offset, 10)
  offset += 10
  const ulUnicodeRange1 = readUint(data, offset)
  offset += 4
  const ulUnicodeRange2 = readUint(data, offset)
  offset += 4
  const ulUnicodeRange3 = readUint(data, offset)
  offset += 4
  const ulUnicodeRange4 = readUint(data, offset)
  offset += 4
  const achVendID = readASCII(data, offset, 4)
  offset += 4
  const fsSelection = readUshort(data, offset)
  offset += 2
  const usFirstCharIndex = readUshort(data, offset)
  offset += 2
  const usLastCharIndex = readUshort(data, offset)
  offset += 2
  const sTypoAscender = readShort(data, offset)
  offset += 2
  const sTypoDescender = readShort(data, offset)
  offset += 2
  const sTypoLineGap = readShort(data, offset)
  offset += 2
  const usWinAscent = readUshort(data, offset)
  offset += 2
  const usWinDescent = readUshort(data, offset)
  offset += 2

  return {
    obj: {
      xAvgCharWidth,
      usWeightClass,
      usWidthClass,
      fsType,
      ySubscriptXSize,
      ySubscriptYSize,
      ySubscriptXOffset,
      ySubscriptYOffset,
      ySuperscriptXSize,
      ySuperscriptYSize,
      ySuperscriptXOffset,
      ySuperscriptYOffset,
      yStrikeoutSize,
      yStrikeoutPosition,
      sFamilyClass,
      panose,
      ulUnicodeRange1,
      ulUnicodeRange2,
      ulUnicodeRange3,
      ulUnicodeRange4,
      achVendID,
      fsSelection,
      usFirstCharIndex,
      usLastCharIndex,
      sTypoAscender,
      sTypoDescender,
      sTypoLineGap,
      usWinAscent,
      usWinDescent
    },
    offset
  }
}

function version1(data: Uint8Array, offset: number) {
  const ver0 = version0(data, offset)

  const ulCodePageRange1 = readUint(data, ver0.offset)
  ver0.offset += 4
  const ulCodePageRange2 = readUint(data, ver0.offset)
  ver0.offset += 4

  return { obj: { ...ver0.obj, ulCodePageRange1, ulCodePageRange2 }, offset: ver0.offset }
}

function version2(data: Uint8Array, offset: number) {
  const ver1 = version1(data, offset)

  const sxHeight = readShort(data, ver1.offset)
  ver1.offset += 2
  const sCapHeight = readShort(data, ver1.offset)
  ver1.offset += 2
  const usDefault = readUshort(data, ver1.offset)
  ver1.offset += 2
  const usBreak = readUshort(data, ver1.offset)
  ver1.offset += 2
  const usMaxContext = readUshort(data, ver1.offset)
  ver1.offset += 2

  return {
    obj: {
      ...ver1.obj,
      sxHeight,
      sCapHeight,
      usDefault,
      usBreak,
      usMaxContext
    },
    offset: ver1.offset
  }
}

function version5(data: Uint8Array, offset: number) {
  const ver2 = version2(data, offset)

  const usLowerOpticalPointSize = readUshort(data, ver2.offset)
  ver2.offset += 2
  const usUpperOpticalPointSize = readUshort(data, ver2.offset)
  ver2.offset += 2

  return {
    obj: {
      ...ver2.obj,
      usLowerOpticalPointSize,
      usUpperOpticalPointSize
    },
    offset: ver2.offset
  }
}
