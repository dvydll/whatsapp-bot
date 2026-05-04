/**
 * Sistema de economía y registro - extraído de settings/Grupo/Js/reg.js
 * Maneja registro de usuarios, coins, XP, niveles y reputación
 */

import fs from 'node:fs'

const JsonRegistro = './settings/Grupo/Json/registros.json'

let registro
try {
  registro = JSON.parse(fs.readFileSync(JsonRegistro))
} catch (error) {
  console.error(error)
  registro = []
}

export const saveRegistro = () => {
  fs.writeFileSync(JsonRegistro, `${JSON.stringify(registro, null, 2)}\n`)
}

// ========================
// REGISTRO
// ========================

/**
 * Registra un nuevo usuario
 * @param {string} sender - JID del usuario
 * @param {string} nombre - Nombre del usuario
 */
export const AddReg = (sender, nombre) => {
  const obj = {
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
 * @param {string} sender - JID del usuario
 * @returns {boolean}
 */
export const checkOfReg = (sender) => {
  return registro.some(r => r.id === sender)
}

/**
 * Verifica si un usuario está registrado (alternativo)
 * @param {string} usuario - JID del usuario
 * @returns {boolean}
 */
export const checkOfRegM = (usuario) => {
  return registro.some(r => r.id === usuario)
}

// ========================
// ECONOMÍA (COINS)
// ========================

/**
 * Busca la posición de un usuario en el registro
 */
export const findPosition = (sender) => {
  let position = false
  Object.keys(registro).forEach((i) => {
    if (registro[i].id === sender) position = i
  })
  return position
}

/**
 * Elimina coins de un usuario
 * @param {string} sender - JID del usuario
 * @param {number} monto - Cantidad a eliminar
 */
export const delkoin = (sender, monto) => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].dinero -= monto
    saveRegistro()
  }
}

/**
 * Agrega coins a un usuario
 * @param {string} sender - JID del usuario
 * @param {number} monto - Cantidad a agregar
 */
export const addkoin = (sender, monto) => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].dinero += monto
    saveRegistro()
  }
}

/**
 * Obtiene los coins de un usuario
 * @param {string} sender - JID del usuario
 * @returns {number} Dinero del usuario
 */
export const MoneyOfSender = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].dinero
}

// Versiones alternativas (para menciones)
export const delkoinM = (usuario, monto) => delkoin(usuario, monto)
export const addkoinM = (usuario, monto) => addkoin(usuario, monto)
export const MoneyOfM = (usuario) => MoneyOfSender(usuario)

// ========================
// NIVELES Y XP
// ========================

/**
 * Sube el nivel de un usuario
 * @param {string} sender - JID del usuario
 * @param {number} monto - Cantidad a incrementar
 */
export const addLevel = (sender, monto) => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].nivel += monto
    saveRegistro()
  }
}

/**
 * Agrega XP a un usuario
 * @param {string} sender - JID del usuario
 * @param {number} monto - Cantidad de XP
 */
export const addXp = (sender, monto) => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].xp += monto
    saveRegistro()
  }
}

/**
 * Obtiene el nivel de un usuario
 * @param {string} sender - JID del usuario
 * @returns {number} Nivel del usuario
 */
export const levelOfsender = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].nivel
}

/**
 * Obtiene el XP de un usuario
 * @param {string} sender - JID del usuario
 * @returns {number} XP del usuario
 */
export const xpOfsender = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].xp
}

// ========================
// RXP (XP requerido para siguiente nivel)
// ========================

/**
 * Agrega RXP a un usuario
 * @param {string} sender - JID del usuario
 * @param {number} monto - Cantidad a agregar
 */
export const addRxp = (sender, monto) => {
  const position = findPosition(sender)
  if (position !== false) {
    registro[position].rxp += monto
    saveRegistro()
  }
}

/**
 * Obtiene el RXP de un usuario
 * @param {string} sender - JID del usuario
 * @returns {number} RXP del usuario
 */
export const Rxp = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].rxp
}

// ========================
// REPUTACIÓN
// ========================

/**
 * Agrega reputación a un usuario
 * @param {string} usuario - JID del usuario
 * @param {number} monto - Cantidad a agregar
 */
export const addRep = (usuario, monto) => {
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
 * @param {string} usuario - JID del usuario
 * @param {number} monto - Cantidad a eliminar
 */
export const delRep = (usuario, monto) => {
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
 * @param {string} sender - JID del usuario
 * @returns {number} Reputación del usuario
 */
export const repUser = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].rep
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
