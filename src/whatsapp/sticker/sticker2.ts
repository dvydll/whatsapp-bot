/**
 * Sticker functions (v2) - extraídas de fuction/sticker/rename2.js
 * Requiere: fs-extra, axios, y las funciones exif2 del mismo directorio
 */

import axios from 'axios';
import fs from 'fs-extra';

// Intentar cargar las funciones exif2
import * as exif2 from './exif2.js';

const imageToWebp2 = exif2.imageToWebp2;
const videoToWebp2 = exif2.videoToWebp2;
const writeExifImg2 = exif2.writeExifImg2;
const writeExifVid2 = exif2.writeExifVid2;

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

const sendImageAsSticker2 = async (
  sock: any,
  from: string,
  path: string | Buffer,
  quoted?: any,
  options: StickerOptions = {}
): Promise<Buffer | null> => {
  if (!fs || !imageToWebp2) return null;

  const buff = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split(',')[1], 'base64')
      : /^https?:\/\//.test(path)
        ? await getBuffer(path)
        : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);

  const buffer: Buffer | null =
    options && (options.packname || options.author)
      ? (await writeExifImg2(buff, options)) ?? null
      : await imageToWebp2(buff);

  await sock.sendMessage(
    from,
    { sticker: { url: buffer }, ...options },
    { quoted },
  );
  return buffer;
};

const sendVideoAsSticker2 = async (
  sock: any,
  from: string,
  path: string | Buffer,
  quoted?: any,
  options: StickerOptions = {}
): Promise<Buffer | null> => {
  if (!fs || !videoToWebp2) return null;

  const buff = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split(',')[1], 'base64')
      : /^https?:\/\//.test(path)
        ? await getBuffer(path)
        : fs.existsSync(path)
          ? fs.readFileSync(path)
          : Buffer.alloc(0);

  const buffer: Buffer | null =
    options && (options.packname || options.author)
      ? (await writeExifVid2(buff, options)) ?? null
      : await videoToWebp2(buff);

  await sock.sendMessage(
    from,
    { sticker: { url: buffer }, ...options },
    { quoted },
  );
  return buffer;
};

export { sendImageAsSticker2, sendVideoAsSticker2 };