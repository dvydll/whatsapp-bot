/**
 * Command Registry - Router de comandos
 * Recibe el comando y lo envía al módulo correspondiente
 */

type CommandHandler = (params: any) => void | Promise<void>;

const commands = new Map<string, CommandHandler>();

// Registrar comando
export function registerCommand(name: string, handler: CommandHandler): void {
  commands.set(name.toLowerCase(), handler);
}

// Registrar múltiples comandos alias
export function registerCommands(names: string[], handler: CommandHandler): void {
  for (const name of names) {
    commands.set(name.toLowerCase(), handler);
  }
}

// Ejecutar comando
export function executeCommand(command: string, context: any): boolean {
  const handler = commands.get(command.toLowerCase());
  if (!handler) return false;
  handler(context);
  return true;
}

// Verificar si existe comando
export function hasCommand(command: string): boolean {
  return commands.has(command.toLowerCase());
}

// Listar comandos (para debug)
export function listCommands(): string[] {
  return Array.from(commands.keys());
}

export default { registerCommand, registerCommands, executeCommand, hasCommand, listCommands };