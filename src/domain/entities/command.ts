// Command entity
export interface Command {
  name: string;
  description: string;
  aliases: string[];
  category: string;
  cooldown: number;
  permission: 'public' | 'admin' | 'owner';
  usage: string;
}

export type CommandHandler = (context: CommandContext) => Promise<void>;

export interface CommandContext {
  message: string;
  sender: string;
  chatJid: string;
  args: string[];
}