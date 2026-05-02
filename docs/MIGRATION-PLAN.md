# Plan de Migración: Reorganización de Módulos

> Plan detallado para migrar código de `fuction/` y `Games/` a `lib/`
> Fecha: 2026-05-02
> Estado: En planificación

---

## Resumen Ejecutivo

El objetivo es **eliminar las carpetas `fuction/` y `Games/Js/`** moviendo toda la lógica a `lib/`, manteniendo:
- ✅ La funcionalidad intacta
- ✅ La base de datos JSON (`settings/`, `Games/Json/`, `session/`)
- ❌ Sin cambios de comportamiento

---

## Análisis de Estado Actual

### Carpetas analizadas

| Carpeta | Propósito | ¿Migrar? |
|---------|-----------|----------|
| `session/` | Sesión WhatsApp (creds, keys) | ❌ NO - funciona como DB |
| `settings/` | Configuración y datos de grupos | ❌ NO - funciona como DB |
| `fuction/` | Funciones externas (download, sticker) | ✅ SÍ → `lib/` |
| `Games/Js/` | Lógica de juegos | ✅ SÍ → `lib/` |
| `Games/Json/` | Estado de juegos | ❌ NO - datos JSON |

### Dependencias actuales en `index.js`

```
fuction/download/gets.js    → fetchJson (13 usos), getBuffer (1), fetchBuffer (1)
fuction/sticker/rename.js   → sendImageAsSticker (1), sendVideoAsSticker (1)
fuction/sticker/rename2.js  → sendImageAsSticker2 (2), sendVideoAsSticker2 (2)
fuction/settings/fuctions.js→ getExtension (1), getRandom (1)

settings/Grupo/Js/reg.js    → addXp (15), addkoin/delkoin (22), MoneyOfSender (4), +12 más
settings/Bot/Js/menu.js     → Menu() (1)

Games/Js/claim.js           → timeClaim (3), expiredClaim (2)
Games/Js/mining.js          → checkRuleta, addRuleta (4), checkMinar (4), +8 más
```

### Dead code identificado

- `fuction/sticker/exif.js` - No se usa
- `fuction/sticker/exif2.js` - No se usa
- `settings/User/Js/ind.js` - No se usa

---

## Fases de Migración

### FASE 1: Migrar `fuction/` → `lib/` (BAJO RIESGO)

| Orden | Módulo origen | → Destino en lib/ | Líneas | Dificultad |
|-------|---------------|-------------------|--------|-------------|
| 1 | `fuction/settings/fuctions.js` | `lib/utils-fuctions.js` | ~50 | Fácil |
| 2 | `fuction/download/gets.js` | `lib/download.js` | ~80 | Media |
| 3 | `fuction/sticker/rename.js` | `lib/sticker.js` | ~60 | Media |
| 4 | `fuction/sticker/rename2.js` | `lib/sticker2.js` | ~60 | Media |

#### Pasos para cada submódulo:

```
1. Leer código fuente original (fuction/X)
2. Copiar a lib/X.js (SIN CAMBIOS)
3. Actualizar require en index.js: './fuction/X' → './lib/X'
4. TESTEAR: node index.js + comando relevante
5. COMMIT si OK
```

#### Dead code a eliminar después:
- `fuction/sticker/exif.js`
- `fuction/sticker/exif2.js`

---

### FASE 2: Migrar `Games/` → `lib/` (MEDIO RIESGO)

| Orden | Módulo origen | → Destino en lib/ | Líneas | Dificultad |
|-------|---------------|-------------------|--------|-------------|
| 1 | `Games/Js/claim.js` | `lib/games-claim.js` | ~40 | Fácil |
| 2 | `Games/Js/mining.js` | `lib/games-mining.js` | ~200 | Alta |
| 3 | `settings/Grupo/Js/reg.js` | `lib/economy.js` | ~150 | Alta |

**Nota:** Los JSONs en `Games/Json/` se mantienen - son datos, no lógica.

---

### FASE 3: Consolidar `lib/` (BAJO RIESGO)

#### Estructura objetivo:

```
lib/
├── time.js              ✅ (ya migrado)
├── responses.js         ✅ (ya migrado)
├── types.js            ✅ (ya migrado)
├── config.js           ✅ (ya migrado)
├── helpers.js          ✅ (ya migrado)
├── utils-fuctions.js   ← NUEVO (fuction/settings/)
├── download.js           ← NUEVO (fuction/download/)
├── sticker.js            ← NUEVO (fuction/sticker/)
├── sticker2.js          ← NUEVO (fuction/sticker/)
├── economy.js           ← NUEVO (settings/Grupo/Js/reg.js)
├── games-claim.js       ← NUEVO (Games/Js/claim.js)
├── games-mining.js      ← NUEVO (Games/Js/mining.js)
├── menu.js              ← NUEVO (settings/Bot/)
├── handlers/
│   └── connection.js    ✅ (ya creado)
└── commands/
```

#### Limpieza post-migración:
- ❌ Eliminar `lib/index.js` (barrel que no funciona)
- ❌ Eliminar carpeta `fuction/` (vacía)
- ❌ Eliminar carpeta `Games/Js/` (solo quedan Json)
- ❌ Eliminar `settings/User/Js/ind.js` (dead code)

---

### FASE 4: ADR - SQLite vs JSON (ALTO IMPACTO)

#### Contexto actual:

Las carpetas `settings/` y `Games/Json/` funcionan como una **base de datos simple basada en archivos JSON**:

| Carpeta | "Tabla" | Propósito |
|---------|---------|-----------|
| `session/` | - | Sesión activa de WhatsApp |
| `settings/settings.json` | - | Configuración global |
| `settings/Grupo/Json/` | ~5 archivos | Config por grupo |
| `Games/Json/` | ~3 archivos | Estado de juegos |
| `settings/rangos.json` | - | Niveles y XP |

#### Análisis comparativo:

| Aspecto | JSON actual | SQLite potencial |
|---------|-------------|------------------|
| **Pros** | Simple, no requiere setup | ACID, transacciones, queries complejos |
| **Contras** | Sin transacciones, corrupciones posibles | Dependencia extra, migración necesaria |
| **Riesgo** | Bajo (funciona) | Alto (cambio significativo) |
| **Effort** | - | ~2-3 días |

#### Acciones:
1. Crear `docs/ADR-002-json-to-sqlite.md`
2. Investigar opción SQLite
3. Documentar pros/contras
4. Decidir en equipo
5. NO ejecutar hasta Fase 3 completada

---

## Estado de Migración (Tracking)

| Módulo | Estado | Notas |
|--------|--------|-------|
| `lib/time.js` | ✅ done | |
| `lib/responses.js` | ✅ done | |
| `lib/types.js` | ✅ done | |
| `lib/config.js` | ✅ done | |
| `lib/helpers.js` | ✅ done | |
| `lib/utils-fuctions.js` | ⏳ pending | Fase 1.1 |
| `lib/download.js` | ⏳ pending | Fase 1.2 |
| `lib/sticker.js` | ⏳ pending | Fase 1.3 |
| `lib/sticker2.js` | ⏳ pending | Fase 1.4 |
| `lib/games-claim.js` | ⏳ pending | Fase 2.1 |
| `lib/games-mining.js` | ⏳ pending | Fase 2.2 |
| `lib/economy.js` | ⏳ pending | Fase 2.3 |
| `lib/menu.js` | ⏳ pending | Fase 2.3 |
| ADR SQLite | ⏳ pending | Fase 4 |

---

## Historial

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-05-02 | Plan creado | dvyd |

---

*Documento vivo - actualizar según avance*