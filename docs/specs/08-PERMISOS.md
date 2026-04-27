# SPEC: Permisos y Control de Acceso

> **Versión**: 1.0.0  
> **Última actualización**: 2026-04-27  
> **Estado**: ✅ Completado

---

## 1. Descripción General

| Atributo | Valor |
|---------|-------|
| Módulo | Permisos |
| Archivo principal | `index.js` |

---

## 2. Niveles de Permiso

| Nivel | Descripción | Verificación |
|-------|-----------|------------|
| Owner | Dueño del bot | `isOwner` |
| Admin | Admin del grupo | `isGroupAdmins` |
| Registrado | Usuario registrado | `isReg` |
| Grupo | En grupo de WhatsApp | `isGroup` |
| Público | Cualquiera | Sin verificación |

---

## 3. Verificaciones

### 3.1 isOwner

```javascript
// index.js:263-265, 310
const numerodono = ["519xxxxxxxxx@lid"];
const isOwner = numerodono.includes(sender);
```

### 3.2 isGroup

```javascript
// index.js:278
const isGroup = info.key.remoteJid.endsWith('@g.us');
```

### 3.3 isGroupAdmins

```javascript
// index.js:313
const isGroupAdmins = groupAdmins.some(admin => admin.id?.includes(sender));
```

### 3.4 isReg

```javascript
// index.js:347
const isReg = checkOfReg(sender);
```

### 3.5 isBotGroupAdmins

```javascript
// index.js:314
const isBotGroupAdmins = esAdminFlexible(sock, groupAdmins.map(p => p.id));

// Función flexibles (líneas 316-335)
function esAdminFlexible(sock, listaDeAdmins) {
  const botId = sock.authState.creds.me.id;   // ej: 51916525000:26@lid
  const botLid = sock.authState.creds.me.lid;  // ej: 51916525000@lid
  
  return listaDeAdmins.some(adminJid => {
    // Compara con y sin :26
    return adminJid === botId || 
           adminJid === botLid ||
           adminJid === botId.replace(/:\d+/, '') ||
           adminJid === botLid.replace(/:\d+/, '')
  });
}
```

---

## 4. Bot On/Off

### 4.1 Verificación Global

```javascript
// index.js:603
if (!botActivo && !isOwner) return;
```

### 4.2 Encender (.boton)

```
PERMISO: isOwner
ARCHIVO: settings/estadoBot.json
ESTADO: activo = true
```

### 4.3 Apagar (.botoff)

```
PERMISO: isOwner
ARCHIVO: settings/estadoBot.json
ESTADO: activo = false
```

---

## 5. Anti-Privado

### 5.1 Activar (.antipv)

```
PERMISO: isOwner
ARGUMENTO: on/off
ARCHIVO: settings/Grupo/Json/chat.json
```

### 5.2 Efecto

```javascript
// index.js:595-597
if (isAntipv && !isGroup && !isOwner) {
  sock.updateBlockStatus(sender, 'block');
}
```

---

## 6. Modo Admin (.modoadmin)

```
PERMISO: isGroupAdmins
EFECTO: Solo admins usan el bot
CHECK: isModoAdmin && !isGroupAdmins → BLOQUEAR
```

---

## 7. Mensajes de Respuesta

| Código | Mensaje |
|--------|---------|
| `admin` | "『 🚫 No eres admin 』" |
| `botadmin` | "『 El bot debe ser admin 』" |
| `grupos` | "『 Comando solo grupos 』" |
| `vacio` | "『 Escribe algo 』" |
| `miowner` | "『 No eres mi creador 』" |
| `registro` | "『 Primero registrare 』" |

---

## 8. Tabla de Permisos por Comando

| Comando | Owner | Admin | Registro | Grupo |
|---------|-------|-------|----------|-------|
| .boton/.botoff | ✅ | ❌ | ❌ | ❌ |
| .antipv | ✅ | ❌ | ❌ | ❌ |
| .bangp | ✅ | ❌ | ❌ | ❌ |
| .welcome | ❌ | ✅ | ❌ | ✅ |
| .antilink | ❌ | ✅ | ❌ | ✅ |
| .kick | ❌ | ✅ | ❌ | ✅ |
| .todos | ❌ | ✅ | ✅ | ✅ |
| .menu | ❌ | ❌ | ✅ | ✅ |
| .perfil | ❌ | ❌ | ✅ | ❌ |
| .play | ❌ | ❌ | ✅ | ❌ |

---

## 9. Referencias

- Index: `index.js:278-372`, `index.js:592-604`, `index.js:673-709`

---

*Documento generado automáticamente - 2026*