# Implementation Plan: Stripe Payment Execution and Webhook Core

**Branch**: `[feature/SACP-94-stripe-payment-execution-core]` | **Date**: 2026-04-03 | **Spec**: [/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/004-stripe-payment-execution-core/spec.md](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/004-stripe-payment-execution-core/spec.md)
**Input**: Feature specification from `/specs/004-stripe-payment-execution-core/spec.md`

## Summary

This plan defines the technical architecture for the Stripe payment execution
slice of the MVP. The boundary is deliberately authority-preserving: the
sovereign checkout core owns execution eligibility, Adobe Commerce owns
authoritative commerce totals and order context, and Stripe owns payment
execution state. The adapter layer translates between those domains while
preserving replay safety, asynchronous reconciliation, and operator-visible evidence.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22.x target runtime  
**Primary Dependencies**: Fastify 5.x service runtime, Stripe API client boundary, JSON Schema validation, PostgreSQL-backed correlation store, Postman collection for payment and webhook validation  
**Storage**: PostgreSQL for payment reference correlation, webhook evidence, idempotency material, and audit metadata; Stripe remains the external authority for payment state  
**Testing**: Vitest unit/integration tests, contract validation for canonical payment payloads, simulation scenarios for duplicate submission/timeouts/webhook-first delivery, Postman regression checks for payment and webhook flows  
**Target Platform**: Containerized Node.js middleware adapter service boundary attached to the sovereign checkout core  
**Project Type**: Planning-first backend payment slice for a future monorepo middleware  
**Performance Goals**: Payment attempt creation and retrieval acknowledgments below 800 ms p95 excluding Stripe latency spikes; replay-safe duplicate detection for create/confirm/capture/cancel flows; webhook reconciliation latency low enough for operator trust and non-ambiguous order release  
**Constraints**: Stripe is the only payment authority; the core remains the only execution-eligibility authority; webhook validation is mandatory for authoritative asynchronous outcomes; Postman and QA evidence are mandatory because Stripe-facing endpoints and validation flows will be introduced; exact Stripe API version remains `PENDING VERIFICATION` because Stripe behavior is account-versioned  
**Scale/Scope**: Repository planning artifacts for Stripe payment-attempt correlation, authoritative payment outcomes, webhook evidence, and irreversible payment governance consumed by the sovereign checkout core and later surfaces

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

The target architecture is a vendor-specific payment adapter boundary that
translates canonical sovereign checkout payment commands into Stripe payment
operations and translates authoritative Stripe results back into canonical
payment outcomes. The adapter must not mint sovereign authority, must not treat
local synchronous responses as sufficient proof of completion, and must not let
raw Stripe semantics leak across the platform without canonical translation.

The implementation centers on three boundaries:

1. **Payment Attempt Boundary**: creates and retrieves replay-safe canonical payment references bound to authoritative checkout context.
2. **Execution Boundary**: confirms, captures, cancels, and classifies Stripe-side outcomes without losing idempotency or authority separation.
3. **Webhook Reconciliation Boundary**: verifies asynchronous Stripe events and reconciles them with local synchronous payment actions and operator evidence.

### Bounded Contexts

- **Payment Attempt Context**: Owns payment reference creation, Stripe payment
  identity correlation, and authoritative amount binding.
- **Execution Governance Context**: Owns create/confirm/capture/cancel semantics,
  replay safety, sovereign decision enforcement, and duplicate-protection rules.
- **Webhook Evidence Context**: Owns event verification, asynchronous
  reconciliation, and Stripe-first outcome classification.
- **Payment Audit and Governance Context**: Owns append-only payment evidence,
  QA readiness, and operator-visible failure and compensation semantics.

### Layer Mapping

