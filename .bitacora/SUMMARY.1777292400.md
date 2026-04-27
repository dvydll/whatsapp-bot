---
title: Reorganización Specs en Archivos Individuales
description: Separación de specs en carpeta docs/specs/ con archivos por módulo
summary: |
  Se reorganizaron las specs granulares en archivos individuales dentro de docs/specs/:
  - 01-AUTH.md: Sistema de conexión y autenticación (pairing code, reconexión)
  - 02-REGISTRO.md: Registro de usuarios (addReg, checkOfReg)
  - 03-ECONOMIA.md: Economía (addkoin, delkoin, XP, niveles)
  - 04-JUEGOS.md: Juegos (minería/diario/ruleta/tragamondas/pesca)
  - 05-GRUPOS.md: Gestión (welcome/antilink/kick/modoadmin)
  - 06-DESCARGAS.md: Descargas (YouTube/TikTok/FB/Instagram)
  - 07-STICKER.md: Sticker y conversión media
  - 08-PERMISOS.md: Permisos y control de acceso
  Cada spec incluye: descripción, funcionalidades, flujos,validaciones, errores,diagramas Mermaid.
createdAt: 2026-04-27T20:00:00Z
tags:
  - docs
  - specs
  - reorganization
author: dvyd
metadata:
  specsCreated: 8
---

## Trabajo Realizado

Se reorganizó el documento SPECS.md largo en 8 archivos individuales dentro de `docs/specs/`:

### Archivos Creados

| # | Archivo | Contenido |
|---|--------|----------|
| 01 | [01-AUTH.md](./01-AUTH.md) | Conexión/Autenticación |
| 02 | [02-REGISTRO.md](./02-REGISTRO.md) | Registro usuarios |
| 03 | [03-ECONOMIA.md](./03-ECONOMIA.md) | Economía |
| 04 | [04-JUEGOS.md](./04-JUEGOS.md) | Juegos |
| 05 | [05-GRUPOS.md](./05-GRUPOS.md) | Gestión grupos |
| 06 | [06-DESCARGAS.md](./06-DESCARGAS.md) | Descargas |
| 07 | [07-STICKER.md](./07-STICKER.md) | Sticker/media |
| 08 | [08-PERMISOS.md](./08-PERMISOS.md) | Permisos |

### Formato Estandarizado

Cada spec sigue la estructura:
- Descripción General (módulo, archivos, dependencias)
- Funcionalidades (flujos, validaciones, inputs/outputs)
- Configuración
- Estados
- Errores Comunes
- Diagramas Mermaid
- Referencias

## Siguientes Pasos

1. Agregar specs pendientes (.menu, .infobot)
2. Agregar spec de IA (.gpt)
3. Agregar spec de entretenimiento (.ship)