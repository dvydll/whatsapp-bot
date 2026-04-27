// Economy commands
export interface EconomyCommands {
  balance: (args: string[], context: CommandContext) => Promise<void>;
  daily: (args: string[], context: CommandContext) => Promise<void>;
  transfer: (args: string[], context: CommandContext) => Promise<void>;
  slot: (args: string[], context: CommandContext) => Promise<void>;
}

interface CommandContext {
  sender: string;
  chatJid: string;
}