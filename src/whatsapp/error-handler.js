/**
 * Handler de errores - extraído de index.js
 * Manejo centralizado de errores del bot
 */

// Errores conocidos que no queremos loguear (ruido innecesario)
const IGNORED_ERRORS = [
  "this.isZero",
  "Could not find MIME for Buffer <null>",
  "Cannot read property 'conversation' of null",
  "Cannot read property 'contextInfo' of undefined",
  "Cannot set property 'mtype' of undefined",
  "jid is not defined"
]

/**
 * Crea el handler de errores para mensajes
 * @param {Function} colorFn - Función color del index.js
 * @returns {Function} Handler de error
 */
const createMessageErrorHandler = (colorFn) => {
  return (e) => {
    let errorStr = String(e)
    
    // Filtrar errores conocidos que no queremos mostrar
    const isIgnored = IGNORED_ERRORS.some(ignored => errorStr.includes(ignored))
    
    if (!isIgnored) {
      console.log('Error : %s', colorFn(errorStr, 'red'))
    }
  }
}

/**
 * Función helper para loguear errores de forma consistente
 * @param {Error|string} error - Error a loguear
 * @param {string} context - Contexto donde ocurrió el error
 * @param {Function} colorFn - Función color del index.js
 */
const logError = (error, context = '', colorFn) => {
  const errorStr = String(error)
  const prefix = context ? `[${context}] ` : ''
  console.log('%sError: %s', prefix, colorFn(errorStr, 'red'))
}

export {
  createMessageErrorHandler,
  logError,
  IGNORED_ERRORS
}