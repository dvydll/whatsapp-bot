// AI Image generation plugin
export interface AIImagePlugin {
  generate(prompt: string, style?: string): Promise<GeneratedImage>;
  variations(image: Buffer, count?: number): Promise<Buffer[]>;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  model: string;
}