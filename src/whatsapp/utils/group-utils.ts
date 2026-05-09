/**
 * Utilidades de grupos - extraído de index.js
 * Funciones helpers para manejo de grupos
 */

import type { GroupParticipant } from 'baileys';

/**
 * Obtiene la lista de administradores de un grupo
 * @param participants - Array de participantes del grupo
 * @returns Array de JIDs de administradores
 */
const getGroupAdmins = (participants: GroupParticipant[]): string[] => {
  const admins: string[] = []
  for (const i of participants) {
    if (i.admin == 'admin') admins.push(i.id)
    if (i.admin == 'superadmin') admins.push(i.id)
  }
  return admins
}

export {
  getGroupAdmins
}