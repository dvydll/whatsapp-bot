# Feature: Sistema de Economía (Monedas)

## Descripción
como usuario registrado
quiero gestionar mis monedas
para jugar y interactuar en el sistema

### Escenario: Consultar saldo

**Given** el usuario está registrado con 100 monedas
**When** envío el comando `.cartera`
**Then** el sistema muestra "100 Rupias"

### Escenario: Agregar monedas

**Given** el usuario tiene 50 monedas
**When** el sistema ejecuta `addCoins(user, 50)`
**Then** el usuario tiene 100 monedas

### Escenario: Deducir monedas (saldo suficiente)

**Given** el usuario tiene 100 monedas
**When** el sistema ejecuta `deductCoins(user, 30)`
**Then** el usuario tiene 70 monedas

### Escenario: Deducir monedas (saldo insuficiente)

**Given** el usuario tiene 20 monedas
**When** el sistema ejecuta `deductCoins(user, 50)`
**Then** el sistema permite deducir (sin validación en código actual)
**And** el usuario tiene -30 monedas
**Note** Este comportamiento debe cambiarse en refactorización