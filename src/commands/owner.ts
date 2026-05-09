/**
 * Comandos de owner - Simplified
 */

export default {
  miapi: async (params: any) => {
    const { APINAUFRA, NAUFRA_KEY, enviar } = params;
    try {
      const res = await fetch(`${APINAUFRA}/api/keyinfo?apikey=${NAUFRA_KEY}`);
      const data = await res.json() as any;
      if (data.status) {
        enviar(`API Info:\nUsadas: ${data.usadas}\nLimite: ${data.limite}`);
      } else {
        enviar('Error consultando API');
      }
    } catch {
      enviar('Error consultando API');
    }
  },

  infobot: (params: any) => {
    const { time, Bot, runtime, enviar, sock, from, info, JpgBot } = params;
    const uptime = typeof process !== 'undefined' ? process.uptime() : 0;
    const text = `Info Bot\nHora: ${time}\nNombre: ${Bot}\nUptime: ${runtime(uptime)}`;
    sock.sendMessage(from, { image: { url: JpgBot }, caption: text }, { quoted: info });
  },

  reiniciar: () => {
    console.log('Reiniciando...');
    setTimeout(() => process.exit(0), 1000);
  },
};