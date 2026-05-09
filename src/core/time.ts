/**
 * Funciones de tiempo - extraídas de index.js
 * Sin cambios de comportamiento, solo organizadas
 */

import moment from 'moment-timezone'

/**
 * Obtiene la hora actual formateada
 */
function getTime(timezone = 'Europe/Madrid'): string {
  return moment.tz(timezone).format('DD/MM HH:mm:ss')
}

/**
 * Obtiene la hora del día (HH)
 */
function getHour(): string {
  return moment().format('HH')
}

/**
 * Obtiene saludo basado en la hora
 */
function getGreeting(): string {
  const hour = parseInt(getHour())

  if (hour >= 1 && hour <= 5) {
    return '𝘽𝙪𝙚𝙣𝙖𝙨 🙋'
  } else if (hour >= 5 && hour <= 12) {
    return '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ☀️'
  } else if (hour >= 12 && hour <= 18) {
    return '𝘽𝙪𝙚𝙣𝙖𝙨 𝙩𝙖𝙧𝙙𝙚𝙨 ⛅'
  } else {
    return '𝙗𝙪𝙚𝙣𝙖𝙨 𝙣𝙤𝙘𝙝𝙚𝙨 🌑'
  }
}

/**
 * Calcula el runtime formateado
 */
function runtime(seconds: number): string {
  seconds = Number(seconds)
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const parts: string[] = []

  if (days > 0) {
    parts.push(days + (days === 1 ? ' 𝙳𝙸𝙰' : ' 𝙳𝙸𝙰𝚂'))
  }
  if (hours > 0) {
    parts.push(hours + (hours === 1 ? ' 𝙷𝙾𝚁𝙰' : ' 𝙷𝙾𝚁𝙰𝚂'))
  }
  if (minutes > 0) {
    parts.push(minutes + (minutes === 1 ? '  𝙼𝙸𝙽𝚄𝚃𝙾' : ' 𝙼𝙸𝙽𝚄𝚃𝙾𝚂'))
  }
  if (remainingSeconds > 0) {
    parts.push(remainingSeconds + (remainingSeconds === 1 ? ' 𝚂𝙴𝙶𝚄𝙽𝙳𝙾' : ' 𝚂𝙴𝙶𝚄𝙽𝚃𝙾𝚂'))
  }

  return parts.join(', ')
}

export {
  getTime,
  getHour,
  getGreeting,
  runtime
}