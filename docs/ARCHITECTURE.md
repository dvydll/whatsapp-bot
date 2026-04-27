# 🏗️ ARCHITECTURE.md - Arquitectura del Sistema

> Arquitectura técnica y diagramas del sistema WhatsAppBot  
> Fecha: 2026-04-27

---

## 1. Visión de Componentes

### 1.1 Diagrama de Arquitectura General

```mermaid
flowchart TB
    subgraph Client["WhatsApp Client"]
        User["Usuario"]
        Group["Grupo"]
    end

    subgraph Bot["WhatsAppBot"]
        subgraph Core["Core"]
            WS["WebSocket"]
            Handler["Message Handler"]
            CmdParser["Command Parser"]
            Perms["Permission Manager"]
        end

        subgraph Commands["Commands"]
            OwnerCmd["Owner Commands"]
            GroupCmd["Group Commands"]
            UserCmd["User Commands"]
            PublicCmd["Public Commands"]
        end

        subgraph Games["Sistema de Juegos"]
            Mining["Minería"]
            Casino["Casino"]
            Daily["Diario"]
            Fishing["Pesca"]
        end

        subgraph Utils["Utilidades"]
            Media["Media Converter"]
            Sticker["Sticker Maker"]
            Download["Downloader"]
        end
    end

    subgraph Storage["Almacenamiento"]
        JSON["JSON Files"]
        Session["Session Auth"]
    end

    subgraph External["APIs Externas"]
        NaufrabotAPI["api.naufrabot.com"]
        YouTube["YouTube API"]
        Social["Social Media APIs"]
    end

    User -->|Mensaje| WS
    Group -->|Mensaje| WS
    WS --> Handler
    Handler --> CmdParser
    CmdParser --> Perms
    
    Perms -->|Owner| OwnerCmd
    Perms -->|Admin| GroupCmd
    Perms -->|Registered| UserCmd
    Perms -->|Public| PublicCmd
    
    UserCmd --> Games
    Games -->|Guardar| JSON
    
    CmdParser -->|Sticker| Sticker
    CmdParser -->|Download| Download
    Sticker -->|API| NaufrabotAPI
    Download -->|YT| YouTube
    Download -->|Social| Social
    
    WS -->|Save Session| Session
    Handler -->|Save Data| JSON
```

---

## 2. Arquitectura de Mensajería

### 2.1 Flujo de Procesamiento de Mensajes

```mermaid
sequenceDiagram
    participant U as Usuario
    participant W as WhatsApp
    participant B as Bot
    participant S as Storage
    participant A as API Externa

    U->>W: Envía mensaje
    W->>B: Evento: messages.upsert
    
    rect rgb(240, 248, 255)
        Note over B: Parsear tipo de mensaje
    end
    
    alt Es comando
        B->>B: Extraer comando y args
        
        rect rgb(255, 250, 205)
            Note over B: Verificar permisos
        end
        
        alt Requiere registro
            B->>S: checkOfReg(sender)
            S-->>B: Boolean
        end
        
        alt No registrado
            B->>W: Enviar mensaje de registro
        end
        
        alt Requiere API
            B->>A: HTTP Request
            A-->>B: Response JSON
        end
        
        alt Tiene cooldown activo
            B->>W: Enviar tiempo restante
        end
        
        alt Ejecutar comando
            B->>B: Lógica del comando
            
            rect rgb(144, 238, 144)
                Note over B: Actualizar estado
            end
            
            alt Guardar datos
                B->>S: fs.writeFileSync
            end
        end
        
        B->>W: Enviar respuesta
    else No es comando
        B->>B: Ignorar o procesar evento
    end
```

---

## 3. Modelo de Datos

### 3.1 Estructura de Usuario (ERD)

```mermaid
erDiagram
    USUARIO {
        string id PK
        string nombre
        int nivel
        int xp
        int rxp
        int dinero
        int rep
    }

    JUEGO {
        string usuario_id PK
        string tipo
        datetime ultimo_juego
        datetime cooldown
    }

    GRUPO {
        string jid PK
        string nombre
        bool bienvenida
        bool antilink
        bool modo_admin
    }

    USUARIO ||--o{ JUEGO : juega
    GRUPO ||--o{ USUARIO : pertenece
```

