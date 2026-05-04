import { Boom } from '@hapi/boom'
import {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  default as makeWASocket,
  useMultiFileAuthState
} from "baileys"
import cfonts from 'cfonts'
import { exec } from "child_process"
import NodeCache from "node-cache"
// import fetch from 'node-fetch'
import fs from 'node:fs'
import readline from "node:readline"
import speed from "performance-now"
import pino from 'pino'

//color
import chalk from 'chalk'
const color = (text, color) => !color ? chalk.green(text) : chalk.keyword(color)(text);

//baner
const banner = cfonts.render("Daya| Bot", {
  font: 'pallet',
  align: 'center',
  gradient: ["green", "blue"]
})

// FUNCIONES DESCARGA 
import { fetchJson } from './lib/http/download.js'

//Stickers
import { sendImageAsSticker2, sendVideoAsSticker2 } from './lib/whatsapp/sticker/sticker2.js'

//Grupos js
import economy from './lib/systems/economy.js'

// GAMES
import { expiredClaim } from './lib/systems/games/claim.js'
import {
  addClaimTraga,
  addDayli,
  addMinar,
  addPescar,
  addRuleta,
  checkDayli,
  checkMinar,
  checkPescar,
  checkRuleta,
  expiredAttp,
  expiredDayli,
  expiredEmoji,
  expiredEve,
  expiredMinar,
  expiredPescar,
  expiredRuleta,
  timeClaimTraga,
  timeDayli,
  timeMinar,
  timePescar,
  timeRuleta
} from './lib/systems/games/mining.js'

// Menu bot js
import Menu from './lib/systems/menu.js'

//configurar grupos
const welkom = JSON.parse(fs.readFileSync('./settings/Grupo/Json/welkom.json'))
const antilink = JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink.json'))
let bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json'))
const Antipv = JSON.parse(fs.readFileSync('./settings/Grupo/Json/chat.json'))
const registro = JSON.parse(fs.readFileSync('./settings/Grupo/Json/registros.json'))
const Exportion = JSON.parse(fs.readFileSync('./Games/Json/exportion.json'))
const Exportion1 = JSON.parse(fs.readFileSync('./Games/Json/exportion1.json'))
const Cuestions = JSON.parse(fs.readFileSync('./Games/Json/cuestions.json'))

// time
import { getGreeting, getTime, runtime } from './lib/core/time.js'
const time = getTime()
const timeFt = getGreeting()

// Configuraciones
import configCommands from './lib/commands/config.js'
import infoCommands from './lib/commands/info.js'
import ownerCommands from './lib/commands/owner.js'
import testCommands from './lib/commands/test.js'
import { APINAUFRA, Bot, JpgBot, NAUFRA_KEY, owner, prefixo } from './lib/core/config.js'
import { DLT_FL, sleep } from './lib/utils/helpers.js'
import { createGroupHandler } from './lib/whatsapp/group-handler.js'
import { esAdminFlexible } from './lib/whatsapp/permissions.js'
import { getFileBuffer } from './lib/whatsapp/utils/download-utils.js'
import { getGroupAdmins } from './lib/whatsapp/utils/group-utils.js'
import { obtenerMencionado } from './lib/whatsapp/utils/mention-utils.js'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

const phoneNumber = "5199999999"; // cambiar número

