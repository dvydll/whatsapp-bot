// Wikipedia plugin
export interface WikipediaPlugin {
  search(query: string): Promise<WikipediaResult[]>;
  getPage(title: string): Promise<string>;
}

export interface WikipediaResult {
  title: string;
  snippet: string;
  pageId: number;
}