# Feature: Descarga de YouTube

## Descripción
como usuario registrado
quiero descargar audio de YouTube
para escuchar música offline

### Escenario: Descargar audio exitosamente

**Given** el usuario está registrado
**When** envío el comando `.play despacito`
**Then** el sistema busca el video en YouTube
**And** descarga el audio
**And** envía el archivo de audio

### Escenario: Descarga con API key inválida

**Given** el usuario está registrado
**And** la API key no es válida
**When** envío el comando `.play despacito`
**Then** el sistema muestra error de API
**And** no envía ningún archivo

### Escenario: Descarga sin registro

**Given** el usuario no está registrado
**When** envío el comando `.play despacito`
**Then** el sistema muestra mensaje de registro requerido