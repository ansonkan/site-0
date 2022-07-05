const t = (function () {
  const ab = new ArrayBuffer(8)
  return {
    buff: ab,
    int8: new Int8Array(ab),
    uint8: new Uint8Array(ab),
    int16: new Int16Array(ab),
    uint16: new Uint16Array(ab),
    int32: new Int32Array(ab),
    uint32: new Uint32Array(ab)
  }
})()

const TextDecoder = window.TextDecoder ? new window.TextDecoder() : null

export function readFixed(data: Uint8Array, o: number) {
  return ((data[o] << 8) | data[o + 1]) + ((data[o + 2] << 8) | data[o + 3]) / (256 * 256 + 4)
}

export function readF2dot14(data: Uint8Array, o: number) {
  const num = readShort(data, o)
  return num / 16384
}

export function readInt(buff: Uint8Array, p: number) {
  // if (p >= buff.length) throw 'error'
  const a = t.uint8
  a[0] = buff[p + 3]
  a[1] = buff[p + 2]
  a[2] = buff[p + 1]
  a[3] = buff[p]
  return t.int32[0]
}

export function readInt8(buff: Uint8Array, p: number) {
  // if (p >= buff.length) throw 'error'
  const a = t.uint8
  a[0] = buff[p]
  return t.int8[0]
}

export function readShort(buff: Uint8Array, p: number) {
  // if (p >= buff.length) throw 'error'
  const a = t.uint8
  a[1] = buff[p]
  a[0] = buff[p + 1]
  return t.int16[0]
}

export function readUshort(buff: Uint8Array, p: number) {
  // if (p >= buff.length) throw 'error'
  return (buff[p] << 8) | buff[p + 1]
}

export function writeUshort(buff: Uint8Array, p: number, n: number) {
  buff[p] = (n >> 8) & 255
  buff[p + 1] = n & 255
}

export function readUshorts(buff: Uint8Array, p: number, len: number) {
  const arr = []
  for (let i = 0; i < len; i++) {
    const v = readUshort(buff, p + i * 2)
    // if (v == 932) console.log(p + i * 2)
    arr.push(v)
  }
  return arr
}

export function readUint(buff: Uint8Array, p: number) {
  // if (p >= buff.length) throw 'error'
  const a = t.uint8
  a[3] = buff[p]
  a[2] = buff[p + 1]
  a[1] = buff[p + 2]
  a[0] = buff[p + 3]
  return t.uint32[0]
}

export function writeUint(buff: Uint8Array, p: number, n: number) {
  buff[p] = (n >> 24) & 255
  buff[p + 1] = (n >> 16) & 255
  buff[p + 2] = (n >> 8) & 255
  buff[p + 3] = (n >> 0) & 255
}

export function readUint64(buff: Uint8Array, p: number) {
  // if (p >= buff.length) throw 'error'
  return readUint(buff, p) * (0xffffffff + 1) + readUint(buff, p + 4)
}

// l : length in Characters (not Bytes)
export function readASCII(buff: Uint8Array, p: number, l: number) {
  // if (p >= buff.length) throw 'error'
  let s = ''
  for (let i = 0; i < l; i++) s += String.fromCharCode(buff[p + i])
  return s
}

export function writeASCII(buff: Uint8Array, p: number, s: string) {
  for (let i = 0; i < s.length; i++) buff[p + i] = s.charCodeAt(i)
}

export function readUnicode(buff: Uint8Array, p: number, l: number) {
  // if (p >= buff.length) throw 'error'
  let s = ''
  for (let i = 0; i < l; i++) {
    const c = (buff[p++] << 8) | buff[p++]
    s += String.fromCharCode(c)
  }
  return s
}

export function readUTF8(buff: Uint8Array, p: number, l: number) {
  if (TextDecoder && p == 0 && l == buff.length) return TextDecoder.decode(buff)
  return readASCII(buff, p, l)
}

export function readBytes(buff: Uint8Array, p: number, l: number) {
  // if (p >= buff.length) throw 'error'
  const arr = []
  for (let i = 0; i < l; i++) arr.push(buff[p + i])
  return arr
}

// l : length in Characters (not Bytes)
export function readASCIIArray(buff: Uint8Array, p: number, l: number) {
  // if (p >= buff.length) throw 'error'
  const s = []
  for (let i = 0; i < l; i++) s.push(String.fromCharCode(buff[p + i]))
  return s
}