| Layer | Responsibility | Key Artifacts |
|-------|----------------|---------------|
| Sovereign Decision Layer | Remains upstream authority for whether a payment action is permitted | `SDE`, `DecisionEvaluation`, `ExecutionIntent` refs |
| Trust Layer | Enforces principal/agent authority before Stripe invocation | execution eligibility refs |
| Commerce Orchestration Layer | Supplies canonical payment command context and authoritative commerce amount | checkout session refs, order refs, totals refs |
| Agent Interoperability Layer | Later ACP/UCP surfaces consume canonical payment outcomes, not raw Stripe semantics | normalized payment outcome payloads |
| Tooling and Context Layer | Supports planning, Postman, Jira, and Confluence traceability | Spec Kit artifacts, Postman strategy |
| Payment Execution and Settlement Layer | Stripe-specific execution and eventual downstream settlement consumers | `StripePaymentReference`, payment outcome refs |
| Observability, Audit and Governance Layer | Captures immutable payment evidence and webhook reconciliation history | webhook evidence, audit records, QA evidence page |

## Protocol Selection Matrix *(mandatory when protocols or external surfaces are involved)*

| Protocol / Interface | Why It Enters | Why Alternatives Do Not | Boundary | Crossing Artifacts |
|----------------------|---------------|--------------------------|----------|--------------------|
| Stripe API | Required authoritative payment execution interface for MVP authorize/capture/cancel flows | Repo-local state alone cannot represent money movement or payment finality | External payment authority boundary | payment refs, execution outcomes, capture/cancel results |
| Stripe webhooks | Required for authoritative asynchronous completion and failure reconciliation | Polling alone would weaken trust and delay outcome certainty | Async evidence boundary | event refs, signature-verification results, reconciled outcomes |
| Internal sovereign checkout core | Required to supply authority eligibility and irreversible-action gates | Stripe must not become authority for delegated execution permissions | Core-to-payment boundary | `CheckoutSession`, `ExecutionIntent`, `DecisionEvaluation` refs |
| Adobe Commerce authority context | Required to supply authoritative totals and order context bound to the payment | Stripe must not become authority for commerce amount derivation | Commerce-to-payment boundary | totals refs, order refs |
| HTTP/JSON | Expected transport for future payment and webhook validation flows | Event-only transport would hide request/response and Postman validation needs | Service interface boundary | payment commands, webhook payload handling |
| MCP | Required for planning and Atlassian traceability only | Not part of runtime payment authority | Tooling boundary | Jira/Confluence artifacts |

## Domain Model *(mandatory)*

- **StripePaymentReference**: Correlation aggregate between `CheckoutSession`,
  one payment execution intent, and one Stripe payment identity.
  Invariants: exactly one active canonical payment reference per irreversible
  payment intent unless an explicit replacement flow is declared.
- **PaymentExecutionOutcome**: Canonical result returned by the payment adapter.
  Invariants: indicates accepted, failed, canceled, requires action, requires capture, processing, or uncertain without ambiguity.
- **StripeWebhookEvidence**: Append-only record of verified or rejected Stripe
  event delivery and its reconciliation effect. Invariants: verification result explicit, raw event identity preserved, replay handling detectable.
- **PaymentActionRecord**: Append-only evidence of create, confirm, capture,
  cancel, retrieval, and reconciliation actions. Invariants: every irreversible
  or authority-relevant action is recorded with correlation metadata.

## Sovereign Decision Model *(mandatory when applicable)*

- **Decision Artifact**: Upstream `SovereignDecisionEnvelope` from the core
- **Issuance**: Not minted by the payment adapter; consumed as upstream execution authority
- **Verification**: The adapter trusts only core-approved execution contexts and
  must reject gated payment commands missing valid authority references
- **Propagation**: Core decision and evaluation references travel with payment
  commands for audit correlation, not to redefine Stripe authority
- **Revocation**: Revoked or invalid authority blocks further irreversible payment
  actions and may require cancel or operator-review classification for in-flight attempts
- **Evidence**: Stripe payment refs and webhook evidence must correlate to
  `decision_id`, `checkout_session_id`, `execution_intent_id`, and authoritative commerce refs

## Trust Model *(mandatory)*

