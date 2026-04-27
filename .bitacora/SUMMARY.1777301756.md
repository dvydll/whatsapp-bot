---
title: WAB-1: Refactor ESM utils y versión dinámica
description: Mover utilidades ESM a shared y usar versión dinámica del package.json
summary: |
  Commit f28f132:
  - Agregado src/shared/utils/esm.ts con utilidades ESM
  - Movido entry point a src/index.ts (desde src/main/)
  - Versión del bot ahora es dinámica desde package.json
  - whatsapp-client.ts usa getESMDirname
  
  Build y tests pasando.
createdAt: 2026-04-27T19:55:56Z
tags:
  - refactor
  - WAB-1
  - esm
author: dvyd
metadata:
  branch: refactor/WAB-1
  commit: f28f132
---

## Estado WAB-1

### Progreso

| # | Tarea | Estado |
|---|-------|--------|
| 1 | TypeScript + Vitest config | ✅ |
| 2 | ES Modules config | ✅ |
| 3 | Docker config | ✅ |
| 4 | Clean Architecture structure | ✅ |
| 5 | src/config/env.ts (Zod) | ✅ |
| 6 | src/infrastructure/logging (Pino) | ✅ |
| 7 | src/index.ts (entry point) | ✅ |
| 8 | WhatsAppClient (Baileys) | ✅ |
| 9 | ESM utils (shared) | ✅ |
| 10 | Dynamic package version | ✅ |

## Notas

- Build: ✅ pnpm build pasa
- Tests: 33/33 pasando