### 3.2 Modelo de Registro

```mermaid
classDiagram
    class Usuario {
        +string id
        +string nombre
        +int nivel
        +int xp
        +int rxp
        +int dinero
        +int rep
    }

    class Juego {
        +string usuario_id
        +string tipo
        +Date ultimo_juego
    }

    class Registro {
        +AddReg()
        +checkOfReg()
    }

    class Economia {
        +addkoin()
        +delkoin()
        +MoneyOfSender()
    }

    class Progreso {
        +addXp()
        +addLevel()
        +levelOfsender()
    }

    class Reputacion {
        +addRep()
        +repUser()
    }

    Usuario --> Registro
    Usuario --> Economia
    Usuario --> Progreso
    Usuario --> Reputacion
```

---

## 4. Sistema de Juegos

### 4.1 Diagrama de Estados - Juegos

```mermaid
stateDiagram-v2
    [*] --> Listo
    
    state Listo {
        [*] --> VerificarRegistro
        VerificarRegistro --> NoRegistrado: isReg = false
        VerificarRegistro --> VerificarCooldown: isReg = true
        
        NoRegistrado --> [*]
        
        VerificarCooldown --> EnCooldown: tiempo < cooldown
        VerificarCooldown --> EjecutarJuego: tiempo >= cooldown
        
        EnCooldown --> [*]
    }
    
    state EjecutarJuego {
        [*] --> GenerarResultado
        GenerarResultado --> ActualizarEstado
        ActualizarResultado --> EnviarMensaje
        ActualizarResultado --> GuardarDatos
        
        EnviarMensaje --> [*]
    }
    
    EjecutarJuego --> [*]
```

### 4.2 Diagrama de Flujo - Juegos

```mermaid
flowchart TD
    A[Usuario ejecuta juego] --> B{Registro?}
    B -->|No| C[Mostrar mensaje registro]
    B -->|Sí| D{Verificar cooldown}
    
    D -->|Activo| E[Mostrar tiempo restante]
    D -->|Inactivo| F[Ejecutar lógica]
    
    F --> G[Generar resultado aleatorio]
    G --> H{Gana?}
    H -->|Sí| I[Agregar recompensa]
    H -->|No| J[Sin cambio]
    
    I --> K[Guardar en JSON]
    J --> K
    K --> L[Mostrar resultado]
    
    C --> M[Fin]
    E --> M
    L --> M
```

---

## 5. Gestión de Grupos

### 5.1 Diagrama de Permisos de Grupo

```mermaid
flowchart TD
    A[Mensaje recibido] --> B{Es grupo?}
    
    B -->|No| C{AntiPrivado activo?}
    C -->|Sí| D[Bloquear usuario]
    C -->|No| E[Ignorar]
    
    B -->|Sí| F{Modo Admin activo?}
    
    F -->|Sí| G{Es admin?}
    G -->|No| H[Bloquear comando]
    G -->|Sí| I[Procesar comando]
    
    F -->|No| I
    
    I --> J{Es admin del grupo?}
    J -->|Sí| K[Comandos admin]
    J -->|No| L[Comandos usuario]
    
    K --> M[Ejecutar comando]
    L --> M
```

### 5.2 Configuraciones de Grupo

```mermaid
flowchart LR
    subgraph Configuraciones
        W[Welcome] --> A[.welcome 1/0]
        AL[AntiLink] --> B[.antilink 1/0]
        MA[Modo Admin] --> C[.modoadmin 1/0]
        AP[AntiPrivado] --> D[.antipv on/off]
    end
    
    subgraph Acciones
        K[.kick] --> R[Remover usuario]
        G[.grupo abrir/cerrar] --> O[Cambiar modo]
        T[.todos] --> HM[Mencionar todos]
    end
```

---

## 6. Sistema de Comandos

### 6.1 Jerarquía de Comandos

