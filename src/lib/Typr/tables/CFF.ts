import { readShort, readUshort, readUint, readInt, readASCII } from '../binary'

// prettier-ignore
const tableSE = [
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    1,   2,   3,   4,   5,   6,   7,   8,
    9,  10,  11,  12,  13,  14,  15,  16,
   17,  18,  19,  20,  21,  22,  23,  24,
   25,  26,  27,  28,  29,  30,  31,  32,
   33,  34,  35,  36,  37,  38,  39,  40,
   41,  42,  43,  44,  45,  46,  47,  48,
   49,  50,  51,  52,  53,  54,  55,  56,
   57,  58,  59,  60,  61,  62,  63,  64,
   65,  66,  67,  68,  69,  70,  71,  72,
   73,  74,  75,  76,  77,  78,  79,  80,
   81,  82,  83,  84,  85,  86,  87,  88,
   89,  90,  91,  92,  93,  94,  95,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0,  96,  97,  98,  99, 100, 101, 102,
  103, 104, 105, 106, 107, 108, 109, 110,
    0, 111, 112, 113, 114,   0, 115, 116,
  117, 118, 119, 120, 121, 122,   0, 123,
    0, 124, 125, 126, 127, 128, 129, 130,
  131,   0, 132, 133,   0, 134, 135, 136,
  137,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   0,
    0, 138,   0, 139,   0,   0,   0,   0,
  140, 141, 142, 143,   0,   0,   0,   0,
    0, 144,   0,   0,   0, 145,   0,   0,
  146, 147, 148, 149,   0,   0,   0,   0
] as const

const KEYS = {
  vs1: [
    'version',
    'Notice',
    'FullName',
    'FamilyName',
    'Weight',
    'FontBBox',
    'BlueValues',
    'OtherBlues',
    'FamilyBlues',
    'FamilyOtherBlues',
    'StdHW',
    'StdVW',
    'escape',
    'UniqueID',
    'XUID',
    'charset',
    'Encoding',
    'CharStrings',
    'Private',
    'Subrs',
    'defaultWidthX',
    'nominalWidthX'
  ],
  vs2: [
    'Copyright',
    'isFixedPitch',
    'ItalicAngle',
    'UnderlinePosition',
    'UnderlineThickness',
    'PaintType',
    'CharstringType',
    'FontMatrix',
    'StrokeWidth',
    'BlueScale',
    'BlueShift',
    'BlueFuzz',
    'StemSnapH',
    'StemSnapV',
    'ForceBold',
    '',
    '',
    'LanguageGroup',
    'ExpansionFactor',
    'initialRandomSeed',
    'SyntheticBase',
    'PostScript',
    'BaseFontName',
    'BaseFontBlend',
    '',
    '',
    '',
    '',
    '',
    '',
    'ROS',
    'CIDFontVersion',
    'CIDFontRevision',
    'CIDFontType',
    'CIDCount',
    'UIDBase',
    'FDArray',
    'FDSelect',
    'FontName'
  ]
} as const

const CHARS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  '.',
  'e',
  'e-',
  'reserved',
  '-',
  'endOfNumber'
] as const

type Key = typeof KEYS.vs1[number] | typeof KEYS.vs2[number]
// type Value = number | null | Array<number | null>
type Dict = ReturnType<typeof readDict>

const isNumArr = (arr: unknown): arr is number[] =>
  Array.isArray(arr) && !arr.some((x) => typeof x === 'number')

