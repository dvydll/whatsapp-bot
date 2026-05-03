# Plan de Refactorización: Extraer Lógica de index.js

> Extracción de lógica del archivo monolithico index.js (~2642 líneas)  
> Fecha: 2026-05-03  
> Estado: En planificación

---

## Resumen Ejecutivo

El objetivo es **dividir index.js en módulos reutilizables** manteniendo:
- ✅ La funcionalidad intacta
- ✅ Comportamiento sin cambios
- ❌ No refactorizar la lógica de los comandos (solo extraer)

---

## Enfoque de Diseño

| Patrón | Cuándo usarlo |
|--------|---------------|
| **Funciones puras** | Lógica sin estado que solo procesa inputs y retorna outputs |
| **Closures** | Cuando necesitamos mantener contexto (sock, from, info) sin instanciar clase |
| **Clases** | Solo cuando hay lógica con estado que debe persistir entre llamadas |

> **Nota**: El enfoque preferencial es funcional/closures. Clases solo si tiene sentido instanciar algo.

---

## Análisis del Estado Actual

### Estructura de index.js

| Sección | Líneas | Descripción |
|---------|--------|-------------|
| Imports | 1-90 | Módulos externos |
| Configuración | 91-100 | Sesión de WhatsApp |
| Event: connection.update | 148-163 | Manejo de conexión |
| Event: group-participants.update | 173-215 | Bienvenidas |
| Event: messages.upsert | 222-2627 | Handler de mensajes |
| └─ Constantes de mensaje | 250-400 | Parsing de tipos |
| └─ Validaciones | 400-450 | isReg, isGroup, etc. |
| └─ Switch de comandos | 519-2612 | ~40+ comandos |
| └─ Default (antilink) | 2546-2587 | Anti-link |
| Watch file | 2636-2641 | Auto-reinicio |

### Código Repetido Identificado

- `getFileBuffer()` - usado en sticker, toimg, tomp3
- `obtenerMencionado()` - usado en kick, regalar
- `esAdminFlexible()` - usado en isBotGroupAdmins
- `getGroupAdmins()` - usado en Sadm
- Parsing de tipos de mensaje (repetido en varios lugares)
- Lógica de XP/Levels en perfil (repetida parcialmente)

---

## Fases de Refactorización

### FASE A: Utilidades de Mensaje (BAJO RIESGO)

Extraer lógica de parseo y constantes que no depende del contexto del mensaje.

| Módulo | origen → destino | Líneas | Enfoque |
|--------|------------------|--------|---------|
| `message-parser.js` | index.js:228-236 → `lib/whatsapp/` | ~20 | Función pura |
| `message-context.js` | index.js:250-314 → `lib/whatsapp/` | ~70 | Closure factory |

#### Objetivos:
- Extraer `getMessageTypes()`, `getTypeMessage()`, `getQuotedTypes()`
- Extraer constantes de mensaje (type, content, from, sender, etc.)
- Mantener dependencia del evento (no se puede aislar completamente)

#### Criterios de éxito:
- [ ] `node index.js` inicia sin errores
- [ ] Comandos básicos funcionan (menu, ping)
- [ ] Mismos outputs que antes

---

### FASE B: Permisos y Validaciones (BAJO RIESGO)

| Módulo | origen → destino | Líneas | Enfoaje |
|--------|------------------|--------|---------|
| `permissions.js` | index.js:318-346 → `lib/whatsapp/` | ~30 | Funciones puras |

#### Objetivos:
- Extraer `isReg`, `isBanGp`, `isAntiLink`, `isModoAdmin`
- Extraer `esAdminFlexible()`
- Crear factory de permisos que tome el contexto

---

### FASE C: Handlers de Eventos (MEDIO RIESGO)

| Módulo | origen → destino | Enfoaje |
|--------|------------------|---------|
| `group-handler.js` | index.js:173-215 | Closure con sock |
| `error-handler.js` | index.js:2614-2621 | Closure |

#### Objetivos:
- Extraer bienvenidas y despedidas
- Extraer manejo de errores del handler

---

### FASE D: Comando Handlers (MEDIO-ALTO RIESGO)

| Módulo | Descripción | Riesgo |
|--------|-------------|--------|
| `sender.js` | Factory de `enviar()`, `mentions()` | Bajo |
| `commands/owner.js` | Comandos de owner | Medio |
| `commands/groups.js` | Welcome, antilink, modoadmin | Medio |
| `commands/media.js` | Sticker, toimg, tomp3 | Medio |
| `commands/economy.js` | perfil, nivel, ruleta, minar | Alto (mucha lógica) |
| `commands/downloads.js` | play, tiktok, fb, etc. | Medio |

#### Importante:
- Cada comando handler debe recibir las dependencias que necesita
- Mantener la misma firma de función para no romper el switch

---

### FASE E: Utilidades Varias (BAJO RIESGO)

| Módulo | origen | Descripción |
|--------|--------|-------------|
| `download-utils.js` | index.js:419-426 | `getFileBuffer()` |
| `group-utils.js` | index.js:89-96 | `getGroupAdmins()` |
| `mention-utils.js` | index.js:432-446 | `obtenerMencionado()` |

---

## Estructura Objetivo

```
lib/whatsapp/
├── message-parser.js      ← Extraído (Fase A)
├── message-context.js     ← Extraído (Fase A)
├── permissions.js         ← Extraído (Fase B)
├── group-handler.js      ← Extraído (Fase C)
├── error-handler.js       ← Extraído (Fase C)
├── sender.js              ← Factory de envío
├── utils/
│   ├── download-utils.js  ← getFileBuffer
│   ├── group-utils.js    ← getGroupAdmins
│   └── mention-utils.js  ← obtenerMencionado
└── commands/
    ├── owner.js
    ├── groups.js
    ├── media.js
    ├── economy.js
    ├── downloads.js
    └── tools.js
```

---

## Estado de Avance

| Fase | Módulo | Estado | Notas |
|------|--------|--------|-------|
| A | `message-parser.js` | ✅ done | Ya existia (lib/core/types.js) |
| A | `message-context.js` | ✅ done | Ya existia (lib/core/types.js) |
| B | `permissions.js` | ⏳ pending | |
| C | `group-handler.js` | ⏳ pending | |
| C | `error-handler.js` | ⏳ pending | |
| E | `download-utils.js` | ✅ done | Extraido a lib/whatsapp/utils/ |
| E | `group-utils.js` | ✅ done | Extraido a lib/whatsapp/utils/ |
| E | `mention-utils.js` | ✅ done | Extraido a lib/whatsapp/utils/ |
| D | `sender.js` | ⏳ pending | Factory |
| D | `commands/` | ⏳ pending | Todos los comandos |

---

## Protocolo de Validación

Para cada módulo extraído:

1. **Crear módulo** en `lib/whatsapp/`
2. **Actualizar require** en index.js
3. **Probar localmente**: `node index.js`
4. **Testear comando relacionado**
5. **Si todo OK → COMMIT**
6. **Si error → Revertir y analizar**

---

## Historial

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-05-03 | Plan creado | dvyd |

---

*Documento vivo - actualizar según avance*