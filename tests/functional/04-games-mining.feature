# Feature: Juegos - Minería

## Descripción
como usuario registrado
quiero minar monedas
para ganar recompensas

### Escenario: Minería exitosa

**Given** el usuario está registrado
**And** no ha minado en las últimas 24 horas
**When** envío el comando `.minar`
**Then** el sistema genera un monto aleatorio entre 5 y 10
**And** agrega las monedas al usuario
**And** muestra el resultado de la minería

### Escenario: Minería en cooldown

**Given** el usuario minó hace 1 hora
**When** envío el comando `.minar`
**Then** el sistema muestra tiempo restante
**And** no se ejecuta la minería

### Escenario: Minería sin registro

**Given** el usuario no está registrado
**When** envío el comando `.minar`
**Then** el sistema muestra mensaje de registro requerido