/**
 * Command Index - Registra todos los comandos en el registry
 */

import { registerCommands, executeCommand, hasCommand, listCommands } from './registry.js';
import { groupCommands } from './group.js';
import { economyCommands } from './economy.js';
import { toolCommands } from './tools.js';

// Importar comandos existentes de lib/commands/
import configCommands from './config.js';
import infoCommands from './info.js';
import ownerCommands from './owner.js';
import testCommands from './test.js';

/**
 * Registrar todos los comandos de un módulo
 * @param {Object} module - Módulo con comandos { alias: { aliases: [], handler } }
 */
function registerModule(module) {
	for (const [name, cmd] of Object.entries(module)) {
		if (cmd.aliases && cmd.handler) {
			registerCommands(cmd.aliases, cmd.handler);
		}
	}
}

// Registrar módulos
registerModule(groupCommands);
registerModule(economyCommands);
registerModule(toolCommands);

// Registrar comandos existentes (compatibilidad)
registerModule(configCommands);
registerModule(infoCommands);
registerModule(ownerCommands);
registerModule(testCommands);

// Debug: listar comandos registrados
export function getCommandCount() {
	let count = 0;
	for (const [name, cmd] of Object.entries(groupCommands)) count += (cmd.aliases?.length || 1);
	for (const [name, cmd] of Object.entries(economyCommands)) count += (cmd.aliases?.length || 1);
	for (const [name, cmd] of Object.entries(toolCommands)) count += (cmd.aliases?.length || 1);
	return count;
}

export { registerCommands, executeCommand, hasCommand, listCommands };
export default { registerCommands, executeCommand, hasCommand, listCommands, getCommandCount };