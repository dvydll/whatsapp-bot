/**
 * Sistema de claims - extraído de Games/Js/claim.js
 * Maneja el cooldown de reclamar cosas
 */

import fs from 'fs'

const JsonGamesClaim = `./Games/Json/claim.json`

interface ClaimEntry {
  user: string;
  time: number;
}

let GameClaim: ClaimEntry[] = []
try {
  GameClaim = JSON.parse(fs.readFileSync(JsonGamesClaim, 'utf-8'))
} catch {
  GameClaim = []
}

/**
 * Agrega un claim para un usuario
 * @param sender - JID del usuario
 * @param time - Tiempo en milisegundos
 */
const addClaim = (sender: string, time: number): void => {
  const obj: ClaimEntry = {
    user: sender,
    time: Date.now() + time
  }
  GameClaim.push(obj)
  fs.writeFileSync(JsonGamesClaim, JSON.stringify(GameClaim, null, 2) + '\n')
}

/**
 * Verifica si un usuario tiene un claim activo
 * @param sender - JID del usuario
 * @returns true si tiene claim activo
 */
const checkClaim = (sender: string): boolean => {
  return GameClaim.some(i => i.user === sender)
}

/**
 * Obtiene el tiempo restante del claim
 * @param sender - JID del usuario
 * @returns Tiempo restante o undefined
 */
const timeClaim = (sender: string): number | undefined => {
  let position: number | false = false
  Object.keys(GameClaim).forEach((i) => {
    if (GameClaim[Number(i)].user === sender) {
      position = Number(i)
    }
  })
  if (position !== false) {
    return GameClaim[position].time
  }
  return undefined
}

/**
 * Limpia los claims expirados cada 5 minutos
 */
const expiredClaim = (): void => {
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