export function parseTab(data: Uint8Array, offset: number, length: number) {
  data = new Uint8Array(data.buffer, offset, length)
  offset = 0

  // Header
  const major = data[offset]
  offset++
  const minor = data[offset]
  offset++
  const hdrSize = data[offset]
  offset++
  const offsize = data[offset]
  offset++
  // console.log(major, minor, hdrSize, offsize)

  // Name INDEX
  const NAME_INDEX = readIndex(data, offset)
  const ninds = NAME_INDEX.indexes
  offset = NAME_INDEX.offset

  const names: string[] = []
  for (let i = 0; i < ninds.length - 1; i++)
    names.push(readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]))
  offset += ninds[ninds.length - 1]

  // Top DICT INDEX
  const DICT_INDEX = readIndex(data, offset)
  const tdinds = DICT_INDEX.indexes
  offset = DICT_INDEX.offset

  // Top DICT Data
  const topDicts: Dict[] = []
  for (let i = 0; i < tdinds.length - 1; i++)
    topDicts.push(readDict(data, offset + tdinds[i], offset + tdinds[i + 1]))
  offset += tdinds[tdinds.length - 1]
  const topdict = topDicts[0]

  // String INDEX
  const STR_INDEX = readIndex(data, offset)
  const sinds = STR_INDEX.indexes
  offset = STR_INDEX.offset

  // String Data
  const strings: string[] = []
  for (let i = 0; i < sinds.length - 1; i++)
    strings.push(readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]))
  offset += sinds[sinds.length - 1]

  // Global Subr INDEX  (subroutines)
  const step1 = {
    ...topdict,
    ...readSubrs(data, offset)
  }

  // charstrings
  const step2 = {
    ...step1,
    CharStrings:
      step1.CharStrings && typeof step1.CharStrings === 'number'
        ? readBytes(data, step1.CharStrings)
        : step1.CharStrings
  }

  // CID font
  const step3 = {
    ...step2,
    ...(() => {
      if (step2.ROS && typeof step2.FDArray === 'number' && typeof step2.FDSelect === 'number') {
        offset = step2.FDArray

        const FS_INDEX = readIndex(data, offset)
        offset = FS_INDEX.offset
        const fdind = FS_INDEX.indexes

        const FDArray: Array<Omit<Dict, 'Private'> & ReturnType<typeof _readFDict>> = []
        for (let i = 0; i < fdind.length - 1; i++) {
          const dict = readDict(data, offset + fdind[i], offset + fdind[i + 1])
          FDArray.push({
            ...dict,
            ..._readFDict(data, dict, strings)
          })
        }
        offset += fdind[fdind.length - 1]

        offset = step2.FDSelect
        const FDSelect: number[] = []
        const fmt = data[offset]
        offset++
        if (fmt == 3) {
          const rns = readUshort(data, offset)
          offset += 2
          for (let i = 0; i < rns + 1; i++) {
            FDSelect.push(readUshort(data, offset), data[offset + 2])
            offset += 3
          }
        } else throw fmt

        return {
          FDArray,
          FDSelect
        }
      }

      return {}
    })()
  }

  // Encoding
  // if (topdict['Encoding'])
  //   topdict['Encoding'] = readEncoding(data, topdict['Encoding'], topdict['CharStrings'].length)

  // charset
  const step4 = {
    ...step3,
    charset:
      typeof step3.charset === 'number' && Array.isArray(step3.CharStrings)
        ? readCharset(data, step3.charset, step3.CharStrings.length)
        : step3.charset
  }

  return {
    ...step4,
    ..._readFDict(data, step4, strings)
  }
}

const TargetedKeys = [
  'FamilyName',
  'FontName',
  'FullName',
  'Notice',
  'version',
  'Copyright'
] as const

function _readFDict(
  data: Uint8Array,
  dict: Pick<Dict, 'Private' | typeof TargetedKeys[number]>,
  ss: string[]
) {
  const step1 = {
    ...dict,
    ...(() => {
      if (isNumArr(dict.Private)) {
        const offset = dict.Private[1]
        const Private = readDict(data, offset, offset + dict.Private[0])

        return {
          Private: {
            ...Private,
            ...(Private.Subrs && typeof Private.Subrs === 'number'
              ? readSubrs(data, offset + Private.Subrs)
              : {})
          }
        }
      }

      return {}
    })()
  }

  return TargetedKeys.reduce((acc, cur) => {
    const val = acc[cur]
    if (typeof val === 'number' && val) {
      return {
        ...acc,
        [cur]: ss[val - 426 + 35]
      }
    }

    return acc
  }, step1)
}

function readSubrs(data: Uint8Array, offset: number) {
  const Subrs = readBytes(data, offset)

  let bias: number
  const nSubrs = Subrs.length + 1
  if (nSubrs < 1240) bias = 107
  else if (nSubrs < 33900) bias = 1131
  else bias = 32768

  return {
    Subrs,
    Bias: bias
  }
}

