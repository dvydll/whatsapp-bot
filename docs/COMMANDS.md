# 📜 COMMANDS.md - Listado de Comandos

> Listado completo de comandos disponibles en NaufraBot V3  
> Fecha: 2026-04-27

---

## Índice de Comandos

1. [Comandos Dueño (Owner)](#1-comandos-deeuno-owner)
2. [Comandos de Grupo](#2-comandos-de-grupo)
3. [Comandos de Juegos](#3-comandos-de-juegos)
4. [Comandos de Descarga](#4-comandos-de-descarga)
5. [Comandos de Utilidad](#5-comandos-de-utilidad)
6. [Comandos de Información](#6-comandos-de-información)
7. [Comandos de Sticker](#7-comandos-de-sticker)
8. [Comandos de Economía](#8-comandos-de-economía)

---

## 1. Comandos Dueño (Owner)

> ⚠️ Solo el propietario del bot puede ejecutar estos comandos

| Comando | Alias | Descripción | Permiso |
|---------|------|-------------|--------|
| `.reiniciar` | - | Reinicia el bot | Owner |
| `.boton` | `.encenderbot`, `.botonon` | Enciende el bot | Owner |
| `.botoff` | `.apagabot`, `.offbot` | Apaga el bot | Owner |
| `.bangp` | - | Banea un grupo | Owner |
| `.unbangp` | - | Desbanea un grupo | Owner |
| `.antipv` | `.antiprivado` | Activa/desactiva anti-privado | Owner |

### Ejemplos

```bash
# Encender el bot
.boton

# Apagar el bot
.botoff

# Banear grupo
.bangp

# Anti-privado
.antipv on
.antipv off
```

---

## 2. Comandos de Grupo

> 📢 Requieren permisos de administrador del grupo

| Comando | Alias | Descripción | Permiso |
|---------|------|-------------|--------|
| `.welcome` | `.bienvenida` | Activar/desactivar bienvenidas | Admin |
| `.antilink` | - | Activar/desactivar anti-link | Admin |
| `.modoadmin` | - | Activar/desactivar modo admin | Admin |
| `.grupo` | - | Abrir/cerrar grupo | Admin |
| `.kick` | `.ban`, `.largate` | Expulsar usuario | Admin |
| `.todos` | `.revivir` | Mencionar a todos | Admin |
| `.anuncio` | - | Enviar anuncio a todos | Admin |
| `.notify` | `.hidetag` | Mencionar con texto | Admin |

### Ejemplos

```bash
# Activar bienvenidas
.welcome 1

# Desactivar bienvenidas
.welcome 0

# Activar antilink
.antilink 1

# Abrir grupo
.grupo abrir

# Cerrar grupo
.grupo cerrar

# Expulsar usuario
.kick @usuario

# Mencionar a todos
.todos Hola a todos

# Modo admin (solo admins usan bot)
.modoadmin 1
```

---

## 3. Comandos de Juegos

> 🎮 Requieren registro previo

| Comando | Descripción | Cooldown | Recompensa |
|---------|------------|----------|----------|
| `.minar` | Minería de monedas | 24h | ₹5-10 |
| `.daily` | Recompensa diaria | 24h | ₹1 + 5 XP |
| `.ruleta <apuesta>` | Ruleta rusa | 24h | ₹1-5 (50%) |
| `.tragamondas` | Tragamondas | 8h | ₹5-10 o XP |
| `.pescar` | Pesca marina | 8h | ₹1-20 + XP |
| `.emojimix 😊+😁` | Combinar emojis | - | 1 coin |
| `.tragamuelas` | (otro nombre) | 8h | ₹5-10 |

### Ejemplos

```bash
# Minería
.minar

# Recompensa diaria
.daily

# Ruleta con apuesta de 5 coins
.ruleta 5

# Tragamondas
.tragamondas

# Pescar
.pescar

# Combinar emojis
.emojimix 🔥+💧
```

---

## 4. Comandos de Descarga

> ⬇️ Requieren registro y API key

| Comando | Alias | Descripción | Plataforma |
|---------|------|-------------|------------|
| `.play` | - | Descargar audio | YouTube |
| `.playvideo` | `.ytmp4` | Descargar video | YouTube |
| `.playdoc` | - | Descargar como documento | YouTube |
| `.ytsearch` | - | Buscar en YouTube | YouTube |
| `.fb` | `.facebook` | Descargar video | Facebook |
| `.tiktok` | - | Descargar video | TikTok |
| `.instagram` | - | Descargar video/foto | Instagram |
| `.mediafire` | - | Descargar archivo | MediaFire |
| `.pinterest` | `.pin` | Buscar imagen | Pinterest |

### Ejemplos

```bash
# Descargar audio
.play despacito

# Descargar video
.playvideo song

# Buscar en YouTube
.ytsearch historia de youtube

# Facebook
.fb https://facebook.com/...

# TikTok
.tiktok https://tiktok.com/...

# Instagram
.instagram https://instagram.com/...

# MediaFire
.mediafire https://www.mediafire.com/...

# Pinterest
.pinterest gatitos
```

---

## 5. Comandos de Utilidad

> 🔧 Herramientas varias

| Comando | Alias | Descripción | Requiere |
|---------|------|-------------|----------|
| `.calcular` | `.cal` | Calculadora | Registro |
| `.toimg` | - | Sticker a imagen | Registro |
| `.amp3` | `.tomp3` | Video a audio | Registro |
| `.rvisu` | `.revelarvisu` | Ver view-once | - |

### Ejemplos

```bash
# Calculadora
.cal 4+4

# Convertir sticker a imagen
.toimg (responder a sticker)

# Convertir video a MP3
.amp3 (responder a video)

# Revelar imagen view-once
.rvisu (responder a imagen)
```

---

## 6. Comandos de Información

> ℹ️ Información del bot

| Comando | Alias | Descripción |
|---------|------|-------------|
| `.menu` | `.help` | Menú del bot |
| `.infobot` | `.ping` | Información del bot |
| `.botcompleto` | `.bot` | Info de adquiere |
| `.personalizarbot` | - | Guía de personalización |
| `.comprarapi` | - | Info de compra API |
| `.grupos` | - | Grupo oficial |
| `.serdueño` | `.serowner`, `.owner` | Cómo ser owner |
| `.canal` | `.canales` | Canales oficiales |
| `.serbot` | - | Info para sub-bot |

### Ejemplos

```bash
# Menú
.menu

# Info del bot
.infobot

# Información de compra
.botcompleto

# Grupo oficial
.grupos

# Canales
.canal
```

---

## 7. Comandos de Sticker

> 🎨 Crear y usar stickers

| Comando | Descripción | Costo |
|---------|------------|-------|
| `.sticker` / `.s` | Crear sticker | 1 coin |
| `.attp` | Sticker con texto | API |
| `.attp2` | Sticker v2 | API |
| `.attp3` | Sticker v3 | API |
| `.emojimix` | Sticker emoji | 1 coin |

### Ejemplos

```bash
# Crear sticker (responder a imagen)
.sticker

# Sticker con texto
.attp Hola mundo

# Sticker emoji
.attp2 🔥+💧
```

---

## 8. Comandos de Economía

> 💰 Sistema de economía y niveles

| Comando | Alias | Descripción | Requiere |
|---------|------|-------------|----------|
| `.reg` | `.registrarme` | Registrarse | - |
| `.perfil` | `.cartera`, `.nivel` | Ver perfil | Registro |
| `.levelup` | - | Subir nivel | Registro |
| `.tienda` | - | Tienda de items | Registro |
| `.regalar` | `.tradecoin`, `.enviar` | Transferir coins | Registro |
| `.rank` | `.rankrep` | Ranking reputación | Admin |
| `.rankcoins` | - | Ranking monedas | Admin |
| `.ranknivel` | - | Ranking niveles | Admin |
| `.rep` | `.mirep` | Mi reputación | Registro |
| `.listreg` | - | Lista registrados | - |

### Ejemplos

```bash
# Registrarse
.reg

# Ver perfil
.perfil

# Ver nivel
.nivel

# Level up
.levelup

# Tienda
.tienda

# Transferir coins
.regalar @usuario 100

# Rankings
.rank
.rankcoins
.ranknivel

# Mi reputación
.mirep
```

---

## 9. Comandos de IA

> 🤖 Integraciones con inteligencia artificial

| Comando | Alias | Descripción |
|---------|------|-------------|
| `.gpt` | `.gpt4`, `.chatgpt`, `.ia` | Chat con IA |

### Ejemplos

```bash
# Preguntar a IA
.gpt Hola, cómo estás?
.ia Cuéntame un chiste
```

---

## 10. Comandos de Entretenimiento

> 🎉 Comandos divertimentos

| Comando | Alias | Descripción | Requiere |
|---------|------|-------------|----------|
| `.ship` | - | Calculadora de amor | Registro |
| `emojimix` | - | Combinar emojis | Registro |

### Ejemplos

```bash
# Calcular amor (mencionar 2 personas)
.ship @usuario1 @usuario2

# Combinar emojis
.emojimix 😊+😂
```

---

## Tabla Resumen de Permisos

| Categoría | Registro | Admin Grupo | Owner | Grupo |
|----------|----------|-------------|-------|-------|
| Dueño | ❌ | ❌ | ✅ | ❌ |
| Grupo | ❌ | ✅ | ✅ | ✅ |
| Juegos | ✅ | ✅ | ✅ | ✅ |
| Descarga | ✅ | ✅ | ✅ | ❌ |
| Utilidad | ✅ | ✅ | ✅ | ✅ |
| Información | ✅ | ⚡ | ✅ | ✅ |
| Sticker | ✅ | ✅ | ✅ | ✅ |
| Economía | ✅ | ✅ | ✅ | ⚠️ |
| IA | ✅ | ✅ | ✅ | ❌ |
| Entretenimiento | ✅ | ✅ | ✅ | ✅ |

✅ = Disponible  
❌ = No disponible  
⚡ = Parcial (solo algunos comandos)

---

## Notas

1. **Registro requerido**: La mayoría de comandos requieren que el usuario esté registrado con `.reg`
2. **Grupo necesario**: Algunos comandos solo funcionan en grupos
3. **API key**: Los comandos de descarga requieren API key válida
4. **Cooldown**: Los juegos tienen tiempos de espera entre usos
5. **Monedas**: Algunos comandos cuestan monedas para usar

---

*Listado generado para NaufraBot V3 - 2026*