import { readUshort, readUnicode, readASCII } from '../binary'

const names = [
  'copyright',
  'fontFamily',
  'fontSubfamily',
  'ID',
  'fullName',
  'version',
  'postScriptName',
  'trademark',
  'manufacturer',
  'designer',
  'description',
  'urlVendor',
  'urlDesigner',
  'licence',
  'licenceURL',
  '---',
  'typoFamilyName',
  'typoSubfamilyName',
  'compatibleFull',
  'sampleText',
  'postScriptCID',
  'wwsFamilyName',
  'wwsSubfamilyName',
  'lightPalette',
  'darkPalette'
] as const

export function parseTab(data: Uint8Array, offset: number) {
  const obj: Record<string, Record<string, string | number>> = {}
  const format = readUshort(data, offset)
  offset += 2
  const count = readUshort(data, offset)
  offset += 2
  const stringOffset = readUshort(data, offset)
  offset += 2

  //console.log(format,count);

  const offset0 = offset

  for (let i = 0; i < count; i++) {
    const platformID = readUshort(data, offset)
    offset += 2
    const encodingID = readUshort(data, offset)
    offset += 2
    const languageID = readUshort(data, offset)
    offset += 2
    const nameID = readUshort(data, offset)
    offset += 2
    const slen = readUshort(data, offset)
    offset += 2
    const noffset = readUshort(data, offset)
    offset += 2
    // console.log(platformID, encodingID, languageID.toString(16), nameID, length, noffset)

    const soff = offset0 + count * 12 + noffset
    let str: string
    if (platformID == 0) str = readUnicode(data, soff, slen / 2)
    else if (platformID == 3 && encodingID == 0) str = readUnicode(data, soff, slen / 2)
    else if (encodingID == 0) str = readASCII(data, soff, slen)
    else if (encodingID == 1) str = readUnicode(data, soff, slen / 2)
    else if (encodingID == 3) str = readUnicode(data, soff, slen / 2)
    else if (encodingID == 4) str = readUnicode(data, soff, slen / 2)
    else if (encodingID == 10) str = readUnicode(data, soff, slen / 2)
    else if (platformID == 1) {
      str = readASCII(data, soff, slen)
      console.log('reading unknown MAC encoding ' + encodingID + ' as ASCII')
    } else {
      console.log('unknown encoding ' + encodingID + ', platformID: ' + platformID)
      str = readASCII(data, soff, slen)
    }

    const tid = 'p' + platformID + ',' + languageID.toString(16) // Typr._platforms[platformID];
    if (obj[tid] == null) obj[tid] = {}
    obj[tid][names[nameID]] = str
    obj[tid]['_lang'] = languageID
    // console.log(tid, obj[tid])
  }
  /*
  if(format == 1)
  {
    var langTagCount = bin.readUshort(data, offset);  offset += 2;
    for(var i=0; i<langTagCount; i++)
    {
      var length  = bin.readUshort(data, offset);  offset += 2;
      var noffset = bin.readUshort(data, offset);  offset += 2;
    }
  }
  */

  //console.log(obj);
  const psn = 'postScriptName'

  for (const p in obj) if (obj[p][psn] != null && obj[p]['_lang'] == 0x0409) return obj[p] // United States
  for (const p in obj) if (obj[p][psn] != null && obj[p]['_lang'] == 0x0000) return obj[p] // Universal
  for (const p in obj) if (obj[p][psn] != null && obj[p]['_lang'] == 0x0c0c) return obj[p] // Canada
  for (const p in obj) if (obj[p][psn] != null) return obj[p]

  let out
  for (const p in obj) {
    out = obj[p]
    break
  }

  if (out) {
    console.log('returning name table with languageID ' + out._lang)
    if (out[psn] == null && out['ID'] != null) out[psn] = out['ID']
  }

  return out
}
