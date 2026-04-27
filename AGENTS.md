# AGENTS.md - Normativa de Trabajo con agentes IA

> Normativas, skills y workflows para desarrollo asistido por IA en WhatsAppBot  
> Fecha: 2026-04-27

---

## 1. Propósito

Este documento establece las normas y procedimientos para el desarrollo profesional asistido por inteligencia artificial en el proyecto.

## 2. Valores del Proyecto

| Valor             | Descripción                         |
| ----------------- | ----------------------------------- |
| **Calidad**       | Código mantenible y testeado        |
| **Documentación** | Todo feature debe estar documentado |
| **Trazabilidad**  | Registrar decisiones en bitácora    |
| **Iteración**     | Mejora continua con pasos pequeños  |

---

## 3. Skills del Proyecto

### 3.1 Skills Especializadas

| Skill                     | Descripción                                                   | Trigger de Uso                                                  |
| ------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| `bitacora`                | Gestión de bitácoras de trabajo con frontmatter estandarizado | Al completar bloques de trabajo, antes de iniciar nuevas tareas |
| `mermaid-diagrams`        | Diagramas Mermaid (class, sequence, flowchart, C4, ERD)       | Arquitectura, flujos de comandos, procesos                      |
| `conventional-commit`     | Generación de commits con formato estándar                    | Antes de cada commit                                            |
| `bash-defensive-patterns` | Patrones defensivos para scripts Bash                         | Escribir scripts de CI/CD, utilitarios                          |
| `find-skills`             | Descubrir e instalar skills adicionales                       | Cuando se necesita funcionalidad adicional                      |

### 3.2 Skills de Subagentes

| Skill                   | Descripción                        | Trigger de Uso            |
| ----------------------- | ---------------------------------- | ------------------------- |
| `repo-researcher`       | Explorar codebase, buscar patrones | Analizar código existente |
| `backend-engineer`      | Implementar lógica backend         | Nuevos features, fixes    |
| `code-reviewer`         | Revisar calidad de código          | Antes de commit           |
| `test-engineer`         | Crear tests unitarios/integración  | Fase de testing           |
| `debugger`              | Investigar errores                 | Troubleshooting           |
| `refactor-engineer`     | Refactorizar código                | Mejora de arquitectura    |
| `docs-writer`           | Documentación técnica              | Crear/actualizar docs     |
| `security-auditor`      | Análisis de seguridad              | Auditar código            |
| `performance-optimizer` | Optimización de rendimiento        | Mejora de performance     |

---

## 4. Workflow de Desarrollo

### 4.1 Flujo Estándar

```
1. ANALIZAR    → Entender requerimiento o problema
2. PLANIFICAR  → Dividir en tareas menores
3. DELEGAR     → Asignar a subagentes especializados
4. IMPLEMENTAR → Escribir código
5. REVISAR     → Code review
6. DOCUMENTAR  → Actualizar docs y bitácora
7. TESTEAR     → Verificar funcionamiento
8. COMMITEAR   → Conventional commits
```

### 4.2 Proceso de Bitácora

```
AL INICIAR:
  - Cargar skill bitacora
  - Consultar bitácora existente para contexto

AL COMPLETAR:
  - Crear SUMMARY timestamp.md
  - Incluir frontmatter con tags
  - Documentar decisiones y blockers
```

### 4.3 Diagramas Requeridos

| Momento              | Diagrama Recomendado |
| -------------------- | -------------------- |
| Arquitectura general | C4 System/Container  |
| Flujos de comandos   | Sequence Diagram     |
| Entidades de datos   | ERD                  |
| Procesos complejos   | Flowchart            |
| Dominio/objetos      | Class Diagram        |

---

## 5. Criterios de Aprobación Humana

| Tipo de Cambio                      | Requiere Approval |
| ----------------------------------- | ----------------- |
| Modificaciones a `settings/*.json`  | ✅ Sí              |
| Cambios en `index.js` (>100 líneas) | ✅ Sí              |
| Nuevos comandos                     | ✅ Sí              |
| Cambios en base de datos            | ✅ Sí              |
| Archivos de documentación           | ❌ No              |
| Entradas de bitácora                | ❌ No              |
| Fixes menores (<20 líneas)          | ❌ No              |

---

## 6. Estándar de Commits

### 6.1 Formato

```
<tipo>(<alcance>): <descripción>

[ cuerpo opcional ]

[ footer opcional ]
```

### 6.2 Tipos Permitidos

| Tipo       | Descripción                          |
| ---------- | ------------------------------------ |
| `feat`     | Nueva funcionalidad                  |
| `fix`      | Corrección de bug                    |
| `docs`     | Documentación                        |
| `refactor` | Refactorización sin cambio funcional |
| `test`     | Tests                                |
| `chore`    | Mantenimiento                        |
| `perf`     | Optimización de rendimiento          |
| `security` | Cambios de seguridad                 |

### 6.3 Ejemplos

```bash
docs(specs): add SPEC for economy system

feat(commands): add .ship command for love calculator

fix(economy): validate balance before deducting coins

refactor(index): separate command handler into modules
```

---

## 7. Estructura de Documentación

### 7.1 Specs Granulares

```
docs/specs/
├── 01-AUTH.md          # Autenticación
├── 02-REGISTRO.md      # Registro
├── 03-ECONOMIA.md     # Economía
├── 04-JUEGOS.md       # Juegos
├── 05-GRUPOS.md       # Gestión grupos
├── 06-DESCARGAS.md    # Descargas
├── 07-STICKER.md      # Sticker
└── 08-PERMISOS.md    # Permisos
```

### 7.2 Propuestas

```
docs/proposals/
├── PROPOSAL-001.md   # Refactorización inicial
├── PROPOSAL-002.md   # Tests
└── PROPOSAL-003.md   # Arquitectura
```

---

## 8. Reglas de Trabajo

### 8.1 Antes de Modificar Código

- [ ] Entender el contexto actual
- [ ] Consultar bitácora para trabajo previo
- [ ] Identificar archivos afectados
- [ ] Planificar cambios necesarios

### 8.2 Después de Modificar Código

- [ ] Verificar sintaxis y dependencias
- [ ] Actualizar documentación relacionada
- [ ] Documentar en bitácora
- [ ] Usar conventional-commit

### 8.3 Antes de Commitear

- [ ] Code review propio
- [ ] Verificar que funciona localmente
- [ ] Commits granulares y descriptivos
- [ ] Nocommitir secrets (verificar .gitignore)

---

## 9. Referencias

- Repository: [github.com/NaufraZapp/Naufrabot-base](https://github.com/NaufraZapp/Naufrabot-base)
- Documentación: `/docs/`
- Bitácora: `/.bitacora/`
- Skills: [OpenCode Skills](https://opencode.ai/skills)

---

*Documento generado automáticamente - 2026*