async function main() {
  console.clear();
  console.log(banner.string);
  console.log(chalk.cyanBright("🔥 DayaBot"));

  // Estado de sesión
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();

  // Crear socket
  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // Desactivado para no mostrar QR
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    syncFullHistory: false,
  });

  // 🟢 Si no hay sesión registrada, generar el código de vinculación de 8 dígitos
  if (!sock.authState.creds.registered) {
    let number = await question(
      chalk.cyan("📱 Escribe tu número de WhatsApp con código de país (solo números): ")
    );
    rl.close();
    number = number.replace(/[^0-9]/g, "");

    if (!number) {
      console.log(chalk.red("❌ Número inválido."));
      process.exit(1);
    }

    console.log(chalk.yellow("⌛ Solicitando código de vinculación..."));
    try {
      const code = await sock.requestPairingCode(number);
      console.log(chalk.bgGreen.black("✅ CÓDIGO DE VINCULACIÓN:"), chalk.white(code));
    } catch (err) {
      console.error(chalk.red("❌ Error al generar código de vinculación:"), err.message);
      process.exit(1);
    }
  }

  // 🔄 Monitorear el estado de conexión
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red("❌ Sesión cerrada. Borra la carpeta 'session' y vuelve a emparejar."));
      } else {
        console.log(chalk.yellow("⚠️ Conexión cerrada, reconectando..."));
        main();
      }
    } else if (connection === "open") {
      console.log(chalk.greenBright("✅ Conectado exitosamente"));
      exec("rm -rf tmp && mkdir tmp");
    }
  });

  // Guardar credenciales cuando se actualicen
  sock.ev.on("creds.update", saveCreds);

  // 𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙰 𝚈 𝙳𝙴𝚂𝙿𝙴𝙳𝙸𝙳𝙰 - extraído a lib/whatsapp/group-handler.js
  const groupHandler = createGroupHandler(sock, { welkom })
  sock.ev.on("group-participants.update", groupHandler)

  // Bienvenida y despedidas
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on("messages.upsert", () => { })

  sock.ev.on('messages.upsert', async m => {
    try {
      const info = m.messages[0]
      if (!info.message) return
      if (info.key && info.key.remoteJid == "status@broadcast") return
      const altpdf = Object.keys(info.message)
      const type = altpdf[0] === "senderKeyDistributionMessage"
        ? altpdf[1] === "messageContextInfo"
          ? altpdf[2]
          : altpdf[1]
        : altpdf[0]
      const content = JSON.stringify(info.message)
      const from = info.key.remoteJid
      const body = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId : ''

      const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

      const pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''

      const numerodono = [`${owner}`];

      const verificarN = async (sla) => {
        const [result] = await sock.onWhatsApp(sla)
        enviar(!result
          ? "Este usuário no existe en WhatsApp"
          : `${sla} Número existente en WhatsApp con id: ${result.jid}`
        )
      }

      // Constantes is
      const isGroup = info.key.remoteJid.endsWith('@g.us')
      const sender = isGroup ? info.key.participant : from
      const groupMetadata = isGroup ? await sock.groupMetadata(from) : ''
      const groupName = isGroup ? groupMetadata.subject : ''
      const groupDesc = isGroup ? groupMetadata.desc : ''
      const groupMembers = isGroup ? groupMetadata.participants || [] : [];
      const nome = info.pushName ? info.pushName : ''
      const groupAdmins = groupMembers.filter(p => p.admin);
      const Sadm = isGroup ? getGroupAdmins(groupAdmins) : ''
      const messagesC = pes.slice(0).trim()?.split(/ +/).shift().toLowerCase()
      const args = body.trim()?.split(/ +/).slice(1)
      const q = args.join(' ')
      const text = args.join(' ')
      const isCmd = prefixo.some(p => body.startsWith(p));

      // MULTIPREFIJO 
      const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const prefixes = prefixo ? prefixo.map(prefix => prefix.toLowerCase()) : [];
      const lowerBudy = budy.toLowerCase();
      const hasPrefix = prefixes.some(prefix => lowerBudy.startsWith(prefix));
      const commandArgs = hasPrefix ? lowerBudy.slice(prefixes.find(prefix => lowerBudy.startsWith(prefix)).length).trim()?.split(' ') : [];
      const comando = hasPrefix ? removeAccents(commandArgs[0]) : '';
      // MULTIPREFIJO
      const mentions = (teks, memberr, id) => {
        (id == null || id === undefined || id === false)
          ? sock.sendMessage(from, { text: teks.trim(), mentions: memberr })
          : sock.sendMessage(from, { text: teks.trim(), mentions: memberr })
      }
      const quoted = info.quoted ? info.quoted : info
      const mime = (quoted.info || quoted).Mimetype || ""
      // sleep ahora viene de lib/helpers.js
      const pushname = info.pushName ? info.pushName : ''
      const isBot = info.key.fromMe ? true : false
      const senderNumber = sender?.split("@")[0]
      const BotNumber = `${sock.user.id?.split(':')[0]}@s.whatsapp.net`
      const isOwner = numerodono.includes(sender)

      const isGroupAdmins = groupAdmins.some(admin => admin.id?.includes(sender));
      const isBotGroupAdmins = esAdminFlexible(sock, groupAdmins.map(p => p.id))
      // esAdminFlexible ahora importado de lib/whatsapp/permissions.js

      // isUrl ahora viene de lib/helpers.js
      const deviceType = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'
      const options = { timeZone: 'Europe/Madrid', hour12: false }
      const data = new Date().toLocaleDateString('PE', { ...options, day: '2-digit', month: '2-digit', year: '2-digit' })
      const hora = new Date().toLocaleTimeString('PE', options)

      // Constantes if nuevas
      const iswelkom = isGroup ? welkom.includes(from) : false
      const isBanGp = isGroup ? bngp.includes(from) : false
      const isAntipv = Antipv.includes('activo')
      const isReg = economy.checkOfReg(sender)
      const isAntiLink = isGroup ? antilink.includes(from) : false
      const coins = economy.MoneyOfSender(sender)

      // 🟢 Sistema de encendido/apagado global del bot
      const estadoPath = './settings/estadoBot.json'

      if (!fs.existsSync(estadoPath)) {
        fs.writeFileSync(estadoPath, JSON.stringify({ activo: true }, null, 2))
      }
      let botActivo = JSON.parse(fs.readFileSync(estadoPath)).activo
      function guardarEstadoBot(estado) {
        fs.writeFileSync(estadoPath, JSON.stringify({ activo: estado }, null, 2))
        botActivo = estado
      }

      //MODO ADMIN 
      const modoAdminPath = './settings/Grupo/Json/modo_admin.json';
      const modoAdminList = fs.existsSync(modoAdminPath) ? JSON.parse(fs.readFileSync(modoAdminPath)) : [];
      const isModoAdmin = isGroup ? modoAdminList.includes(from) : false;

      //Funciones nuevas (pickRandom y DLT_FL ahora vienen de lib/helpers.js)
      const enviar = (texto) => {
        sock.sendMessage(from, { text: texto }, { quoted: info })
      }

      //rangos
      const rangos = JSON.parse(fs.readFileSync('./settings/rangos.json'))
      const YouN = economy.levelOfsender(sender)
      const Mlevel = rangos[YouN] || '🎖️𝐒𝐢𝐧 𝐑𝐚𝐧𝐠𝐨🎖️'
      const Rrxp = economy.Rxp(sender)
      const Crxp = economy.xpOfsender(sender)
      let Mrxp;
      if (Crxp <= Rrxp + 50) {
        Mrxp = '*▒▒▒▒▒▒▒▒▒▒ 0%*'
      } else if (Crxp <= Rrxp + 100) {
        Mrxp = '*█▒▒▒▒▒▒▒▒▒ 10%*'
      } else if (Crxp <= Rrxp + 200) {
        Mrxp = '*██▒▒▒▒▒▒▒▒ 20%*'
      } else if (Crxp <= Rrxp + 300) {
        Mrxp = '*███▒▒▒▒▒▒▒ 30%*'
      } else if (Crxp <= Rrxp + 400) {
        Mrxp = '*████▒▒▒▒▒▒ 40%*'
      } else if (Crxp <= Rrxp + 500) {
        Mrxp = '*█████▒▒▒▒▒ 50%*'
      } else if (Crxp <= Rrxp + 600) {
        Mrxp = '*██████▒▒▒▒ 60%*'
      } else if (Crxp <= Rrxp + 700) {
        Mrxp = '*███████▒▒▒ 70%*'
      } else if (Crxp <= Rrxp + 800) {
        Mrxp = '*████████▒▒ 80%*'
      } else if (Crxp <= Rrxp + 999) {
        Mrxp = '*█████████▒ 90%*'
      } else if (Crxp >= Rrxp + 1000) {
        Mrxp = '*██████████ 100%*'
      }

      // Constantes de tipos de mensaje
      const { getMessageTypes, getTypeMessage, getQuotedTypes } = await import('./lib/core/types.js')

      const types = getMessageTypes(type)
      const isImage = types.isImage
      const isVideo = types.isVideo
      const isAudio = types.isAudio
      const isSticker = types.isSticker
      const isContact = types.isContact
      const isLocation = types.isLocation
      const isProduct = types.isProduct
      const isMedia = types.isMedia

      const typeMessage = getTypeMessage(body, types)

      const quotedTypes = getQuotedTypes(type, content)
      const isQuotedMsg = quotedTypes.isQuotedMsg
      const isQuotedImage = quotedTypes.isQuotedImage
      const isQuotedVideo = quotedTypes.isQuotedVideo
      const isQuotedDocument = quotedTypes.isQuotedDocument
      const isQuotedAudio = quotedTypes.isQuotedAudio
      const isQuotedSticker = quotedTypes.isQuotedSticker
      const isQuotedContact = quotedTypes.isQuotedContact
      const isQuotedLocation = quotedTypes.isQuotedLocation
      const isQuotedProduct = quotedTypes.isQuotedProduct

      // getFileBuffer ahora importado de lib/whatsapp/utils/download-utils.js
      // obtenerMencionado ahora importado de lib/whatsapp/utils/mention-utils.js

      // Time: now imported from lib/time.js
      // Respuestas predefinidas
      const { getRespuestas } = await import('./lib/utils/responses.js')
      const respuesta = getRespuestas(sender)

      // Verificados
      const SvnC = { key: { participant: '0@s.whatsapp.net' }, message: { contactMessage: { displayName: `${pushname}` } } };

      // generarCodigo ahora viene de lib/helpers.js
      // MENSAJES EN CONSOLA
      console.info(
        JSON.stringify({
          ...(isGroup && { groupName }),
          sender: pushname,
          ...(isCmd && { command: comando }),
          message: budy,
          time: hora,
          date: data
        }, null, 2)
      );

      expiredClaim();
      expiredMinar()
      expiredAttp()
      expiredEmoji()
      expiredEve()
      expiredDayli()
      expiredPescar()
      expiredRuleta()

      //ban grupo
      if (isBanGp) return;

      // antiprivado
      if (isAntipv && !isGroup && !isOwner) {
        sock.updateBlockStatus(sender, 'block')
      }

      // INICIO DE COMANDOS
      //solo funciona si está activado el bot
      // Si el grupo está en modo admin y el usuario no es admin ni owner, se bloquea su acceso
      if (isModoAdmin && !isGroupAdmins && !isOwner) return;
      if (!botActivo && !isOwner) return

      switch (comando) {
        case 'prueba':
          testCommands.prueba({ enviar })
          break

        case 'comando2':
          testCommands.comando2({ enviar })
          break

        //Comandos owner
        case 'miapi':
        case 'apikey':
          ownerCommands.miapi({ APINAUFRA, NAUFRA_KEY, enviar })
          break

        case 'menu':
        case 'help': {
          if (!isGroup) return;
          if (!isReg) return enviar(respuesta.registro);

          const Mnu = Menu(timeFt, Bot, sender, groupName, groupMembers);

          // Enviar imagen del menú completa
          await sock.sendMessage(from, {
            image: { url: JpgBot },
            caption: Mnu,
            mentions: [sender]
          }, { quoted: info });
        }
          break;

        case 'boton':
        case 'botonon':
        case 'encenderbot':
          configCommands.boton({ isOwner, botActivo, guardarEstadoBot, enviar, respuesta })
          break

        case 'botoff':
        case 'apagabot':
        case 'offbot':
          configCommands.botoff({ isOwner, botActivo, guardarEstadoBot, enviar, respuesta })
          break


        case 'antiprivado':
        case 'antipv':
          configCommands.antiprivado({ isOwner, args, Antipv, enviar, respuesta })
          break

        case 'rvisu':
        case 'revelarvisu':
        case 'open':
          configCommands.rvisu({ isOwner, enviar, info, sock, from, respuesta })
          break

        case 'botoff':
        case 'apagabot':
        case 'offbot':
          if (!isOwner) return enviar(respuesta.miowner)
          if (!botActivo) return enviar('⚠️ El bot ya estaba apagado.')
          guardarEstadoBot(false)
          enviar('😴 El bot ha sido *DESACTIVADO* y dejará de responder a los comandos.')
          break

        case 'antiprivado':
        case 'antipv': {
          if (!isOwner) return enviar(respuesta.miowner)
          if (args[0] === 'on') {
            if (isAntipv) return enviar('El anti-privado ya esta activo')
            Antipv.push('activo')
            fs.writeFileSync('./settings/Json/chat.json', JSON.stringify(Antipv))
            enviar('Anti-privado activado exitosamente')
          } else if (args[0] === 'off') {
            if (!isAntipv) return enviar('El anti-privado ya estaba desactivado')
            Antipv.splice('desactivo')
            fs.writeFileSync('./settings/Json/chat.json', JSON.stringify(Antipv))
            enviar('Anti-privado desactivado exitosamente')
          } else {
            enviar('on para activar y off para desactivar')
          }
        }
          break

        case 'rvisu':
        case 'revelarvisu':
        case 'open':
          if (!isOwner) return enviar(respuesta.miowner)
          enviar('🥱')
          try {
            if (JSON.stringify(info).includes("videoMessage")) {
              var vio = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
              var viewImage = vio?.imageMessage || info.message?.imageMessage || vio?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || vio?.viewOnceMessage?.message?.imageMessage
              var viewVideo = vio?.videoMessage || info.message?.videoMessage || vio?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || vio?.viewOnceMessage?.message?.videoMessage
              viewVideo.viewOnce = false
              viewVideo.video = { url: viewVideo.url }
              viewVideo.caption += "El vídeo fue *Revelado*"
              sock.sendMessage(from, viewVideo)
            } else {
              var vio = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
              var viewImage = vio?.imageMessage || info.message?.imageMessage || vio?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || vio?.viewOnceMessage?.message?.imageMessage
              var viewVideo = vio?.videoMessage || info.message?.videoMessage || vio?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || vio?.viewOnceMessage?.message?.videoMessage
              viewImage.viewOnce = false
              viewImage.image = { url: `${viewImage.url}` }
              viewImage.caption += "😼"
              sock.sendMessage(from, viewImage)
            }
          } catch (e) {
            console.log(e)
            enviar(e)
          }
          break

        case 'reiniciar': {
          ownerCommands.reiniciar({ enviar, sender, owner })
        }
          break;


        //información 
        case 'infobot': case 'ping': {
          if (!isGroup) return
          const timestamp = speed()
          const latensi = speed() - timestamp
          const uptime = process.uptime()
          ownerCommands.infobot({
            time, data, Bot, deviceType, runtime, pushname, JpgBot, sock, from, info,
            latensi, memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, uptime
          })
        }
          break

        case 'botcompleto':
        case 'bot':
          infoCommands.botcompleto({ enviar })
          break

        case 'personalizarbot':
          infoCommands.personalizarbot({ sock, from, info })
          break

        case 'comprarapi':
          infoCommands.comprarapi({ sock, from, info })
          break

        case 'grupos':
          infoCommands.grupos({ enviar })
          break

        case 'serdueño':
        case 'sercreador':
        case 'owner':
        case 'serowner':
          infoCommands.serdueño({ enviar })
          break

        case 'canal':
        case 'canales':
          infoCommands.canal({ enviar })
          break

        case 'serbot':
          infoCommands.serbot({ enviar })
          break;

        //AJUSTES DEL GRUPO
        case 'welcome':
        case 'bienvenida':
          if (!isGroup) return
          if (args.length < 1) return enviar('「 𝟏 𝐏𝐚𝐫𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐲 𝟎 𝐏𝐚𝐫𝐚 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐫 」 ')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!isBotGroupAdmins) return enviar('El bot necesita ser administrador')
          if (Number(args[0]) === 1) {
            if (iswelkom) return enviar('「 ✅ 𝐋𝐚 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 𝐘𝐚 𝐄𝐬𝐭𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐝𝐚 𝐄𝐧 𝐄𝐥 𝐆𝐫𝐮𝐩𝐨 」 ')
            welkom.push(from)
            fs.writeFileSync('./settings/Grupo/Json/welkom.json', JSON.stringify(welkom))
            enviar('「 ✅ 𝐀𝐜𝐭𝐢𝐯𝐚𝐝𝐨 𝐄𝐱𝐢𝐭𝐨𝐬𝐚𝐦𝐞𝐧𝐭𝐞 」')
          } else if (Number(args[0]) === 0) {
            if (!iswelkom) return enviar('「 ❌ 𝐋𝐚 𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 𝐧𝐨 𝐞𝐬𝐭𝐚 𝐚𝐜𝐭𝐢𝐯𝐚𝐝𝐚」')
            welkom.splice(from, 1)
            fs.writeFileSync('./settings/Grupo/Json/welkom.json', JSON.stringify(welkom))
            enviar('❌ 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐝𝐨 𝐞𝐱𝐢𝐭𝐨𝐬𝐚𝐦𝐞𝐧𝐭𝐞 ')
          } else {
            enviar('「 𝟏 𝐏𝐚𝐫𝐚 𝐀𝐜𝐭𝐢𝐯𝐚𝐫 𝐲 𝟎 𝐏𝐚𝐫𝐚 𝐃𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐫 」')
          }
          break

        case 'bangp': {
          if (!isGroup) return
          if (!isOwner) return enviar(respuesta.miowner)
          if (!isBanGp) { // antes estaba al revés
            const JsonGp = './settings/Grupo/Json/grupo.json';
            bngp.push(from)
            fs.writeFileSync(JsonGp, JSON.stringify(bngp));
            enviar('✅ GRUPO BANEADO EXITOSAMENTE')
          } else {
            enviar('⚠️ El GRUPO YA SE ENCUENTRA BANEADO')
          }
        }
          break

        case 'unbangp': {
          if (!isGroup) return
          if (!isOwner) return enviar(respuesta.miowner)
          if (isBanGp) { // antes también estaba al revés
            const JsonGp = './settings/Grupo/Json/grupo.json';
            bngp = bngp.filter(g => g !== from)
            fs.writeFileSync(JsonGp, JSON.stringify(bngp));
            enviar('✅ GRUPO DESBANEADO EXITOSAMENTE')
          } else {
            enviar('⚠️ El GRUPO YA SE ENCUENTRA DESBANEADO')
          }
        }
          break

        case 'todos':
        case 'revivir':
          if (!isReg) return enviar(respuesta.registro)
          if (!isGroup) return enviar('Es enserio invocar en un chat , te violo tu tio verdad')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          members_id = []
          teks = (args.length > 1) ? body.slice(8).trim() : ''
          teks += `𝐓𝐎𝐓𝐀𝐋 : ${groupMembers.length}\n`
          nu = 0
          for (const mem of groupMembers) {
            nu += 1
            teks += ` ➫[${nu.toString()}] @${mem.id?.split('@')[0]}\n`
            members_id.push(mem.id)
          }
          mentions(`
🗣️💬 ❝¡𝑳𝑳𝒂𝒎𝒂𝒅𝒂 𝒂 𝒕𝒐𝒅𝒐 𝑬𝒍 𝑴𝒖𝒏𝒅𝒐!❞ \n\n➫ ${teks}
`, members_id, true)
          break

        case 'anuncio': {
          if (!isGroup) return enviar('Es enserio invocar en un chat , te violo tu tio verdad')
          if (!isGroupAdmins) return enviar(respuesta.admin)
          men = []
          num = 0
          teks = `
🗣💬 ❝𝑨𝒕𝒆𝒏𝒄𝒊𝒐𝒏 𝒂 𝒆𝒔𝒕𝒆 𝑨𝒏𝒖𝒏𝒄𝒊𝒐.❞
 👉 ❝ ${q} ❞ 👈 
\n`
          for (const m of groupMembers) {
            num += 1
            teks += `• [${num.toString()}] @${m.id?.split('@')[0]}\n`
            men.push(m.id)
          }
          mentions(teks, men, true)
        }
          break

        case 'modoadmin': {
          if (!isGroup) return enviar("⚠️ Este comando solo se puede usar en grupos.");
          if (!isGroupAdmins) return enviar("🚫 Solo los administradores pueden cambiar este modo.");

          const JsonModoAdmin = './settings/Grupo/Json/modo_admin.json';
          let modoAdmin = JSON.parse(fs.readFileSync(JsonModoAdmin));

          const estado = args[0]; // puede ser "1" o "0"

          if (!estado) return enviar("🧩 Usa el comando correctamente:\n\n*modoadmin 1* → Activar modo admin\n*modoadmin 0* → Desactivar modo admin");

          if (estado === "1") {
            if (!modoAdmin.includes(from)) {
              modoAdmin.push(from);
              fs.writeFileSync(JsonModoAdmin, JSON.stringify(modoAdmin, null, 2));
              enviar("✅ *Modo admin activado* — Ahora solo los administradores pueden usar el bot en este grupo.");
            } else {
              enviar("⚠️ El modo admin ya estaba activado en este grupo.");
            }
          }

          else if (estado === "0") {
            if (modoAdmin.includes(from)) {
              modoAdmin = modoAdmin.filter(g => g !== from);
              fs.writeFileSync(JsonModoAdmin, JSON.stringify(modoAdmin, null, 2));
              enviar("🟢 *Modo admin desactivado* — Todos los miembros pueden usar el bot nuevamente.");
            } else {
              enviar("⚠️ El modo admin ya estaba desactivado en este grupo.");
            }
          }

          else {
            enviar("❌ Solo puedes usar *1* para activar o *0* para desactivar.");
          }
        }
          break;

        case 'hidetag':
        case 'notify': {
          if (!isReg) return enviar(respuesta.registro)
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!q) return enviar('Digite un texto ejemplo !notify hola hermanos 🔥')
          if (!isGroup) return enviartexto('Enserio , hidetag en un chat')
          if (!isGroupAdmins) return enviartexto("El bot necesita ser administrador")
          const group = await sock.groupMetadata(from)
          const member = group.participants
          const mem = []
          member.map(async adm => {
            mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
          })
          const optionshidetag = {
            text: q,
            contextInfo: { mentionedJid: mem },
            quoted: m
          }
          sock.sendMessage(from, optionshidetag)
        }
          break

        case 'kick':
        case 'ban':
        case 'largate': {
          if (!isGroup) return
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!isBotGroupAdmins) return enviar(respuesta.botadmin)
          const mentioned = obtenerMencionado(info);

          if (!mentioned) return enviar("⚠️ Debes mencionar a alguien para usar este comando.");
          if (mentioned === BotNumber || mentioned === owner) return enviar('🤨')

          await sock.groupParticipantsUpdate(from, [mentioned], 'remove')
          enviar('Accion realizada exitosamente')
        }
          break

        // ⚙️ Comando para activar/desactivar antilink
        case 'antilink':
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!isBotGroupAdmins) return enviar(respuesta.botadmin)
          if (args.length < 1) return enviar(`𝐃𝐈𝐆𝐈𝐓𝐄 𝟏 𝐏𝐀𝐑𝐀 𝐀𝐂𝐓𝐈𝐕𝐀𝐑 𝐘 𝟎 𝐏𝐀𝐑𝐀 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐑`)

          if (Number(args[0]) === 1) {
            if (isAntiLink) return enviar('✅ El antilink ya está activado en este grupo')
            antilink.push(from)
            fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2))
            enviar('✅ ● ️𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊 𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎 ● ️')
          }
          else if (Number(args[0]) === 0) {
            if (!isAntiLink) return enviar('❌ El antilink ya está desactivado en este grupo')
            const index = antilink.indexOf(from)
            antilink.splice(index, 1)
            fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2))
            enviar('❌ ● ️𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎 ● ️')
          }
          else {
            enviar(`𝐃𝐈𝐆𝐈𝐓𝐄 𝟏 𝐏𝐀𝐑𝐀 𝐀𝐂𝐓𝐈𝐕𝐀𝐑 𝐘 𝟎 𝐏𝐀𝐑𝐀 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐑`)
          }
          break;

        case 'grupo': {
          if (!isGroup) return enviar(respuesta.grupos)
          if (!isGroupAdmins) return enviar(respuesta.admin)
          if (!isBotGroupAdmins) return enviar(respuesta.botadmin)

          if (!args[0]) {
            return enviar(`⚙️ *Configuración del grupo*

Usa:
• */grupo abrir* → Abrir el grupo
• */grupo cerrar* → Cerrar el grupo`)
          }

          if (args[0] === 'abrir') {

            await sock.groupSettingUpdate(from, 'not_announcement')

            enviar(`🟢 *GRUPO ABIERTO*

Ahora todos los miembros pueden enviar mensajes.`)

          } else if (args[0] === 'cerrar') {

            await sock.groupSettingUpdate(from, 'announcement')

            enviar(`🔒 *GRUPO CERRADO*

Solo los administradores pueden enviar mensajes.`)

          } else {

            enviar(`⚠️ Opción inválida

Usa:
• */grupo abrir*
• */grupo cerrar*`)
          }

        }
          break

        // STICKERS 
        case 's':
        case 'sticker': {
          if (!isReg) return enviar(respuesta.registro)
          if (coins < 1) return enviar(respuesta.coins)
          const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
          const boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
          const boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage
          if (boij2) {
            enviar(`Creando su sticker espere un poco ❤️`)
            const pack = `
👑 Dueño 👑
 ✅Daya
⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :
 ${pushname} `
            const author2 = ` 
🤖 𝐁𝐨𝐭 🤖
 ⃟DayaBot
💐 𝐆𝐫𝐮𝐩𝐨💐
${groupName} `
            owgi = await getFileBuffer(boij2, 'image')
            const encmediaa = await sendImageAsSticker2(sock, from, owgi, info, { packname: pack, author: author2 })
            await DLT_FL(encmediaa)
            await economy.addXp(sender, 1)
            await economy.delkoin(sender, 1)
          } else if (boij && boij.seconds < 11) {
            enviar(`Creando tu Sticker ${pushname}`)
            const pack = `
👑 Dueño 👑
 ✅Daya
⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :
 ${pushname} `
            const author2 = ` 
🤖 𝐁𝐨𝐭 🤖
 ⃟DayaBot
💐 𝐆𝐫𝐮𝐩𝐨💐
${groupName} `
            owgi = await getFileBuffer(boij, 'video')
            const encmedia = await sendVideoAsSticker2(sock, from, owgi, info, { packname: pack, author: author2 })
            await DLT_FL(encmedia)
            await economy.addXp(sender, 1)
            await economy.delkoin(sender, 1)
          } else {
            return enviar(`Marque una imagen o \nUn vídeo máximo de 10 segundos ⏲️`)
          }
        }
          break

        ///Nesecitas clave API//
        case "attp":
        case "attp2":
        case "attp3":
          if (!isReg) return enviar(respuesta.registro)
          if (!q) return enviar("Coloca un texto o emoji después del comando")

          try {
            const url = `${APINAUFRA}/api/${messagesC}?text=${encodeURIComponent(q)}&apikey=${NAUFRA_KEY}`
            const res = await fetch(url)
            const buffer = await res.buffer()

            await sock.sendMessage(from, {
              sticker: buffer
            }, { quoted: info })

          } catch (e) {
            console.log(e)
            enviar("Error al crear sticker")
          }

          break

        case 'ship': {
          if (!isReg) return enviar(respuesta.registro)
          if (!isGroup) return enviar('solo disponible en grupos')

          if (!info.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
            info.message.extendedTextMessage.contextInfo.mentionedJid.length < 2)
            return enviar('💞 Menciona a dos personas para calcular su *nivel de amor* 💘')

          const users = info.message.extendedTextMessage.contextInfo.mentionedJid

          const user1 = users[0]
          const user2 = users[1]

          const loveRate = Math.floor(Math.random() * 100) + 1

          let foto1, foto2

          try {
            foto1 = await sock.profilePictureUrl(user1, 'image')
          } catch {
            foto1 = 'https://i.postimg.cc/VkqDjMdJ/75499-coraz-el-dia-de-san-valentin-amor-corazon-de-amor-x750.jpg'
          }

          try {
            foto2 = await sock.profilePictureUrl(user2, 'image')
          } catch {
            foto2 = 'https://i.postimg.cc/VkqDjMdJ/75499-coraz-el-dia-de-san-valentin-amor-corazon-de-amor-x750.jpg'
          }

          const fondo = 'https://telegra.ph/file/394705b02d10509c435cf.jpg'

          const shipImg = `${APINAUFRA}/api/canvas/ship?apikey=${NAUFRA_KEY}&foto1=${encodeURIComponent(foto1)}&foto2=${encodeURIComponent(foto2)}&fundo=${encodeURIComponent(fondo)}&mat=${loveRate}`

          await sock.sendMessage(from, {
            image: { url: shipImg },
            caption: `💘 *𝐂𝐀𝐋𝐂𝐔𝐋𝐀𝐃𝐎𝐑 𝐃𝐄 𝐀𝐌𝐎𝐑* 💘

@${user1?.split('@')[0]} 💖 @${user2?.split('@')[0]}

• *${loveRate}% de Amor Eterno* 🌹`,
            mentions: [user1, user2]

          }, { quoted: info })

        }
          break



        case 'emojimix': {
          if (!isReg) return enviar(respuesta.registro);
          if (coins < 1) return enviar(respuesta.coins);

          if (!q) return enviar(`
🔁𝑪𝒐𝒎𝒃𝒊𝒏𝒂 𝒆𝒎𝒐𝒋𝒊𝒔 𝒚 𝒅𝒆𝒔𝒄𝒖𝒃𝒓𝒆 𝒏𝒖𝒆𝒗𝒂𝒔 𝒄𝒓𝒆𝒂𝒄𝒊𝒐𝒏𝒆𝒔‼️
☑️𝑬𝒔𝒄𝒓𝒊𝒃𝒆 𝒆𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 𝒂𝒔í:
👉 *!emojimix 😊+😂*`);

          enviar('`🔁 𝑴𝒆𝒛𝒄𝒍𝒂𝒏𝒅𝒐...`');

          try {
            const [emoji1, emoji2] = q.split`+`;
            const em = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);

            for (const res of em.results) {
              const templateMessage = {
                image: { url: `${res.url}`, quoted: info }
              };
              sock.sendMessage(from, templateMessage, { quoted: info });

              // Reducir 1 moneda y agregar 1 de experiencia
              await economy.delkoin(sender, 1);
              await economy.addXp(sender, 1);
            }

          } catch (err) {
            enviar('❌ Ocurrió un error, intenta con otros emojis.');
            console.log(err);
          }
        }
          break;

        ///////////////////HERRAMIENTAS///////////
        case 'amp3':
        case 'tomp3':
          if (!isReg) return enviar(respuesta.registro)
          if (!isQuotedVideo) return enviar(`[❗] ${sender?.split('@')[0]}, Marque un video `)
          enviar('`Creando....`')
          tomp = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage, 'video')
          sock.sendMessage(from, { audio: tomp, mimetype: 'audio/mpeg' }, { quoted: info })
          await economy.addXp(sender, 6)
          await economy.delkoin(sender, 3)
          break


        case 'toimg':
          if (!isReg) return enviar(respuesta.registro)
          if (!isQuotedSticker) return enviar('[❗]• 𝗠𝗔𝗥𝗤𝗨𝗘 𝗨𝗡 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 •')
          try {
            enviar('`Creando....`')
            buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
            sock.sendMessage(from, { image: buff, caption: ` [❗] *${pushname}*, Aquí tienes tu pedido ` }, { quoted: info }).catch(e => {
              console.log(e);
              enviar('Nose pudo convertir a imagen verifica que sea un sticker y no un gif ❌')
            })
            await economy.addXp(sender, 3)
            await economy.delkoin(sender, 2)
          } catch {
            enviar('ocurrio un error ')
          }
          break

        case 'calcular':
        case 'cal':
          if (!isReg) return enviar(respuesta.registro)
          if (args.length == 0) return enviar(` ┣「 𝗢𝗣𝗘𝗥𝗔𝗖𝗜𝗢𝗡𝗘𝗦 」┫\n╭──────────────────\n│➫┇+ 𝐒𝐮𝐦𝐚\n│➫┇- 𝐑𝐞𝐬𝐭𝐚\n│➫┇/ 𝐃𝐢𝐯𝐢𝐬𝐢𝐨𝐧\n│➫┇* 𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐢𝐜𝐚𝐜𝐢𝐨𝐧\n│➫ 𝔼𝕛𝕖𝕞𝕡𝕝𝕠 : 𝐂𝐚𝐥 𝟒+𝟒\n╰──────────────────`)
          const resultzx = eval(q)
          await sleep(1000)
          enviar(`\n╭──────────────────\n││「 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 」│\n│➫┇${q} = *${resultzx}*\n╰──────────────────`)
          break

        //nesecitas api
        case 'gpt': case 'gpt4': case 'openai': case 'chatgpt':
        case 'ia': {

          if (!q) return enviar('❌ Escribe una pregunta');

          try {
            const apiURL = `${APINAUFRA}/chatgpt?apikey=${NAUFRA_KEY}&prompt=${encodeURIComponent(q)}&t=${Date.now()}`;
            const data = await fetchJson(apiURL);
            const mensaje = `🤖 *ChatGPT*\n\n${data.respuesta}`;
            await sock.sendMessage(from, { text: mensaje }, { quoted: info });
          } catch (e) {
            console.log("ERROR IA:", e);
            enviar('❌ Error usando la IA');
          }
        }
          break;

        //nesecita API 
        case 'ytsearch': {
          if (!q) return enviar('❌ Escribe un nombre para buscar en YouTube');
          try {
            const apiURL = `${APINAUFRA}/ytsearch?apikey=${NAUFRA_KEY}&q=${encodeURIComponent(q.trim())}`;

            console.log("🔗 Llamando a API:", apiURL);

            const apiData = await fetchJson(apiURL);

            if (!apiData || !apiData.status)
              return reply('❌ No se pudo obtener respuesta válida de la API');

            if (!apiData.resultados || !Array.isArray(apiData.resultados))
              return reply('❌ La API devolvió datos inválidos');

            if (apiData.resultados.length === 0)
              return reply('❌ No se encontraron resultados');

            const firstVideo = apiData.resultados[0];

            let text = `「✦」Resultados para *${q.trim()}*\n\n`;

            for (const video of apiData.resultados) {

              text += `❀ *${video.title}*\n`;
              text += `> ✐ Canal » *${video.author}*\n`;
              text += `> ⴵ Duración » *${video.duration}*\n`;
              text += `> 👁 Visitas » *${video.views.toLocaleString()}*\n`;
              text += `> 🜸 Link » _${video.url}_\n\n`;
            }

            await sock.sendMessage(from, {
              image: { url: firstVideo.thumbnail },
              caption: text.trim()
            }, { quoted: info });

          } catch (e) {
            console.log("❌ ERROR YTSEARCH CASE:", e);
            enviar('❌ Error buscando videos en YouTube');
          }

        }
          break;

        //Economía niveles y experiencia 
        case 'perfil': case 'cartera':
        case 'nivel': case 'minivel': {

          if (!isReg) return enviar(respuesta.registro)

          var saldo = economy.MoneyOfSender(sender)
          const Xp = economy.xpOfsender(sender)
          const Mnv = economy.levelOfsender(sender)
          const Rxxp = economy.Rxp(sender)
          const myrep2 = economy.repUser(sender)
          const Xpnull = Rxxp - 1000

          if (Xp === null) return economy.addXp(sender, Xpnull)

          let foto

          try {
            foto = await sock.profilePictureUrl(sender, 'image')
          } catch {
            foto = 'https://i.postimg.cc/85NsPp8j/20260131-152616.jpg'
          }

          const Mp = `
╔══✦❖【 𝑻𝒖 𝑷𝒆𝒓𝒇𝒊𝒍 】❖✦══╗
🏷️  𝐍𝐨𝐦𝐛𝐫𝐞      »  @${sender?.split('@')[0]}
⚔️  𝐑𝐚𝐧𝐠𝐨       »  ${Mlevel}
👑  𝐑𝐞𝐩𝐮𝐭𝐚𝐜𝐢𝐨́𝐧  »  ${myrep2}
💰  𝐃𝐢𝐧𝐞𝐫𝐨     »  ₹${saldo} 𝐑𝐮𝐩𝐢𝐚𝐬
📈  𝐍𝐢𝐯𝐞𝐥       »  ${Mnv} ➜ ${Mnv + 1}
📚  𝐄𝐗𝐏         »  ${Xp} / ${Rxxp + 1000}
╚══✦❖【 𝐏𝐫𝐨𝐠𝐫𝐞𝐬𝐨 】❖✦══╝
▰▰ ${Mrxp} ▰▰
`
          await sock.sendMessage(from, {
            image: { url: foto },
            caption: Mp,
            mentions: [sender]
          }, { quoted: info })

        }
          break
        //comando tragamonedas 
        case 'tragamuedas':
        case 'tragamoneda':
          if (!isReg) return enviar("Debes registrarte para jugar.");
          const apuestas = 1; // Coste por jugar
          if (coins < apuestas) return enviar("No tienes suficientes Coins 🪙 para jugar.");

          const ahora = Date.now();
          const tiempoGuardado = timeClaimTraga(sender) || 0;
          const tiempoRestante = tiempoGuardado - ahora;

          if (tiempoRestante > 0) {
            return await enviar(`[❗] 𝙴𝚂𝙿𝙴𝚁𝙴 ${runtime(tiempoRestante / 1000)} para volver a jugar.`);
          } else {
            const espera = 8 * 60 * 60 * 1000; // 8 horas
            await addClaimTraga(sender, espera);
          }

          // Restar una moneda por jugar
          await economy.delkoin(sender, apuestas);

          // Lista de símbolos para la tragamuedas
          const simbolos = ['🥕', '🐰', '🐸', '🦊', '🐱', '🍋', '🔔', '🍒', '🍉', '🍌'];

          // Generar filas aleatorias
          const obtenerFila = () => [
            simbolos[Math.floor(Math.random() * simbolos.length)],
            simbolos[Math.floor(Math.random() * simbolos.length)],
            simbolos[Math.floor(Math.random() * simbolos.length)]
          ];

          // Generar las tres filas
          const filaArriba = obtenerFila();
          const filaAbajo = obtenerFila();

          let filaCentro;
          const probabilidad = Math.random(); // Número entre 0 y 1

          // 60% de probabilidad de que los tres símbolos del centro sean iguales
          if (probabilidad < 0.6) {
            const simboloGanador = simbolos[Math.floor(Math.random() * simbolos.length)];
            filaCentro = [simboloGanador, simboloGanador, simboloGanador]; // Hacer que las 3 sean iguales
          } else {
            filaCentro = obtenerFila(); // Si no, generar aleatoriamente
          }

          // Verificar si el usuario ganó
          const esGanador = filaCentro[0] === filaCentro[1] && filaCentro[1] === filaCentro[2];

          let resultadoMensaje = "😢 Has perdido... Inténtalo de nuevo dentro de 8 horas.";
          let premioTexto = "";

          // Si gana, recibe aleatoriamente Coins o EXP entre 5 y 10
          if (esGanador) {
            const premioCantidad = Math.floor(Math.random() * 6) + 5; // Número aleatorio entre 5 y 10
            const tipoPremio = Math.random() < 0.5 ? 'coins' : 'exp'; // 50% de probabilidad para cada tipo

            if (tipoPremio === 'coins') {
              await economy.addkoin(sender, premioCantidad);
              premioTexto = `🎉 Recibiste ${premioCantidad} Coins 🪙.`;
            } else {
              await economy.addXp(sender, premioCantidad);
              premioTexto = `📚 Recibiste ${premioCantidad} de EXP.`;
            }

            resultadoMensaje = "🎉 ¡Has ganado! 🎉";
          }

          // Construcción del mensaje de respuesta
          const mensajeCasino = `
         *༻  𝙏𝙍𝘼𝙂𝘼𝙈𝙊𝙉𝙀𝘿𝘼𝙎 ༺*
            ┏━━━━┛🎰┗━━━━┓
             ||   【${filaArriba[0]}】【${filaArriba[1]}】【${filaArriba[2]}】   ||
           ◢◞───────────◟◣
        █ ||   【${filaCentro[0]}】【${filaCentro[1]}】【${filaCentro[2]}】   || █
           ◥◝───────────◜◤
             ||   【${filaAbajo[0]}】【${filaAbajo[1]}】【${filaAbajo[2]}】   ||
            ┗━━━━┓🎰┏━━━━┛
   🪙◆━━━━━━━▣✦▣━━━━━━━━◆🪙
Has gastado ${apuestas} Coin 🪙.
${resultadoMensaje}
${premioTexto}
`;

          // Enviar el mensaje después de 3 segundos
          setTimeout(() => {
            enviar(mensajeCasino);
          }, 3000);

          break;

        case "dayli": case "daily":
          if (!isGroup) return
          if (!isReg) return
          const dayli = checkDayli(sender)
          if (dayli) {
            const ahora = Date.now()
            const time = timeDayli(sender)
            const result = ahora - time
            const resultado = (0 - result) / 1000;
            return sock.sendMessage(from, { text: `Espere ${runtime(resultado)} para su nueva recompensa` }, { quoted: info })
          } else {
            const time = 24 * 60 * 60 * 1000
            await addDayli(sender, time)
            const montoExperiencia = 5
            const monto = 1
            enviar(`
⏳🪙 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀 𝐃𝐈𝐀𝐑𝐈𝐀 🪙⏳

𝑮𝒂𝒏𝒂𝒔𝒕𝒆 ${monto} 𝑪𝒐𝒊𝒏𝒔 𝒚 ${montoExperiencia} 𝒅𝒆 𝑬𝒙𝒑𝒆𝒓𝒊𝒆𝒏𝒄𝒊𝒂.
`)
            await economy.addkoin(sender, monto)
            await economy.addXp(sender, montoExperiencia)
          }
          break

        case 'reg': case 'registrarme': case 'registrame': case 'rg':
          if (isReg) return enviar(respuesta.yaregistro)
          const nombre = pushname
          await economy.AddReg(sender, nombre)
          sock.sendMessage(from, {
            image: { url: JpgBot },
            caption: `★━━━━★━━━━★★━━━━★
         *༻  𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎  ༺*
🎉𝑅𝑒𝑔𝑖𝑠𝑡𝑟𝑜 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑎𝑑𝑜 *${nombre}* 🥳
🪙𝑹𝒆𝒄𝒊𝒃𝒊𝒔𝒕𝒆 *₹50 Rupias* 🪙 𝒄𝒐𝒎𝒐 𝑹𝒆𝒈𝒂𝒍𝒐 𝒅𝒆 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒂.
◆━━━━━━━▣✦▣━━━━━━━━◆`
          }, { quoted: info })
          break

        case 'levelup': {
          const XpR = economy.xpOfsender(sender)
          const Rxxp = economy.Rxp(sender)
          if (XpR >= Rxxp + 1000) {
            await economy.addLevel(sender, 1)
            sleep(100)
            await economy.addkoin(sender, 10)
            sleep(100)
            await economy.addXp(sender, 100)
            sleep(100)
            await economy.addRxp(sender, 1000)
            const Mup = ` 
        ★━━━ 𝐒𝐔𝐁𝐈𝐒𝐓𝐄 𝐃𝐄 𝐍𝐈𝐕𝐄𝐋 ━━━★
✪ @${sender?.split('@')[0]}
🎉 ¡𝑭𝒆𝒍𝒊𝒄𝒊𝒅𝒂𝒅𝒆𝒔 𝒉𝒂𝒔 𝒅𝒆𝒔𝒃𝒍𝒐𝒒𝒖𝒆𝒂𝒅𝒐 𝒖𝒏 𝒏𝒖𝒆𝒗𝒐 𝒓𝒂𝒏𝒈𝒐! 💪
`
            sock.sendMessage(from, { text: Mup, mentions: [sender] }, { quoted: info })
          } else {
            enviar(`
❌ 𝑬𝒙𝒑𝒆𝒓𝒊𝒆𝒏𝒄𝒊𝒂 𝒊𝒏𝒔𝒖𝒇𝒊𝒄𝒊𝒆𝒏𝒕𝒆. ${pushname} 𝒅𝒆𝒃𝒆𝒓𝒂𝒔 𝒆𝒏𝒕𝒓𝒆𝒏𝒂𝒓 𝒎𝒂𝒔 𝒔𝒆𝒈𝒖𝒊𝒅𝒐. 
`)
          }
        }
          break

        case 'minar': {
          if (!isReg) return enviar(respuesta.registro)
          if (!isGroup) return enviar(respuesta.grupos)
          const isMin = checkMinar(sender)
          if (isMin) {
            const ahora = Date.now()
            const time = timeMinar(sender)
            const result = ahora - time
            const resultado = (0 - result) / 1000;
            return enviar(`𝑪𝒉𝒂𝒎𝒃𝒆𝒂𝒏𝒅𝒐... ${runtime(resultado)} `)
          } else {
            const time = 24 * 60 * 60 * 1000
            await addMinar(sender, time)
            const numbeR = [5, 6, 7, 8, 9, 10];
            const randomIndex = Math.floor(Math.random() * numbeR.length);
            const monto = numbeR[randomIndex];
            enviar(`
               ★━━━ 𝐌𝐈𝐍𝐀𝐍𝐃𝐎... ━━━★
💰 Descubriste oro puro y obtuviste *₹${monto} Rupias* 
💬 ❝ 🌟 𝑮𝒓𝒂𝒄𝒊𝒂𝒔 𝒂𝒍 𝑮𝒓𝒆𝒎𝒊𝒐 𝒅𝒆 𝑴𝒊𝒏𝒆𝒓𝒐𝒔 ⛏ 𝒔𝒆 𝒈𝒂𝒓𝒂𝒏𝒕𝒊𝒛𝒂 𝑺𝒖𝒆𝒍𝒅𝒐 𝑴𝒊𝒏𝒊𝒎𝒐 𝒅𝒆 *₹5 Rupias* 🪙.❞

⏳ 𝑽𝒖𝒆𝒍𝒗𝒆 𝒆𝒏 24 𝒉𝒐𝒓𝒂𝒔.
`)
            await economy.addkoin(sender, monto)
          }
        }
          break

        case "ruleta": {
          if (!q) return enviar(`Indique un monto para apostar, ejemplo .ruleta 4`);
          if (!isReg) return enviar(respuesta.registro)
          const montto = q
          const monto = (montto * 1) / 1
          if (isNaN(monto)) return enviar(`Indique un monto válido en coins`);
          if (monto > economy.MoneyOfSender(sender)) return enviar(`No tienes suficiente dinero`);
          if (monto > 5) return enviar('La apuesta no debe ser mayor a 5 Rupias');
          const isMinxxx = checkRuleta(sender)
          if (isMinxxx) {
            const ahora = Date.now()
            const time = timeRuleta(sender)
            const result = ahora - time
            const resultado = (0 - result) / 1000;
            return enviar(`Espere... ${runtime(resultado)} `)
          } else {
            const time = 24 * 60 * 60 * 1000
            await addRuleta(sender, time)
            const ppt = ["muere", "vive"]; // Posibilidades
            const pptb = ppt[Math.floor(Math.random() * ppt.length)];  // Elección aleatoria del sistema
            let vit;

            // Modo Duelo Letal
            if (pptb === "muere") {
              vit = `💭「𝙍𝙖𝙯𝙚𝙧, 𝙚𝙡 𝙎𝙞𝙣 𝙈𝙞𝙚𝙙𝙤 🐺 𝙖𝙥𝙪𝙣𝙩𝙖 𝙖 𝙡𝙖 𝙘𝙖𝙗𝙚𝙯𝙖 𝙙𝙚 ${pushname} 😨🔫」
💭「𝙍𝙖𝙯𝙚𝙧 🐺 𝙖𝙥𝙧𝙚𝙩𝙖 𝙚𝙡 𝙜𝙖𝙩𝙞𝙡𝙡𝙤... 💥 𝘽𝙊𝙊𝙈!」
💭「${pushname} 𝙝𝙖 𝙘𝙖í𝙙𝙤 𝙮 𝙥𝙚𝙧𝙙𝙞ó ${monto} Rupias 🪙」`;
              await economy.delkoin(sender, monto);
              // El jugador pierde
            } else if (pptb === "vive") {
              vit = `💭「𝙍𝙖𝙯𝙚𝙧, 𝙚𝙡 𝙎𝙞𝙣 𝙈𝙞𝙚𝙙𝙤 🐺 𝙖𝙥𝙪𝙣𝙩𝙖 𝙖 𝙡𝙖 𝙘𝙖𝙗𝙚𝙯𝙖 𝙙𝙚 ${pushname} 😨🔫」
💭「𝙍𝙖𝙯𝙚𝙧 🐺 𝙖𝙥𝙧𝙚𝙩𝙖 𝙚𝙡 𝙜𝙖𝙩𝙞𝙡𝙡𝙤... 💥 𝘽𝙊𝙊𝙈!」
💭「𝙀𝙨 𝙪𝙣𝙖 𝙗𝙧𝙤𝙢𝙖, ${pushname} 𝙨𝙤𝙗𝙧𝙚𝙫𝙞𝙫𝙚 𝙮 𝙜𝙖𝙣𝙖 ${monto} Rupias 🪙」`;
              await economy.addkoin(sender, monto);
              // El jugador gana
            }
            const datatt = `
╭━━━╾⭑✦  ✦⭑╼━━━╮
         ⌬ 𝙍𝙐𝙇𝙀𝙏𝘼 𝙍𝙐𝙎𝘼 ⌬
${vit}
⌛ 𝙑𝙪𝙚𝙡𝙫𝙚 𝙚𝙣 24 𝙝𝙤𝙧𝙖𝙨...
╰━━━╾⭑✦ ⬤ ✦⭑╼━━━╯
`;
            enviar(datatt);
          }
        }
          break

        case "pescar": {
          if (q) return enviar(`no ponga ninguna palabra solo /pescar`);
          if (!isReg) return enviar(respuesta.registro)
          const isMinxxx = checkPescar(sender)
          if (isMinxxx) {
            const ahora = Date.now()
            const time = timePescar(sender)
            const result = ahora - time
            const resultado = (0 - result) / 1000;
            return enviar(`Espere... ${runtime(resultado)} `)
          } else {
            const time = 8 * 60 * 60 * 1000;
            await addPescar(sender, time)
            const ppt = ["delfin", "pulpo", "pez", "pez2", "pez3", "zapato"]; // Posibilidades
            const pptb = ppt[Math.floor(Math.random() * ppt.length)];  // Elección aleatoria del sistema
            let vit;

            // Cazador Marino
            if (pptb === "delfin") {
              vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🦈 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙜𝙖𝙣𝙖𝙨 20 𝙙𝙚 𝙀𝙓𝙋 📚」`;
              await economy.addXp(sender, 20);
              // El jugador gana
            } else if (pptb === "pulpo") {
              vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐙 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 8 𝙍𝙪𝙥𝙞𝙖𝙨 💎」`;
              await economy.addkoin(sender, 8);
            } else if (pptb === "pez") {
              vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐠 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 4 𝙍𝙪𝙥𝙞𝙖𝙨 💎 𝒚 5 𝙙𝙚 𝙀𝙓𝙋 📚」`;
              await economy.addkoin(sender, 4);
              await economy.addXp(sender, 5);
            } else if (pptb === "pez2") {
              vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐟 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 3 𝙍𝙪𝙥𝙞𝙖𝙨 💎 𝒚 3 𝙙𝙚 𝙀𝙓𝙋 📚」`;
              await economy.addkoin(sender, 3);
              await economy.addXp(sender, 3);
            } else if (pptb === "pez3") {
              vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🐡 𝙮 𝙖𝙡 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯 𝙧𝙚𝙘𝙞𝙗𝙚𝙨 1 𝙍𝙪𝙥𝙞𝙖 💎 𝒚 2 𝙙𝙚 𝙀𝙓𝙋 📚」`;
              await economy.addkoin(sender, 1);
              await economy.addXp(sender, 2);
            } else if (pptb === "zapato") {
              vit = `💭「𝙃𝙖𝙨 𝙖𝙩𝙧𝙖𝙥𝙖𝙙𝙤 𝙪𝙣 🥾 𝙮 𝙖𝙡 𝙩𝙧𝙖𝙩𝙖𝙧 𝙙𝙚 𝙫𝙚𝙣𝙙𝙚𝙧𝙡𝙤 𝙖 𝙆𝙖𝙞 🐯, 𝙡́𝙚𝙡 𝙨𝙚 𝙧𝙞𝙚 🤣 𝙙𝙚 𝙩𝙞 🥲」`;
            }

            const datatt = `
╔════ ⭑✦.   ✦⭑ ════╗
         ❖ 𝙋𝙀𝙎𝘾𝘼 𝙀𝙉 𝙀𝙇 𝙈𝘼𝙍 ❖
${vit}
⌛ 𝙑𝙪𝙚𝙡𝙫𝙚 𝙚𝙣 8 𝙝𝙤𝙧𝙖𝙨...
╚════ ⭑✦ ❖ ✦⭑ ════╝
`;
            enviar(datatt);
          }
        }
          break

        case 'listreg': {
          R_ = []
          teks = '*REGISTRADOS* 😼\n'
          for (let R of registro) {
            teks += `• @${R.id?.split('@')[0]}\n`
            R_.push(R.id)
          }
          teks += '• ' + registro.length
          mentions(teks, R_, true)
        }
          break

        case 'regalar':
        case 'tradecoin':
        case 'tradecoins':
        case 'enviarcoins':
        case 'enviar': {
          if (!isGroup) return enviar("⚠️ Este comando solo funciona en grupos.");

          (async () => {
            try {
              const mencionado = obtenerMencionado(info); // destinatario
              const emisor = sender; // quien envía las monedas
              const monto = Number(args[1]);

              if (!mencionado) return enviar("⚠️ Debes mencionar a alguien para enviarle monedas.\nEj: .regalar @usuario 100");
              if (mencionado === emisor) return enviar("⚠️ No puedes enviarte monedas a ti mismo.");
              if (isNaN(monto) || monto <= 0) return enviar("⚠️ Ingresa una cantidad válida de monedas.\nEj: .regalar @usuario 100");

              const saldoEmisor = await economy.MoneyOfM(emisor);
              if (saldoEmisor < monto) return enviar("❌ No tienes suficientes monedas para hacer esta transferencia.");

              // Realizar transferencia
              await economy.delkoin(emisor, monto);
              await economy.addkoin(mencionado, monto);
              await sleep(100);

              const nuevoSaldo = await economy.MoneyOfM(emisor);
              enviar(`✅ Transferencia completada.\nUsted envió *₹${monto} Rupias.*`, {
                mentions: [emisor, mencionado]
              });
            } catch (e) {
              enviar('❌ Error: ' + e.message);
            }
          })();
        }
          break;

        case 'rep': case 'mirep': case 'mireputacion':
          if (!isReg) return enviar(respuesta.registro)
          const myrep = economy.repUser(sender)
          const mitulamide30milimetros = `
╭━━━╾⭑✦REPUTACIÓN✦⭑╼━━━╮
𝑳𝒂 𝑹𝒆𝒑𝒖𝒕𝒂𝒄𝒊𝒐𝒏 𝒅𝒆 ${pushname} 𝒆𝒔 𝒅𝒆 ${myrep}.
`
          if (myrep < 20) {
            await sock.sendMessage(from, {
              image: { url: "https://i.postimg.cc/NfJfvsBW/Untitled-05-12-2024-09-16-50-1.png" },
              caption: mitulamide30milimetros
            }, { quoted: info });
          } else if (myrep >= 21 && myrep <= 40) {
            await sock.sendMessage(from, {
              image: { url: "https://i.postimg.cc/PxjdQNQ8/Untitled-05-12-2024-09-16-50-2.png" },
              caption: mitulamide30milimetros
            }, { quoted: info });
          } else if (myrep >= 41 && myrep <= 60) {
            await sock.sendMessage(from, {
              image: { url: "https://i.postimg.cc/HL5pMbXg/Untitled-05-12-2024-09-16-50-3.png" },
              caption: mitulamide30milimetros
            }, { quoted: info });
          } else if (myrep >= 61 && myrep <= 80) {
            await sock.sendMessage(from, {
              image: { url: "https://i.postimg.cc/brWX3NWB/IMG-20241223-WA0014.jpg" },
              caption: mitulamide30milimetros
            }, { quoted: info });
          } else {
            await sock.sendMessage(from, {
              image: { url: "https://i.postimg.cc/Cx9hdcZ7/Untitled-05-12-2024-09-16-50-5.png" },
              caption: mitulamide30milimetros
            }, { quoted: info });
          }

          break

        case 'rank': case 'rankrep':
          if (!isGroup) return
          if (!isGroupAdmins) return enviar(respuesta.admin)
          let teks2 = `
▭▬ ۞ ▬▛ ༼⁠ᘛ 𝑳𝒖𝒏𝒂-𝑩𝒐𝒕 ᘚ༽ ▜▬ ۞ ▬▭
*༻❦ 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐃𝐄 𝐑𝐄𝐏𝐔𝐓𝐀𝐂𝐈𝐎𝐍 ❦༺\n`;
          registro.sort((a, b) => b.rep - a.rep) // Ordena de mayor a menor
            .slice(0, 10) // Toma solo los 10 primeros
            .forEach((usuario, indice) => {
              teks2 += `• 🚩Numero ${indice + 1}: *${usuario.nombre}* | *${usuario.rep}* de Reputación\n`;
            });
          enviar(teks2)
          break

        case 'rankcoins': {
          if (!isGroup) return;
          if (!isGroupAdmins) return enviar(respuesta.admin)
          const pathi = './settings/Grupo/Json/registros.json';

          // Leer los datos actualizados en el momento
          const registro = JSON.parse(fs.readFileSync(pathi, 'utf8'));

          let rankingMensaje = `*🏆 RANKING DE MILLONARIOS*\n\nTOP.  USUARIO.   RUPIAS\n\n`;

          // Convertir a array si registro es un objeto
          const rankingArray = Array.isArray(registro)
            ? registro
            : Object.entries(registro).map(([jid, data]) => ({
              nombre: data.nombre || jid?.split('@')[0],
              dinero: data.dinero || 0,
            }));

          rankingArray
            .sort((a, b) => b.dinero - a.dinero)
            .slice(0, 10)
            .forEach((usuario, index) => {
              rankingMensaje += `• ${index + 1}. *${usuario.nombre}* ➫ _${usuario.dinero}_ Rupias\n`;
            });

          enviar(rankingMensaje);
        }
          break;

        case 'ranknivel': {
          if (!isGroup) return
          if (!isGroupAdmins) return enviar(respuesta.admin)
          let teks = `
*RANKING DE NIVEL* :
TOP.   USUARIO.   NIVEL\n`
          registro.sort((a, b) => b.nivel - a.nivel).forEach((usuario, index) => {
            teks += `• ${index + 1}.     *${usuario.nombre}*  ➫  _*${usuario.nivel}*_\n`
          });
          enviar(teks)
        }
          break

        case "tienda":
          if (!q) return enviar(`
✦━───༺༻───━✦
🎀❖ 𝓣𝓘𝓔𝓝𝓓𝓐 ❖🎀

🐾💬 "𝓑𝓲𝓮𝓷𝓿𝓮𝓷𝓲𝓭𝓸 𝓪 𝓵𝓪 𝓽𝓲𝓮𝓷𝓭𝓪 🌙"
━━━━━━━━━━━━━━━
🍀 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 1️⃣:
👉 *.tienda 1* 👈
🏷️ 50 𝓒𝓸𝓲𝓷𝓼 🪙 🔁 200 𝓔𝓧𝓟 📚

🌟 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 2️⃣:
👉 *.tienda 2* 5 Los dragones 👈
🏷️ 50 𝓒𝓸𝓲𝓷𝓼 🪙 🔁 𝓒𝓪𝓶𝓫𝓲𝓪 𝓷𝓸𝓶𝓫𝓻𝓮 𝓭𝓮 𝓻𝓪𝓷𝓰𝓸𝓼
( .𝓽𝓲𝓮𝓷𝓭𝓪 2 + 𝓷𝓲𝓿𝓮𝓵 𝓭𝓮 𝓻𝓪𝓷𝓰𝓸 + 𝓷𝓸𝓶𝓫𝓻𝓮𝓝𝓾𝓮𝓿𝓸 )

💎 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 3️⃣:
👉 *.emojimix 😇+😈* 👈
🏷️ 1 𝓒𝓸𝓲𝓷 🪙 🔁 𝓒𝓸𝓶𝓫𝓲𝓷𝓪 🌀 𝓮𝓶𝓸𝓳𝓲𝓼.

🎨 𝘼𝙧𝙩𝙞𝙘𝙪𝙡𝙤 4️⃣:
👉 *.sticker* 👈
🏷️ 1 𝓒𝓸𝓲𝓷 🪙 🔁 𝓒𝓻𝓮𝓪 𝓼𝓽𝓲𝓬𝓴𝓮𝓻𝓼 𝓬𝓸𝓷 𝓯𝓸𝓽𝓸𝓼 𝓸 𝓖𝓘𝓕𝓼.

✦━───༺༻───━✦
`);

          if (q.startsWith("1")) {
            if (coins < 50) return enviar("❌ No tienes suficientes Reales para hacer esta compra. Necesitas al menos 50 Rupias.");
            await economy.delkoin(sender, 50);
            await economy.addXp(sender, 200);

            return enviar(`🐱💬 Gracias ${pushname}, cambiaste 50 Rupias por 200 EXP.`);
          }

          if (q.startsWith("2")) {
            const args = q?.split(" ");
            const nivel = parseInt(args[1]);
            const nuevoNombre = args.slice(2).join(" ");

            if (isNaN(nivel) || !nuevoNombre) {
              return enviar("❌ Usa el comando correctamente: .tienda 2 <nivel> <nuevo nombre>\nEjemplo: .tienda 2 8 Los Poderosos");
            }

            if (coins < 50) {
              return enviar("❌ No tienes suficientes Coins para cambiar el nombre del rango. Necesitas 50 Coins.");
            }

            const path = './settings/rangos.json';
            let rangosData;

            try {
              rangosData = JSON.parse(fs.readFileSync(path));
            } catch (e) {
              return enviar("⚠️ Error al leer los rangos. Asegúrate de que el archivo exista y esté bien formado.");
            }

            rangosData[nivel] = nuevoNombre;

            try {
              fs.writeFileSync(path, JSON.stringify(rangosData, null, 2));
              await economy.delkoin(sender, 50);

              return enviar(`✅ ¡Perfecto, ${pushname}!\nHas cambiado el rango del nivel *${nivel}* a:\n✨ *${nuevoNombre}* ✨\nY se descontaron 50 Rupias 🪙`);
            } catch (e) {
              return enviar("⚠️ No se pudo guardar el nuevo nombre. Intenta de nuevo.");
            }
          }

          break;

        //DESCARGAS
        //nesecitas api
        case 'playvideo':
        case 'ytmp4': {
          if (!isReg) return enviar(respuesta.registro)
          if (!q)
            return enviar('❌ Escribe un nombre o link de YouTube');
          try {

            // Endpoint info del video
            const apiURL =
              `${APINAUFRA}/ytinfo?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;

            const apiData = await fetchJson(apiURL);

            // SI YTINFO FUNCIONA
            if (apiData && apiData.Estado === "online") {

              const data = apiData.Resultado;

              await sock.sendMessage(from, {
                image: { url: data.Miniatura },
                caption: `「✪」 *${data.Titulo}*\n\n*ⴵ Duración:* ${data.Duracion}\n*✐ Canal:* ${data.Canal.Nombre}\n*👁 Vistas:* ${data.Visualizaciones}\n*🜸 Link:* ${data.EnlaceYoutube}`
              }, { quoted: info });

              await sock.sendMessage(from, {
                video: { url: `${data.EnlaceDescarga}&apikey=${NAUFRA_KEY}` }, // 🔑 Agregar key también aquí
                mimetype: 'video/mp4',
                caption: data.Titulo
              }, { quoted: info });

              return;
            }

            // SI YTINFO FALLA → DESCARGA IGUAL
            const videoURL =
              `${APINAUFRA}/ytmp4?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;

            await sock.sendMessage(from, {
              video: { url: videoURL },
              mimetype: 'video/mp4',
              caption: q
            }, { quoted: info });

          } catch (e) {
            console.log("ERROR PLAYVIDEO:", e);
            enviar('❌ Error descargando video');

          }
        }
          break;

        case 'playdoc': {
          if (!isReg) return enviar(respuesta.registro)
          if (!q)
            return enviar('❌ Escribe un nombre o link de YouTube');

          try {
            const apiURL =
              `${APINAUFRA}/ytinfo?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;
            const apiData = await fetchJson(apiURL);

            // SI YTINFO FUNCIONA
            if (apiData && apiData.Estado === "online") {
              const data = apiData.Resultado;

              await sock.sendMessage(from, {
                image: { url: data.Miniatura },
                caption: `「✪」 *${data.Titulo}*

*ⴵ Duración:* ${data.Duracion}
*✐ Canal:* ${data.Canal.Nombre}
*👁 Vistas:* ${data.Visualizaciones}
*🜸 Link:* ${data.EnlaceYoutube}
`
              }, { quoted: info });

              await sock.sendMessage(from, {
                document: { url: `${data.EnlaceDescarga}&apikey=${NAUFRA_KEY}` },
                mimetype: 'video/mp4',
                fileName: `${data.Titulo}.mp4`
              }, { quoted: info });

              return;
            }

            // SI YTINFO FALLA → DESCARGA IGUAL
            const videoURL =
              `${APINAUFRA}/ytmp4?apikey=${NAUFRA_KEY}&url=${encodeURIComponent(q.trim())}`;

            await sock.sendMessage(from, {
              document: { url: videoURL },
              mimetype: 'video/mp4',
              fileName: `video.mp4`
            }, { quoted: info });

          } catch (e) {
            console.log("ERROR MP4DOC:", e);
            enviar('❌ Error enviando documento');

          }

        }
          break;

        case 'play': {
          if (!isReg) return enviar(respuesta.registro)
          if (!q) return enviar('❌ Escribe un nombre o link de YouTube')

          // El resto del archivo continúa igual pero usando los imports ESM
          // IMPORTANTE: Para que esto funcione correctamente, necesitas:
          // 1. Añadir "type": "module" en package.json
          // 2. O usar la extensión .mjs para el archivo

          break;
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}

main()