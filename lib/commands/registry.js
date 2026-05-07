/**
 * Command Registry - Router de comandos
 * Recibe el comando y lo envía al módulo correspondiente
 */

const commands = new Map();

// Registrar comando
export function registerCommand(name, handler) {
	commands.set(name.toLowerCase(), handler);
}

// Registrar múltiples comandos alias
export function registerCommands(names, handler) {
	for (const name of names) {
		commands.set(name.toLowerCase(), handler);
	}
}

// Ejecutar comando
export function executeCommand(command, context) {
	const handler = commands.get(command.toLowerCase());
	if (!handler) return false;
	handler(context);
	return true;
}

// Verificar si existe comando
export function hasCommand(command) {
	return commands.has(command.toLowerCase());
}

// Listar comandos (para debug)
export function listCommands() {
	return Array.from(commands.keys());
}

export default { registerCommand, registerCommands, executeCommand, hasCommand, listCommands };