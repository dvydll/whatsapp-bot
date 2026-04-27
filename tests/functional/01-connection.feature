# Feature: Sistema de Conexión de WhatsApp

## Descripción
como desarrollador
quiero que el bot se conecte automáticamente a WhatsApp Web
para que pueda procesar mensajes

### Escenario: Conexión exitosa al iniciar

**Given** el archivo de sesión no existe
**And** las credenciales son válidas
**When** ejecuto el comando `node src/main/index.ts`
**Then** el sistema genera un código de vinculación de 8 dígitos
**And** muestra el código en la terminal
**And** el estado de conexión es "等待 vinculacion"

### Escenario: Reconexión automática tras desconexión

**Given** el bot está conectado
**And** la conexión se cierra unexpectedly
**When** el sistema detecta el evento de desconexión
**Then** el bot espera 5 segundos
**And** intenta reconectar automáticamente
**And** el estado de conexión es "conectado"

### Escenario: Sesión válida al iniciar

**Given** existe archivo de sesión con credenciales
**When** ejecuto el comando `node src/main/index.ts`
**Then** el sistema carga las credenciales desde `./session/`
**And** el estado de conexión es "conectado" directamente
**And** no requiere código de vinculación