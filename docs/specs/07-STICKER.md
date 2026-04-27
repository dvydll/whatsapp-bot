# SPEC: Sticker y Conversión de Media

> **Versión**: 1.0.0  
> **Estado**: ✅ Completado

---

## 1. Crear Sticker (.s, .sticker)

**Index**: `index.js:1241`  
**Costo**: 1 moneda  
**Requiere**: Registro

```
FLUJO:
  1. Verificar isReg
  2. Verificar coins >= 1
  3. Extraer multimedia del mensaje reply
  4. SI imagen → sendImageAsSticker2
  5. SI video (≤10s) → sendVideoAsSticker2
  6. Descontar 1 moneda
  7. Agregar 1 XP
```

## 2. Sticker con Texto (.attp, .attp2, .attp3)

**Index**: `index.js:1288`  
**Requiere**: Registro + API key

```
GET ${APINAUFRA}/api/${messagesC}?text=${q}&apikey=${KEY}
```

## 3. Sticker → Imagen (.toimg)

**Index**: `index.js:1412`  
**Costo**: 2 monedas  
**Requiere**: Registro

```
FLUJO:
  1. Extraer sticker del reply
  2. Convertir a buffer
  3. Enviar como imagen
  4. Descontar 2 monedas + agregar 3 XP
```

## 4. Video → MP3 (.amp3, .tomp3)

**Index**: `index.js:1400`  
**Costo**: 3 monedas  
**Requiere**: Registro

```
FLUJO:
  1. Extraer video del reply
  2. Convertir a audio
  3. Enviar como audio
  4. Descontar 3 monedas + agregar 6 XP
```

## 5. Emoji Mix (.emojimix)

**Index**: `index.js:1363`  
**Costo**: 1 moneda  
**Requiere**: Registro

```
GET https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&q=${emoji1}_${emoji2}
```

---

**Referencias**: `index.js:1241-1412`, `fuction/sticker/`