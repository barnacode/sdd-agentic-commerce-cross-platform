# SDD Agentic Commerce Cross Platform

`Spec Kit` especializado para diseñar y gobernar soluciones de pagos agentizados
soberanos, interoperables y auditables.

## Descripción

Este repositorio contiene la base de planificación para construir una plataforma
de agentic commerce y agentic payments guiada por `Spec-Driven Development`.
El objetivo no es producir features ad hoc, sino forzar que cada cambio relevante
nazca desde una especificación trazable, con soberanía de decisión, trust explícito,
protocol boundaries claros, validación y evidencia operativa.

El framework de trabajo ya está endurecido para este dominio mediante:

- una constitución operativa en `.specify/memory/constitution.md`
- templates de `spec`, `plan` y `tasks` adaptados a pagos agentizados soberanos
- hooks opcionales de checklist y clarificación en `.specify/extensions.yml`

## Qué resuelve este Speckit

Este `speckit` obliga a que cualquier feature relevante describa y valide, como
mínimo:

- `Sovereign Decision Model`
- `Trust Model`
- `Protocol Selection Matrix`
- `Authority/Source of Truth`
- `Threat Model`
- `State Machines`
- `Error Handling and Compensation`
- `Observability Plan`
- `Test Strategy`
- `Rollout / Migration / Rollback`
- `Jira`, `Confluence` y trazabilidad operativa
- actualización de colecciones `Postman` por endpoint nuevo o modificado

Está orientado a casos donde intervienen dinero, consentimiento, delegación,
checkout orchestration o interoperabilidad entre agentes y plataformas.

## Principios operativos

- Toda acción con efecto económico o contractual debe estar respaldada por una
  decisión soberana explícita.
- Trust, autorización, delegación y source of truth no pueden quedar implícitos.
- No se diseña ni implementa un flujo de pago sin idempotencia, replay protection
  y compensaciones seguras.
- Toda feature relevante sigue `Spec-Driven Development` antes de tocar código.
- Todo trabajo debe seguir `gitflow`.
- Si QA detecta defectos, debe existir bug en Jira y documentación de evidencia,
  impacto y resolución en Confluence.
- Todo endpoint nuevo o modificado debe documentarse en una colección de Postman
  apta para automatización.

## Estructura relevante

```text
.specify/
├── memory/
│   └── constitution.md
├── templates/
│   ├── spec-template.md
│   ├── plan-template.md
│   ├── tasks-template.md
│   └── agent-file-template.md
└── extensions.yml

.aiassistant/docs/
├── constitution/
├── specs/governance/
├── templates/
└── agents/
```

## Flujo de uso

### 1. Definir la feature

Crear la rama de trabajo siguiendo `gitflow` y abrir la trazabilidad requerida:

- ticket en Jira
- página o sección en Confluence
- branch adecuada: `feature/`, `release/`, `bugfix/` o `hotfix/`

### 2. Generar la spec

Usar `speckit` para crear la especificación funcional:

```bash
/speckit.specify "Describir aquí la feature"
```

La spec debe capturar el problema, alcance, restricciones, escenarios de aceptación,
modelo de decisión soberana, trust boundaries y supuestos.

### 3. Clarificar ambigüedades

Si hay dudas relevantes sobre dinero, consentimiento, revocación, privacidad,
trust o boundaries protocolarios:

```bash
/speckit.clarify
```

### 4. Elaborar el plan técnico

```bash
/speckit.plan
```

El plan debe incluir arquitectura objetivo, bounded contexts, protocol matrix,
trust model, threat model, state machines, compensaciones, observabilidad,
estrategia de pruebas y rollback.

### 5. Generar las tareas

```bash
/speckit.tasks
```

Las tareas deben quedar trazadas a requisitos y contemplar:

- `gitflow`
- Jira y Confluence
- tests
- Postman
- validación QA
- bug tracking para defectos detectados

### 6. Analizar consistencia

```bash
/speckit.analyze
```

Este paso permite detectar gaps entre `spec.md`, `plan.md` y `tasks.md` antes de
implementar.

### 7. Implementar

```bash
/speckit.implement
```

Solo se debe implementar lo que esté trazado en la spec y el plan.

## Validaciones obligatorias

Antes de considerar terminada una feature:

- la spec debe ser consistente con la implementación
- las pruebas definidas deben ejecutarse y pasar
- los defectos QA deben tener bug en Jira y documentación en Confluence
- los endpoints afectados deben estar reflejados en Postman
- los riesgos, supuestos y `PENDING VERIFICATION` deben quedar explícitos
- debe existir estrategia de rollback

## Artefactos principales

- [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)
- [`.specify/templates/spec-template.md`](./.specify/templates/spec-template.md)
- [`.specify/templates/plan-template.md`](./.specify/templates/plan-template.md)
- [`.specify/templates/tasks-template.md`](./.specify/templates/tasks-template.md)
- [`.specify/extensions.yml`](./.specify/extensions.yml)

## Estado actual

El repositorio está preparado como base de planificación. La arquitectura objetivo
del monorepo de agentic commerce y pagos soberanos puede estar definida en los
artefactos de planificación aunque todavía no esté completamente materializada en
el árbol de código.
