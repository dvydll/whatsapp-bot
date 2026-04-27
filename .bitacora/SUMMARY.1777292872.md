---
title: "Configuración de entorno con Zod"
description: "Implementación de esquema Zod para validación de variables de entorno con tipos TypeScript, lazy initialization y tests unitarios"
summary: |
  Se implementó la configuración de variables de entorno usando Zod en `src/config/env.ts` con las siguientes características:
  
  - Esquema Zod con validación para 7 variables: BOT_NAME, OWNER_JID, BOT_PREFIX, NAUFRA_KEY, TIMEZONE, LOG_LEVEL, NODE_ENV
  - Validación de formato para OWNER_JID (regex WhatsApp) y BOT_PREFIX (1-5 caracteres)
  - Enum para LOG_LEVEL y NODE_ENV con mensajes de error customizados
  - Lazy singleton pattern para evitar errores en tests (config se inicializa al primer acceso)
  - Proxy para acceso a config como objeto normal
  - Exports: config (readonly), schema, getConfig(), EnvConfig, EnvConfigOptional
  - 18 tests unitarios cubriendo validaciones y casos edge
createdAt: "2026-04-27T13:31:12Z"
tags: ["feat", "backend", "config", "zod", "typescript", "test"]
author: "agent"
metadata:
  files_created:
    - src/config/env.ts
    - src/config/index.ts
    - tests/unit/env.test.ts
  pattern: "lazy-singleton"
  validation: "zod-schema"
---