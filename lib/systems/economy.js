/**
 * Sistema de economía y registro - extraído de settings/Grupo/Js/reg.js
 * Maneja registro de usuarios, coins, XP, niveles y reputación
 */

const fs = require('fs')

const JsonRegistro = './settings/Grupo/Json/registros.json'

let registro
try {
  registro = JSON.parse(fs.readFileSync(JsonRegistro))
} catch (e) {
  registro = []
}

const saveRegistro = () => {
  fs.writeFileSync(JsonRegistro, JSON.stringify(registro, null, 2) + '\n')
}

// ========================
// REGISTRO
// ========================

/**
 * Registra un nuevo usuario
 * @param {string} sender - JID del usuario
 * @param {string} nombre - Nombre del usuario
 */
const AddReg = (sender, nombre) => {
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
const checkOfReg = (sender) => {
  return registro.some(r => r.id === sender)
}

/**
 * Verifica si un usuario está registrado (alternativo)
 * @param {string} usuario - JID del usuario
 * @returns {boolean}
 */
const checkOfRegM = (usuario) => {
  return registro.some(r => r.id === usuario)
}

// ========================
// ECONOMÍA (COINS)
// ========================

/**
 * Busca la posición de un usuario en el registro
 */
const findPosition = (sender) => {
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
const delkoin = (sender, monto) => {
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
const addkoin = (sender, monto) => {
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
const MoneyOfSender = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].dinero
}

// Versiones alternativas (para menciones)
const delkoinM = (usuario, monto) => delkoin(usuario, monto)
const addkoinM = (usuario, monto) => addkoin(usuario, monto)
const MoneyOfM = (usuario) => MoneyOfSender(usuario)

// ========================
// NIVELES Y XP
// ========================

/**
 * Sube el nivel de un usuario
 * @param {string} sender - JID del usuario
 * @param {number} monto - Cantidad a incrementar
 */
const addLevel = (sender, monto) => {
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
const addXp = (sender, monto) => {
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
const levelOfsender = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].nivel
}

/**
 * Obtiene el XP de un usuario
 * @param {string} sender - JID del usuario
 * @returns {number} XP del usuario
 */
const xpOfsender = (sender) => {
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
const addRxp = (sender, monto) => {
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
const Rxp = (sender) => {
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
const addRep = (usuario, monto) => {
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
const delRep = (usuario, monto) => {
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
const repUser = (sender) => {
  const position = findPosition(sender)
  if (position !== false) return registro[position].rep
}

module.exports = {
  // Registro
  AddReg,
  checkOfReg,
  checkOfRegM,
  // Economía
  MoneyOfSender,
  addkoin,
  delkoin,
  addkoinM,
  delkoinM,
  MoneyOfM,
  // Niveles
  addLevel,
  addXp,
  levelOfsender,
  xpOfsender,
  // RXP
  Rxp,
  addRxp,
  // Reputación
  addRep,
  delRep,
  repUser
}