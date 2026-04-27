// Anti-delete plugin
export interface AntiDeletePlugin {
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
  onDelete(handler: (message: DeletedMessage) => void): void;
}

export interface DeletedMessage {
  jid: string;
  messageId: string;
  from: string;
  timestamp: number;
  content?: string;
}