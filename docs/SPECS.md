# 📋 SPECS.md - Especificaciones Granulares

> Especificaciones detalladas de comportamiento de cada feature del sistema  
> Fecha: 2026-04-27  
> Versión: 1.0.0

---

## Índice de Contents

1. [Sistema de Conexión y Autenticación](#1-sistema-de-conexión-y-autenticación)
2. [Sistema de Registro de Usuarios](#2-sistema-de-registro-de-usuarios)
3. [Sistema de Economía](#3-sistema-de-economía)
4. [Sistema de Juegos](#4-sistema-de-juegos)
5. [Gestión de Grupos](#5-gestión-de-grupos)
6. [Comandos de Descarga](#6-comandos-de-descarga)
7. [Sistema de Sticker y Media](#7-sistema-de-sticker-y-media)
8. [Comandos de Información](#8-comandos-de-información)
9. [Permisos y Control de Acceso](#9-permisos-y-control-de-acceso)
10. [Sistema de Anti-Privado](#10-sistema-de-anti-privado)

---

## 1. Sistema de Conexión y Autenticación

### 1.1 Inicio del Bot

**Archivo**: `index.js` líneas 115-180

**Comportamiento**:

| Paso | Acción                           | Condición                            |
| ---- | -------------------------------- | ------------------------------------ |
| 1    | Limpiar consola                  | Always                               |
| 2    | Mostrar banner ASCII             | Always                               |
| 3    | Cargar credenciales de sesión    | `useMultiFileAuthState("./session")` |
| 4    | Obtener versión de Baileys       | `fetchLatestBaileysVersion()`        |
| 5    | Crear WebSocket con makeWASocket | Always                               |
| 6    | Verificar si hay sesión previa   | `sock.authState.creds.registered`    |

### 1.2 Vinculación (Pairing Code)

**Comportamiento**:

```
CUANDO no hay sesión registrada (authenticated === false):
  1. Solicitar número de WhatsApp con código de país
  2. Validar que solo contenga números
  3. Solicitar código de vinculación
  4. Mostrar código de 8 dígitos en consola
  
ERRORES MANEJADOS:
  - Número vacío → "Número inválido"
  - Error en generación → Mostrar error
```

**Inputs**:
- Número de teléfono con código de país (ej: 519999999999)

**Outputs**:
- Código de vinculación de 8 dígitos

### 1.3 Reconexión Automática

**Comportamiento**:

```
CUANDO connection === "close":
  1. Obtener código de desconexión
  2. SI reason === DisconnectReason.loggedOut:
     - Mostrar mensaje de sesión cerrada
     - Indicar borrar carpeta session
  3. SI NO:
     - Mostrar "Reconnecting..."
     - Llamar startProo() recursivamente
  
CUANDO connection === "open":
  1. Mostrar "Conectado exitosamente"
  2. Crear carpeta tmp
```

### 1.4 Guardado de Credenciales

**Comportamiento**:
- Escuchar evento `creds.update`
- Llamar `saveCreds()` en cada actualización
- Persistir en `./session/`

---

## 2. Sistema de Registro de Usuarios

### 2.1 Registro (.reg, .registrarme)

**Comando**: `case 'reg'` (línea 1683)

**Archivo**: `settings/Grupo/Js/reg.js`

**Trigger**: Usuario envía `.reg` o `.registrarme`

**Flujo**:

```
1. Verificar si ya está registrado (checkOfReg)
   → SI: Enviar "Ya estás registrado" y terminar
   
2. Crear registro con valores por defecto:
   {
     id: sender,           // JID del usuario
     nombre: pushname,    // Nombre de WhatsApp
     nivel: 1,
     xp: 1,
     rxp: 0,
     dinero: 50,         // Monedas iniciales
     rep: 0
   }
   
3. Guardar en registros.json
4. Enviar mensaje de bienvenida con 50 Rupias
```

**Precondiciones**:
- Ninguna (público)

**Postcondiciones**:
- Usuario agregado a `registros.json`
- Recibe 50 monedas iniciales

**Mensaje de Respuesta**:
```
╔══════◇◆◇══════╗
💬 ❝ 𝑅𝑒𝑔𝑖𝑠𝑡𝑟𝑜 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑎𝑑𝑜 *{nombre}* 🥳
🪙𝑅𝑒𝑐𝑖𝑏𝑖𝑠𝑡𝑒 *₹50 Rupias* 🪙 𝑐𝑜𝑚𝑜 𝑅𝑒𝑔𝑎𝑙𝑜 𝑑𝑒 𝐵𝑖𝑒𝑛𝑣𝑒𝑛����𝑑𝑎
╚══════◇◆◇══════╝
```

### 2.2 Verificación de Registro (checkOfReg)

**Función**: `reg.js` líneas 24-32

**Comportamiento**:
```javascript
function checkOfReg(sender) {
  // Itera sobre registro
  // Retorna true si encuentra sender en algún registro[i].id
  // Retorna false si no encuentra
}
```

**Complejidad**: O(n) donde n = número de usuarios registrados

---

## 3. Sistema de Economía

### 3.1 Estructura de Monedas

**Archivo**: `settings/Grupo/Json/registros.json`

**Ejemplo**:
```json
[
  {
    "id": "519999999999@s.whatsapp.net",
    "nombre": "Usuario",
    "nivel": 1,
    "xp": 1,
    "rxp": 0,
    "dinero": 50,
    "rep": 0
  }
]
```

### 3.2 Agregar Monedas (addkoin)

**Función**: `reg.js` líneas 60-71

**Comportamiento**:
```javascript
function addkoin(sender, monto) {
  1. Buscar posición del usuario en registro
  2. SI existe: registro[position].dinero += monto
  3. Escribir archivo JSON
}
```

### 3.3 Deducir Monedas (delkoin)

**Función**: `reg.js` líneas 47-58

**Comportamiento**:
```javascript
function delkoin(sender, monto) {
  1. Buscar posición del usuario
  2. SI existe: registro[position].dinero -= monto
  3. Escribir archivo JSON
}
```

**Nota**: No verifica si saldo es suficiente (puede quedar negativo)

### 3.4 Obtener Saldo (MoneyOfSender)

**Función**: `reg.js` líneas 73-83

**Retorna**:
- Dinero del usuario si existe
- `undefined` si no existe

### 3.5 Sistema de XP y Niveles

**Agregar XP** (`addXp`): línea 138-149
- `registro[position].xp += monto`

**Obtener XP** (`xpOfsender`): línea 163-173
- Retorna XP actual del usuario

**Level Up** (`addLevel`): línea 125-136
- `registro[position].nivel += monto`

**Obtener Nivel** (`levelOfsender`): línea 151-161
- Retorna nivel actual

**Progresión de Niveles**:
| Nivel | Rango    | XP Acumulada Requerida |
| ----- | -------- | ---------------------- |
| 1-5   | Novato   | 0-5000                 |
| 6-10  | Bronce   | 5000-11000             |
| 11-15 | Plata    | 11000-21000            |
| 16-20 | Oro      | 21000-35000            |
| 21-25 | Platino  | 35000-55000            |
| 26-30 | Diamante | 55000-80000            |

---

## 4. Sistema de Juegos

### 4.1 Minería (.minar)

**Trigger**: `.minar`

**Cooldown**: 24 horas (86400000 ms)

**Ubicación**: `index.js` línea 1726

**Flujo**:

```
1. Verificar registro (isReg)
   → NO: Enviar mensaje de registro
   
2. Verificar grupo (isGroup)
   → NO: "solo disponible en grupos"
   
3. Verificar cooldown (checkMinar)
   → SI ACTIVO: Mostrar tiempo restante y terminar
   
4. Si cooldown completado:
   a. Establecer nuevo cooldown de 24h
   b. Generar monto aleatorio (5-10)
   c. Agregar monto a dinheiro
   d. Enviar resultado
```

**Recompensa**: ₹5-10 (aleatorio)

### 4.2 Diario (.daily)

**Trigger**: `.daily`

**Cooldown**: 24 horas

**Ubicación**: `index.js` línea 1656

**Flujo**:

```
1. Verificar registro
2. Verificar grupo
3. Verificar cooldown
4. Si disponible:
   - Agregar 1 moneda
   - Agregar 5 XP
   - Mostrar resultado
```

**Recompensa**: ₹1 + 5 XP

### 4.3 Ruleta (.ruleta)

**Trigger**: `.ruleta <apuesta>`

**Cooldown**: 24 horas

**Ubicación**: `index.js` línea 1755

**Parámetros**:
- `<apuesta>`: Número de monedas a apostatar (máx 5)

**Validaciones**:
```
1. SI no hay args → "Indique un monto"
2. SI no registrado → mensaje registro
3. SI monto no es número → "monto válido"
4. SI monto > saldo → "No tienes suficiente"
5. SI monto > 5 → "No debe ser mayor a 5"
6. SI cooldown activo → mostrar tiempo
```

**Lógica**:
```
- 50% probabilidad de ganar (Math.random() < 0.5)
- SI gana: agregar monto apostado
- SI pierde: descontar monto
```

**Recompensa/Pérdida**: ±₹1-5

### 4.4 Tragamondas (.tragamondas)

**Trigger**: `.tragamondas`

**Cooldown**: 8 horas

**Ubicación**: `index.js` línea 1563

**Costo**: 1 moneda

**Flujo**:
```
1. Verificar registro
2. Verificar coins >= 1
3. Verificar cooldown (8h)
4. Generar 3 símbolos x 3 filas
   - 60% probabilidad de línea centro igual
5. SI línea centro赢得:
   - 50% probabilidad: recibir coins (5-10)
   - 50% probabilidad: recibir XP (5-10)
6. SI pierde: solo mensaje
```

**Recompensa**: ₹5-10 o XP 5-10

### 4.5 Pesca (.pescar)

**Trigger**: `.pescar`

**Cooldown**: 8 horas

**Ubicación**: `index.js` línea 1809

**Probabilidades**:
| Resultado | Probabilidad | Recompensa |
| --------- | ------------ | ---------- |
| Delfín    | ~16%         | 20 XP      |
| Pulpo     | ~16%         | ₹8         |
| Pez       | ~16%         | ₹4 + 5 XP  |
| Pez2      | ~16%         | ₹3 + 3 XP  |
| Pez3      | ~16%         | ₹1 + 2 XP  |
| Zapato    | ~16%         | 0          |

**Recompensa máxima**: ₹20 + 20 XP

---

## 5. Gestión de Grupos

### 5.1 Bienvenida (.welcome)

**Trigger**: `.welcome 1` o `.welcome 0`

**Permisos**: Admin de grupo + Bot debe ser admin

**Ubicación**: `index.js` línea 1001

**Archivos**:
- leitura: `settings/Grupo/Json/welkom.json`
- escritura: mismo archivo

**Flujo**:

```
1. Verificar isGroup
   → NO: "comando solo grupos"
   
2. Verificar isGroupAdmins
   → NO: "no eres admin"
   
3. Verificar isBotGroupAdmins  
   → NO: "bot necesita admin"
   
4. SEGÚN args[0]:
   - "1": Activar bienvenidas
     a. Verificar si ya activo → "ya está activado"
     b. Agregar from a welkom
     c. Guardar JSON
     d. Enviar confirmación
   - "0": Desactivar bienvenidas
     a. Verificar si ya inactivo
     b. Removing from welkom
     c. Guardar JSON
     d. Enviar confirmación
   - OTRO: "1 para activar, 0 para desactivar"
```

### 5.2 Anti-Link (.antilink)

**Trigger**: `.antilink 1` o `.antilink 0`

**Permisos**: Admin de grupo

**Ubicación**: `index.js` línea 1173

**Archivos**: `settings/Grupo/Json/antilink.json`

**Flujo**: Mismo que `.welcome`

### 5.3 Kick/Ban (.kick)

**Trigger**: `.kick @usuario`

**Permisos**: Admin de grupo + Bot admin

**Ubicación**: `index.js` línea 1153

**Flujo**:

```
1. Verificar grupo
2. Verificar admin
3. Verificar bot admin
4. Extraer mentioned usuario
5. SI no mentioned → "debes mencionar"
6. SI mentioned es bot/owner → bloquear
7. Ejecutar kick:
   await sock.groupParticipantsUpdate(from, [mentioned], 'remove')
8. Enviar confirmación
```

### 5.4 Modo Admin (.modoadmin)

**Trigger**: `.modoadmin 1` o `.modoadmin 0`

**Permisos**: Admin de grupo

**Ubicación**: `index.js` línea 1092

**Efecto**: Solo admins del grupo pueden usar el bot

### 5.5 Abrir/Cerrar Grupo (.grupo)

**Trigger**: `.grupo abrir` / `.grupo cerrar`

**Permisos**: Admin de grupo

**Ubicación**: `index.js` línea 1197

**Flujo**:

```
1. Verificar grupo
2. Verificar admin
3. Verificar bot admin
4. SEGÚN args[0]:
   - "abrir":Cambiar a 'not_announcement'
   - "cerrar":Cambiar a 'announcement'
5. Enviar confirmación
```

### 5.6 Mencionar a Todos (.todos)

**Trigger**: `.todos [mensaje]`

**Permisos**: Registro + Admin de grupo

**Ubicación**: `index.js` línea 1053

**Flujo**:
```
1. Verificar registro
2. Verificar grupo
3. Verificar admin
4. Iterar sobre groupMembers
5. Construir lista con @menciones
6. Enviar mensaje con menciones
```

---

## 6. Comandos de Descarga

### 6.1 YouTube Audio (.play)

**Trigger**: `.play <texto/link>`

**Requiere**: Registro + API key

**Ubicación**: `index.js` línea 2219

**Flujo**:

```
1. Verificar registro
2. SI no args → "escribe un nombre o link"
3. Construir URL API:
   ${APINAUFRA}/ytinfo?apikey=${NAUFRA_KEY}&url=${query}
4. Obtener info del video
5. SI API responde:
   a. Enviar miniatura con info
   b. Descargar audio:
      ${APINAUFRA}/ytmp3?apikey=${KEY}&url=${enlace}
   c. Enviar audio
6. SI API falla:
   a. Intentar descarga directa
   b. Enviar audio
```

### 6.2 YouTube Video (.playvideo, .ytmp4)

**Trigger**: `.playvideo <texto/link>`

**Ubicación**: `index.js` línea 2102

**Diferencia**: Envía como video (mimetype: video/mp4)

### 6.3 TikTok (.tiktok)

**Trigger**: `.tiktok <link>`

**Ubicación**: `index.js` línea 2318

**URL API**: `${APINAUFRA}/tiktok?apikey=${KEY}&url=${query}`

### 6.4 Facebook (.fb)

**Trigger**: `.fb <link>`

**URL API**: `${APINAUFRA}/fbvideo?apikey=${KEY}&url=${query}`

### 6.5 Instagram (.instagram)

**Trigger**: `.instagram <link>`

**URL API**: `${APINAUFRA}/instagram?apikey=${KEY}&url=${query}`

### 6.6 Pinterest (.pinterest)

**Trigger**: `.pinterest <busqueda>`

**URL API**: `${APINAUFRA}/pinterest-search?apikey=${KEY}&q=${query}`

---

## 7. Sistema de Sticker y Media

### 7.1 Crear Sticker (.s, .sticker)

**Trigger**: `.sticker` (responder a imagen/video)

**Costo**: 1 moneda

**Ubicación**: `index.js` línea 1241

**Flujo**:

```
1. Verificar registro
2. Verificar coins >= 1
3. Extraer multimedia del mensaje:
   - SI reply a imagen: imageMessage
   - SI reply a video: videoMessage
   - SI mensaje direct: imagen/video
4. Verificar video < 10 segundos
5. Convertir a sticker:
   - imagen → sendImageAsSticker2
   - video → sendVideoAsSticker2
6. Agregar metadata (pack, author)
7. Descontar 1 moneda
8. Agregar 1 XP
9. Enviar sticker
```

### 7.2 Sticker con Texto (.attp)

**Trigger**: `.attp <texto>`

**Requiere**: API key + Registro

**Ubicación**: `index.js` línea 1288

**URL API**: `${APINAUFRA}/api/${messagesC}?text=${q}&apikey=${KEY}`

### 7.3 Convertir Video a MP3 (.amp3, .tomp3)

**Trigger**: `.amp3` (responder a video)

**Costo**: 3 monedas

**Ubicación**: `index.js` línea 1400

**Flujo**:

```
1. Verificar registro
2. Verificar reply a video
3. Extraer video del quoted
4. Convertir a audio
5. Enviar como audio
6. Descontar 3 monedas
7. Agregar 6 XP
```

### 7.4 Sticker a Imagen (.toimg)

**Trigger**: `.toimg` (responder a sticker)

**Costo**: 2 monedas

**Ubicación**: `index.js` línea 1412

**Flujo**:

```
1. Verificar registro
2. Verificar reply a sticker
3. Extraer sticker
4. Convertir a imagen
5. Enviar como imagen
6. Descontar 2 monedas
7. Agregar 3 XP
```

---

## 8. Comandos de Información

### 8.1 Menú (.menu)

**Trigger**: `.menu` o `.help`

**Requiere**: Grupo + Registro

**Ubicación**: `index.js` línea 657

**Comportamiento**:
- Llama a función `Menu()` con parámetros
- Envía imagen del menú + caption con menciones

### 8.2 Info Bot (.infobot, .ping)

**Trigger**: `.infobot`

**Requiere**: Grupo

**Ubicación**: `index.js` línea 759

**Muestra**:
- Hora actual
- Fecha
- Nombre del bot
- Prefijo
- Velocidad (latencia)
- Tipo de dispositivo
- Uptime
- Memoria usada
- Nombre del usuario

### 8.3 Perfil (.perfil, .cartera)

**Trigger**: `.perfil`

**Requiere**: Registro

**Ubicación**: `index.js` línea 1520

**Muestra**:
- @jid
- Rango (desde rangos.json)
- Reputación
- Dinero
- Nivel actual y siguiente
- XP actual / XP requerida
- Barra de progreso

---

## 9. Permisos y Control de Acceso

### 9.1 Verificación de Owner

**Ubicación**: `index.js` líneas 263-265, 310

```javascript
const numerodono = ["519xxxxxxxxx@lid"];
const isOwner = numerodono.includes(sender);
```

### 9.2 Verificación de Admin de Grupo

**Ubicación**: `index.js` líneas 278-286, 313

```javascript
const isGroupAdmins = groupAdmins.some(admin => admin.id?.includes(sender));
```

### 9.3 Flag isGroup

**Ubicación**: `index.js` línea 278

```javascript
const isGroup = info.key.remoteJid.endsWith('@g.us')
```

### 9.4 Verificación de Registro

**Ubicación**: línea 347

```javascript
const isReg = checkOfReg(sender);
```

---

## 10. Sistema de Anti-Privado

### 10.1 Activar

**Trigger**: `.antipv on`

**Permisos**: Owner

**Archivo**: `settings/Grupo/Json/chat.json`

**Flujo**:

```
1. Verificar owner
2. Verificar estado actual
3. Agregar "activo" al array
4. Guardar JSON
5. Enviar confirmación
```

### 10.2 Efecto

**Ubicación**: `index.js` líneas 594-597

```javascript
if(isAntipv && !isGroup && !isOwner){
  sock.updateBlockStatus(sender, 'block')
}
```

**Comportamiento**: Bloquea al usuario si envía DM al bot y anti-privado está activo

---

## 11. Sistema de Bot On/Off

### 11.1 Encender

**Trigger**: `.boton`, `.encenderbot`

**Permisos**: Owner

**Ubicación**: `index.js` líneas 673-680

**Archivo**: `settings/estadoBot.json`

### 11.2 Apagar

**Trigger**: `.botoff`, `.apagabot`

**Efecto**: Establece `activo: false`

### 11.3 Verificación Global

**Ubicación**: `index.js` línea 603

```javascript
if (!botActivo && !isOwner) return
```

**Comportamiento**: Si bot está apagado, solo el owner puede usarlo

---

## 12. Revelar View-Once (.rvisu)

**Trigger**: `.rvisu` (responder a imagen/video)

**Permisos**: Owner

**Ubicación**: `index.js` línea 713

**Flujo**:

```
1. Verificar owner
2. Extraer multimedia:
   - SI video: viewVideo
   - SI imagen: viewImage
3. Establecer viewOnce = false
4. Modificar caption
5. Reenviar sin view-once
```

## 14. Referencias Individuales

> Las especificaciones detalladas se encuentran en la carpeta `docs/specs/`:

| # | Archivo | Módulo |
|---|--------|--------|
| 01 | [specs/01-AUTH.md](./specs/01-AUTH.md) | Conexión y Autenticación |
| 02 | [specs/02-REGISTRO.md](./specs/02-REGISTRO.md) | Registro de Usuarios |
| 03 | [specs/03-ECONOMIA.md](./specs/03-ECONOMIA.md) | Sistema de Economía |
| 04 | [specs/04-JUEGOS.md](./specs/04-JUEGOS.md) | Juegos RPG |
| 05 | [specs/05-GRUPOS.md](./specs/05-GRUPOS.md) | Gestión de Grupos |
| 06 | [specs/06-DESCARGAS.md](./specs/06-DESCARGAS.md) | Descargas |
| 07 | [specs/07-STICKER.md](./specs/07-STICKER.md) | Sticker y Media |
| 08 | [specs/08-PERMISOS.md](./specs/08-PERMISOS.md) | Permisos y Control |

---

*Especificaciones granulares generadas para NaufraBot V3 - 2026*