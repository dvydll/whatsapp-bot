/**
 * Sistema de juegos y mining - extraído de Games/Js/mining.js
 * Maneja la lógica de cooldown para múltiples juegos
 */

import fs from 'fs'

interface GameEntry {
  user: string;
  time: number;
}

// Cargar todos los JSONs de juegos
const loadGameJson = (path: string): GameEntry[] => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
  } catch {
    return []
  }
}

// Archivos JSON
const JsonMining = './Games/Json/mining.json'
const JsonCasino = './Games/Json/casino.json'
const JsonPescar = './Games/Json/pescar.json'
const JsonTraga = './Games/Json/tragaperras.json'
const JsonDayli = './Games/Json/dayli.json'
const JsonRuleta = './Games/Json/ruleta.json'
const JsonEve = './Games/Json/eve.json'
const JsonEmoji = './Games/Json/emoji.json'
const JsonAttp = './Games/Json/attp.json'

// Cargar datos
let GameMinar: GameEntry[] = loadGameJson(JsonMining)
let GameCasino: GameEntry[] = loadGameJson(JsonCasino)
let GamePescar: GameEntry[] = loadGameJson(JsonPescar)
let GameTraga: GameEntry[] = loadGameJson(JsonTraga)
let GameDayli: GameEntry[] = loadGameJson(JsonDayli)
let GameRuleta: GameEntry[] = loadGameJson(JsonRuleta)
let GameEve: GameEntry[] = loadGameJson(JsonEve)
let GameEmoji: GameEntry[] = loadGameJson(JsonEmoji)
let GameAttp: GameEntry[] = loadGameJson(JsonAttp)

// ========================
// FUNCIONES ADD
// ========================

const addDayli = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameDayli.push(obj)
  fs.writeFileSync(JsonDayli, JSON.stringify(GameDayli, null, 2) + '\n')
}

const addMinar = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameMinar.push(obj)
  fs.writeFileSync(JsonMining, JSON.stringify(GameMinar, null, 2) + '\n')
}

const addRuleta = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameRuleta.push(obj)
  fs.writeFileSync(JsonRuleta, JSON.stringify(GameRuleta, null, 2) + '\n')
}

const addEve = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameEve.push(obj)
  fs.writeFileSync(JsonEve, JSON.stringify(GameEve, null, 2) + '\n')
}

const addEmoji = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameEmoji.push(obj)
  fs.writeFileSync(JsonEmoji, JSON.stringify(GameEmoji, null, 2) + '\n')
}

const addAttp = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameAttp.push(obj)
  fs.writeFileSync(JsonAttp, JSON.stringify(GameAttp, null, 2) + '\n')
}

const addCasino = (sender: string, time: number): void => {
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GameCasino.push(obj)
  fs.writeFileSync(JsonCasino, JSON.stringify(GameCasino, null, 2) + '\n')
}

const addPescar = (sender: string, time: number): void => {
  if (!sender || typeof time !== 'number') return
  const obj: GameEntry = { user: sender, time: Date.now() + time }
  GamePescar.push(obj)
  fs.writeFileSync(JsonPescar, JSON.stringify(GamePescar, null, 2) + '\n')
}

const addClaimTraga = (sender: string, time: number): void => {
  const index = GameTraga.findIndex(i => i.user === sender)
  const nuevoTiempo = Date.now() + time
  if (index !== -1) {
    GameTraga[index].time = nuevoTiempo
  } else {
    GameTraga.push({ user: sender, time: nuevoTiempo })
  }
  fs.writeFileSync(JsonTraga, JSON.stringify(GameTraga, null, 2) + '\n')
}

// ========================
// FUNCIONES CHECK
// ========================

const checkDayli = (sender: string): boolean => GameDayli.some(i => i.user === sender)
const checkMinar = (sender: string): boolean => GameMinar.some(i => i.user === sender)
const checkRuleta = (sender: string): boolean => GameRuleta.some(i => i.user === sender)
const checkEve = (sender: string): boolean => GameEve.some(i => i.user === sender)
const checkEmoji = (sender: string): boolean => GameEmoji.some(i => i.user === sender)
const checkAttp = (sender: string): boolean => GameAttp.some(i => i.user === sender)
const checkCasino = (sender: string): boolean => GameCasino.some(i => i.user === sender)
const checkPescar = (sender: string): boolean => GamePescar.some(i => i.user === sender)
const checkClaimTraga = (sender: string): boolean => {
  const user = GameTraga.find(i => i.user === sender)
  if (!user) return false
  return user.time > Date.now()
}

// ========================
// FUNCIONES TIME
// ========================

const getTime = (gameArray: GameEntry[], sender: string): number | false => {
  let position: number | false = false
  Object.keys(gameArray).forEach((i) => {
    if (gameArray[Number(i)].user === sender) position = Number(i)
  })
  if (position !== false) return gameArray[position].time
  return false
}

const timeDayli = (sender: string): number | false => getTime(GameDayli, sender)
const timeMinar = (sender: string): number | false => getTime(GameMinar, sender)
const timeRuleta = (sender: string): number | false => getTime(GameRuleta, sender)
const timeEve = (sender: string): number | false => getTime(GameEve, sender)
const timeEmoji = (sender: string): number | false => getTime(GameEmoji, sender)
const timeAttp = (sender: string): number | false => getTime(GameAttp, sender)
const timeCasino = (sender: string): number | false => getTime(GameCasino, sender)
const timePescar = (sender: string): number => {
  const userData = GamePescar.find(i => i.user === sender)
  return userData ? userData.time : 0
}
const timeClaimTraga = (sender: string): number => {
  const data = GameTraga.find(i => i.user === sender)
  return data ? data.time : 0
}

// ========================
// FUNCIONES EXPIRED (limpieza automática)
// ========================

const createExpired = (gameArray: GameEntry[], jsonPath: string) => (): void => {
  setInterval(() => {
    const ahora = Date.now()
    const activos = gameArray.filter(item => ahora < item.time)
    if (activos.length !== gameArray.length) {
      gameArray.length = 0
      gameArray.push(...activos)
      fs.writeFileSync(jsonPath, JSON.stringify(gameArray, null, 2) + '\n')
    }
  }, 1 * 60 * 1000) // cada 1 minuto
}

const expiredDayli = createExpired(GameDayli, JsonDayli)
const expiredMinar = createExpired(GameMinar, JsonMining)
const expiredRuleta = createExpired(GameRuleta, JsonRuleta)
const expiredEve = createExpired(GameEve, JsonEve)
const expiredEmoji = createExpired(GameEmoji, JsonEmoji)
const expiredAttp = createExpired(GameAttp, JsonAttp)
const expiredCasino = createExpired(GameCasino, JsonCasino)
const expiredPescar = createExpired(GamePescar, JsonPescar)

export {
  // Check
  checkCasino, checkAttp, checkEmoji, checkEve, checkClaimTraga,
  checkRuleta, checkMinar, checkDayli, checkPescar,
  // Add
  addClaimTraga, addCasino, addAttp, addEmoji, addEve,
  addRuleta, addMinar, addDayli, addPescar,
  // Time
  timeClaimTraga, timeAttp, timeEmoji, timeEve, timeRuleta,
  timeMinar, timeCasino, timeDayli, timePescar,
  // Expired
  expiredCasino, expiredMinar, expiredAttp, expiredEmoji,
  expiredEve, expiredRuleta, expiredDayli, expiredPescar,
  // Json paths (exportados por compatibilidad)
  JsonDayli
}