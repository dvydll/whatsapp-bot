# ⚙️ CONFIG.md - Guía de Configuración

> Guía completa de configuración de NaufraBot V3  
> Fecha: 2026-04-27

---

## 1. Configuración Inicial

### 1.1 Requisitos del Sistema

| Requisito | Versión Mínima | Notas |
|----------|---------------|-------|
| Node.js | 18+ LTS | Recomendado 20+ |
| npm | 9+ | Incluido con Node.js |
| FFmpeg | Latest | Para procesamiento de medios |

### 1.2 Instalación de Dependencias

```bash
# Clonar el repositorio
git clone https://github.com/NaufraZapp/Naufrabot-base

# Instalar dependencias
npm install

# Instalar FFmpeg (Linux/Termux)
pkg install ffmpeg

# Instalar herramientas adicionales (Termux)
pkg install tesseract
```

---

## 2. Configuración del Bot

### 2.1 Archivo settings.json

Ubicación: `settings/settings.json`

```json
{
  "Bot": "𝑵𝒂𝒖𝒇𝒓𝒂𝑩𝒐𝒕-𝑩𝒂𝒔𝒆",
  "creador": "Naufra",
  "JpgBot": "https://i.postimg.cc/vH5SHVW5/20260316-151443.jpg",
  "owner": "TU_NUMERO@lid",
  "NAUFRA_KEY": "TU_API_KEY"
}
```

| Campo | Descripción | Cómo obtener |
|-------|-------------|-------------|
| `Bot` | Nombre del bot | Editar directamente |
| `creador` | Nombre del creador | Editar directamente |
| `JpgBot` | URL de imagen del menú | Subir a imgur/postimg |
| `owner` | Tu número de WhatsApp | Formato: 5199xxxxxxx@lid |
| `NAUFRA_KEY` | API key de Naufrabot | Registrate en api.naufrabot.com |

### 2.2 Formato del Owner ID

El owner ID debe seguir uno de estos formatos:

```
519xxxxxxxxx@lid       # Formato LID
519xxxxxxxxx@s.whatsapp.net  # Formato antiguo
```

Para convertir tu número:
- País +51 (Perú)
- Ejemplo: 519999999999

---

## 3. Variables de Entorno (Opcional)

### 3.1 Crear archivo .env

Crear archivo `.env` en la raíz del proyecto:

```bash
# Configuración敏感
OWNER=519999999999
NAUFRA_KEY=tu_api_key

# Configuración adicional
BOT_NAME=NaufraBot
TIMEZONE=America/Lima
```

### 3.2 Cargar variables en index.js

Añadir al inicio de `index.js`:

```javascript
require('dotenv').config()
```

---

## 4. Configuración de Grupo

### 4.1 Archivo de Configuración General

Ubicación: `settings/estadoBot.json`

```json
{
  "activo": true
}
```

### 4.2 Configuraciones de Grupos

Los archivos de configuración de grupos están en `settings/Grupo/Json/`:

| Archivo | Función |
|---------|---------|
| `welkom.json` | Grupos con bienvenidas activas |
| `antilink.json` | Grupos con anti-link |
| `modo_admin.json` |Grupros en modo admin |
| `grupo.json` | Grupos baneados |
| `chat.json` | Anti-privado |

Formato JSON (array de JIDs):

```json
["519xxxxxxxxx-xxxxx@g.us"]
```

---

## 5. Configuración de la API

### 5.1 Obtener API Key

