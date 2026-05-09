/**
 * Funciones helper utilitarias - extraídas de index.js
 * Sin dependencias del socket
 */

import fs from 'fs'

/**
 * Selecciona un elemento aleatorio de un array
 * @param list - Array de elementos
 * @returns Elemento aleatorio
 */
function pickRandom<T>(list: T[]): T | undefined {
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Elimina un archivo silenciosamente
 * @param file - Ruta del archivo a eliminar
 */
function DLT_FL(file: string): void {
  try {
    fs.unlinkSync(file)
  } catch {
    // Silencioso
  }
}

/**
 * Función sleep
 * @param ms - Milisegundos a esperar
 * @returns Promise que resuelve después del delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Valida si un string es una URL
 * @param url - String a validar
 * @returns true si es una URL válida
 */
function isUrl(url: string): boolean {
  return !!url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

/**
 * Guarda el estado del bot (activo/inactivo)
 * @param estado - Estado del bot
 */
function guardarEstadoBot(estado: boolean): void {
  const estadoPath = './settings/estadoBot.json'
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: estado }, null, 2))
}

/**
 * Obtiene el estado del bot
 * @returns true si está activo
 */
function getEstadoBot(): boolean {
  const estadoPath = './settings/estadoBot.json'
  if (!fs.existsSync(estadoPath)) {
    fs.writeFileSync(estadoPath, JSON.stringify({ activo: true }, null, 2))
    return true
  }
  return JSON.parse(fs.readFileSync(estadoPath, 'utf-8')).activo
}

/**
 * Genera un código aleatorio de 6 dígitos
 * @returns Código de 6 caracteres
 */
function generarCodigo(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    const indice = Math.floor(Math.random() * caracteres.length)
    codigo += caracteres.charAt(indice)
  }
  return codigo
}

/**
 * Carga un JSON con manejo de errores
 * @param filePath - Ruta del archivo JSON
 * @returns Contenido parseado o array vacío
 */
function loadJson<T>(filePath: string): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return [] as unknown as T
  }
}

export {
  pickRandom,
  DLT_FL,
  sleep,
  isUrl,
  guardarEstadoBot,
  getEstadoBot,
  generarCodigo,
  loadJson
}