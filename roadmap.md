# Roadmap

## Resumen ejecutivo

Este proyecto construirá un middleware de `agentic commerce` y pagos soberanos
que conecte Adobe Commerce con chats agenticos en OpenAI y Gemini para permitir
discovery de productos, gestión de cesta y compra asistida y no asistida.

El objetivo inicial es entregar un MVP auditable, interoperable y gobernado por
decisión soberana, con Adobe Commerce como autoridad de catálogo, pricing, cart
y order creation, y Stripe como autoridad de autorización y captura de pagos.

## Visión del producto

Crear una capa middleware vendor-neutral que:

- traduzca protocolos de commerce y pago agentico hacia un core canónico
- permita operar sobre Adobe Commerce desde surfaces conversacionales
- soporte compras asistidas y no asistidas bajo control soberano
- mantenga trazabilidad por decisión, sesión, pago, pedido y recibo
- preserve boundaries explícitos entre trust, orchestration y payment execution

## North Star

El producto debe permitir que un agente autorizado pueda descubrir productos,
construir una cesta y ejecutar una compra dentro de límites definidos por una
`Sovereign Decision Envelope` (`SDE`), con evidencia auditable y sin romper la
autoridad del sistema commerce ni la del proveedor de pagos.

## Alcance de producto

### In scope

- middleware `Fastify / Node.js`
- surface `OpenAI` vía `ACP`
- surface `Gemini` vía `UCP`
- integración con `Adobe Commerce`
- integración con `Stripe`
- discovery de catálogo
- detalle de producto
- gestión completa de cesta
- checkout asistido
- checkout no asistido
- validación de `SDE`
- persistencia real desde el inicio
- ledger y evidencias auditables
- observabilidad mínima desde el día 1
- documentación de endpoints en `Postman`

### Out of scope para el MVP

- soporte multi-store o segmentación avanzada de catálogo
- múltiples monedas o múltiples mercados
- control de stock en tiempo real
- `3DS/SCA`
- extensiones a otros commerce engines
- extensiones a otros payment providers
- dispute management avanzado
- conciliación webhook-driven avanzada de siguientes niveles de madurez

## Supuestos base

- `ASSUMPTION`: el catálogo es único para OpenAI y Gemini en el MVP
- `ASSUMPTION`: el mercado MVP es Europa y la moneda es `EUR`
- `ASSUMPTION`: el agente autorizado puede completar compra no asistida si el `SDE` es válido
- `ASSUMPTION`: Adobe Commerce es autoridad de catálogo, pricing, cart y order creation
- `ASSUMPTION`: Stripe es autoridad de payment authorization y capture
- `ASSUMPTION`: el MVP requiere recibos y evidencias auditables desde el inicio

## Arquitectura objetivo por fases

### Fase 0. Foundation and Governance

Objetivo:
dejar operativo el framework de `Spec-Driven Development`, gobierno soberano,
quality gates y plantillas de trabajo.

Incluye:

- constitución del proyecto
- templates de `spec`, `plan` y `tasks`
- standard de calidad `SQ4/SQ5`
- `gitflow`
- trazabilidad `Jira` y `Confluence`
- estrategia `Postman`

Estado:

- completada en base de planificación

### Fase 1. MVP Core Middleware

Objetivo:
crear el core canónico del middleware para soportar sesiones de checkout
soberanas con persistencia, trust enforcement y trazabilidad.

Capacidades:

- modelo canónico de `CheckoutSession`
- modelo de `SDE` / mandate
- validación de constraints, `TTL`, `merchant_scope`, `amount_scope`, `currency_scope`
- correlación y audit trail
- persistencia de sesiones, decisiones, ledger y estados de pago
- observabilidad mínima

Exit criteria:

- existe sesión soberana persistida
- existe validación de `SDE`
- existe evidencia correlacionada por decisión y por payment attempt

### Fase 2. Adobe Commerce Adapter

Objetivo:
integrar Adobe Commerce como backend de comercio del MVP.

Capacidades:

- listado de productos
- detalle de producto
- creación y actualización de cesta
- eliminación de líneas
- resumen de cesta
- cierre de transacción y creación de order
- pricing autoritativo desde Adobe

Exit criteria:

