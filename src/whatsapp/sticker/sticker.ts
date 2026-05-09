/**
 * Sticker functions (v1) - extraídas de fuction/sticker/rename.js
 * Requiere: fs-extra, axios, y las funciones exif del mismo directorio
 */

import axios from 'axios';
import fs from 'fs-extra';

// Intentar cargar las funciones exif
import * as exif from './exif.js';

const imageToWebp = exif.imageToWebp;
const videoToWebp = exif.videoToWebp;
const writeExifImg = exif.writeExifImg;
const writeExifVid = exif.writeExifVid;

const getBuffer = (url: string, options?: object): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    options = options || {};
    axios({
      method: 'get',
      url,
      headers: { DNT: 1, 'Upgrade-Insecure-Request': 1 },
      ...options,
      responseType: 'arraybuffer',
    })
      .then((res) => resolve(res.data))
      .catch(reject);
  });

interface StickerOptions {
  packname?: string;
  author?: string;
}

const sendImageAsSticker = async (
  sock: any,
  from: string,
  path: string | Buffer,
  quoted?: any,
  options: StickerOptions = {}
): Promise<Buffer | null> => {
  if (!fs || !imageToWebp) return null;

  const buff = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split(',')[1], 'base64')
      : /^https?:\/\//.test(path)
        ? await getBuffer(path)
        : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);

  let buffer: Buffer | null;
  if (options && (options.packname || options.author)) {
    buffer = (await writeExifImg(buff, options)) ?? null;
  } else {
    buffer = await imageToWebp(buff);
  }

  await sock.sendMessage(
    from,
    { sticker: { url: buffer }, ...options },
    { quoted },
  );
  return buffer;
};

const sendVideoAsSticker = async (
  sock: any,
  from: string,
  path: string | Buffer,
  quoted?: any,
  options: StickerOptions = {}
): Promise<Buffer | null> => {
  if (!fs || !videoToWebp) return null;

  const buff = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split(',')[1], 'base64')
      : /^https?:\/\//.test(path)
        ? await getBuffer(path)
        : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);

  let buffer: Buffer | null;
  if (options && (options.packname || options.author)) {
    buffer = (await writeExifVid(buff, options)) ?? null;
  } else {
    buffer = await videoToWebp(buff);
  }

  await sock.sendMessage(
    from,
    { sticker: { url: buffer }, ...options },
    { quoted },
  );
  return buffer;
};

export { sendImageAsSticker, sendVideoAsSticker };