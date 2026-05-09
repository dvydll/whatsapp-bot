/**
 * Comandos de Grupo - Simplified TS
 */

import fs from 'node:fs';

export const groupCommands = {
  welcome: {
    aliases: ['welcome', 'bienvenida'],
    handler: async (params: any) => {
      const { args, from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, isWelcome, welcome } = params;
      if (!isGroup) return;
      if (args.length < 1) return enviar('「 1 PARA ACTIVAR Y 0 PARA DESACTIVAR 」');
      if (!isGroupAdmins) return enviar('Solo administradores pueden usar este comando');
      if (!isBotGroupAdmins) return enviar('El bot necesita ser administrador');

      if (Number(args[0]) === 1) {
        if (isWelcome) return enviar('La bienvenida ya está activada');
        welcome.push(from);
        fs.writeFileSync('./settings/Grupo/Json/welcome.json', JSON.stringify(welcome));
        enviar('Activado exitosamente');
      } else if (Number(args[0]) === 0) {
        if (!isWelcome) return enviar('La bienvenida no está activada');
        const idx = welcome.indexOf(from);
        if (idx > -1) welcome.splice(idx, 1);
        fs.writeFileSync('./settings/Grupo/Json/welcome.json', JSON.stringify(welcome));
        enviar('Desactivado exitosamente');
      }
    },
  },

  bangp: {
    aliases: ['bangp'],
    handler: async (params: any) => {
      const { isOwner, enviar } = params;
      if (!isOwner) return enviar('Solo el owner puede usar este comando');
      enviar('Comando en migración');
    },
  },

  grupo: {
    aliases: ['grupo'],
    handler: async (params: any) => {
      const { args, from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, sock } = params;
      if (!isGroup) return enviar('Solo funciona en grupos');
      if (!isGroupAdmins) return enviar('Solo administradores');
      if (!isBotGroupAdmins) return enviar('El bot necesita ser admin');

      if (args[0] === 'abrir') {
        await sock.groupSettingUpdate(from, 'not_announcement');
        enviar('Grupo abierto');
      } else if (args[0] === 'cerrar') {
        await sock.groupSettingUpdate(from, 'announcement');
        enviar('Grupo cerrado');
      }
    },
  },

  antilink: {
    aliases: ['antilink'],
    handler: async (params: any) => {
      const { args, from, isGroup, isGroupAdmins, isBotGroupAdmins, enviar, antilink } = params;
      if (!isGroup || !isGroupAdmins || !isBotGroupAdmins) return;
      if (args[0] === '1') {
        if (!antilink.includes(from)) antilink.push(from);
        fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2));
        enviar('Antilink activado');
      } else if (args[0] === '0') {
        const idx = antilink.indexOf(from);
        if (idx > -1) antilink.splice(idx, 1);
        fs.writeFileSync('./settings/Grupo/Json/antilink.json', JSON.stringify(antilink, null, 2));
        enviar('Antilink desactivado');
      }
    },
  },
};

export default groupCommands;