```mermaid
graph TD
    Root[Raíz de Comandos] --> Owner[Owner Only]
    Root --> GroupAdmin[Admin Grupo]
    Root --> Registered[Usuario Registrado]
    Root --> Public[Público]
    Root --> GroupOnly[Solo Grupos]
    
    subgraph Owner
        O1[.reiniciar]
        O2[.boton/.botoff]
        O3[.bangp/.unbangp]
        O4[.antipv]
    end
    
    subgraph GroupAdmin
        GA1[.welcome]
        GA2[.antilink]
        GA3[.modoadmin]
        GA4[.kick]
        GA5[.grupo]
        GA6[.notify]
        GA7[.todos]
    end
    
    subgraph Registered
        R1[.menu]
        R2[.perfil]
        R3[.reg]
        R4[.minar]
        R5[.daily]
        R6[.ruleta]
    end
    
    subgraph Public
        P1[.grupos]
        P2[.canal]
        P3[.serowner]
    end
    
    subgraph GroupOnly
        GO1[.infobot]
        GO2[.tragamonedas]
        GO3[.pescar]
    end
```

---

## 7. Integración con APIs

### 7.1 Flujo de Descargas

```mermaid
flowchart LR
    subgraph Usuario
        U[Usuario] --> C[Envia comando]
    end
    
    subgraph Bot
        P[Parsear URL] --> V{es YouTube?}
        V -->|Sí| YTI[Obtener info]
        V -->|No| V2{es TikTok?}
        
        V2 -->|Sí| TI[Obtener info]
        V2 -->|No| V3{es FB?}
        
        V3 -->|Sí| FI[Obtener info]
        V3 -->|No| O[Otro]
        
        YTI --> YTD[ytmp3/ytmp4]
        TI --> TD[tiktok]
        FI --> FD[facebook]
        O --> OD[mediafire/instagram]
    end
    
    subgraph API
        YTD --> NA[api.naufrabot.com]
        TD --> NA
        FD --> NA
        OD --> NA
    end
    
    NA --> S[Enviar archivo]
    S --> Usuario
```

### 7.2 Sistema de Sticker

```mermaid
flowchart TD
    A[Usuario envia imagen] --> B{Procesar tipo}
    
    B -->|Imagen| C[Crear sticker foto]
    B -->|Video <10s| D[Crear sticker video]
    B -->|Otro| E[Error]
    
    C --> F[API sticker]
    D --> F
    
    F --> G[Agregar metadata]
    G --> H[Guardar en buffer]
    H --> I[Enviar como sticker]
```

---

## 8. Arquitectura de Seguridad

### 8.1 Control de Acceso

```mermaid
flowchart TD
    M[Mensaje recibido] --> I{Es DM?}
    
    I -->|Sí| AP{AntiPrivado activo?}
    AP -->|Sí| B[Bloquear usuario]
    AP -->|No| O[Procesar normalmente]
    
    I -->|No| G{Es grupo?}
    
    G -->|Sí| MA{Modo Admin?}
    MA -->|Sí| GA{Es admin?}
    GA -->|No| B2[Bloquear]
    GA -->|Sí| P[Procesar comando]
    
    MA -->|No| P
    
    P --> VP{Verificar prefijo}
    VP -->|Sí| VC{Verificar comando}
    VP -->|No| Ign[Ignorar]
    
    VC --> R{Requiere registro?}
    R -->|Sí| VR{Registrado?}
    R -->|No| PE{Verificar permisos}
    
    VR -->|No| MR[Mensaje registro]
    VR -->|Sí| PE
    
    PE --> E[Ejecutar]
    E --> Res[Responder]
```

---

## 9. Persistencia

### 9.1 Flujo de Datos

```mermaid
flowchart LR
    subgraph Write
        W[Write] --> J[JSON]
        J --> FS[fs.writeFileSync]
        FS --> D[Disco]
    end
    
    subgraph Read
        R[Read]
        R2[fs.readFileSync]
        R2 --> P[JSON.parse]
        P --> M[Memoria]
    end
    
    subgraph Cache
        C[NodeCache]
    end
```

---

## 10. Resumen de Architecture

| Componente | Tecnología | Propósito |
|-----------|-----------|----------|
| WhatsApp Protocol | Baileys 6.7.21 | Conexión WhatsApp |
| Message Handler | Custom | Procesamiento de mensajes |
| Command Parser | Switch/Case | Enrutamiento de comandos |
| Persistence | JSON Files | Almacenamiento |
| External APIs | HTTP/Axios | Descargas y AI |

---

*Diagrams generated with Mermaid - 2026*