function readBytes(data: Uint8Array, offset: number) {
  const { offset: off, indexes } = readIndex(data, offset)

  const subrs: Uint8Array[] = []
  const arl = indexes.length - 1
  const no = data.byteOffset + off
  for (let i = 0; i < arl; i++) {
    const ari = indexes[i]
    subrs.push(new Uint8Array(data.buffer, no + ari, indexes[i + 1] - ari))
  }
  return subrs
}

function glyphByUnicode(charset: number[], code: number) {
  for (let i = 0; i < charset.length; i++) if (charset[i] == code) return i
  return -1
}

// glyph by standard encoding
export function glyphBySE({ charset }: Dict, charcode: number) {
  if (charcode < 0 || charcode > 255 || !isNumArr(charset)) return -1
  return glyphByUnicode(charset, tableSE[charcode])
}

/*readEncoding : function(data, offset, num)
		{
			var bin = Typr["B"];
			
			var array = ['.notdef'];
			var format = data[offset];  offset++;
			//console.log("Encoding");
			//console.log(format);
			
			if(format==0)
			{
				var nCodes = data[offset];  offset++;
				for(var i=0; i<nCodes; i++)  array.push(data[offset+i]);
			}
			/*
			else if(format==1 || format==2)
			{
				while(charset.length<num)
				{
					var first = bin.readUshort(data, offset);  offset+=2;
					var nLeft=0;
					if(format==1) {  nLeft = data[offset];  offset++;  }
					else          {  nLeft = bin.readUshort(data, offset);  offset+=2;  }
					for(var i=0; i<=nLeft; i++)  {  charset.push(first);  first++;  }
				}
			}
			
			else throw "error: unknown encoding format: " + format;
			
			return array;
		},*/

function readCharset(data: Uint8Array, offset: number, num: number) {
  const charset: Array<string | number> = ['.notdef']
  const format = data[offset]
  offset++

  if (format == 0) {
    for (let i = 0; i < num; i++) {
      const first = readUshort(data, offset)
      offset += 2
      charset.push(first)
    }
  } else if (format == 1 || format == 2) {
    while (charset.length < num) {
      let first = readUshort(data, offset)
      offset += 2
      let nLeft = 0
      if (format == 1) {
        nLeft = data[offset]
        offset++
      } else {
        nLeft = readUshort(data, offset)
        offset += 2
      }
      for (let i = 0; i <= nLeft; i++) {
        charset.push(first)
        first++
      }
    }
  } else throw 'error: format: ' + format

  return charset
}

function readIndex(data: Uint8Array, offset: number) {
  const indexes: number[] = []

  const count = readUshort(data, offset) + 1
  offset += 2
  const offsize = data[offset]
  offset++

  if (offsize == 1) {
    for (let i = 0; i < count; i++) indexes.push(data[offset + i])
  } else if (offsize == 2) {
    for (let i = 0; i < count; i++) indexes.push(readUshort(data, offset + i * 2))
  } else if (offsize == 3) {
    for (let i = 0; i < count; i++) indexes.push(readUint(data, offset + i * 3 - 1) & 0x00ffffff)
  } else if (offsize == 4) {
    for (let i = 0; i < count; i++) indexes.push(readUint(data, offset + i * 4))
  } else if (count != 1) throw 'unsupported offset size: ' + offsize + ', count: ' + count

  offset += count * offsize
  return { offset: offset - 1, indexes }
}

export function getCharString(data: Uint8Array, offset: number) {
  const b0 = data[offset]
  const b1 = data[offset + 1]
  // const b2 = data[offset + 2]
  // const b3 = data[offset + 3]
  // const b4 = data[offset + 4]

  let vs = 1
  let op = null
  let val = null

  // prettier-ignore
  {
    // operand
    if (b0 <= 20) { op = b0; vs = 1; }
    if (b0 == 12) { op = b0 * 100 + b1; vs = 2; }
    // if (b0 == 19 || b0 == 20) { op = b0 /* +" "+b1 */; vs = 2; }  
    if (21 <= b0 && b0 <= 27) { op = b0; vs = 1; }
    if (b0 == 28) { val = readShort(data, offset + 1); vs = 3; }
    if (29 <= b0 && b0 <= 31) { op = b0; vs = 1; }
    if (32 <= b0 && b0 <= 246) { val = b0 - 139; vs = 1; }
    if (247 <= b0 && b0 <= 250) { val = (b0 - 247) * 256 + b1 + 108; vs = 2; }
    if (251 <= b0 && b0 <= 254) { val = -(b0 - 251) * 256 - b1 - 108; vs = 2; }
    if (b0 == 255) { val = readInt(data, offset + 1) / 0xffff; vs = 5; }
  }

  return {
    val: val != null ? val : 'o' + op,
    size: vs
  }
}

