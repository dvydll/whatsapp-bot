/**
 * Registro de comandos del bot
 * @module presentation/handlers/command-registry
 */

import type { PermissionLevel } from '../../shared/constants/permissions.js';

/**
 * Tipo de callback para un comando
 */
export type CommandCallback = (params: CommandParams) => Promise<void> | void;

/**
 * Parámetros recibidos al ejecutar un comando
 */
export interface CommandParams {
  /** JID del grupo o usuario que envió el comando */
  jid: string;
  /** Nombre del remitente */
  senderName: string;
  /** JID del remitente */
  senderJid: string;
  /** Args del comando (sin el nombre) */
  args: string[];
  /** Texto completo del mensaje */
  rawText: string;
  /** El mensaje original del cliente de WhatsApp */
  message: unknown;
}

/**
 * Definición de un comando registrado
 */
export interface CommandDefinition {
  /** Nombre del comando */
  name: string;
  /** Descripción corta (para help) */
  description: string;
  /** Ejemplo de uso (para help) */
  usage: string;
  /** Callback a ejecutar */
  callback: CommandCallback;
  /** Nivel de permiso requerido */
  permissions: PermissionLevel;
  /** Grupo de comandos (para categorización) */
  category?: string;
  /** Alias del comando */
  aliases?: string[];
}

/**
 * Comando con alias resueltos
 */
interface RegisteredCommand extends CommandDefinition {
  /** Mapa de todos los nombres válidos (incluye aliases) */
  names: Set<string>;
}

/**
 * Registry de comandos disponibles
 */
export class CommandRegistry {
  private commands: Map<string, RegisteredCommand> = new Map();

  /**
   * Registra un nuevo comando
   * @param command - Definición del comando
   * @throws Error si el nombre ya está registrado
   */
  register(command: CommandDefinition): void {
    const { name, aliases = [] } = command;

    // Verificar si el nombre principal ya existe
    if (this.commands.has(name.toLowerCase())) {
      throw new Error(`Comando '${name}' ya está registrado`);
    }

    // Verificar conflictos con aliases
    const normalizedName = name.toLowerCase();
    const normalizedAliases = aliases.map((a) => a.toLowerCase());

    for (const alias of normalizedAliases) {
      if (this.commands.has(alias)) {
        throw new Error(`Alias '${alias}' ya está en uso`);
      }
    }

    // Crear set de nombres válidos
    const names = new Set<string>([normalizedName, ...normalizedAliases]);

    // Guardar comando
    this.commands.set(normalizedName, {
      ...command,
      name: normalizedName,
      aliases: normalizedAliases,
      names,
    });

    // Registrar aliases en el mapa también
    for (const alias of normalizedAliases) {
      this.commands.set(alias, {
        ...command,
        name: normalizedName, // Apunta al nombre principal
        aliases,
        names,
      });
    }
  }

  /**
   * Obtiene un comando por nombre o alias
   * @param name - Nombre o alias del comando
   * @returns El comando o undefined si no existe
   */
  get(name: string): CommandDefinition | undefined {
    const normalizedName = name.toLowerCase();
    const command = this.commands.get(normalizedName);

    if (!command) {
      return undefined;
    }

    // Devolver definición limpia sin el Set interno
    return {
      name: command.name,
      description: command.description,
      usage: command.usage,
      callback: command.callback,
      permissions: command.permissions,
      category: command.category,
      aliases: command.aliases,
    };
  }

  /**
   * Lista todos los comandos registrados
   * @param filter - Filtro opcional por nivel de permisos
   * @returns Lista de comandos
   */
  list(filter?: { minPermissions?: PermissionLevel }): CommandDefinition[] {
    const seen = new Set<string>();
    const result: CommandDefinition[] = [];

    for (const cmd of this.commands.values()) {
      // Evitar duplicados
      if (seen.has(cmd.name)) {
        continue;
      }
      seen.add(cmd.name);

      // Aplicar filtro de permisos si se especifica
      if (filter?.minPermissions !== undefined) {
        if (cmd.permissions < filter.minPermissions) {
          continue;
        }
      }

      result.push({
        name: cmd.name,
        description: cmd.description,
        usage: cmd.usage,
        callback: cmd.callback,
        permissions: cmd.permissions,
        category: cmd.category,
        aliases: cmd.aliases,
      });
    }

    // Ordenar alfabéticamente
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }

  /**
   * Verifica si un comando existe
   * @param name - Nombre o alias
   */
  has(name: string): boolean {
    return this.commands.has(name.toLowerCase());
  }

  /**
   * Obtiene el número de comandos registrados
   */
  size(): number {
    // Contar solo comandos únicos (sin aliases)
    const uniqueNames = new Set<string>();
    for (const cmd of this.commands.values()) {
      uniqueNames.add(cmd.name);
    }
    return uniqueNames.size;
  }
}

/**
 * Instancia singleton del registry
 */
let registryInstance: CommandRegistry | null = null;

/**
 * Obtiene la instancia del registry (singleton)
 */
export function getCommandRegistry(): CommandRegistry {
  if (!registryInstance) {
    registryInstance = new CommandRegistry();
  }
  return registryInstance;
}

export type { CommandRegistry as Registry };