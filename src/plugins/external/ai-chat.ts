// AI Chat plugin
export interface AIChatPlugin {
  chat(userId: string, message: string): Promise<string>;
  clearHistory(userId: string): void;
  setSystemPrompt(prompt: string): void;
}