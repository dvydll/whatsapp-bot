/**
 * Librería de módulos organizados
 *-organiza los requires existentes sin cambiar comportamiento
 */

// ============================================
// EXTERNAL DEPENDENCIES
// ============================================

// WhatsApp/Baileys
const {
  default: makeWASocket,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  proto
} = require("baileys")

// Node.js built-ins
const fs = require('fs')
const path = require('path')

// Optional modules - handle if not installed
let NodeCache, readline, moment, pino, speed, chalk, cfonts, axios

try { NodeCache = require("node-cache") } catch (e) {}
try { readline = require("readline") } catch (e) {}
try { moment = require("moment-timezone") } catch (e) {}
try { pino = require('pino') } catch (e) {}
try { speed = require("performance-now") } catch (e) {}
try { chalk = require('chalk') } catch (e) {}
try { cfonts = require('cfonts') } catch (e) {}
try { axios = require("axios") } catch (e) {}

// ============================================
// EXTERNAL MODULES (existing folder structure)
// ============================================

// Downloads
const { fetchJson, getBuffer, fetchBuffer } = require('./fuction/download/gets.js')

// Settings utils
const { getExtension, getRandom } = require('./fuction/settings/fuctions.js')

// Sticker makers
const { sendVideoAsSticker, sendImageAsSticker } = require('./fuction/sticker/rename.js')
const { sendVideoAsSticker2, sendImageAsSticker2 } = require('./fuction/sticker/rename2.js')

// Economy & Registration
const {
  MoneyOfSender, addkoin, delkoin,
  AddReg, checkOfReg,
  addLevel, addXp, levelOfsender, xpOfsender,
  checkOfRegM, addkoinM, delkoinM, MoneyOfM,
  Rxp, addRxp, addRep, delRep, repUser
} = require('./settings/Grupo/Js/reg.js')

// Games
const { addClaim, checkClaim, timeClaim, expiredClaim } = require('./Games/Js/claim.js')
const {
  checkCasino, checkAttp, checkEmoji, checkEve,
  addClaimTraga, checkClaimTraga, timeClaimTraga,
  checkRuleta, checkMinar, addCasino, addAttp,
  addEmoji, addEve, addRuleta, addMinar,
  expiredCasino, expiredMinar, expiredAttp,
  expiredEmoji, expiredEve, expiredRuleta,
  timeAttp, timeEmoji, timeEve, timeRuleta,
  timeMinar, timeCasino, expiredDayli, JsonDayli,
  addDayli, timeDayli, checkDayli, checkPescar,
  timePescar, addPescar, expiredPescar
} = require('./Games/Js/mining.js')

// Menu
const Menu = require('./settings/Bot/Js/menu.js')

// ============================================
// CONFIGURATION
// ============================================

const color = chalk ? (text, c) => !c ? chalk.green(text) : chalk.keyword(c)(text) : (text) => text
const banner = cfonts ? cfonts.render("Naufra| Bot| Base", { font: 'pallet', align: 'center', gradient: ["green", "blue"] }) : { string: '' }

// Load config
const { creador, owner, Bot, JpgBot, NAUFRA_KEY } = require("./settings/settings.json")

// Prefixes
const prefixo = ['#', '/', '•', '.', '!', '?', '*']

// API
const APINAUFRA = 'https://api.naufrabot.com'

// ============================================
// GROUP CONFIGS (JSON)
// ============================================

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (e) {
    return []
  }
}

const welkom = loadJson('./settings/Grupo/Json/welkom.json')
const antilink = loadJson('./settings/Grupo/Json/antilink.json')
const bngp = loadJson('./settings/Grupo/Json/grupo.json')
const Antipv = loadJson('./settings/Grupo/Json/chat.json')
const registro = loadJson('./settings/Grupo/Json/registros.json')
const Exportion = loadJson('./Games/Json/exportion.json')
const Exportion1 = loadJson('./Games/Json/exportion1.json')
const Cuestions = loadJson('./Games/Json/cuestions.json')
const rangos = loadJson('./settings/rangos.json')

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Baileys
  makeWASocket,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  proto,

  // Node
  fs,
  path,
  NodeCache,
  readline,
  moment,
  pino,
  speed,

  // Utils
  chalk,
  color,
  cfonts,
  banner,
  axios,

  // External modules
  fetchJson,
  getBuffer,
  fetchBuffer,
  getExtension,
  getRandom,
  sendVideoAsSticker,
  sendImageAsSticker,
  sendVideoAsSticker2,
  sendImageAsSticker2,

  // Economy
  MoneyOfSender,
  addkoin,
  delkoin,
  AddReg,
  checkOfReg,
  addLevel,
  addXp,
  levelOfsender,
  xpOfsender,
  Rxp,
  addRxp,
  addRep,
  delRep,
  repUser,

  // Games
  addClaim,
  checkClaim,
  timeClaim,
  expiredClaim,
  checkCasino,
  checkAttp,
  checkEmoji,
  checkEve,
  addClaimTraga,
  checkClaimTraga,
  timeClaimTraga,
  checkRuleta,
  checkMinar,
  addCasino,
  addAttp,
  addEmoji,
  addEve,
  addRuleta,
  addMinar,
  expiredCasino,
  expiredMinar,
  expiredAttp,
  expiredEmoji,
  expiredEve,
  expiredRuleta,
  timeAttp,
  timeEmoji,
  timeEve,
  timeRuleta,
  timeMinar,
  timeCasino,
  expiredDayli,
  JsonDayli,
  addDayli,
  timeDayli,
  checkDayli,
  checkPescar,
  timePescar,
  addPescar,
  expiredPescar,

  // Menu
  Menu,

  // Config
  creador,
  owner,
  Bot,
  JpgBot,
  NAUFRA_KEY,
  prefixo,
  APINAUFRA,

  // Group configs
  welkom,
  antilink,
  bngp,
  Antipv,
  registro,
  Exportion,
  Exportion1,
  Cuestions,
  rangos,

  // Helper
  loadJson
}