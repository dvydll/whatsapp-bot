---
title: Refactor modular - Fase 1 completada
description: Arquitectura separada en módulos: instance, connect, events, message-handler, commands registry
summary: Se ha restructurado completamente index.js de ~2000 líneas a ~38 líneas. Se crearon módulos separados para: lib/instance.js (creación del socket Baileys), lib/connect.js (vinculación), lib/events.js (bind de los 4 eventos), lib/message-handler.js (parser y router de mensajes), lib/commands/ con registry, group, economy y tools. El switch de comandos se migró a un sistema de registry donde cada comando es un módulo exportable.
createdAt: 2026-05-07T00:00:00Z
tags: [refactor, architecture, feat, commands]
author: architect-agent
metadata:
  branch: refactor/modular-architecture
  lines_before: 1991
  lines_after: 38
  modules_created: 9
  commands_migrated: ~50
---

## Contexto
El archivo index.js había crecido hasta ~2000 líneas con tres responsabilidades entrelazadas: creación de sesión, manejo de eventos y un switch de +50 comandos. El objetivo era reducir complejidad y hacer el código mantenible.

## Trabajo Realizado
1. **Creado lib/instance.js** - Factory del socket Baileys con auth multi-file
2. **Creado lib/connect.js** - Solicitud de código de vinculación (pairing code)
3. **Creado lib/events.js** - Bind centralizado de los 4 eventos
4. **Creado lib/message-handler.js** - Parser de mensajes y router de comandos
5. **Creado lib/commands/registry.js** - Sistema de registro de comandos
6. **Creado lib/commands/group.js** - Comandos de grupo (welcome, kick, antilink, etc.)
7. **Creado lib/commands/economy.js** - Comandos de perfil, registro, rankings, tienda
8. **Creado lib/commands/tools.js** - Herramientas (sticker, yt, gpt, emojimix)
9. **Creado lib/commands/index.js** - Barrel export que registra todos los comandos
10. **Refactorizado index.js** - Ahora solo orquesta los 4 módulos principales

## Decisiones
- Se optó por un registry simple de funciones (no se implementó patrón Command con inversión de control) para mantenerlo simple y cut-and-paste del código existente
- Cada comando recibe un objeto `ctx` (contexto) con todas las dependencias injectadas
- Se mantienen los comandos existentes en lib/commands/ (config, info, owner, test) para compatibilidad

## Problemas
- Los comandos migrated todavía necesitan ajustes (algunos references a variables no incluidas en ctx)
- La función economy.AddReg está siendo llamada como método estático pero es una función exportada

## Siguientes Pasos
1. Ajustar los comandos migrate para que funcione con el ctx
2. Eliminar código duplicado en lib/whatsapp/sticker/ (v1 vs v2)
3. Unificar funciones M en economy.js
4. Crear comandos de juegos (ruleta, minar, pescar, etc.)
5. Documentar API de los módulos con JSDoc