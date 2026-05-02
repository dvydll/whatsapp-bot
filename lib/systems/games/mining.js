/**
 * Sistema de juegos y mining - extraído de Games/Js/mining.js
 * Maneja la lógica de cooldown para múltiples juegos
 */

const fs = require('fs')

// Cargar todos los JSONs de juegos
const loadGameJson = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path))
  } catch (e) {
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
let GameMinar = loadGameJson(JsonMining)
let GameCasino = loadGameJson(JsonCasino)
let GamePescar = loadGameJson(JsonPescar)
let GameTraga = loadGameJson(JsonTraga)
let GameDayli = loadGameJson(JsonDayli)
let GameRuleta = loadGameJson(JsonRuleta)
let GameEve = loadGameJson(JsonEve)
let GameEmoji = loadGameJson(JsonEmoji)
let GameAttp = loadGameJson(JsonAttp)

// ========================
// FUNCIONES ADD
// ========================

const addDayli = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameDayli.push(obj)
  fs.writeFileSync(JsonDayli, JSON.stringify(GameDayli, null, 2) + '\n')
}

const addMinar = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameMinar.push(obj)
  fs.writeFileSync(JsonMining, JSON.stringify(GameMinar, null, 2) + '\n')
}

const addRuleta = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameRuleta.push(obj)
  fs.writeFileSync(JsonRuleta, JSON.stringify(GameRuleta, null, 2) + '\n')
}

const addEve = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameEve.push(obj)
  fs.writeFileSync(JsonEve, JSON.stringify(GameEve, null, 2) + '\n')
}

const addEmoji = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameEmoji.push(obj)
  fs.writeFileSync(JsonEmoji, JSON.stringify(GameEmoji, null, 2) + '\n')
}

const addAttp = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameAttp.push(obj)
  fs.writeFileSync(JsonAttp, JSON.stringify(GameAttp, null, 2) + '\n')
}

const addCasino = (sender, time) => {
  const obj = { user: sender, time: Date.now() + time }
  GameCasino.push(obj)
  fs.writeFileSync(JsonCasino, JSON.stringify(GameCasino, null, 2) + '\n')
}

const addPescar = (sender, time) => {
  if (!sender || typeof time !== 'number') return
  const obj = { user: sender, time: Date.now() + time }
  GamePescar.push(obj)
  fs.writeFileSync(JsonPescar, JSON.stringify(GamePescar, null, 2) + '\n')
}

const addClaimTraga = (sender, time) => {
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

const checkDayli = (sender) => GameDayli.some(i => i.user === sender)
const checkMinar = (sender) => GameMinar.some(i => i.user === sender)
const checkRuleta = (sender) => GameRuleta.some(i => i.user === sender)
const checkEve = (sender) => GameEve.some(i => i.user === sender)
const checkEmoji = (sender) => GameEmoji.some(i => i.user === sender)
const checkAttp = (sender) => GameAttp.some(i => i.user === sender)
const checkCasino = (sender) => GameCasino.some(i => i.user === sender)
const checkPescar = (sender) => GamePescar.some(i => i.user === sender)
const checkClaimTraga = (sender) => {
  const user = GameTraga.find(i => i.user === sender)
  if (!user) return false
  return user.time > Date.now()
}

// ========================
// FUNCIONES TIME
// ========================

const getTime = (gameArray, sender) => {
  let position = false
  Object.keys(gameArray).forEach((i) => {
    if (gameArray[i].user === sender) position = i
  })
  if (position !== false) return gameArray[position].time
}

const timeDayli = (sender) => getTime(GameDayli, sender)
const timeMinar = (sender) => getTime(GameMinar, sender)
const timeRuleta = (sender) => getTime(GameRuleta, sender)
const timeEve = (sender) => getTime(GameEve, sender)
const timeEmoji = (sender) => getTime(GameEmoji, sender)
const timeAttp = (sender) => getTime(GameAttp, sender)
const timeCasino = (sender) => getTime(GameCasino, sender)
const timePescar = (sender) => {
  const userData = GamePescar.find(i => i.user === sender)
  return userData ? userData.time : 0
}
const timeClaimTraga = (sender) => {
  const data = GameTraga.find(i => i.user === sender)
  return data ? data.time : 0
}

// ========================
// FUNCIONES EXPIRED (limpieza automática)
// ========================

const createExpired = (gameArray, jsonPath) => () => {
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

module.exports = {
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