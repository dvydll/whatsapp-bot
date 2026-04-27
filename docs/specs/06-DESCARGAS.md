# SPEC: Comandos de Descarga

> **Versión**: 1.0.0  
> **Última actualización**: 2026-04-27  
> **Estado**: ✅ Completado

---

## 1. Descripción General

| Atributo | Valor |
|---------|-------|
| Módulo | Descargas |
| API externa | `api.naufrabot.com` |
| Requiere | API key + Registro |

---

## 2. YouTube Audio (.play)

**Comando**: `index.js:2219`

**Trigger**: `.play <texto/link>`

**Requiere**: Registro

```
FLUJO:
  1. Verificar isReg
  2. Verificar args
     → NO: "escribe nombre o link"
  3. Construir URL:
     ${APINAUFRA}/ytinfo?apikey=${KEY}&url=${query}
  4. Obtener info video
  5. SI API responde:
     a. Enviar miniatura + info
     b. Descargar audio:
        ${APINAUFRA}/ytmp3?apikey=${KEY}&url=${enlace}
     c. Enviar audio
  6. SI falla:
     a. Intentar descarga directa
     b. Enviar audio
```

### 2.1 Endpoint Info

```
GET ${APINAUFRA}/ytinfo?apikey=${KEY}&url=${url}
```

| Campo | Descripción |
|------|-------------|
| `Estado` | "online" o "offline" |
| `Resultado.Titulo` | Título del video |
| `Resultado.Duracion` | Duración |
| `Resultado.Canal.Nombre` | Nombre del canal |
| `Resultado.Visualizaciones` | Vistas |
| `Resultado.EnlaceYoutube` | URL YouTube |
| `Resultado.EnlaceDescarga` | URL directo |
| `Resultado.Miniatura` | URL thumbnail |

---

## 3. YouTube Video (.playvideo)

**Comando**: `index.js:2102`

**Trigger**: `.playvideo <texto/link>`

**Diferencia**: Envía como video (mimetype: video/mp4)

```javascript
await sock.sendMessage(from, {
  video: { url: videoURL },
  mimetype: 'video/mp4',
  caption: titulo
}, { quoted: info })
```

---

## 4. YouTube Documento (.playdoc)

**Comando**: `index.js:2157`

**Trigger**: `.playdoc <texto/link>`

**Diferencia**: Envía como documento (fileName: titulo.mp4)

```javascript
await sock.sendMessage(from, {
  document: { url: videoURL },
  mimetype: 'video/mp4',
  fileName: `${titulo}.mp4`
}, { quoted: info })
```

---

## 5. YouTube Search (.ytsearch)

**Comando**: `index.js:1468`

**Trigger**: `.ytsearch <busqueda>`

```
GET ${APINAUFRA}/ytsearch?apikey=${KEY}&q=${query}
```

| Campo | Descripción |
|------|-------------|
| `resultados[]` | Array de videos |
| `resultados[].title` | Título |
| `resultados[].author` | Canal |
| `resultados[].duration` | Duración |
| `resultados[].views` | Vistas |
| `resultados[].url` | URL |
| `resultados[].thumbnail` | Imagen |

---

## 6. TikTok (.tiktok)

**Comando**: `index.js:2318`

**Trigger**: `.tiktok <link>`

```
GET ${APINAUFRA}/tiktok?apikey=${KEY}&url=${url}
```

---

## 7. Facebook (.fb)

**Comando**: `index.js:2288`

**Trigger**: `.fb <link>`

```
GET ${APINAUFRA}/fbvideo?apikey=${KEY}&url=${url}
```

---

## 8. Instagram (.instagram)

**Comando**: `index.js:2391`

**Trigger**: `.instagram <link>`

```
GET ${APINAUFRA}/instagram?apikey=${KEY}&url=${url}
```

---

## 9. MediaFire (.mediafire)

**Comando**: `index.js:2347`

**Trigger**: `.mediafire <link>`

```
GET ${APINAUFRA}/mediafire-dl?apikey=${KEY}&url=${url}
```

**Procesamiento**:
1. Obtener nombre desde header `content-disposition`
2. Obtener tipo MIME desde header
3. Enviar como documento

---

## 10. Pinterest (.pinterest)

**Comando**: `index.js:2417`

**Trigger**: `.pinterest <busqueda>`

```
GET ${APINAUFRA}/pinterest-search?apikey=${KEY}&q=${query}
```

---

## 11. Tabla Resumen

| Comando | Trigger | API Endpoint | Formato entrada |
|---------|---------|-----------|-------------|
| `.play` | texto/link | ytmp3/ytinfo | audio |
| `.playvideo` | texto/link | ytmp4 | video |
| `.playdoc` | texto/link | ymp4 | documento |
| `.ytsearch` | busqueda | ytsearch | imagen |
| `.tiktok` | link | tiktok | video |
| `.fb` | link | fbvideo | video |
| `.instagram` | link | instagram | video |
| `.mediafire` | link | mediafire-dl | documento |
| `.pinterest` | busqueda | pinterest-search | imagen |

---

## 12. Errores Comunes

| Error | Causa | Solución |
|-------|-------|---------|
| "Error descargando" | API caída | Verificar API key |
| "API inválida" | Key incorrecta | Renovar key |
| Rate limit | demasiadas requests | Esperar |

---

## 13. Referencias

- Index: `index.js:2102-2430`
- API: `api.naufrabot.com`

---

*Documento generado automáticamente - 2026*