---
title: WAB-1: Fix dependencias y Zod 4.x API
description: Corregir versiones y compatibilidad Zod 4.x
summary: |
  Estado después de las correcciones:
  - @types/node: ^25.6.0 → ^22.9.0
  - tsconfig.json: eliminado baseUrl (deprecated)
  - env.ts: adaptado a Zod 4.x API (z.enum, error.issues)
  - tests: corregidos para Zod 4.x
  - Build: ✅ pnpm build pasa
  - Tests: ✅ 33 tests pasando
createdAt: 2026-04-27T19:35:00Z
tags:
  - refactor
  - WAB-1
  - dependencies
  - fix
  - zod
author: dvyd
metadata:
  branch: refactor/WAB-1
  nodeVersion: v24.13.0
---

## Estado Actual

###Paquetes Instalados (post-fix)

| Paquete | Versión | Estado |
|--------|---------|--------|
| baileys | 7.0.0-rc.9 | ✅ |
| pino | 10.3.1 | ✅ |
| zod | 4.3.6 | ✅ |
| @biomejs/biome | 2.4.13 | ✅ |
| @types/node | 22.19.17 | ✅ |
| pino-pretty | 13.1.3 | ✅ |
| tsx | 4.21.0 | ✅ |
| typescript | 6.0.3 | ✅ |
| vitest | 4.1.5 | ✅ |

### Cambios Realizados

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | package.json | @types/node: ^22.9.0 |
| 2 | tsconfig.json | Eliminado baseUrl y paths |
| 3 | src/config/env.ts | Adaptado a Zod 4.x API |
| 4 | tests/unit/env.test.ts | error.errors → error.issues |

### Errors Corregidos

| # | Error | Solución |
|---|-------|---------|
| 1 | baseUrl deprecated in TS 7.0 | Eliminar de tsconfig.json |
| 2 | ERR_PACKAGE_PATH_NOT_EXPORTED | Reinstalar con pnpm |
| 3 | Zod 4.x z.enum API | Usar objeto { key: value } |
| 4 | Zod 4.x error.errors | Cambiar a error.issues |

## Resultado

- [x] Build: `pnpm build` pasa ✅
- [x] Tests: 33/33 pasando ✅
- [x] node_modules sincronizado ✅

## Siguientes Pasos

- [ ] Commits de los cambios
- [ ] Continuar con implementación de Baileys