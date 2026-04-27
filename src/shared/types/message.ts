// Message types
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker';

export interface BotMessage {
  type: MessageType;
  jid: string;
  from: string;
  content: string;
  media?: Buffer;
  timestamp: number;
}

export interface ReplyMessage extends BotMessage {
  quotedMessageId: string;
}