function readCharString(data: Uint8Array, offset: number, length: number) {
  const end = offset + length

  const arr: Array<string | number> = []

  while (offset < end) {
    const b0 = data[offset]
    const b1 = data[offset + 1]
    // const b2 = data[offset + 2]
    // const b3 = data[offset + 3]
    // const b4 = data[offset + 4]

    let vs = 1
    let op = null
    let val = null

    // prettier-ignore
    {
      // operand
      if (b0 <= 20) { op = b0; vs = 1; }
      if (b0 == 12) { op = b0 * 100 + b1; vs = 2; }
      if (b0 == 19 || b0 == 20) { op = b0 /* +" "+b1 */; vs = 2; }
      if (21 <= b0 && b0 <= 27) { op = b0; vs = 1; }
      if (b0 == 28) { val = readShort(data, offset + 1); vs = 3; }
      if (29 <= b0 && b0 <= 31) { op = b0; vs = 1; }
      if (32 <= b0 && b0 <= 246) { val = b0 - 139; vs = 1; }
      if (247 <= b0 && b0 <= 250) { val = (b0 - 247) * 256 + b1 + 108; vs = 2; }
      if (251 <= b0 && b0 <= 254) { val = -(b0 - 251) * 256 - b1 - 108; vs = 2; }
      if (b0 == 255) { val = readInt(data, offset + 1) / 0xffff; vs = 5; }
    }

    arr.push(val != null ? val : 'o' + op)
    offset += vs

    // var cv = arr[arr.length - 1]
    // if (cv == undefined) throw 'error'
    // console.log()
  }

  return arr
}

function readDict(data: Uint8Array, offset: number, end: number) {
  const dict: Partial<Record<Key, number | null | Array<number | null>>> = {}
  let carr: Array<number | null> = []

  while (offset < end) {
    const b0 = data[offset]
    const b1 = data[offset + 1]
    // const b2 = data[offset + 2]
    // const b3 = data[offset + 3]
    // const b4 = data[offset + 4]
    let vs = 1
    let key: Key | null = null
    let val: number | null = null

    // prettier-ignore
    {
      // operand
      if (b0 == 28) { val = readShort(data, offset + 1); vs = 3; }
      if (b0 == 29) { val = readInt  (data, offset + 1); vs = 5; }
      if (32  <= b0 && b0 <= 246) { val =   b0 - 139;                   vs = 1; }
      if (247 <= b0 && b0 <= 250) { val =  (b0 - 247) * 256 + b1 + 108; vs = 2; }
      if (251 <= b0 && b0 <= 254) { val = -(b0 - 251) * 256 - b1 - 108; vs = 2; }
      if (b0 == 255) { val = readInt(data, offset + 1) / 0xffff; vs = 5; throw 'unknown number'; }
    }

    if (b0 == 30) {
      const nibs: number[] = []
      vs = 1

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const b = data[offset + vs]
        vs++
        const nib0 = b >> 4
        const nib1 = b & 0xf
        if (nib0 != 0xf) nibs.push(nib0)
        if (nib1 != 0xf) nibs.push(nib1)
        if (nib1 == 0xf) break
      }

      let s = ''
      for (let i = 0; i < nibs.length; i++) s += CHARS[nibs[i]]
      // console.log(nibs);
      val = parseFloat(s)
    }

    if (b0 <= 21) {
      // operator
      key = KEYS.vs1[b0]
      vs = 1

      if (b0 == 12) {
        key = KEYS.vs2[b1]
        vs = 2
      }
    }

    if (key != null) {
      dict[key] = carr.length == 1 ? carr[0] : carr
      carr = []
    } else carr.push(val)

    offset += vs
  }

  return dict
}
