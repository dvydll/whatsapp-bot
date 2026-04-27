# Feature: Registro de Usuarios

## Descripción
como usuario nuevo
quiero registrarme en el bot
para acceder a las funcionalidades

### Escenario: Registro exitosO

**Given** el usuario no está registrado
**When** envío el comando `.reg`
**Then** el sistema crea un registro con 50 monedas iniciales
**And** muestra mensaje de bienvenida con el nombre
**And** el usuario queda registrado en el sistema

### Escenario: Usuario ya registrado intenta registrarse

**Given** el usuario ya está registrado
**When** envío el comando `.reg`
**Then** el sistema muestra mensaje "ya estás registrado"
**And** no se modifica el registro existente

### Escenario: Registro con nombre de WhatsApp

**Given** el usuario tiene "Juan" como nombre en WhatsApp
**When** envío el comando `.reg`
**Then** el sistema guarda "Juan" como nombre en el registro