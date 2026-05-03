/**
 * WhatsApp client wrapper usando Baileys
 * @module infrastructure/external/whatsapp-client
 */

import {
  makeWASocket,
  useMultiFileAuthState,
  type WAMessage,
  type WASocket,
} from 'baileys';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getConfig } from '../../config/env.js';
import { AppError } from '../../shared/errors/app-error.js';
import { getESMDirname } from '../../shared/utils/esm.js';
import { getLogger, type Logger } from '../logging/logger.js';

/**
 * Directorio actual (para session storage)
 */
const __dirname = getESMDirname(import.meta.url);

/**
 * Tipo de mensaje entrante
 */
export interface IncomingMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message?: WAMessage['message'] | null;
  pushName?: string;
  timestamp: number;
}

/**
 * Estado de conexión
 */
export type ConnectionState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected';

/**
 * Callback para eventos
 */
export type MessageCallback = (message: IncomingMessage) => void | Promise<void>;
export type ConnectionCallback = (state: ConnectionState) => void | Promise<void>;
export type ErrorCallback = (error: Error) => void | Promise<void>;

/**
 * Información del bot
 */
export interface BotInfo {
  jid: string;
  name: string;
}

/**
 * Interfaz pública del cliente WhatsApp
 */
export interface WhatsAppClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(jid: string, text: string): Promise<void>;
  getMe(): BotInfo;
  onMessage(callback: MessageCallback): void;
  onConnection(callback: ConnectionCallback): void;
  onError(callback: ErrorCallback): void;
}

/**
 * Implementación del cliente WhatsApp usando Baileys
 */
export class WhatsAppClientImpl implements WhatsAppClient {
  private socket: WASocket | null = null;
  private logger: Logger;
  private botInfo: BotInfo | null = null;
  private connected = false;
  private messageCallbacks: MessageCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private sessionPath: string;
  private connectionResolver: (() => void) | null = null;

  /**
   * Constructor
   */
  constructor() {
    this.logger = getLogger();
    const config = getConfig();

    // Directorio para sesión (default: ./session-data)
    const projectRoot = join(__dirname, '../../../..');
    this.sessionPath = process.env.SESSION_PATH || join(projectRoot, 'session-data');
    this.ensureSessionDirectory();
  }

  /**
   * Asegura que existe el directorio de sesión
   */
  private ensureSessionDirectory(): void {
    if (!existsSync(this.sessionPath)) {
      mkdirSync(this.sessionPath, { recursive: true });
      this.logger.info(`Directorio de sesión creado: ${this.sessionPath}`);
    }
  }

