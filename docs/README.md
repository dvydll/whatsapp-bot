# 📚 Documentación de WhatsAppBot

Bienvenido a la documentación técnica de WhatsAppBot. Este documento sirve como índice y punto de entrada para toda la documentación del proyecto.

## 📋 Índice de Documentación

| Documento | Descripción | Prioridad |
|----------|------------|----------|
| [SPEC.md](./SPEC.md) | Especificaciones técnicas detalladas del sistema | Alta |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitectura y diagramas del sistema | Alta |
| [COMMANDS.md](./COMMANDS.md) | Listado completo de comandos disponibles | Alta |
| [CONFIG.md](./CONFIG.md) | Guía de configuración | Media |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Solución de problemas comunes | Media |

## 🎯 Propósito del Proyecto

WhatsAppBot es un bot de WhatsApp basado en Baileys que proporciona las siguientes funcionalidades principales:

- Gestión de grupos con система de bienvenidas y AntiLink
- Juegos RPG con sistema de economía (monedas, XP, niveles)
- Descargas de contenido multimedia
- Sistema de stickers con texto (ATTP)
- Conversiones de medios (video a áudio, sticker a imagen)
- Protección AntiPrivado

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+ LTS
- npm o yarn
- FFmpeg (para procesamiento de audio/video)

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el bot
node index.js
```

### Primera Configuración

1. Edita `settings/settings.json` con tu número de owner
2. Ejecuta `node index.js`
3. Ingresa tu número de WhatsApp con código de país
4. Recibe el código de vinculación de 8 dígitos

## 📁 Estructura del Proyecto

```
whatsapp-bot/
├── index.js              # Punto de entrada principal
├── start.sh             # Script de inicio automático
├── package.json        # Dependencias
├── docs/              # Documentación
├── fuction/           # Funciones utilitarias
├── settings/          # Configuraciones
└── Games/            # Sistema de juegos
```

## 🔧 Tecnologías

| Tecnología | Versión | Propósito |
|-----------|--------|----------|
| Baileys | 6.7.21 | Biblioteca WhatsApp |
| Node.js | 18+ | Tiempo de ejecución |
| axios | 1.4.0 | Peticiones HTTP |
| ffmpeg | - | Procesamiento de medios |

## 📞 Soporte

- Canal oficial: [WhatsApp](https://chat.whatsapp.com/Jd7WKQBsAhkCG4k1SPxK7r)
- Web: [naufrabot.com](https://naufrabot.com)
- YouTube: [@naufrazapp_bots](https://youtube.com/@naufrazapp_bots)

## 📝 Historial de Versiones

| Versión | Fecha | Cambios |
|--------|-------|---------|
| 1.0.0 | 2026 | Versión inicial documentada |

---

*Documentación generada para WhatsAppBot*