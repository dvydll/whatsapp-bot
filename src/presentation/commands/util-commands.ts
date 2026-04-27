// Utility commands
export interface UtilCommands {
  menu: (args: string[], context: CommandContext) => Promise<void>;
  ping: (args: string[], context: CommandContext) => Promise<void>;
  help: (args: string[], context: CommandContext) => Promise<void>;
  rules: (args: string[], context: CommandContext) => Promise<void>;
}

interface CommandContext {
  sender: string;
  chatJid: string;
}