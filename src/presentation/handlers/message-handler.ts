/**
 * Manejador de mensajes del bot
 * @module presentation/handlers/message-handler
 */

import { getConfig } from '../../config/env.js';
import { Permissions, type PermissionLevel } from '../../shared/constants/permissions.js';
import { AppError } from '../../shared/errors/app-error.js';
import { getLogger, type Logger } from '../../infrastructure/logging/logger.js';
import type {
  WhatsAppClient,
  IncomingMessage,
} from '../../infrastructure/external/whatsapp-client.js';
import type {
  CommandCallback,
  CommandParams,
  CommandDefinition,
} from './command-registry.js';

/**
 * Resultado del parser de comandos
 */
export interface ParsedCommand {
  /** Nombre del comando (minúsculas) */
  command: string;
  /** Args separados */
  args: string[];
  /** Texto original del mensaje */
  rawText: string;
}

/**
 * Resultado de la validación de permisos
 */
export interface PermissionCheck {
  /** Si tiene permisos */
  allowed: boolean;
  /** Nivel de permiso del usuario */
  userLevel: PermissionLevel;
  /** Nivel requerido por el comando */
  requiredLevel: PermissionLevel;
  /** Razón si no tiene permisos */
  reason?: string;
}

/**
 * Interfaz del MessageHandler
 */
export interface MessageHandler {
  /**
   * Maneja un mensaje entrante
   */
  handle(message: IncomingMessage): Promise<void>;

  /**
   * Registra un comando
   */
  registerCommand(command: CommandDefinition): void;
}

/**
 * Implementación del MessageHandler
 */
export class MessageHandlerImpl implements MessageHandler {
  private logger: Logger;
  private waClient: WhatsAppClient;
  private commandRegistry: Map<string, CommandDefinition> = new Map();

  /**
   * Constructor
   * @param waClient - Cliente de WhatsApp
   * @param commandRegistry - Registry de comandos (opcional)
   */
  constructor(waClient: WhatsAppClient) {
    this.logger = getLogger();
    this.waClient = waClient;
  }

  /**
   * Maneja un mensaje entrante
   */
  async handle(message: IncomingMessage): Promise<void> {
    try {
      const { remoteJid } = message.key;
      const pushName = message.pushName;
      const text = this.extractText(message);

      if (!text || !text.trim()) {
        return;
      }

      // Parsear comando
      const parsed = this.parseCommand(text);

      if (!parsed) {
        this.logger.debug(`Mensaje ignorado (no es comando): ${text.substring(0, 30)}`);
        return;
      }

      this.logger.info(
        `Comando: ${parsed.command} de ${pushName || remoteJid}`
      );

      // Buscar comando en registry
      const command = this.commandRegistry.get(parsed.command.toLowerCase());

      if (!command) {
        await this.reply(remoteJid, `Comando '${parsed.command}' no reconocido`);
        return;
      }

      // Validar permisos
      const permissionCheck = await this.checkPermissions(
        remoteJid,
        command.permissions
      );

      if (!permissionCheck.allowed) {
        await this.reply(
          remoteJid,
          `No tienes permisos para usar este comando. Necesitas: ${this.getPermissionName(permissionCheck.requiredLevel)}`
        );
        return;
      }

      // Ejecutar comando
      const params: CommandParams = {
        jid: remoteJid,
        senderName: pushName || 'Desconocido',
        senderJid: remoteJid,
        args: parsed.args,
        rawText: text,
        message,
      };

      await command.callback(params);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error manejando mensaje: ${err.message}`);

      // Responder con error genérico
      const jid = message.key.remoteJid;
      await this.reply(jid, 'Hubo un error al procesar el comando.');
    }
  }

  /**
   * Registra un comando en el handler
   */
  registerCommand(command: CommandDefinition): void {
    const name = command.name.toLowerCase();
    this.commandRegistry.set(name, command);
    this.logger.debug(`Comando registrado: ${name}`);
  }

  /**
   * Extrae texto del mensaje
   */
  private extractText(message: IncomingMessage): string | null {
    const msg = message.message;
    if (!msg) {
      return null;
    }

    // Mensaje de texto directo
    if (msg.conversation) {
      return msg.conversation;
    }

    // Mensaje extendido
    if (msg.extendedTextMessage?.text) {
      return msg.extendedTextMessage.text;
    }

    return null;
  }

  /**
   * Parsea el texto del mensaje para extraer comando y args
   * Soporta prefijos configurables separated by whitespace or direct mention
   */
  parseCommand(text: string): ParsedCommand | null {
    const config = getConfig();
    const prefix = config.BOT_PREFIX;
    const trimmed = text.trim();

    // Verificar si starts with the prefix
    const startsWithPrefix = trimmed.startsWith(prefix);

    // Si no tiene prefijo, verificar si menciona al bot (opcional)
    const isMention =
      trimmed.startsWith('@') && trimmed.includes(prefix);

    if (!startsWithPrefix && !isMention) {
      return null;
    }

    // Extraer parte después del prefijo
    let commandPart: string;
    if (startsWithPrefix) {
      commandPart = trimmed.slice(prefix.length).trim();
    } else {
      // Para menciones, remover @ y prefijo
      const afterAt = trimmed.replace(/^@[^:]+:/, '').trim();
      commandPart = afterAt;
    }

    if (!commandPart) {
      return null;
    }

    // Separar comando de argumentos
    const parts = commandPart.split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    if (!command) {
      return null;
    }

    return {
      command,
      args,
      rawText: text,
    };
  }

  /**
   * Valida los permisos del usuario
   */
  async checkPermissions(
    jid: string,
    requiredLevel: PermissionLevel
  ): Promise<PermissionCheck> {
    const config = getConfig();

    // Owner tiene acceso a todo
    if (jid === config.OWNER_JID) {
      return {
        allowed: true,
        userLevel: Permissions.OWNER,
        requiredLevel,
      };
    }

    // Por ahora, todos los usuarios tienen nivel PUBLIC
    // Future: integrar con sistema de grupos para ADMIN
    const userLevel = Permissions.PUBLIC;

    return {
      allowed: userLevel >= requiredLevel,
      userLevel,
      requiredLevel,
      reason:
        userLevel < requiredLevel
          ? 'Nivel de permiso insuficiente'
          : undefined,
    };
  }

  /**
   * Obtiene el nombre del nivel de permiso
   */
  private getPermissionName(level: PermissionLevel): string {
    const names: Record<number, string> = {
      [Permissions.PUBLIC]: 'Público',
      [Permissions.PREMIUM]: 'Premium',
      [Permissions.MODERATOR]: 'Moderador',
      [Permissions.ADMIN]: 'Admin',
      [Permissions.OWNER]: 'Dueño',
    };
    return names[level] || 'Desconocido';
  }

  /**
   * Responde a un mensaje
   */
  private async reply(jid: string, text: string): Promise<void> {
    await this.waClient.sendMessage(jid, text);
  }
}

/**
 * Fabrica de MessageHandler
 */
let messageHandlerInstance: MessageHandler | null = null;

/**
 * Crea o obtiene la instancia del MessageHandler
 */
export function createMessageHandler(
  waClient: WhatsAppClient
): MessageHandler {
  if (!messageHandlerInstance) {
    messageHandlerInstance = new MessageHandlerImpl(waClient);
  }
  return messageHandlerInstance;
}

/**
 * Obtiene la instancia existente (debe llamarse después de createMessageHandler)
 */
export function getMessageHandler(): MessageHandler | null {
  return messageHandlerInstance;
}

export type {
  MessageHandlerImpl as Impl,
  MessageHandler as IMessageHandler,
};