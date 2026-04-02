# Atlassian Setup Handoff

## Objetivo

Este documento deja preparado el contexto necesario para continuar en otra sesión
la configuración de `Jira` y `Confluence` para el proyecto de agentic commerce y
pagos soberanos.

## Estado actual

- Proyecto `Jira` ya creado con clave: `SACP`
- `Jira` ya conectado con `Confluence`
- `Spec Kit` ya endurecido en el repositorio
- `roadmap.md` ya existe y está versionado
- Rama activa de trabajo: `feature/mvp-agentic-checkout`

## Bloqueo actual

En esta sesión no fue posible usar el `MCP` de Atlassian.

Error observado:

- `MCP startup failed`
- `handshaking with MCP server failed`
- `connection closed: initialize response`

Por tanto:

- no se pudo inspeccionar el proyecto `SACP`
- no se pudo verificar el `space` de Confluence
- no se pudieron crear páginas, épicas ni plantillas desde el entorno

## Configuración objetivo de Jira

### Proyecto

- **Project Key**: `SACP`
- **Purpose**: plataforma de `agentic commerce` y pagos soberanos

### Tipos de issue recomendados

- `Epic`
- `Story`
- `Task`
- `Bug`
- `Spike`

### Jerarquía recomendada

- `Epic` -> `Story`
- `Epic` -> `Task`
- `Epic` -> `Spike`
- `Bug` ligado a `Epic` y, cuando aplique, a la `Story` afectada

### Estados mínimos recomendados

- `Backlog`
- `Ready`
- `In Progress`
- `In Review`
- `QA`
- `Done`
- `Blocked`

### Campos recomendados

- `Protocol Scope`
- `Surface Scope`
- `Mode Scope`
- `Risk Level`
- `Confluence Page`
- `Postman Required`
- `QA Evidence Required`

### Convención de naming recomendada

- `Epic`: `MVP - <capability>`
- `Story`: `<surface|adapter|core> - <outcome>`
- `Bug`: `BUG - <symptom>`

## Épicas iniciales sugeridas en Jira

- `MVP - Sovereign Checkout Core`
- `MVP - Adobe Commerce Integration`
- `MVP - Stripe Payment Integration`
- `MVP - OpenAI ACP Surface`
- `MVP - Gemini UCP Surface`
- `MVP - Audit, Observability and QA Hardening`

## Configuración objetivo de Confluence

### Space

Usar el space conectado al proyecto `SACP`.

### Árbol mínimo recomendado

- `00. Product`
- `01. Roadmap`
- `02. Epics`
- `03. Specs`
- `04. Plans`
- `05. ADRs`
- `06. QA Evidence`
- `07. Postman and Contracts`
- `08. Runbooks`

### Plantillas mínimas recomendadas

- `Epic Page`
- `Feature Spec`
- `Technical Plan`
- `ADR`
- `QA Evidence`
- `Bug Analysis`

## Relación Jira <-> Confluence

Reglas deseadas:

- toda `Epic` tiene página madre en Confluence
- toda `Story` relevante referencia spec o subsection en Confluence
- todo `Bug` detectado por QA tiene evidencia en Confluence
- toda spec enlaza a:
  - roadmap
  - epic
  - stories relacionadas
  - ADRs si aplica
  - QA evidence cuando exista

## Política operativa a reflejar después en Speckit

- No se crea rama `feature/` sin issue en Jira
- No se empieza una spec relevante sin `Epic`
- No se pasa a `plan` sin página Confluence creada o reservada
- No se cierra un bug de QA sin análisis en Confluence
- No se entrega endpoint sin colección `Postman` actualizada

## Artefactos del repositorio ya preparados

- `README.md`
- `.specify/memory/constitution.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/tasks-template.md`
- `.specify/templates/spec-quality-checklist.md`
- `roadmap.md`

## Alcance del MVP ya definido

Resumen del MVP:

- middleware `Fastify / Node.js`
- integración `Adobe Commerce`
- integración `Stripe`
- surfaces:
  - `OpenAI` vía `ACP`
  - `Gemini` vía `UCP`
- compra asistida y no asistida
- `SDE` obligatorio para unattended checkout
- mercado MVP: Europa
- moneda MVP: `EUR`
- sin `3DS/SCA` en MVP
- persistencia real desde el inicio
- evidencias auditables y observabilidad mínima desde el día 1

## Próximos pasos cuando el MCP de Atlassian esté disponible

1. Validar acceso al proyecto `SACP` en Jira
2. Validar o localizar el space conectado en Confluence
3. Crear la estructura mínima de páginas del space
4. Crear las épicas iniciales en Jira
5. Enlazar cada épica con su página madre en Confluence
6. Confirmar convenciones reales de nombres, URLs y campos
7. Actualizar `speckit` para exigir:
   - `jira_project_key`
   - `epic_key`
   - `confluence_space`
   - `confluence_page`
   - QA evidence linkage
   - Postman linkage

## Nota para la siguiente sesión

Si el `MCP` de Atlassian sigue fallando, no intentar configurar Confluence/Jira
desde este entorno sin antes validar que el servidor `atlassian` arranca y expone
recursos o plantillas MCP.
