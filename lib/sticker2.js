/**
 * Sticker functions (v2) - extraídas de fuction/sticker/rename2.js
 * Requiere: fs-extra, axios, y las funciones exif2 del mismo directorio
 */

let fs, axios
try { fs = require('fs-extra') } catch (e) {}
try { axios = require('axios') } catch (e) {}

// Intentar cargar las funciones exif2
let imageToWebp2, videoToWebp2, writeExifImg2, writeExifVid2
try {
  const exif2 = require('./exif2')
  imageToWebp2 = exif2.imageToWebp2
  videoToWebp2 = exif2.videoToWebp2
  writeExifImg2 = exif2.writeExifImg2
  writeExifVid2 = exif2.writeExifVid2
} catch (e) {
  console.warn('exif2 no disponible para sticker v2')
}

const getBuffer = (url, options) => new Promise(async (resolve, reject) => {
  if (!axios) return reject('axios no disponible')
  options = options || {}
  await axios({ method: "get", url, headers: { "DNT": 1, "Upgrade-Insecure-Request": 1 }, ...options, responseType: "arraybuffer" })
    .then((res) => resolve(res.data))
    .catch(reject)
})

const sendImageAsSticker2 = async (sock, from, path, quoted, options = {}) => {
  if (!fs || !imageToWebp2) return null

  let buff = Buffer.isBuffer(path) ? path
    : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')
    : /^https?:\/\//.test(path) ? await (await getBuffer(path))
    : fs.existsSync(path) ? fs.readFileSync(path)
    : Buffer.alloc(0)

  let buffer
  if (options && (options.packname || options.author)) {
    buffer = await writeExifImg2(buff, options)
  } else {
    buffer = await imageToWebp2(buff)
  }

  await sock.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
  return buffer
}

const sendVideoAsSticker2 = async (sock, from, path, quoted, options = {}) => {
  if (!fs || !videoToWebp2) return null

  let buff = Buffer.isBuffer(path) ? path
    : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')
    : /^https?:\/\//.test(path) ? await (await getBuffer(path))
    : fs.existsSync(path) ? fs.readFileSync(path)
    : Buffer.alloc(0)

  let buffer
  if (options && (options.packname || options.author)) {
    buffer = await writeExifVid2(buff, options)
  } else {
    buffer = await videoToWebp2(buff)
  }

  await sock.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
  return buffer
}

module.exports = { sendVideoAsSticker2, sendImageAsSticker2 }