- Adobe responde como autoridad de catálogo, pricing y cart
- el middleware no acepta pricing caller-supplied como autoritativo

### Fase 3. Stripe Payment Integration

Objetivo:
incorporar autorización y captura de pagos usando Stripe.

Capacidades:

- creación de intento de pago
- autorización
- captura
- persistencia de estado de pago
- ledger y recibos

Exit criteria:

- existe flujo end-to-end con pago real o realista en entorno controlado
- los estados de pago quedan correlacionados con la sesión y la decisión

### Fase 4. OpenAI ACP Surface

Objetivo:
exponer discovery y checkout agentico para OpenAI vía `ACP`.

Capacidades:

- discovery de catálogo
- detalle de producto
- operaciones de cesta
- creación y consulta de checkout session
- compra asistida
- compra no asistida bajo `SDE`

Exit criteria:

- un agente en OpenAI puede completar el flujo MVP contra el middleware

### Fase 5. Gemini UCP Surface

Objetivo:
exponer discovery y checkout agentico para Gemini vía `UCP`.

Capacidades:

- discovery de catálogo
- detalle de producto
- operaciones de cesta
- creación y consulta de checkout session
- compra asistida
- compra no asistida bajo `SDE`

Exit criteria:

- un agente en Gemini puede completar el flujo MVP contra el middleware

### Fase 6. MVP Hardening

Objetivo:
cerrar gaps de calidad, seguridad y operabilidad para declarar el MVP listo.

Capacidades:

- coverage de escenarios de fallo
- pruebas de integración y contratos
- colecciones `Postman` completas
- QA formal
- bug workflow en `Jira`
- evidencias en `Confluence`
- runbooks operativos mínimos

Exit criteria:

- QA superada
- defectos críticos cerrados o aceptados explícitamente
- rollback factible

## Matriz de capacidades por release

### Release R1 - Planning Foundation

- framework `speckit` endurecido
- constitución y quality gates
- roadmap de producto

### Release R2 - Core Sovereign Checkout

- core middleware
- `SDE`
- persistencia
- observabilidad

### Release R3 - Commerce and Payments

- adapter Adobe Commerce
- integración Stripe
- ledger y receipts

### Release R4 - Agent Surfaces MVP

- OpenAI `ACP`
- Gemini `UCP`
- assisted y unattended checkout

### Release R5 - Hardening

- QA integral
- Postman completo
- documentación operativa
- readiness de MVP

## Riesgos estructurales

- `RISK`: ambigüedad en authority/source-of-truth entre Adobe, Stripe y middleware
- `RISK`: compra no asistida sin `3DS/SCA` exige límites muy estrictos en el `SDE`
- `RISK`: ausencia de stock en tiempo real puede generar fallos de cierre
- `RISK`: divergencia funcional entre `ACP` y `UCP`
- `RISK`: complejidad de trazabilidad entre decisión, carrito, pago y pedido

## Mitigaciones estratégicas

- definir authority matrix explícita desde el plan técnico
- hacer obligatorio `SDE` con `TTL`, budget y scope acotado
- modelar replay protection e idempotency desde el core
- usar un modelo canónico único y traductores en el borde de protocolo
- exigir evidencias y correlation IDs end-to-end

## Dependencias críticas

- credenciales y acceso a Adobe Commerce
- credenciales y configuración de Stripe
- definición exacta de surfaces `ACP` y `UCP` del MVP
- storage para persistencia real
- proyecto Jira y espacio Confluence operativos

## Definition of Done del MVP

El MVP se considerará completado cuando:

- OpenAI y Gemini puedan descubrir productos y operar cesta contra Adobe Commerce
- exista checkout asistido y no asistido bajo `SDE`
- Stripe procese autorización y captura del flujo MVP
- el middleware persista sesiones, decisiones, ledger y estados de pago
- existan recibos y evidencias auditables
- los endpoints estén documentados en `Postman`
- QA haya sido ejecutada y los defectos estén trazados
- exista rollback factible

## Próximo paso

Con este roadmap aprobado, el siguiente paso es abrir la primera spec del MVP:

`MVP sovereign checkout middleware for Adobe Commerce + OpenAI ACP + Gemini UCP + Stripe`
