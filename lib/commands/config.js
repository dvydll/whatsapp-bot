/**
 * Comandos de configuración del bot (owner)
 */

import fs from 'node:fs';

export default {
	/**
	 * Comando boton/encenderbot - Enciende el bot
	 */
	boton: (params) => {
		const { isOwner, botActivo, guardarEstadoBot, enviar, respuesta } = params;

		if (!isOwner) return enviar(respuesta.miowner);
		if (botActivo) return enviar('✅ El bot ya está encender.');
		guardarEstadoBot(true);
		enviar(
			'🤖 El bot ha sido *ACTIVADO* y volverá a responder a los comandos.',
		);
	},

	/**
	 * Comando botoff/apagabot - Apaga el bot
	 */
	botoff: (params) => {
		const { isOwner, botActivo, guardarEstadoBot, enviar, respuesta } = params;

		if (!isOwner) return enviar(respuesta.miowner);
		if (!botActivo) return enviar('⚠️ El bot ya estaba apagado.');
		guardarEstadoBot(false);
		enviar(
			'😴 El bot ha sido *DESACTIVADO* y afectará de responder a los comandos.',
		);
	},

	/**
	 * Comando antiprivado/antipv - Activa/desactiva antiprivado
	 */
	antiprivado: (params) => {
		const { isOwner, args, Antipv, enviar, respuesta } = params;
		const chatPath = './settings/Json/chat.json';

		if (!isOwner) return enviar(respuesta.miowner);

		if (args[0] === 'on') {
			if (Antipv.includes('activo'))
				return enviar('El anti-privado ya esta activo');
			Antipv.push('activo');
			fs.writeFileSync(chatPath, JSON.stringify(Antipv));
			enviar('Anti-privado activado exitosamente');
		} else if (args[0] === 'off') {
			if (!Antipv.includes('activo'))
				return enviar('El anti-privado ya estaba desactivado');
			Antipv.splice('desactivo');
			fs.writeFileSync(chatPath, JSON.stringify(Antipv));
			enviar('Anti-privado desactivado exitosamente');
		} else {
			enviar('on para activar y off para desactivar');
		}
	},

	/**
	 * Comando rvisu/revelarvisu/open - Revelar vista única
	 */
	rvisu: (params) => {
		const { isOwner, enviar, info, sock, from } = params;

		if (!isOwner) return enviar(params.respuesta.miowner);
		enviar('🥱');

		try {
			if (JSON.stringify(info).includes('videoMessage')) {
				const vio =
					info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
				const viewVideo =
					vio?.videoMessage ||
					info.message?.videoMessage ||
					vio?.viewOnceMessageV2?.message?.videoMessage ||
					info.message?.viewOnceMessageV2?.message?.videoMessage ||
					vio?.viewOnceMessage?.message?.videoMessage ||
					info.message?.viewOnceMessage?.message?.videoMessage;
				viewVideo.viewOnce = false;
				viewVideo.video = { url: viewVideo.url };
				viewVideo.caption += 'El vídeo fue *Revelado*';
				sock.sendMessage(from, viewVideo);
			} else {
				const vio =
					info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
				const viewImage =
					vio?.imageMessage ||
					info.message?.imageMessage ||
					vio?.viewOnceMessageV2?.message?.imageMessage ||
					info.message?.viewOnceMessageV2?.message?.imageMessage ||
					vio?.viewOnceMessage?.message?.imageMessage ||
					info.message?.viewOnceMessage?.message?.imageMessage;
				viewImage.viewOnce = false;
				viewImage.image = { url: `${viewImage.url}` };
				viewImage.caption += '😼';
				sock.sendMessage(from, viewImage);
			}
		} catch (e) {
			console.log(e);
			enviar(e);
		}
	},
};
