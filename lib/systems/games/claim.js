/**
 * Sistema de claims - extraído de Games/Js/claim.js
 * Maneja el cooldown de reclamar cosas
 */

import fs from 'fs'

const JsonGamesClaim = `./Games/Json/claim.json`

let GameClaim
try {
  GameClaim = JSON.parse(fs.readFileSync(JsonGamesClaim))
} catch (e) {
  GameClaim = []
}

/**
 * Agrega un claim para un usuario
 * @param {string} sender - JID del usuario
 * @param {number} time - Tiempo en milisegundos
 */
const addClaim = (sender, time) => {
  const obj = {
    user: sender,
    time: Date.now() + time
  }
  GameClaim.push(obj)
  fs.writeFileSync(JsonGamesClaim, JSON.stringify(GameClaim, null, 2) + '\n')
}

/**
 * Verifica si un usuario tiene un claim activo
 * @param {string} sender - JID del usuario
 * @returns {boolean} true si tiene claim activo
 */
const checkClaim = (sender) => {
  return GameClaim.some(i => i.user === sender)
}

/**
 * Obtiene el tiempo restante del claim
 * @param {string} sender - JID del usuario
 * @returns {number|undefined} Tiempo restante o undefined
 */
const timeClaim = (sender) => {
  let position = false
  Object.keys(GameClaim).forEach((i) => {
    if (GameClaim[i].user === sender) {
      position = i
    }
  })
  if (position !== false) {
    return GameClaim[position].time
  }
}

/**
 * Limpia los claims expirados cada 5 minutos
 */
const expiredClaim = () => {
  setInterval(() => {
    const ahora = Date.now()
    GameClaim.forEach((item, indice) => {
      if (ahora >= item.time) {
        GameClaim.splice(indice, 1)
        fs.writeFileSync(JsonGamesClaim, JSON.stringify(GameClaim, null, 2) + '\n')
      }
    })
  }, 5 * 60 * 1000); // verifica cada 5 min
}

export { addClaim, checkClaim, timeClaim, expiredClaim }