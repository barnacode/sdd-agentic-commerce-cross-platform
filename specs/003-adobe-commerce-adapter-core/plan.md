# Implementation Plan: Adobe Commerce Authoritative Adapter Core

**Branch**: `[feature/SACP-65-adobe-commerce-adapter-core]` | **Date**: 2026-04-02 | **Spec**: [/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md)
**Input**: Feature specification from `/specs/003-adobe-commerce-adapter-core/spec.md`

## Summary

This plan defines the technical architecture for the Adobe Commerce adapter that
connects the sovereign checkout core to authoritative commerce operations. The
approach is authority-preserving and boundary-focused: Adobe Commerce owns
catalog, product, cart, totals, and order outcomes; the sovereign checkout core
owns decision authority and execution eligibility; and the adapter translates
between both worlds while preserving audit correlation, replay safety, and operator visibility.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22.x target runtime  
**Primary Dependencies**: Fastify 5.x service runtime, Adobe Commerce API client boundary, JSON Schema validation, PostgreSQL-backed correlation store, Postman collection for adapter validation  
**Storage**: PostgreSQL for adapter correlation metadata, authoritative snapshot references, and audit evidence pointers; Adobe Commerce remains external authority for commerce state  
**Testing**: Vitest unit/integration tests, contract validation for adapter payloads, simulation scenarios for product drift/timeouts/duplicates, Postman regression checks for adapter endpoints  
**Target Platform**: Containerized Node.js middleware adapter service boundary attached to the sovereign checkout core  
**Project Type**: Planning-first backend adapter slice for a future monorepo middleware  
**Performance Goals**: Catalog and product-detail adapter responses below 700 ms p95 excluding Adobe latency spikes; cart and order adapter acknowledgment below 1 s p95 excluding Adobe latency spikes; deterministic duplicate detection for cart and order commands  
**Constraints**: Adobe Commerce is the only commerce authority; caller-supplied pricing is never authoritative; adapter must support both `Human Present` and `Human Not Present`; Postman and QA evidence are mandatory because endpoints and adapter contracts will be introduced; exact Adobe API version remains `PENDING VERIFICATION` until implementation-time validation  
**Scale/Scope**: Repository planning artifacts for Adobe catalog/cart/order authority, adapter contracts, failure handling, and correlation rules consumed by the sovereign checkout core and later agent surfaces

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Sovereign decision impact identified and handled explicitly
- [x] Trust model and authority matrix defined
- [x] Protocol roles and boundaries justified
- [x] Idempotency, replay protection, and compensation considered
- [x] Auditability and observability planned
- [x] Jira/Confluence traceability captured
- [x] Gitflow branch strategy identified for the work
- [x] Endpoint validation artifacts and Postman updates planned when APIs change
- [x] Target architecture vs current repo reality called out where they differ

## Architecture Overview *(mandatory)*

### Target Architecture

The target architecture is a vendor-specific commerce adapter boundary that
translates canonical sovereign checkout commands into Adobe Commerce operations
and translates authoritative Adobe outcomes back into canonical commerce
authority outcomes. The adapter must not mint decision authority, accept caller
pricing as truth, or leak Adobe-specific semantics into the sovereign checkout
core beyond the contractually agreed commerce authority outcomes.

The implementation will center on three boundaries:

1. **Catalog/Product Boundary**: reads authoritative product and discovery data from Adobe Commerce.
2. **Cart/Price Boundary**: mutates Adobe carts and returns only Adobe-authoritative item and totals outcomes.
3. **Order Submission Boundary**: submits order creation commands and correlates resulting Adobe order references or uncertain outcomes back to the core.

### Bounded Contexts

- **Catalog Authority Context**: Owns Adobe product discovery, product detail
  retrieval, and authoritative snapshot mapping.
- **Cart Authority Context**: Owns Adobe cart creation, cart mutation, cart
  summary, totals refresh, and caller-price rejection semantics.
- **Order Authority Context**: Owns Adobe order submission, duplicate protection,
  timeout handling, and order reference correlation.
