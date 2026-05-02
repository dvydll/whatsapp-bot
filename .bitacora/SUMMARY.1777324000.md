---
title: Refactorización modular - Inicio del proyecto
description: Crear estructura lib/ y comenzar a organizar index.js sin cambiar comportamiento
summary: |
  Rama refactor/modular creada desde refactor/WAB-1
  - Creada estructura lib/ con handlers/, commands/, systems/, utils/
  - Primeros módulos: time.js, responses.js, connection.js
  - Objetivo: organización gradual sin arquitectura limpia ni cambios de comportamiento
createdAt: 2026-05-02T14:00:00Z
tags:
  - refactor
  - modular
  - index.js
  - lib
author: dvyd
metadata:
  branch: refactor/modular
  commit: ef14a70
---

## Inicio del proyecto de refactorización

### Contexto

El proyecto tenía dos bots funcionando en paralelo:
- `index.js` (~2700 líneas) - funcionando
- `src/` (TypeScript con Clean Architecture) - con bugs

El usuario decidió:
1. NO arreglar el código nuevo con bugs
2. En cambio, organizar gradualmente `index.js` moviendo funcionalidad a módulos

### Decisiones tomadas

| Decisión | Razón |
|----------|-------|
| No usar Clean Architecture | Sobreingeniería para un bot que ya funciona |
| No usar TypeScript | Mantener compatibilidad simple |
| No agregar env variables | Mantener lo que funciona |
| Mover código sin cambiar comportamiento | HITL (Human In The Loop) - validar en cada paso |
| Formato convencional commits | Mantener consistencia |

### Próximos pasos

- Integrar módulos uno a uno en index.js
- Testear cada integración
- Commit por cada módulo funcional

##bitacora/entries/modular-refactor