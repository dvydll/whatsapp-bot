declare module 'fluent-ffmpeg' {
  const ff: any;
  export default ff;
}

declare module 'node-webpmux' {
  class Image {
    load(path: string | Buffer): Promise<void>;
    exif: Buffer;
    save(path: string): Promise<void>;
  }
  export default { Image };
}

declare module 'fs-extra' {
  import fs from 'fs';
  export default fs;
}