- **Adapter Audit and Governance Context**: Owns adapter evidence, correlation IDs,
  QA evidence linkage, and operator-visible failure semantics.

### Layer Mapping

| Layer | Responsibility | Key Artifacts |
|-------|----------------|---------------|
| Sovereign Decision Layer | Remains upstream authority for whether commerce actions are permitted | `SDE`, `DecisionEvaluation` references |
| Trust Layer | Enforces principal/agent authority before adapter invocation | execution eligibility references |
| Commerce Orchestration Layer | Issues canonical commerce commands and consumes authoritative outcomes | canonical command envelope, `CommerceAuthorityOutcome` |
| Agent Interoperability Layer | Later ACP/UCP surfaces consume canonical commerce outcomes, not Adobe internals | normalized catalog/cart/order payloads |
| Tooling and Context Layer | Supports planning, Postman, Jira, and Confluence traceability | Spec Kit artifacts, Postman strategy |
| Payment Execution and Settlement Layer | Downstream consumer of authoritative cart/order outcomes | order correlation refs, totals refs |
| Observability, Audit and Governance Layer | Captures immutable evidence of Adobe-facing operations and outcomes | adapter audit records, QA evidence page |

## Protocol Selection Matrix *(mandatory when protocols or external surfaces are involved)*

| Protocol / Interface | Why It Enters | Why Alternatives Do Not | Boundary | Crossing Artifacts |
|----------------------|---------------|--------------------------|----------|--------------------|
| Adobe Commerce API | Required authoritative commerce interface for MVP catalog, cart, and order operations | Any repo-local model alone would not satisfy the roadmap authority matrix | External commerce authority boundary | product snapshots, cart refs, totals, order refs |
| Internal sovereign checkout core | Required to supply authority eligibility and canonical orchestration context | Adobe Commerce must not become authority for delegated agent execution | Core-to-adapter boundary | `CheckoutSession`, `ExecutionIntent`, `DecisionEvaluation` refs |
| ACP | Later OpenAI surface consumes canonical commerce outcomes but is not authoritative here | ACP should not define cart or product truth | Agent commerce boundary | normalized catalog/cart outputs |
| UCP | Later Gemini surface consumes canonical commerce outcomes but is not authoritative here | UCP should not define cart or product truth | Agent commerce boundary | normalized catalog/cart outputs |
| HTTP/JSON | Expected transport for future adapter endpoints and testable Postman flows | Event-only transport would hide request/response validation needs | Service interface boundary | adapter commands/responses |
| MCP | Required for planning and Atlassian traceability only | Not part of runtime commerce authority | Tooling boundary | Jira/Confluence artifacts |

## Domain Model *(mandatory)*

- **AdobeCatalogSnapshot**: Immutable view of Adobe product discovery output.
  Invariants: source timestamp captured, Adobe source identity explicit, and no caller mutation.
- **AdobeProductDetailSnapshot**: Immutable view of authoritative product detail.
  Invariants: tied to one Adobe product identifier and one retrieval event.
- **AdobeCartReference**: Correlation aggregate between `CheckoutSession` and one
  Adobe cart. Invariants: one active Adobe cart reference per commerce path unless an explicit replacement flow exists.
- **AdobeOrderReference**: Correlation aggregate between `ExecutionIntent` and one
  Adobe order submission attempt. Invariants: every accepted order submission retains an Adobe-side reference or an uncertain outcome marker.
- **CommerceAuthorityOutcome**: Canonical result returned by the adapter.
  Invariants: indicates whether Adobe accepted, rejected, partially applied, or left the outcome uncertain.

## Sovereign Decision Model *(mandatory when applicable)*

- **Decision Artifact**: Upstream `SovereignDecisionEnvelope` from the core
- **Issuance**: Not minted by the adapter; consumed as upstream execution authority
- **Verification**: The adapter trusts only core-approved execution contexts and
  must reject commands missing valid authority references for gated operations
- **Propagation**: Core decision and evaluation references travel with adapter
  cart and order commands for audit correlation, not to redefine Adobe authority