- **Principals**: Buyer/account owner, platform operator, QA operator
- **Authorized Agents**: Delegated agent surfaces and orchestration actors already validated by the sovereign checkout core
- **Trust Artifacts**: `decision_id`, `DecisionEvaluation`, `ExecutionIntent`,
  `checkout_session_id`, Stripe payment identity, webhook event identity, audit record ID
- **Policy Enforcement Points**: payment command ingress validation, create/confirm/capture/cancel handlers, duplicate-detection guard, webhook verifier, audit recorder
- **Privacy & Data Minimization**: Persist only Stripe identifiers, canonical
  payment metadata, evidence pointers, and webhook verification results needed for replay safety and QA; avoid storing forbidden sensitive payment material

## Threat Model *(mandatory)*

- **Threat**: Duplicate payment creation or capture
- **Impact**: Duplicate authorization or duplicate money movement
- **Mitigation**: Canonical idempotency binding between execution intent, payment reference, and Stripe request semantics
- **Residual Risk**: Operator reconciliation still required if Stripe outcome remains uncertain after timeout

- **Threat**: Local assumption of success without authoritative Stripe completion
- **Impact**: Order release or fulfillment based on non-authoritative state
- **Mitigation**: Canonical outcome model distinguishes synchronous acknowledgment from authoritative completion; webhooks close async certainty
- **Residual Risk**: Delayed webhook delivery can prolong operator uncertainty

- **Threat**: Amount drift between authoritative commerce state and payment attempt
- **Impact**: Incorrect charge amount or invalid payment attempt reuse
- **Mitigation**: Bind payment attempt to authoritative totals refs and require explicit handling for drift before confirm/capture
- **Residual Risk**: Late order or tax changes may force cancellation and recreation of payment attempt

- **Threat**: Webhook spoofing or replay
- **Impact**: Fraudulent payment state transitions or corrupted audit trail
- **Mitigation**: Treat webhook verification as a trust boundary and preserve explicit verification evidence before reconciliation
- **Residual Risk**: Operational misconfiguration can still degrade webhook trust until corrected

## State Machines & Flows *(mandatory)*

### Core State Machines

- **StripePaymentReference Lifecycle**: `unbound -> created -> awaiting_confirmation -> processing -> requires_action | requires_capture | succeeded | canceled | failed | uncertain | reconciled`
- **PaymentExecutionOutcome Lifecycle**: `pending -> accepted | failed | canceled | requires_action | requires_capture | processing | uncertain`
- **StripeWebhookEvidence Lifecycle**: `received -> verified | rejected -> reconciled | ignored`

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
specs/004-stripe-payment-execution-core/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── contracts/
    └── stripe-payment-execution-contract.md