  /**
   * Conecta al cliente con WhatsApp
   */
  async connect(): Promise<void> {
    if (this.connected) {
      this.logger.warn('Ya conectado a WhatsApp');
      return;
    }

    this.logger.info('Iniciando conexión con WhatsApp...');
    this.emitConnection('connecting');

    // Promise que se resuelve cuando la conexión está establecida
    // cuando connection === 'open' o se rechaza por timeout/error
    const connectionPromise = new Promise<void>((resolve, reject) => {
      this.connectionResolver = resolve;

      // Timeout de 30 segundos
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Timeout: conexión no establecida en 30 segundos'));
        }
      }, 30000);
    });

    try {
      // Cargar estado de autenticación
      const authState = await useMultiFileAuthState(this.sessionPath);

      // Crear socket con autenticación
      this.socket = makeWASocket({
        auth: authState.state,
        logger: this.logger as any,
        browser: ['WhatsApp Bot', 'Chrome', '120.0.0'],
      });

      // Evento: conexión actualizada
      this.socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        // QR code recibido ( requiere escaneo)
        if (update.qr) {
          this.logger.info('QR Code recibido, escanea con WhatsApp:');
          console.log(update.qr);
        }

        // Conexión cerrada
        if (connection === 'close') {
          const reason = (lastDisconnect as any)?.error?.message || 'Unknown';
          this.logger.warn(`Conexión cerrada: ${reason}`);
          this.emitConnection('disconnected');
          this.connected = false;

          // Rechazar la promise pendiente si no se estableció
          if (this.connectionResolver) {
            this.connectionResolver();
            this.connectionResolver = null;
          }

          // Reconectar automáticamente si no es cierre intencional
          if (!reason.includes('logged out')) {
            this.logger.info('Reconectando en 5 segundos...');
            setTimeout(() => this.connect(), 5000);
          }
        }

        // Conexión exitosa
        if (connection === 'open') {
          this.logger.info('Conexión establecida con WhatsApp');
          this.connected = true;
          this.emitConnection('connected');

          // Resolver la waiting Promise
          if (this.connectionResolver) {
            this.connectionResolver();
            this.connectionResolver = null;
          }
        }
      });

      // Evento: mensajes nuevos
      this.socket.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
          // Ignorar mensajes del propio bot
          if (msg.key.fromMe) continue;

          const messageData: IncomingMessage = {
            key: {
              remoteJid: msg.key.remoteJid || '',
              fromMe: msg.key.fromMe || false,
              id: msg.key.id || '',
            },
            message: msg.message,
            pushName: msg.pushName || msg.key.remoteJid || undefined,
            timestamp: msg.messageTimestamp as number,
          };

          this.emitMessage(messageData);
        }
      });

      // Guardar credenciales actualizadas
      this.socket.ev.on('creds.update', async () => {
        if (authState.saveCreds) {
          await authState.saveCreds();
        }
      });

      // Esperar a que la conexión se establezca (o timeout)
      await connectionPromise;

    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error al conectar: ${err.message}`);
      this.emitError(err);
      throw new AppError('WA_CONNECTION_ERROR', `Error al conectar: ${err.message}`);
    }
  }

  /**
   * Desconecta del cliente de WhatsApp
   */
  async disconnect(): Promise<void> {
    if (!this.socket) {
      this.logger.warn('No hay conexión activa');
      return;
    }

    this.logger.info('Desconectando de WhatsApp...');
    this.emitConnection('disconnecting');

    try {
      this.socket.end(undefined);
      this.socket = null;
      this.connected = false;
      this.botInfo = null;

      // Limpiar resolver pendiente
      this.connectionResolver = null;

      this.emitConnection('disconnected');
      this.logger.info('Desconectado correctamente');
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error al desconectar: ${err.message}`);
      this.emitError(err);
      throw new AppError('WA_DISCONNECT_ERROR', `Error al desconectar: ${err.message}`);
    }
  }

  /**
   * Envía un mensaje de texto
   * @param jid - JID del destinatario
   * @param text - Texto del mensaje
   */
  async sendMessage(jid: string, text: string): Promise<void> {
    if (!this.socket || !this.connected) {
      throw new AppError('WA_NOT_CONNECTED', 'No hay conexión activa');
    }

    try {
      await this.socket.sendMessage(jid, { text });
      this.logger.debug(`Mensaje enviado a ${jid}: ${text.substring(0, 50)}...`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error al enviar mensaje: ${err.message}`);
      this.emitError(err);
      throw new AppError('WA_SEND_ERROR', `Error al enviar mensaje: ${err.message}`);
    }
  }

  /**
   * Obtiene información del bot
   */
  getMe(): BotInfo {
    if (!this.socket || !this.connected) {
      throw new AppError('WA_NOT_CONNECTED', 'No hay conexión activa');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = this.socket.user as any;
    return {
      jid: user?.jid || '',
      name: user?.name || user?.jid ??.split('@')[0] || 'WhatsApp Bot',
    };
  }

  /**
   * Registra callback para mensajes entrantes
   */
  onMessage(callback: MessageCallback): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Registra callback para cambios de conexión
   */
  onConnection(callback: ConnectionCallback): void {
    this.connectionCallbacks.push(callback);
  }

  /**
   * Registra callback para errores
   */
  onError(callback: ErrorCallback): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Emite evento de mensaje
   */
  private emitMessage(message: IncomingMessage): void {
    for (const callback of this.messageCallbacks) {
      try {
        callback(message);
      } catch (error) {
        const err = error as Error;
        this.logger.error(`Error en callback de mensaje: ${err.message}`);
      }
    }
  }

  /**
   * Emite evento de conexión
   */
  private emitConnection(state: ConnectionState): void {
    for (const callback of this.connectionCallbacks) {
      try {
        callback(state);
      } catch (error) {
        const err = error as Error;
        this.logger.error(`Error en callback de conexión: ${err.message}`);
      }
    }
  }

  /**
   * Emite evento de error
   */
  private emitError(error: Error): void {
    for (const callback of this.errorCallbacks) {
      try {
        callback(error);
      } catch (err) {
        this.logger.error(`Error en callback de error: ${(err as Error).message}`);
      }
    }
  }

  /**
   * Verifica si hay conexión activa
   */
  isConnected(): boolean {
    return this.connected;
  }
}

/**
 * Instancia singleton del cliente
 */
let waClientInstance: WhatsAppClient | null = null;

/**
 * Obtiene la instancia del cliente WhatsApp (singleton)
 */
export function getWhatsAppClient(): WhatsAppClient {
  if (!waClientInstance) {
    waClientInstance = new WhatsAppClientImpl();
  }
  return waClientInstance;
}

export default WhatsAppClientImpl;