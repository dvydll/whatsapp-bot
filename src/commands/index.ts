/**
 * Command Index - Simplified
 */

import { economyCommands } from './economy.js';
import { groupCommands } from './group.js';
import { executeCommand, hasCommand, listCommands, registerCommands } from './registry.js';
import { toolCommands } from './tools.js';
import configCommands from './config.js';
import infoCommands from './info.js';
import ownerCommands from './owner.js';
import testCommands from './test.js';

// Registrar módulos -acepta cualquier estructura
function registerModule(module: any) {
  for (const cmd of Object.values(module)) {
    const c = cmd as { aliases?: string[]; handler?: any };
    if (c && c.aliases && c.handler) {
      registerCommands(c.aliases, c.handler);
    }
  }
}

registerModule(groupCommands);
registerModule(economyCommands);
registerModule(toolCommands);
registerModule(configCommands);
registerModule(infoCommands);
registerModule(ownerCommands);
registerModule(testCommands);

export function getCommandCount(): number {
  return listCommands().length;
}

export { executeCommand, hasCommand, listCommands, registerCommands };
export default { registerCommands, executeCommand, hasCommand, listCommands, getCommandCount };