/**
 * Comandos de Economía y Perfil - Simplified TS
 */

export const economyCommands: Record<string, any> = {
  reg: {
    aliases: ['reg', 'registrarme', 'registrame', 'rg'],
    handler: async (params: any) => {
      const { sender, from, isReg, enviar, pushname, economy, respuesta, sock, info, JpgBot } = params;
      if (isReg) return enviar(respuesta.yaregistro);
      await economy.AddReg(sender, pushname);
      sock.sendMessage(from, { image: { url: JpgBot }, caption: `Registro completado ${pushname}!` }, { quoted: info });
    },
  },

  perfil: {
    aliases: ['perfil', 'cartera', 'nivel', 'minivel'],
    handler: async (params: any) => {
      const { sender, from, isReg, enviar, economia, respuesta, sock, info, pushname, economy, rangos } = params;
      if (!isReg) return enviar(respuesta.registro);
      const saldo = economy.MoneyOfSender(sender);
      const nivel = economy.levelOfsender(sender);
      const xp = economy.xpOfsender(sender);
      const rep = economy.repUser(sender);
      sock.sendMessage(from, { text: `Perfil: ${pushname}\nDinero: ${saldo}\nNivel: ${nivel}\nXP: ${xp}\nRep: ${rep}` }, { quoted: info });
    },
  },

  nivel: {
    aliases: ['nivel'],
    handler: (params: any) => {
      const { sender, economy, enviar } = params;
      const lvl = economy.levelOfsender(sender);
      enviar(`Tu nivel es: ${lvl}`);
    },
  },
};

function calculateProgress(xp: number, rxp: number): string {
  if (xp <= rxp + 50) return '0%';
  if (xp <= rxp + 100) return '10%';
  if (xp <= rxp + 200) return '20%';
  if (xp <= rxp + 300) return '30%';
  if (xp <= rxp + 400) return '40%';
  if (xp <= rxp + 500) return '50%';
  if (xp <= rxp + 600) return '60%';
  if (xp <= rxp + 700) return '70%';
  if (xp <= rxp + 800) return '80%';
  if (xp <= rxp + 999) return '90%';
  return '100%';
}

export default economyCommands;