```

### Specialized Specs To Derive When Applicable

- `adapter.spec` represented by this feature's plan, contract, and data model
- `authority.spec` inherited from sovereign checkout core and narrowed for payment execution semantics
- `flow.spec` represented by payment and webhook state machines plus quickstart validation
- `security.spec` represented by the trust boundary, webhook verification boundary, and replay-safety rules
- `surface.spec` deferred to later ACP/UCP and frontend payment-surface features

## Project Structure

### Current Repository Reality

The repository remains a planning-first workspace with no runtime Stripe adapter
code yet. Feature planning artifacts live under `specs/` and govern what later
middleware packages and endpoints will be created.

### Target Structure For This Feature

```text
/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/
├── specs/004-stripe-payment-execution-core/
│   ├── spec.md
│   ├── plan.md
│   ├── research.md
│   ├── data-model.md
│   ├── quickstart.md
│   ├── checklists/
│   │   └── requirements.md
│   └── contracts/
│       └── stripe-payment-execution-contract.md
└── AGENTS.md
```

**Structure Decision**: This slice only materializes planning artifacts and
keeps the future payment adapter package layout as target architecture until implementation begins.

## Error Handling & Compensation *(mandatory)*

- **Failure Classes**: duplicate create/confirm/capture, amount drift, timeout
  after Stripe acceptance, failed confirmation, failed capture, canceled payment,
  webhook verification failure, uncertain execution outcome
- **Retry Strategy**: Bounded retries only for safe retrieval or explicitly
  replay-safe payment actions; no blind retry for confirm or capture without duplicate protection and authoritative outcome inspection
- **Compensation Strategy**: Cancel replaceable payment attempts when amount
  drift invalidates them, block or escalate capture after revocation, preserve
  uncertain outcomes explicitly, and require operator or reconciliation workflow when authoritative closure is missing
- **Operator Visibility**: Every failed, canceled, timed out, verification-rejected,
  or uncertain Stripe outcome writes structured payment evidence and must surface to QA/operator workflows

## Observability Plan *(mandatory)*

- **Logs**: Structured logs for payment attempt creation, confirm/capture/cancel
  requests, duplicate detection, timeout classification, webhook receipt, webhook
  verification result, and reconciliation result; no secrets or forbidden payment payload duplication
- **Metrics**: payment attempt creation latency, duplicate rejection rate,
  timeout rate, `requires_action` rate, `requires_capture` rate, uncertain outcome rate, webhook verification failure rate
- **Tracing/Correlation**: `checkout_session_id`, `decision_id`,
  `execution_intent_id`, authoritative totals ref, Stripe payment identity,
  webhook event identity, local request ID, audit event ID
- **Audit Trail**: Append-only payment evidence tied to `SACP-94` QA evidence page `217186351`

## Test Strategy *(mandatory)*

- **Unit Tests**: duplicate-detection logic, authoritative outcome mapping,
  revocation gating, amount-drift classification, webhook verification policy
- **Integration Tests**: payment attempt creation, confirmation, capture,
  cancellation, retrieval, and webhook reconciliation flows against Stripe test fixtures or sandbox
- **Contract Tests**: canonical payment contracts defined in `contracts/stripe-payment-execution-contract.md`
- **Simulation Tests**: duplicate create/confirm/capture, timeout before Stripe
  response, webhook-first delivery, `requires_action` in unattended mode, amount drift before capture
- **Postman Collection Strategy**: Create or extend Stripe payment collection
  requests for create, retrieve, confirm, capture, cancel, and webhook verification/reconciliation flows
- **Manual Validation**: authority-matrix review, Postman walkthrough, Stripe
  test-mode validation, QA evidence completeness review
- **QA Failure Workflow**: defects create Jira `Error` or `Tarea` under the relevant payment feature/epic and record evidence in the SACP-94 QA evidence page

## Rollout / Migration / Rollback *(mandatory)*

- **Rollout Plan**: Planning-first rollout; implementation should stage payment
  attempt creation and retrieval before enabling capture-heavy or auto-release flows when possible
- **Migration Requirements**: None in the repo now; implementation must later add Stripe credentials, webhook secrets, environment configuration, and adapter package structure
- **Rollback Plan**: Revert planning artifacts if design is rejected; later runtime rollback must disable Stripe payment routes and webhook processing while preserving audit evidence

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Ticket(s)**: `SACP-94`
- **Epic Key**: `SACP-4`
- **Protocol Scope**: `Multi-Protocol`
- **Surface Scope**: `Stripe`
- **Mode Scope**: `Both`
- **Risk Level**: `Critical`
- **Confluence Space**: `SACPM`
- **Confluence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186347/Feature+SACP-94+-+Stripe+payment+execution+and+webhook+core`, `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217415727/Plan+SACP-94+-+Stripe+payment+execution+and+webhook+core`
- **ADR Links**: `N/A`
- **Gitflow Branch Type**: `feature/`
- **Confluence Page Field ID**: `customfield_10094`
- **Postman Required Field ID**: `customfield_10095`
- **QA Evidence Required Field ID**: `customfield_10096`
- **Postman Collection(s)**: `PENDING VERIFICATION`
- **QA Evidence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186351/QA+Evidence+-+SACP-94+-+Stripe+payment+execution+and+webhook+core`

## Complexity Tracking

> Fill only if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
