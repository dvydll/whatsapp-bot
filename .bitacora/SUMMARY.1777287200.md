---
title: Specs Granulares - Análisis Detallado de Features
description: Extracción de especificaciones granulares de cada feature del bot (con behaviors, inputs, outputs, validaciones)
summary: |
  Se extrajeron las especificaciones completas de 10 sistemas principales:
  1) Conexión/Autenticación (pairing code, reconexión)
  2) Registro de usuarios (funciones, estructura)
  3) Economía (addkoin, delkoin, XP, niveles)
  4) Juegos (minería/daily/ruleta/tragamondas/pesca con cooldowns y probabilidades)
  5) Gestión de grupos (welcome/antilink/kick/modoadmin/grupo)
  6) Descargas (YouTube/TikTok/FB/Instagram/Pinterest)
  7) Sticker/media (crear sticker, attp, convertir)
  8) Información (menu, perfil, infobot)
  9) Permisos (owner, admin, registro)
  10) Anti-privado y Bot On/Off
  
  Cada spec incluye: trigger, flujo, validaciones, pre/post condiciones, archivos.
createdAt: 2026-04-27T19:30:00Z
tags:
  - specs
  - analysis
  - backend
  - features
author: dvyd
metadata:
  specsCreated: 10
  linesDocumented: 2000+
---

## Contexto

Continuación del análisis para extraer comportamiento detallado de cada comando.

## EspecificacionesCreadas

### 1. Sistema de Conexión y Autenticación
- Pairing code de 8 dígitos
- useMultiFileAuthState
- Reconexión automática
- Guardado de credenciales en ./session/

### 2. Sistema de Registro de Usuarios
- addReg sender, nombre
- checkOfReg (busqueda lineal O(n))
- Estructura en registros.json

### 3. Sistema de Economía
- addkoin/delkoin (modifican directo JSON)
- MoneyOfSender
- addXp, addLevel, nivel progression

### 4. Juegos
- .minar: 24h cooldown, ₹5-10 random
- .daily: 24h, ₹1 + 5 XP
- .ruleta: 24h, apuesta ≤5, 50% win
- .tragamondas: 8h, 60% win概率
- .pescar: 8h, 6 resultados posibles

### 5. Gestión de Grupos
- .welcome: isGroup + isAdmin + botAdmin
- .antilink: isGroup + isAdmin
- .kick: isGroup + isAdmin + botAdmin
- .modoadmin: solo admins usan bot
- .grupo abrir/cerrar: cambiar a announcement

### 6. Descargas
- API externa api.naufrabot.com
- .play/.playvideo: YouTube
- .tiktok: TikTok
- .fb: Facebook
- .instagram
- .pinterest

### 7. Sticker
- .sticker:1 coin, convertir imagen/video
- .attp: API, texto a sticker
- .toimg: sticker → imagen
- .amp3: video → audio

### 8. Información
- .menu: grupo + registro
- .infobot: grupo
- .perfil: registro

### 9. Permisos
- isOwner: numerodono.includes
- isGroup: remoteJid.endsWith('@g.us')
- isGroupAdmins: groupAdmins.includes
- isReg: checkOfReg()

### 10. Anti-Privado y Bot On/Off
- .antipv: bloquear DM
- .boton/.botoff: estado global
- .rvisu: revelar view-once

## Observaciones

- Sin validación de saldo suficiente en delkoin (puede quedar negativo)
- Cooldown se verifica en memoria (se resetea al reiniciar)
- API externa puede fallar (sin fallback robusto)
- isGroupAdmins usa comparación con includes (podría falsear)

## Siguientes Pasos

1. Agregar tests unitarios para funciones de economía
2. Implementar persistencia de cooldowns en JSON
3. Agregar validación de saldo antes de debitar
4. Refactorizar index.js por módulos