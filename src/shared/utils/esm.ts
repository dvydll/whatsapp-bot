/**
 * Utilidades para ESM (ECMAScript Modules)
 * @module shared/utils/esm
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';

/**
 * Obtiene __filename en ESM
 * @param url - Pasar import.meta.url
 * @returns Ruta absoluta del archivo actual
 */
export function getESMFilename(url: string | URL): string {
  return fileURLToPath(url);
}

/**
 * Obtiene __dirname en ESM
 * @param url - Pasar import.meta.url
 * @returns Directorio absoluto del archivo actual
 */
export function getESMDirname(url: string | URL): string {
  return dirname(fileURLToPath(url));
}

/**
 * Obtiene el directorio del proyecto (raíz)
 * @param url - Pasar import.meta.url
 * @returns Ruta absoluta del directorio del proyecto
 */
export function getProjectDir(url: string | URL): string {
  const currentDir = dirname(fileURLToPath(url));
  // Asume que src/ está en la raíz del proyecto
  return join(currentDir, '..');
}

/**
 * Lee un archivo JSON de forma segura
 * @param filePath - Ruta al archivo JSON
 * @returns Objeto parsado o null si hay error
 */
export function readJSONFile<T>(filePath: string): T | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Lee la versión del package.json
 * @param projectDir - Directorio del proyecto (opcional, detecta automáticamente)
 * @returns Versión del paquete o '0.0.0' si no se encuentra
 */
export function getPackageVersion(projectDir?: string): string {
  const rootDir = projectDir || join(dirname(fileURLToPath(import.meta.url)), '..');
  const packagePath = join(rootDir, 'package.json');
  
  const pkg = readJSONFile<{ version?: string }>(packagePath);
  return pkg?.version || '0.0.0';
}

/**
 * Lee el nombre del paquete desde package.json
 * @param projectDir - Directorio del proyecto (opcional)
 * @returns Nombre del paquete o 'unknown' si no se encuentra
 */
export function getPackageName(projectDir?: string): string {
  const rootDir = projectDir || join(dirname(fileURLToPath(import.meta.url)), '..');
  const packagePath = join(rootDir, 'package.json');
  
  const pkg = readJSONFile<{ name?: string }>(packagePath);
  return pkg?.name || 'unknown';
}