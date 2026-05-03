/**
 * Utilidades de grupos - extraído de index.js
 * Funciones helpers para manejo de grupos
 */

/**
 * Obtiene la lista de administradores de un grupo
 * @param {Array} participants - Array de participantes del grupo
 * @returns {Array} Array de JIDs de administradores
 */
const getGroupAdmins = (participants) => {
  const admins = []
  for (let i of participants) {
    if (i.admin == 'admin') admins.push(i.id)
    if (i.admin == 'superadmin') admins.push(i.id)
  }
  return admins
}

module.exports = {
  getGroupAdmins
}