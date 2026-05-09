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

type ColorFn = (text: string, color: string) => string

/**
 * Crea el handler de errores para mensajes
 * @param colorFn - Función color del index.js
 * @returns Handler de error
 */
const createMessageErrorHandler = (colorFn: ColorFn) => {
  return (e: unknown): void => {
    const errorStr = String(e)

    // Filtrar errores conocidos que no queremos mostrar
    const isIgnored = IGNORED_ERRORS.some(ignored => errorStr.includes(ignored))

    if (!isIgnored) {
      console.log('Error : %s', colorFn(errorStr, 'red'))
    }
  }
}

/**
 * Función helper para loguear errores de forma consistente
 * @param error - Error a loguear
 * @param context - Contexto donde ocurrió el error
 * @param colorFn - Función color del index.js
 */
const logError = (error: unknown, context = '', colorFn?: ColorFn): void => {
  const errorStr = String(error)
  const prefix = context ? `[${context}] ` : ''
  if (colorFn) {
    console.log('%sError: %s', prefix, colorFn(errorStr, 'red'))
  } else {
    console.log('%sError: %s', prefix, errorStr)
  }
}

export {
  createMessageErrorHandler,
  logError,
  IGNORED_ERRORS
}