# Jira y Confluence Operating Model

## Resumen ejecutivo

Este repositorio queda vinculado al tenant Atlassian `barnacode.atlassian.net`
con `Jira project = SACP` y `Confluence space = SACPM`.

La configuración se fija para que toda feature, bugfix, ADR y evidencia QA tenga
una correlación explícita entre:

- ticket Jira
- página Confluence
- rama Gitflow
- artefactos de `Spec Kit`
- evidencias de prueba y rollback

La fuente canónica de parámetros reutilizables queda en
[`config/atlassian/project-governance.json`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json).

## Contexto y objetivos

- Evitar trazabilidad implícita o dependiente de memoria del equipo.
- Alinear `Jira`, `Confluence`, `Gitflow` y `Spec-Driven Development`.
- Dejar una convención estable para features, bugfixes, QA y ADRs.
- Preparar base reutilizable para automatización posterior vía `MCP`.

## Restricciones

- `Jira project` operativo: `SACP`
- `Confluence space` operativo: `SACPM`
- `MCP Atlassian` disponible y verificado localmente
- bootstrap issue creado: `SACP-1`
- issue types reales hoy en `SACP`: `Epic`, `Tarea`, `Subtarea`, `Historia`,
  `Error`, `Spike`
- custom fields reales hoy en `SACP`:
  - `Protocol Scope` -> `customfield_10090`
  - `Surface Scope` -> `customfield_10091`
  - `Mode Scope` -> `customfield_10092`
  - `Risk Level` -> `customfield_10093`
  - `Confluence Page` -> `customfield_10094`
  - `Postman Required` -> `customfield_10095`
  - `QA Evidence Required` -> `customfield_10096`

## Convenciones canónicas

### Jira

- Proyecto: `SACP`
- Tipos disponibles hoy: `Epic`, `Tarea`, `Subtarea`, `Historia`, `Error`, `Spike`
- Nombres operativos a usar desde automatización:
  - `Historia` en vez de `Story`
  - `Error` en vez de `Bug`
  - `Tarea` en vez de `Task`
- Labels base:
  - `sdd-agentic-commerce`
  - `governance`
  - `spec-driven`
  - `qa-bug`

### Confluence

- Espacio: `SACPM`
- Home page: `SDD Agentic Commerce Protocol MVP Home`
- Jerarquía mínima recomendada:
  - `00. Product`
  - `01. Roadmap`
  - `02. Epics`
  - `03. Specs`
  - `04. Plans`
  - `05. ADRs`
  - `06. QA Evidence`
  - `07. Postman and Contracts`
  - `08. Runbooks`

Estructura ya sembrada:

- `00. Product`
- `01. Roadmap`
- `02. Epics`
- `03. Specs`
- `04. Plans`
- `05. ADRs`
- `06. QA Evidence`
- `07. Postman and Contracts`
- `08. Runbooks`
- `Runbook - Jira and Confluence Traceability` como hijo de `08. Runbooks`

Plantillas base creadas como páginas reutilizables:

- `Template - Epic Page`
- `Template - Feature Spec`
- `Template - Technical Plan`
- `Template - ADR`
- `Template - QA Evidence`
- `Template - Bug Analysis`

### Gitflow

- `feature/<jira-key>-<slug>`
- `bugfix/<jira-key>-<slug>`
- `hotfix/<jira-key>-<slug>`
- `release/<version>`

## Modelo de trazabilidad

Toda feature relevante debe dejar, como mínimo:

- `jira_issue_key`
- `confluence_page_id` o URL
- `git_branch`
- `spec.md`, `plan.md` y `tasks.md`

Correlación recomendada por slice:

| Slice | Jira | Confluence | Repo |
|-------|------|------------|------|
| Feature | `Historia`, `Tarea` o `Epic` | `Feature <jira-key> - <title>` | `specs/...` |
| ADR | issue enlazado o comentario | `ADR-<nnn> - <title>` | `adr/...` o docs |
| QA | `Tarea` o `Error` | `QA Evidence - <jira-key> - <title>` | reportes/tests |
| Bugfix | `Tarea` o `Error` | actualización de evidencia | `bugfix/...` |

## Flujo operativo esperado

1. Crear ticket Jira en `SACP`.
2. Asegurar `Epic` madre antes de iniciar una spec relevante.
3. Abrir rama Gitflow con el `jira-key` en el nombre.
4. Crear o actualizar la página Confluence correlacionada.
5. Reflejar referencias en `spec.md`, `plan.md` y `tasks.md`.
6. Ejecutar implementación, pruebas y actualización de Postman si aplica.
7. Registrar evidencia QA y rollback antes del cierre.

## Épicas iniciales sembradas

- `SACP-2` `MVP - Sovereign Checkout Core`
- `SACP-3` `MVP - Adobe Commerce Integration`
- `SACP-4` `MVP - Stripe Payment Integration`
- `SACP-5` `MVP - OpenAI ACP Surface`
- `SACP-6` `MVP - Gemini UCP Surface`
- `SACP-7` `MVP - Audit, Observability and QA Hardening`

Cada una tiene su página madre creada en `02. Epics` y un comentario en Jira con
la URL de Confluence correspondiente.

## Campos Jira obligatorios para trabajo relevante

- `Protocol Scope`
- `Surface Scope`
- `Mode Scope`
- `Risk Level`
- `Confluence Page`
- `Postman Required`
- `QA Evidence Required`

Para automatización o integraciones, usar los IDs reales:

- `Protocol Scope` -> `customfield_10090`
- `Surface Scope` -> `customfield_10091`
- `Mode Scope` -> `customfield_10092`
- `Risk Level` -> `customfield_10093`
- `Confluence Page` -> `customfield_10094`
- `Postman Required` -> `customfield_10095`
- `QA Evidence Required` -> `customfield_10096`

## Sovereign decision y governance

Esta configuración no sustituye la gobernanza de negocio del dominio. Solo fija
la capa operativa para que las decisiones soberanas, contratos, órdenes, pagos,
evidencias y defectos queden correlacionados con trazabilidad revisable.

## Open questions

- `OPEN QUESTION`: ¿se mantendrá `SACP-8` como issue de validación o se eliminará?
- `OPEN QUESTION`: ¿se añadirán estados `Ready`, `In Review`, `QA` y `Blocked`?
- `PENDING VERIFICATION`: automatizar creación de páginas y issues semilla desde
  un script local apoyado en `config/atlassian/project-governance.json`
