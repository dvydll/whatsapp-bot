// YouTube downloader service
export interface YouTubeDownloader {
  getVideoInfo(url: string): Promise<VideoInfo>;
  downloadAudio(url: string, outputPath: string): Promise<string>;
  downloadVideo(url: string, outputPath: string): Promise<string>;
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  views: number;
}