- **Revocation**: Revoked or invalid authority blocks further gated adapter operations
- **Evidence**: Adobe cart and order references must correlate to `decision_id`,
  `checkout_session_id`, and adapter evidence records

## Trust Model *(mandatory)*

- **Principals**: Buyer/account owner, platform operator, QA operator
- **Authorized Agents**: Delegated agent surfaces and orchestration actors already validated by the sovereign checkout core
- **Trust Artifacts**: `decision_id`, `DecisionEvaluation`, `ExecutionIntent`,
  adapter request correlation IDs, Adobe cart/order IDs, evidence refs
- **Policy Enforcement Points**: adapter ingress validation, cart mutation
  handler, order submission handler, duplicate-detection guard, audit recorder
- **Privacy & Data Minimization**: Persist only Adobe identifiers, authoritative
  snapshot references, and evidence pointers needed for replay safety and QA; avoid storing unnecessary product or customer payload duplication

## Threat Model *(mandatory)*

- **Threat**: Caller-supplied price or total tampering
- **Impact**: Non-authoritative pricing influences downstream payment or order behavior
- **Mitigation**: Adapter ignores caller-supplied price/totals and treats Adobe totals as sole authority
- **Residual Risk**: Upstream UX may display stale price before Adobe recalculation; must be corrected through authoritative refresh

- **Threat**: Duplicate cart or order submission
- **Impact**: Duplicate Adobe cart mutations or duplicate order creation
- **Mitigation**: Canonical idempotency binding between core execution intent and adapter command correlation
- **Residual Risk**: Adobe-side uncertainty may still require reconciliation after timeout

- **Threat**: Stale catalog or product information used for checkout
- **Impact**: Product unavailable, price drift, or invalid line items during later stages
- **Mitigation**: Refresh authoritative snapshots before cart/order critical points and surface stale-resource failures explicitly
- **Residual Risk**: Real-time stock remains out of MVP scope and may still cause late failures

- **Threat**: Uncertain Adobe order outcome after timeout
- **Impact**: The core cannot know whether order creation succeeded
- **Mitigation**: Represent uncertain outcome explicitly, preserve evidence, and require reconciliation workflow
- **Residual Risk**: MVP may need operator intervention if synchronous certainty is not available

## State Machines & Flows *(mandatory)*

### Core State Machines

- **AdobeCartReference Lifecycle**: `unbound -> created -> active -> recalculating -> updated | partially_applied | invalidated | failed`
- **AdobeOrderReference Lifecycle**: `not_requested -> submission_requested -> submitted_waiting_outcome -> accepted | rejected | uncertain | reconciled`
- **CommerceAuthorityOutcome Lifecycle**: `pending -> accepted | rejected | partially_applied | uncertain`

### Sequence / Flow Coverage

- [x] Happy path
- [x] Soft-fail path
- [x] Hard-fail path
- [x] Timeout path
- [x] Duplicate submission path
- [x] Partial completion path
- [x] Compensation path

## Contracts & Spec Graph *(mandatory)*

### Core Artifacts

```text
specs/003-adobe-commerce-adapter-core/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── contracts/
    └── adobe-commerce-adapter-contract.md
```

### Specialized Specs To Derive When Applicable

- `adapter.spec` represented by this feature's plan, contract, and data model
- `surface.spec` deferred to later ACP/UCP features
- `authority.spec` inherited from sovereign checkout core and narrowed for commerce authority outcomes
- `flow.spec` represented by cart/order state machines and quickstart validation
- `security.spec` represented by threat model and caller-price rejection rules

## Project Structure

### Current Repository Reality

The repository remains a planning-first workspace with no runtime adapter code yet.
Feature planning artifacts live under `specs/` and govern what later monorepo
packages and endpoints will be created.

### Target Structure For This Feature

```text
/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/
├── specs/003-adobe-commerce-adapter-core/
│   ├── spec.md
│   ├── plan.md
│   ├── research.md
│   ├── data-model.md
│   ├── quickstart.md
│   ├── checklists/
│   │   └── requirements.md
│   └── contracts/
│       └── adobe-commerce-adapter-contract.md
└── AGENTS.md
```

