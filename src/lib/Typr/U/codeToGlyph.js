const pps = ['p3e10', 'p0e4', 'p3e1', 'p1e0', 'p0e3', 'p0e1' /*, 'p3e3' */]

export function codeToGlyph(font, code) {
  const cmap = font.cmap

  let tind = -1

  for (let i = 0; i < pps.length; i++)
    if (cmap.ids[pps[i]] != null) {
      tind = cmap.ids[pps[i]]
      break
    }

  if (tind == -1) throw 'no familiar platform and encoding!'

  const tab = cmap.tables[tind]
  let fmt = tab.format
  let gid = -1

  if (fmt == 0) {
    if (code >= tab.map.length) gid = 0
    else gid = tab.map[code]
  } else if (fmt == 4) {
    // else if(fmt==2) {
    // 	var data=font["_data"], off = cmap.off+tab.off+6, bin=Typr["B"];
    // 	var shKey = bin.readUshort(data,off + 2*(code>>>8));
    // 	var shInd = off + 256*2 + shKey*8;

    // 	var firstCode = bin.readUshort(data,shInd);
    // 	var entryCount= bin.readUshort(data,shInd+2);
    // 	var idDelta   = bin.readShort (data,shInd+4);
    // 	var idRangeOffset = bin.readUshort(data,shInd+6);

    // 	if(firstCode<=code && code<=firstCode+entryCount) {
    // 		// not completely correct
    // 		gid = bin.readUshort(data, shInd+6+idRangeOffset + (code&255)*2);
    // 	}
    // 	else gid=0;
    // 	//if(code>256) console.log(code,(code>>>8),shKey,firstCode,entryCount,idDelta,idRangeOffset);

    // 	//throw "e";
    // 	//console.log(tab,  bin.readUshort(data,off));
    // 	//throw "e";
    // }
    let sind = -1
    const ec = tab.endCount
    if (code > ec[ec.length - 1]) sind = -1
    else {
      // smallest index with code <= value
      sind = arrSearch(ec, 1, code)
      if (ec[sind] < code) sind++
    }

    if (sind == -1) gid = 0
    else if (code < tab.startCount[sind]) gid = 0
    else {
      var gli = 0
      if (tab.idRangeOffset[sind] != 0)
        gli =
          tab.glyphIdArray[
            code -
              tab.startCount[sind] +
              (tab.idRangeOffset[sind] >> 1) -
              (tab.idRangeOffset.length - sind)
          ]
      else gli = code + tab.idDelta[sind]
      gid = gli & 0xffff
    }
  } else if (fmt == 6) {
    const off = code - tab.firstCode
    const arr = tab.glyphIdArray

    if (off < 0 || off >= arr.length) gid = 0
    else gid = arr[off]
  } else if (fmt == 12) {
    const grp = tab.groups

    if (code > grp[grp.length - 2]) gid = 0
    else {
      const i = arrSearch(grp, 3, code)
      if (grp[i] <= code && code <= grp[i + 1]) {
        gid = grp[i + 2] + (code - grp[i])
      }
      if (gid == -1) gid = 0
    }
  } else throw 'unknown cmap table format ' + tab.format

  const SVG = font['SVG ']
  const loca = font.loca
  // if the font claims to have a Glyph for a character, but the glyph is empty, and the character is not "white", it is a lie!
  if (
    gid != 0 &&
    font['CFF '] == null &&
    (SVG == null || SVG.entries[gid] == null) &&
    loca[gid] == loca[gid + 1] && // loca not present in CFF or SVG fonts
    [
      0x9, 0xa, 0xb, 0xc, 0xd, 0x20, 0x85, 0xa0, 0x1680, 0x2028, 0x2029, 0x202f, 0x3000, 0x180e,
      0x200b, 0x200c, 0x200d, 0x2060, 0xfeff
    ].indexOf(code) == -1 &&
    !(0x2000 <= code && code <= 0x200a)
  )
    gid = 0

  return gid
}

// find the greatest index with a value <= v
function arrSearch(arr, k, v) {
  let l = 0
  let r = Math.floor(arr.length / k)

  while (l + 1 != r) {
    const mid = l + ((r - l) >>> 1)
    if (arr[mid * k] <= v) l = mid
    else r = mid
  }

  return l * k
}
