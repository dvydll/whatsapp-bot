// Auto-react plugin
export interface AutoReactPlugin {
  addReaction(word: string, emoji: string): void;
  removeReaction(word: string): void;
  getReactions(): Record<string, string>;
  enable(): void;
  disable(): void;
}