1. Visit ar [api.naufrabot.com](https://api.naufrabot.com)
2. Crear una cuenta
3. Obtener tu API key
4. Actualizar `NAUFRA_KEY` en `settings/settings.json`

### 5.2 Verificar API Key

```bash
# En el bot
.miapi
```

---

## 6. Configuración de Prefijos

### 6.1 Editar Prefijos

En `index.js`, línea ~95:

```javascript
const prefixo = ['#','/','•','.','!','?','*']
```

### 6.2 Agregar Nuevo Prefijo

```javascript
const prefixo = ['#','/','•','.','!','?','*','$']
```

---

## 7. Configuración de Zonas Horarias

### 7.1 Zona Horaria del Bot

En `index.js`, línea ~78:

```javascript
const time = moment.tz('America/Lima').format('DD/MM HH:mm:ss')
```

### 7.2 Zonas Disponibles

| Zona | Ciudad |
|------|-------|
| America/Lima | Lima |
| America/Bogota | Bogotá |
| America/Mexico_City | Ciudad de México |
| America/Buenos_Aires | Buenos Aires |
| Europe/Madrid | Madrid |

---

## 8. Configuración de Sessión

### 8.1 Sesión de WhatsApp

La sesión se guarda en la carpeta `./session/`:

```
session/
├── app-state.json
├── creds.json
└── session-id
```

### 8.2 Recargar Sesión

```bash
# Elimujar carpeta session
rm -rf session

# Reiniciar bot
node index.js
```

---

## 9. Personalización del Menú

### 9.1 Imagen del Menú

Cambiar en `settings/settings.json`:

```json
{
  "JpgBot": "URL_DE_TU_IMAGEN"
}
```

### 9.2 Texto del Menú

Editar en `settings/Bot/Js/menu.js`

---

## 10. Configuración de Jogos

### 10.1 Rangos

Editar `settings/rangos.json`:

```json
{
  "1": "🥊Novato I🥊",
  "2": "🥊Novato II🥊",
  "100": "🥒Follador Legendario🥒"
}
```

### 10.2 Cooldowns de Jogos

Los cooldowns están hardcodeados en los archivos de juegos:

| Juego | Archivo | Cooldown |
|------|---------|---------|
| Minería | `Games/Js/mining.js` | 24 horas |
| Diario | `Games/Js/mining.js` | 24 horas |
| Ruleta | `Games/Js/mining.js` | 24 horas |
| Tragamondas | `Games/Js/mining.js` | 8 horas |
| Pesca | `Games/Js/mining.js` | 8 horas |

---

## 11. Configuración Avanzada

### 11.1 Cambiar Número de Teléfono

1. Editar `settings/settings.json`
2. Cambiar campo `owner`
3. Eliminar carpeta `session`
4. Reiniciar el bot

### 11.2 Múltiples Owners

Editar `index.js`, línea ~263:

```javascript
const numerodono = [
  "519999999999@lid",
  "519888888888@lid"  // Agregar más números
];
```

### 11.3 Activar/Desactivar Anti-Link

```bash
# En un grupo donde eres admin
.antilink 1   # Activar
.antilink 0   # Desactivar
```

---

## 12. Configuración de Bienvenidas

### 12.1 Mensaje de Bienvenida

Editar en `index.js`, línea ~202:

```javascript
const sol = `
*✧ Bienvenido @${num} al grupo *
${grup}
`;
```

### 12.2 Imagen de Bienvenida

El URL está hardcodeado en `index.js`, línea ~216:

```javascript
image: { url: "URL_DE_TU_IMAGEN" }
```

---

## 13. Troubleshooting de Configuración

### 13.1 El Bot No Responde

1. Verificar estado: `settings/estadoBot.json`
2. Verificar si está banneado: `settings/Grupo/Json/grupo.json`
3. Revisar logs en consola

### 13.2 Error de Conexión

1. Eliminar carpeta `session`
2. Ejecutar `node index.js` de nuevo
3. Vincular con código de 8 dígitos

### 13.3 API No Funciona

1. Verificar API key: `.miapi`
2. Renovar API key en api.naufrabot.com

---

## 14. Resumen de Archivos de Configuración

| Archivo | Ubicación | Función |
|---------|-----------|---------|
| settings.json | settings/ | Configuración principal |
| estadoBot.json | settings/ | Estado on/off |
| rangos.json | settings/ | Nombres de rangos |
| welkom.json | settings/Grupo/Json/ | Bienvenidas |
| antilink.json | settings/Grupo/Json/ | Anti-link |
| modo_admin.json | settings/Grupo/Json/ | Modo admin |
| grupo.json | settings/Grupo/Json/ | Grupos baneados |
| registros.json | settings/Grupo/Json/ | Usuarios |
| registros.json | Games/Json/ | Datos de juegos |

---

*Guía de configuración generada para NaufraBot V3 - 2026*