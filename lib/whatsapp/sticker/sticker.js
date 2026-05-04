/**
 * Sticker functions (v1) - extraídas de fuction/sticker/rename.js
 * Requiere: fs-extra, axios, y las funciones exif del mismo directorio
 */

import fs from 'fs-extra'
import axios from 'axios'

// Intentar cargar las funciones exif
import * as exif from './exif.js'

const imageToWebp = exif.imageToWebp
const videoToWebp = exif.videoToWebp
const writeExifImg = exif.writeExifImg
const writeExifVid = exif.writeExifVid

const getBuffer = (url, options) => new Promise(async (resolve, reject) => {
  options = options || {}
  await axios({ method: "get", url, headers: { "DNT": 1, "Upgrade-Insecure-Request": 1 }, ...options, responseType: "arraybuffer" })
    .then((res) => resolve(res.data))
    .catch(reject)
})

const sendImageAsSticker = async (sock, from, path, quoted, options = {}) => {
  if (!fs || !imageToWebp) return null

  let buff = Buffer.isBuffer(path) ? path
    : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')
      : /^https?:\/\//.test(path) ? await (await getBuffer(path))
        : fs.existsSync(path) ? fs.readFileSync(path)
          : Buffer.alloc(0)

  let buffer
  if (options && (options.packname || options.author)) {
    buffer = await writeExifImg(buff, options)
  } else {
    buffer = await imageToWebp(buff)
  }

  await sock.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
  return buffer
}

const sendVideoAsSticker = async (sock, from, path, quoted, options = {}) => {
  if (!fs || !videoToWebp) return null

  let buff = Buffer.isBuffer(path) ? path
    : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')
      : /^https?:\/\//.test(path) ? await (await getBuffer(path))
        : fs.existsSync(path) ? fs.readFileSync(path)
          : Buffer.alloc(0)

  let buffer
  if (options && (options.packname || options.author)) {
    buffer = await writeExifVid(buff, options)
  } else {
    buffer = await videoToWebp(buff)
  }

  await sock.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
  return buffer
}

export { sendVideoAsSticker, sendImageAsSticker }