// Image processor service
export interface ImageProcessor {
  resize(image: Buffer, width: number, height: number): Promise<Buffer>;
  compress(image: Buffer, quality: number): Promise<Buffer>;
  toSticker(image: Buffer): Promise<Buffer>;
  addWatermark(image: Buffer, text: string): Promise<Buffer>;
}