# 🔧 TROUBLESHOOTING.md - Solución de Problemas

> Guía de soluciones para problemas comunes en WhatsAppBot  
> Fecha: 2026-04-27

---

## Índice de Contenidos

1. [Problemas de Conexión](#1-problemas-de-conexión)
2. [Problemas de Comandos](#2-problemas-de-comandos)
3. [Problemas de Juegos](#3-problemas-de-juegos)
4. [Problemas de Descarga](#4-problemas-de-descarga)
5. [Problemas de Economía](#5-problemas-de-economía)
6. [Problemas de Grupos](#6-problemas-de-grupos)
7. [Errores de Código](#7-errores-de-código)
8. [Ayuda Adicional](#8-ayuda-adicional)

---

## 1. Problemas de Conexión

### 1.1 El Bot NoSe Conecta

**Síntomas**:
- No aparece el código QR
- No acepta el código de vinculación
- Error de conexión constante

**Soluciones**:

```bash
# 1. Eliminar sesión anterior
rm -rf session

# 2. Reiniciar el bot
node index.js
```

### 1.2 Código QR No Aparece

**Causa**: `printQRInTerminal` está desactivado

**Solución**: Editar `index.js`, línea ~129:

```javascript
printQRInTerminal: true,  // Cambiar a true
```

### 1.3 Error "Session Closed"

**Causa**: Sesión expirada o revocada

**Solución**:

```bash
# Eliminar credenciales
rm -rf session

# Generar nuevo código
node index.js
```

### 1.4 Error de Timeout

**Causa**: Conexión lenta o API no responde

**Solución**:

```javascript
// En index.js, agregar timeout:
const sock = makeWASocket({
  // ... otras opciones
  browser: ["Ubuntu", "Chrome", "20.0.04"],
  browser: ["Ubuntu", "Chrome", "20.0.04"]
});
```

---

## 2. Problemas de Comandos

### 2.1 El Bot No Responde a Comandos

**Verificar**:

1. ¿El bot está activo?
```bash
# Archivo: settings/estadoBot.json
# Debe contener: { "activo": true }
```

2. ¿El grupo está baneado?
```bash
# Revisar settings/Grupo/Json/grupo.json
```

3. ¿Está en modo admin?
```bash
# Revisar settings/Grupo/Json/modo_admin.json
```

### 2.2 "Debes Registrarte" Siempre

**Causa**: Usuario no en registros.json

**Solución**:

```bash
# El usuario debe ejecutar .reg
# O verificar manually:
# 1. Revisar settings/Grupo/Json/registros.json
# 2. Agregar usuario manualmente si es necesario
```

### 2.3 "No Eres Admin" Error

**Causa**: Intentando ejecutar comando sin permisos

**Solución**:

```bash
# Asegurarse de ser admin del grupo
# O ejecutar comando como owner
```

---

## 3. Problemas de Juegos

### 3.1 Cooldown No Funciona

**Síntomas**: "Espere X tiempo" aunque ya pasó

**Solución**: Reiniciar el bot para recargar datos

```bash
# Detener bot (Ctrl+C)
# Reiniciar
node index.js
```

### 3.2 No Gano Monedas

**Causa**: Probabilidad de victoria del 50%

**Solución**: Intentar de nuevo en 24 horas

### 3.3 Minería Da 0 Monedas

**Causa**: Probabilidad aleatoria (5-10)

**Solución**: No hay forma de forzar, es aleatorio

### 3.4 Error en Tragamondas

**Verificar**: Cooldown de 8 horas activo

---

## 4. Problemas de Descarga

### 4.1 "Error Descargando" YouTube

**Causas posibles**:
1. API key inválida
2. Video eliminado
3. Rate limit excedido

**Solución**:

```bash
# 1. Verificar API key
.miapi

# 2. Probar con otro video

# 3. Cambiar API key en settings/settings.json
```

### 4.2 "API Key Inválida"

**Solución**:

1. Obtener nueva API key de api.naufrabot.com
2. Editar `settings/settings.json`:

```json
{
  "NAUFRA_KEY": "TU_NUEVA_KEY"
}
```

### 4.3 Error de TikTok/Instagram

**Causa**: Cambios en las APIs de las plataformas

**Solución**: No hay solución inmediata, esperar actualización

### 4.4 "Error Descargando Archivo"

**Verificar**:
1. Link correcto de MediaFire
2. Archivo no eliminado
3. API key válida

---

## 5. Problemas de Economía

### 5.1 No Puedo Ver Mi Perfil

**Verificar**:
1. Estas registrado: `.reg`
2. El archivo existe: `settings/Grupo/Json/registros.json`

### 5.2 Mi Dinero Es 0

**Causa Normal**: Has gastado todas las monedas

**Solución**: Jugar para ganar más

### 5.3 No Puedo Transferir

**Verificar**:
1. Tienes suficientes monedas
2. El destinatario está registrado
3. No te envías a ti mismo

### 5.4 Level Up No Funciona

**Causa**: No suficiente XP acumulada

**Verificar**: Necesitas XP >= rxp + 1000

---

## 6. Problemas de Grupos

### 6.1 Welcome No Funciona

**Verificar**:

1. ¿Bienvenida activada?
```bash
.welcome 1  # Activar
```

2. ¿El bot es admin?
3. ¿El grupo está en welkom.json?

### 6.2 Anti-Link No Funciona

**Verificar**:

1. ¿Anti-link activado?
```bash
.antilink 1
```

2. ¿El bot es admin?
3. ¿El link detectado contiene http/https?

### 6.3 ".kick" No Funciona

**Verificar**:
1. El bot debe ser admin
2. El usuario no debe ser admin
3. El usuario debe estar en el grupo

### 6.4 ".grupo abrir" No Funciona

**Verificar**: El bot debe ser admin del grupo

---

## 7. Errores de Código

### 7.1 "Cannot Read Property of undefined"

**Causa**: Intentar acceder a propiedad null

**Solución**: Agregar verificaciones:

```javascript
// Antes:
const valor = mensaje.campo.subcampo

// Después:
const valor = mensaje?.campo?.subcampo || "default"
```

### 7.2 "JSON Parse Error"

**Causa**: Archivo JSON corrupto

**Solución**:

```bash
# Reparar archivo JSON
#Abrir archivo y verificar estructura
# Corregir comas faltantes, etc.
```

### 7.3 "File Not Found"

**Causa**: Archivo no existe

**Solución**:

```bash
# Crear archivo vacío
echo "[]" > archivo.json
```

### 7.4 "Maximum Call Stack"

**Causa**: Recursión infinita

**Solución**: Agregar caso base en funciones recursivas

---

## 8. Problemas de Rendimiento

### 8.1 Bot Lento

**Solución**:

1. Reiniciar periódicamente con cron:
```bash
# En start.sh agregar:
# Reiniciar cada 6 horas
```

2. Optimizar comandos lentos

### 8.2 Usa Mucha Memoria

**Solución**:

```javascript
// Agregar limite de cache:
const msgRetryCounterCache = new NodeCache({
  stdTTL: 60,  // 60 segundos
  checkperiod: 10
});
```

---

## 9. Ayuda Adicional

### 9.1 Comandos de Diagnóstico

```bash
# Verificar estado del bot
.infobot

# Verificar API
.miapi

# Verificar registro
.listreg (como admin)
```

### 9.2 Logs de Consola

Para mejor diagnóstico, ver los logs:

1. **Comandos ejecutados**: Logs en consola color verde
2. **Errores**: Logs en rojo
3. **Conexión**: Mensajes de estado

### 9.3 Contacto de Soporte

- **Canal oficial**: [WhatsApp](https://chat.whatsapp.com/Jd7WKQBsAhkCG4k1SPxK7r)
- **Web**: [naufrabot.com](https://naufrabot.com)
- **YouTube**: [@naufrazapp_bots](https://youtube.com/@naufrazapp_bots)

---

## Tabla de Errores Comunes

| Error | Causa | Solución |
|-------|------|---------|
| Session closed | Sesión expirada | Regenerar sesión |
| Not registered | Usuario no registrado | Ejecutar .reg |
| Not admin | Sin permisos | Ser admin |
| API error | API key inválida | Renovar API |
| Cooldown active | Tiempo no cumplido | Esperar |
| No coins | Sin monedas | Jugar para ganar |
| Group only | Comando solo grupos | Usar en grupo |
| Invalid format | Formato incorrecto | Verificar comando |

---

*Guía de troubleshooting generada para WhatsAppBot - 2026*