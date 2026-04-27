# Feature: Gestión de Grupos - Bienvenidas

## Descripción
como administrador del grupo
quiero configurar mensajes de bienvenida
para recibir nuevos miembros

### Escenario: Activar bienvenida

**Given** el bot es administrador del grupo
**And** las bienvenidas están desactivadas
**When** envío el comando `.welcome 1`
**Then** el sistema activa las bienvenidas en el grupo

### Escenario: Enviar bienvenida cuando un nuevo usuario entra

**Given** las bienvenidas están activas
**When** un nuevo usuario entra al grupo
**Then** el sistema envía el mensaje de bienvenida
**And** menciona al nuevo usuario con @

### Escenario: Solo admins pueden activar bienvenidas

**Given** el usuario no es administrador del grupo
**When** envío el comando `.welcome 1`
**Then** el sistema muestra mensaje de "no tienes permisos"

### Escenario: El bot debe ser administrador

**Given** el bot no es administrador del grupo
**When** envío el comando `.welcome 1`
**Then** el sistema muestra "el bot necesita ser administrador"