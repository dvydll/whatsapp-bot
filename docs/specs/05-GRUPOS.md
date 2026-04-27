# SPEC: Gestión de Grupos

> **Versión**: 1.0.0  
> **Última actualización**: 2026-04-27  
> **Estado**: ✅ Completado

---

## 1. Descripción General

| Atributo | Valor |
|---------|-------|
| Módulo | Gestión de Grupos |
| Archivo principal | `index.js` |
| Prefijos | `settings/Grupo/Json/` |

---

## 2. Bienvenidas (.welcome)

**Comando**: `index.js:1001`

**Trigger**: `.welcome 1` o `.welcome 0`

```
FLUJO:
  1. Verificar isGroup
     → NO: "solo grupos" → FIN
  2. Verificar isGroupAdmins
     → NO: "no eres admin" → FIN
  3. Verificar isBotGroupAdmins
     → NO: "bot necesita admin" → FIN
  4. SEGÚN args[0]:
     - "1": agregar a welkom.json
     - "0": remover de welkom.json
  5. Guardar JSON
  6. Enviar confirmación
```

| Param | Valores | Descripción |
|-------|---------|-------------|
| `args[0]` | `1` | Activar |
| `args[0]` | `0` | Desactivar |

| Archivo | Contenido |
|---------|------------|
| `settings/Grupo/Json/welkom.json` | Array de JIDs |

### 2.1 Mensaje de Bienvenida

```javascript
// index.js:202-219
const sol = `
✦━─⌬༓༒༓⌬─━✦
*✧ Bienvenido/a ✦✧*
💌 「 Hola @${num} bienvenido/a al grupo ${grup} 」
📜 Recuerda las reglas
『 👥 Miembros: ${mem} 』
✦━─⌬༓༒༓⌬─━✦
`
```

**Evento**: `group-participants.update` → `action === 'add'`

---

## 3. Anti-Link (.antilink)

**Comando**: `index.js:1173`

**Trigger**: `.antilink 1` o `.antilink 0`

```
FLUJO:
  1. Verificar isGroupAdmins
  2. Verificar isBotGroupAdmins
  3. SEGÚN args[0]:
     - "1": activar antilink
     - "0": desactivar antilink
  4. Guardar JSON
  5. Enviar confirmación
```

| Archivo | Contenido |
|---------|------------|
| `settings/Grupo/Json/antilink.json` | Array de JIDs |

### 3.1 Detección de Link

```javascript
// La detección está implementada en el handler de mensajes
// Cuando el bot detecta URL en mensaje de no-admin:
if (isAntiLink && !isGroupAdmins) {
  // Eliminar mensaje
  // Opcional: kick al usuario
}
```

---

## 4. Kick/Ban (.kick)

**Comando**: `index.js:1153`

**Trigger**: `.kick @usuario`

```
FLUJO:
  1. Verificar isGroup
  2. Verificar isGroupAdmins  
  3. Verificar isBotGroupAdmins
  4. Obtener mencionado
  5. SI no mencionado → error
  6. SI mencionado = bot/owner → bloquear
  7. Ejecutar kick:
     await sock.groupParticipantsUpdate(from, [mencionado], 'remove')
  8. Enviar confirmación
```

### 4.1 Obtener Mencionado

```javascript
function obtenerMencionado(info) {
  // 1. Buscar en contextInfo.mentionedJid
  // 2. SI no, buscar en contextInfo.participant
  // 3. Retornar JID o null
}
```

---

## 5. Modo Admin (.modoadmin)

**Comando**: `index.js:1092`

**Trigger**: `.modoadmin 1` o `.modoadmin 0`

```
EFECTO:
  - Cuando activo: solo admins del grupo pueden usar el bot
  - Check: isModoAdmin && !isGroupAdmins → BLOQUEAR
```

| Archivo | Contenido |
|---------|------------|
| `settings/Grupo/Json/modo_admin.json` | Array de JIDs |

---

## 6. Abrir/Cerrar Grupo (.grupo)

**Comando**: `index.js:1197`

**Trigger**: `.grupo abrir` / `.grupo cerrar`

```
FLUJO:
  1. Verificar isGroup
  2. Verificar isGroupAdmins
  3. Verificar isBotGroupAdmins
  4. SEGÚN args[0]:
     - "abrir": 'not_announcement'
     - "cerrar": 'announcement'
  5. Ejecutar:
     await sock.groupSettingUpdate(from, modo)
  6. Enviar confirmación
```

| Modo | Constante WhatsApp |
|------|------------------|
| Abierto | `not_announcement` |
| Cerrado | `announcement` |

---

## 7. Mencionar a Todos (.todos)

**Comando**: `index.js:1053`

**Trigger**: `.todos [mensaje]`

```
FLUJO:
  1. Verificar isReg
  2. Verificar isGroup
  3. Verificar isGroupAdmins
  4. Obtener todos los miembros
  5. Construir mentions
  6. Enviar con menciones
```

---

## 8. Anuncio (.anuncio)

**Comando**: `index.js:1073`

**Trigger**: `.anuncio <texto>`

```
FLUJO:
  1. Verificar isGroup
  2. Verificar isGroupAdmins
  3. Obtener miembros
  4. Construir lista
  5. Enviar con menciones
```

---

## 9. Ban/Unban Grupo

### 9.1 Ban (.bangp)

**Comando**: `index.js:1023`

```
FLUJO:
  1. Verificar isGroup
  2. Verificar isOwner
  3. Agregar a grupo.json
  4. Enviar confirmación
```

### 9.2 Unban (.unbangp)

**Comando**: `index.js:1037`

```
FLUJO:
  1. Verificar isGroup
  2. Verificar isOwner
  3. Remover de grupo.json
  4. Enviar confirmación
```

| Archivo | Contenido |
|---------|------------|
| `settings/Grupo/Json/grupo.json` | JIDs de grupos baneados |

---

## 10. Tabla Resumen

| Comando | Permiso | Bot Admin | Archivo |
|---------|--------|----------|---------|
| `.welcome` | Admin | ✅ | welkom.json |
| `.antilink` | Admin | ❌ | antilink.json |
| `.kick` | Admin | ✅ | - |
| `.modoadmin` | Admin | ❌ | modo_admin.json |
| `.grupo` | Admin | ✅ | - |
| `.todos` | Admin | ❌ | - |
| `.anuncio` | Admin | ❌ | - |
| `.bangp` | Owner | ❌ | grupo.json |

---

## 11. Errores Comunes

| Error | Causa | Solución |
|-------|-------|---------|
| "no eres admin" | Sin permisos | Ser admin del grupo |
| "bot necesita admin" | Bot no es admin | Promover al bot |
| "grupo baneado" | En grupo.json | Usar .unbangp |

---

## 12. Referencias

- Index: `index.js:1001-1237`
- Módulo: `settings/Grupo/Js/reg.js`

---

*Documento generado automáticamente - 2026*