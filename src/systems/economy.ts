/**
 * Sistema de economía y registro - extraído de settings/Grupo/Js/reg.js
 * Maneja registro de usuarios, coins, XP, niveles y reputación
 */

import fs from 'fs'

const JsonRegistro = './settings/Grupo/Json/registros.json'

export interface RegistroEntry {
  id: string;
  nombre: string;
  nivel: number;
  xp: number;
  rxp: number;
  dinero: number;
  rep: number;
}

let registro: RegistroEntry[] = []
try {
  registro = JSON.parse(fs.readFileSync(JsonRegistro, 'utf-8'))
} catch (error) {
  console.error(error)
  registro = []
}

const saveRegistro = (): void => {
  fs.writeFileSync(JsonRegistro, `${JSON.stringify(registro, null, 2)}\n`)
}

// ========================
// REGISTRO
// ========================

/**
 * Registra un nuevo usuario
 * @param sender - JID del usuario
 * @param nombre - Nombre del usuario
 */
export const AddReg = (sender: string, nombre: string): void => {
  const obj: RegistroEntry = {
    id: sender,
    nombre: nombre,
    nivel: 1,
    xp: 1,
    rxp: 0,
    dinero: 50,
    rep: 0
  }
  registro.push(obj)
  saveRegistro()
}

/**
 * Verifica si un usuario está registrado
 * @param sender - JID del usuario
 * @returns true si está registrado
 */
export const checkOfReg = (sender: string): boolean => {
  return registro.some(r => r.id === sender)
}

/**
 * Verifica si un usuario está registrado (alternativo)
 * @param usuario - JID del usuario
 * @returns true si está registrado
 */
export const checkOfRegM = (usuario: string): boolean => {
  return registro.some(r => r.id === usuario)
}

// ========================
// ECONOMÍA (COINS)
// ========================

/**
 * Busca la posición de un usuario en el registro
 * @param sender - JID del usuario
 * @returns Posición o false
 */
export const findPosition = (sender: string): number | false => {
  let position: number | false = false
  Object.keys(registro).forEach((i) => {
    if (registro[Number(i)].id === sender) position = Number(i)
  })
  return position
}

/**
 * Elimina coins de un usuario
 * @param sender - JID del usuario
 * @param monto - Cantidad a eliminar
 */
export const delkoin = (sender: string, monto: number): void => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].dinero -= monto
    saveRegistro()
  }
}

/**
 * Agrega coins a un usuario
 * @param sender - JID del usuario
 * @param monto - Cantidad a agregar
 */
export const addkoin = (sender: string, monto: number): void => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].dinero += monto
    saveRegistro()
  }
}

/**
 * Obtiene los coins de un usuario
 * @param sender - JID del usuario
 * @returns Dinero del usuario
 */
export const MoneyOfSender = (sender: string): number => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].dinero
  return 0
}

// Versiones alternativas (para menciones)
export const delkoinM = (usuario: string, monto: number): void => delkoin(usuario, monto)
export const addkoinM = (usuario: string, monto: number): void => addkoin(usuario, monto)
export const MoneyOfM = (usuario: string): number => MoneyOfSender(usuario)

// ========================
// NIVELES Y XP
// ========================

/**
 * Sube el nivel de un usuario
 * @param sender - JID del usuario
 * @param monto - Cantidad a incrementar
 */
export const addLevel = (sender: string, monto: number): void => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].nivel += monto
    saveRegistro()
  }
}

/**
 * Agrega XP a un usuario
 * @param sender - JID del usuario
 * @param monto - Cantidad de XP
 */
export const addXp = (sender: string, monto: number): void => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].xp += monto
    saveRegistro()
  }
}

/**
 * Obtiene el nivel de un usuario
 * @param sender - JID del usuario
 * @returns Nivel del usuario
 */
export const levelOfsender = (sender: string): number => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].nivel
  return 0
}

/**
 * Obtiene el XP de un usuario
 * @param sender - JID del usuario
 * @returns XP del usuario
 */
export const xpOfsender = (sender: string): number => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].xp
  return 0
}

// ========================
// RXP (XP requerido para siguiente nivel)
// ========================

/**
 * Agrega RXP a un usuario
 * @param sender - JID del usuario
 * @param monto - Cantidad a agregar
 */
export const addRxp = (sender: string, monto: number): void => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].rxp += monto
    saveRegistro()
  }
}

/**
 * Obtiene el RXP de un usuario
 * @param sender - JID del usuario
 * @returns RXP del usuario
 */
export const Rxp = (sender: string): number => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].rxp
  return 0
}

// ========================
// REPUTACIÓN
// ========================

/**
 * Agrega reputación a un usuario
 * @param usuario - JID del usuario
 * @param monto - Cantidad a agregar
 */
export const addRep = (usuario: string, monto: number): void => {
  if (typeof usuario !== 'string') return
  usuario = usuario.trim()
  let found = false

  registro.forEach((user) => {
    if (user.id.trim() === usuario) {
      user.rep += monto
      found = true
    }
  })

  if (found) saveRegistro()
}

/**
 * Elimina reputación de un usuario
 * @param usuario - JID del usuario
 * @param monto - Cantidad a eliminar
 */
export const delRep = (usuario: string, monto: number): void => {
  if (typeof usuario !== 'string') return
  usuario = usuario.trim()
  let found = false

  registro.forEach((user) => {
    if (user.id.trim() === usuario) {
      user.rep -= monto
      found = true
    }
  })

  if (found) saveRegistro()
}

/**
 * Obtiene la reputación de un usuario
 * @param sender - JID del usuario
 * @returns Reputación del usuario
 */
export const repUser = (sender: string): number => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].rep
  return 0
}

export default {
  addkoin,
  addkoinM,
  // Niveles
  addLevel,
  // Registro
  AddReg,
  // Reputación
  addRep,
  addRxp,
  addXp,
  checkOfReg,
  checkOfRegM,
  delkoin,
  delkoinM,
  delRep,
  levelOfsender,
  MoneyOfM,
  // Economía
  MoneyOfSender,
  repUser,
  // RXP
  Rxp,
  xpOfsender
}