**Structure Decision**: This slice only materializes planning artifacts and keeps
the future adapter package layout as target architecture until implementation begins.

## Error Handling & Compensation *(mandatory)*

- **Failure Classes**: unavailable product, invalid cart mutation, pricing drift,
  duplicate command, Adobe timeout, uncertain order outcome, partial line-item acceptance
- **Retry Strategy**: Bounded retries only for idempotent reads or safe retries;
  no blind retry for order submission without duplicate protection and outcome reconciliation
- **Compensation Strategy**: Reflect partial application explicitly, invalidate or
  refresh cart state when Adobe rejects authoritative totals, and escalate uncertain order outcomes to reconciliation or operator review
- **Operator Visibility**: Every rejected, partially applied, timed out, or uncertain Adobe outcome writes structured adapter evidence and must surface to QA/operator workflows

## Observability Plan *(mandatory)*

- **Logs**: Structured logs for Adobe request initiation, authoritative response
  receipt, recalculation result, duplicate detection, timeout, and reconciliation outcome; no secrets or unnecessary customer payload duplication
- **Metrics**: Adobe catalog latency, cart mutation latency, totals drift rate,
  duplicate rejection rate, order uncertainty rate, partial-application rate
- **Tracing/Correlation**: `checkout_session_id`, `decision_id`,
  `execution_intent_id`, `adobe_cart_id`, `adobe_order_id`, adapter request ID, audit event ID
- **Audit Trail**: Append-only adapter evidence tied to `SACP-65` QA evidence page `217186327`

## Test Strategy *(mandatory)*

- **Unit Tests**: caller-price rejection logic, authoritative outcome mapping, duplicate-detection logic, uncertain outcome classification
- **Integration Tests**: product detail, cart mutation, totals recalculation, and order submission flows against Adobe-facing integration fixtures or sandbox
- **Contract Tests**: canonical adapter contracts defined in `contracts/adobe-commerce-adapter-contract.md`
- **Simulation Tests**: product drift, cart invalidation, duplicate order submission, timeout before Adobe outcome, partial cart acceptance
- **Postman Collection Strategy**: Create or extend Adobe adapter collection
  requests for product discovery, product detail, cart create/update/remove,
  cart summary, and order submission/reconciliation endpoints
- **Manual Validation**: authority-matrix review, Postman walkthrough, Adobe
  sandbox validation, QA evidence page completeness review
- **QA Failure Workflow**: defects create Jira `Error` or `Tarea` under the relevant adapter feature/epic and record evidence in the SACP-65 QA evidence page

## Rollout / Migration / Rollback *(mandatory)*

- **Rollout Plan**: Planning-first rollout; implementation should stage read-only
  catalog/product endpoints before write-heavy cart/order operations when possible
- **Migration Requirements**: None in the repo now; implementation must later add Adobe credentials, environment configuration, and adapter package structure
- **Rollback Plan**: Revert planning artifacts if design is rejected; later runtime rollback must disable Adobe adapter routes while preserving audit evidence

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Ticket(s)**: `SACP-65`
- **Epic Key**: `SACP-3`
- **Protocol Scope**: `Multi-Protocol`
- **Surface Scope**: `Adobe Commerce`
- **Mode Scope**: `Both`
- **Risk Level**: `High`
- **Confluence Space**: `SACPM`
- **Confluence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217415700/Feature+SACP-65+-+Adobe+Commerce+authoritative+adapter+core`
- **ADR Links**: `N/A`
- **Gitflow Branch Type**: `feature/`
- **Confluence Page Field ID**: `customfield_10094`
- **Postman Required Field ID**: `customfield_10095`
- **QA Evidence Required Field ID**: `customfield_10096`
- **Postman Collection(s)**: `PENDING VERIFICATION`
- **QA Evidence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186327/QA+Evidence+-+SACP-65+-+Adobe+Commerce+authoritative+adapter+core`

## Complexity Tracking

> Fill only if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
