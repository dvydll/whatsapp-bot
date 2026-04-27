// Group commands
export interface GroupCommands {
  welcome: (args: string[], context: CommandContext) => Promise<void>;
  antilink: (args: string[], context: CommandContext) => Promise<void>;
  kick: (args: string[], context: CommandContext) => Promise<void>;
  promote: (args: string[], context: CommandContext) => Promise<void>;
}

interface CommandContext {
  sender: string;
  chatJid: string;
}