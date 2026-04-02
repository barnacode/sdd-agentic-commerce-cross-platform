# Implementation Plan: Sovereign Checkout Session and SDE Lifecycle Core

**Branch**: `[feature/SACP-36-sovereign-checkout-core]` | **Date**: 2026-04-02 | **Spec**: [/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md)
**Input**: Feature specification from `/specs/002-sovereign-checkout-core/spec.md`

## Summary

This plan defines the technical architecture for the canonical sovereign checkout
core that later Adobe Commerce, Stripe, ACP, and UCP integrations will consume.
The approach is domain-first and authority-first: model `CheckoutSession`,
`SovereignDecisionEnvelope`, policy evaluation, and correlated audit records as
the canonical core; isolate vendor and protocol concerns behind adapters; and
make idempotency, revocation, and compensation explicit before any payment or
order adapter is introduced.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22.x target runtime  
**Primary Dependencies**: Fastify 5.x service runtime, JSON Schema validation, PostgreSQL 16.x durable store, Postman collection for operator validation  
**Storage**: PostgreSQL for canonical session, decision, evaluation, and append-only audit persistence  
**Testing**: Vitest unit/integration tests, contract validation for canonical payloads, simulation scenarios for timeout/duplicate/revocation, Postman regression checks for exposed endpoints  
**Target Platform**: Containerized Node.js middleware service deployed as the MVP core backend  
**Project Type**: Planning-first backend service slice for a future monorepo middleware  
**Performance Goals**: Policy evaluation and session transition acknowledgment below 500 ms p95 without external adapter latency; deterministic duplicate detection for repeated commands within active idempotency windows  
**Constraints**: No irreversible action without valid `SDE`; vendor-neutral core; Europe/EUR defaults; explicit authority matrix; QA and Postman linkage mandatory when APIs appear; Context7 validation unavailable in this environment due to invalid API key, so repo truth is used as primary evidence and no external API-dependent design choice is blocked by that limitation  
**Scale/Scope**: Repository planning artifacts for the core domain, authority model, persistence model, and canonical contracts that will govern all later commerce, payment, and agent surface slices

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

The target architecture is a canonical sovereign checkout core service boundary
that owns session lifecycle, decision verification outcomes, correlation, and
policy-safe command orchestration. It does not own catalog pricing, cart truth,
payment truth, or surface-specific payloads. Instead, it emits and persists the
canonical artifacts that later adapters and surfaces must honor.

The implementation will center on three internal boundaries:

1. **Decision Authority Boundary**: validates and tracks whether an `SDE` is
   usable for a requested action at a given point in time.
2. **Checkout Session Boundary**: governs the lifecycle of a session and the
   transition rules between reversible and irreversible states.
3. **Audit and Evidence Boundary**: captures immutable, correlated evidence for
   every significant transition or policy outcome.

### Bounded Contexts

- **Sovereign Decision Context**: Owns `SDE`, decision evaluation, revocation,
  expiry, and decision-use evidence.
- **Checkout Session Context**: Owns `CheckoutSession`, execution intent,
  idempotency handling, and canonical state transitions.
- **Audit and Governance Context**: Owns append-only evidence records, operator
  visibility, correlation IDs, QA evidence linkage, and governance traceability.
- **External Authority Integration Context**: Declares the boundaries where later
  commerce, payment, and agent-surface adapters will attach without changing core semantics.

### Layer Mapping

| Layer | Responsibility | Key Artifacts |
|-------|----------------|---------------|
| Sovereign Decision Layer | Define and evaluate bounded delegated authority | `SovereignDecisionEnvelope`, `DecisionEvaluation` |
| Trust Layer | Verify principal, agent authority, revocation, and trust artifacts | authority matrix, policy enforcement rules |
| Commerce Orchestration Layer | Manage session lifecycle and reversible vs irreversible commands | `CheckoutSession`, `ExecutionIntent` |
| Agent Interoperability Layer | Consume canonical contracts from downstream ACP/UCP/A2A surfaces later | canonical command/event contracts |
| Tooling and Context Layer | Support planning, QA, Postman, and operational tooling | Spec Kit artifacts, Jira/Confluence links, Postman strategy |
| Payment Execution and Settlement Layer | Remain external for this slice, but consume canonical execution intents later | payment attempt references, settlement hooks |
| Observability, Audit and Governance Layer | Persist immutable evidence and correlation metadata | `AuditCorrelationRecord`, QA evidence page, runbooks |

## Protocol Selection Matrix *(mandatory when protocols or external surfaces are involved)*

| Protocol / Interface | Why It Enters | Why Alternatives Do Not | Boundary | Crossing Artifacts |
|----------------------|---------------|--------------------------|----------|--------------------|
| Internal canonical core | Required to define reusable session and decision semantics independent of vendors | Adapter-specific contracts would couple the domain too early | Core domain boundary | `CheckoutSession`, `SDE`, evaluation outcomes, audit records |
| ACP | Later OpenAI surface will consume the core checkout semantics | ACP should not define trust or payment authority for the whole platform | Agent commerce surface boundary | surface commands mapped to canonical intents |
| UCP | Later Gemini surface will consume the same core semantics | UCP should not redefine checkout authority or audit semantics | Agent commerce surface boundary | capability requests, canonical session references |
| AP2-aligned mandate semantics | Useful conceptual fit for delegated authority, bounded mandates, and evidence | Direct AP2 integration is not yet in scope for the MVP core slice | Trust and payment delegation boundary | mandate-like decision fields, evidence requirements |
| MCP | Required for Atlassian and planning tooling, not runtime authority | No other runtime protocol is needed for planning operations | Tooling boundary | Jira issues, Confluence pages, governance metadata |
| HTTP/JSON | Expected transport for the future core service APIs | Event-only transport would hide request/response validation and Postman needs | Service interface boundary | session commands, decision validation requests, evidence queries |

## Domain Model *(mandatory)*

- **CheckoutSession**: Aggregate root representing the governed checkout lifecycle.
  Invariants: one active autonomy mode, explicit authoritative context references,
  no irreversible execution without accepted policy evaluation, and state transitions only through the canonical state machine.
- **SovereignDecisionEnvelope**: Aggregate root representing delegated authority.
  Invariants: bounded scope, explicit principal and agent, finite validity window,
  and immutable issuance metadata once activated.
- **DecisionEvaluation**: Immutable policy result for a specific `SDE` and
  checkout context. Invariants: every irreversible execution references an
  accepted evaluation, and every rejection explains the blocking constraint.
- **ExecutionIntent**: Canonical command object for attempted irreversible work.
  Invariants: idempotency material required, target action explicit, and source session + evaluation references present.
- **AuditCorrelationRecord**: Append-only evidence record linking who requested
  what, under which authority, against which session, and with what outcome.
  Invariants: immutable once written and always correlated to at least one canonical identifier.

## Sovereign Decision Model *(mandatory when applicable)*

- **Decision Artifact**: `SovereignDecisionEnvelope`
- **Issuance**: Created by a trust-authoritative flow outside or alongside the
  core, then attached to a session with explicit principal, authorized agent,
  allowed actions, constraints, and evidence references.
- **Verification**: The core verifies status, expiry, revocation, scope fit,
  autonomy mode fit, and action eligibility through a deterministic policy evaluation step.
- **Propagation**: The accepted evaluation outcome propagates from trust boundary
  to checkout orchestration and then to later commerce or payment adapters as a canonical authorization reference, never as implicit session state.
- **Revocation**: Revocation invalidates future irreversible actions immediately
  and forces the session into a blocked, compensating, or operator-review path depending on in-flight external commitments.
- **Evidence**: `decision_id`, `checkout_session_id`, evaluation result,
  execution intent, payment attempt reference, order reference, and resulting
  audit records must remain correlated.

## Trust Model *(mandatory)*

- **Principals**: Buyer/account owner, platform operator, QA operator
- **Authorized Agents**: Delegated agent surfaces and automation actors explicitly named in the `SDE`
- **Trust Artifacts**: `SDE`, revocation status, evaluation outcomes, idempotency keys, audit correlation IDs, future commerce/payment receipts
- **Policy Enforcement Points**: SDE verification endpoint/service, checkout
  command handler, irreversible execution gateway, compensation controller, audit recorder
- **Privacy & Data Minimization**: Persist no PCI-sensitive payment payloads,
  separate authority evidence from customer profile data, and store only the
  minimum references required for operator and QA reconstruction

## Threat Model *(mandatory)*

- **Threat**: Authority confusion between trust validation and session orchestration
- **Impact**: Session proceeds on implicit or stale authority
- **Mitigation**: Explicit evaluation step with authoritative trust source and immutable evaluation record
- **Residual Risk**: Stale external authority references if downstream revocation propagation is delayed

- **Threat**: Replay of irreversible commands with duplicate or altered idempotency material
- **Impact**: Duplicate payment authorization, duplicate order submission, inconsistent evidence
- **Mitigation**: Canonical idempotency key binding to session, action, and evaluation context
- **Residual Risk**: Partial duplicates across external adapters until all downstream integrations honor the same idempotency semantics

- **Threat**: Session state drift after partial external completion
- **Impact**: Payment, order, and local state diverge
- **Mitigation**: Explicit partial-completion states, compensation strategy, operator-review path, and append-only evidence
- **Residual Risk**: Some cases still require manual operator decision in the MVP

- **Threat**: Over-broad or expired `SDE` used in unattended mode
- **Impact**: Unauthorized purchase execution
- **Mitigation**: Mandatory validation of amount, merchant, currency, TTL, risk ceiling, and revocation status before irreversible work
- **Residual Risk**: Policy misconfiguration outside the core remains possible and must be caught by QA and governance review

## State Machines & Flows *(mandatory)*

### Core State Machines

- **CheckoutSession Lifecycle**: `draft -> prepared -> awaiting_authority -> authorized_for_execution -> executing_irreversible_action -> partially_completed | completed | blocked | compensating | failed | cancelled`
- **SDE Lifecycle**: `issued -> active -> evaluated -> consumed | expired | revoked | rejected`
- **ExecutionIntent Lifecycle**: `requested -> accepted_for_execution -> in_flight -> succeeded | failed | timed_out | compensating | compensated`

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
specs/002-sovereign-checkout-core/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── contracts/
    └── sovereign-checkout-core-contract.md
```

### Specialized Specs To Derive When Applicable

- `authority.spec` captured by the sovereign decision model and trust model in this slice
- `persistence.spec` represented by the data model and append-only audit requirements
- `flow.spec` represented by the state machines and quickstart scenarios
- `adapter.spec` deferred to later Adobe Commerce and Stripe features
- `surface.spec` deferred to later ACP and UCP features

## Project Structure

### Current Repository Reality

The repository remains a planning-first workspace with governance artifacts,
Spec Kit templates, and feature directories under `specs/`. No runtime service,
package layout, or durable storage implementation exists yet in the code tree.

### Target Structure For This Feature

```text
/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/
├── specs/002-sovereign-checkout-core/
│   ├── spec.md
│   ├── plan.md
│   ├── research.md
│   ├── data-model.md
│   ├── quickstart.md
│   ├── checklists/
│   │   └── requirements.md
│   └── contracts/
│       └── sovereign-checkout-core-contract.md
└── AGENTS.md
```

**Structure Decision**: This slice only materializes planning artifacts. The
runtime monorepo structure remains target architecture and is intentionally not
materialized yet to avoid inventing implementation packages before tasks and execution.

## Error Handling & Compensation *(mandatory)*

- **Failure Classes**: invalid authority, expired authority, revoked authority,
  duplicate intent, timeout, partial external completion, external reconciliation mismatch
- **Retry Strategy**: Bounded retries only for reversible operations; no retry of
  irreversible work without idempotency and a valid, still-current evaluation outcome
- **Compensation Strategy**: Represent partial completion explicitly, trigger
  compensating intent where safe, and escalate to operator review when external truth cannot be reversed automatically
- **Operator Visibility**: Every blocked, failed, timed out, or compensating path
  writes structured audit evidence and must be visible through operator and QA evidence channels

## Observability Plan *(mandatory)*

- **Logs**: Structured logs for session creation, evaluation outcome, execution
  intent, external callback reconciliation, revocation handling, and compensation decisions; no secrets or PCI-sensitive payloads
- **Metrics**: policy acceptance/rejection counts, idempotency duplicate rate,
  session transition counts, compensation rate, timeout rate, operator-review rate
- **Tracing/Correlation**: `decision_id`, `checkout_session_id`,
  `decision_evaluation_id`, `execution_intent_id`, `payment_attempt_id`,
  `order_id`, and audit event ID
- **Audit Trail**: Append-only evidence stream linked to Jira `SACP-36` QA evidence expectations and Confluence evidence page `217481217`

## Test Strategy *(mandatory)*

- **Unit Tests**: session state transition rules, policy evaluation rule composition, revocation handling, idempotency key binding
- **Integration Tests**: end-to-end session + decision workflows with mocked commerce/payment authority responses
- **Contract Tests**: canonical request/response/event payloads defined in `contracts/sovereign-checkout-core-contract.md`
- **Simulation Tests**: timeout, duplicate submission, partial completion, revocation-after-authorization, and compensation scenarios
- **Postman Collection Strategy**: Create or extend the core middleware Postman
  collection for session creation, decision attachment, evaluation, irreversible execution requests, and evidence lookup endpoints once APIs are derived from this plan
- **Manual Validation**: architecture review, authority matrix review, state machine walkthrough, QA evidence page completeness review
- **QA Failure Workflow**: defects create Jira `Error` or `Tarea` under the relevant feature/epic and record diagnosis plus evidence in the SACP-36 QA evidence page

## Rollout / Migration / Rollback *(mandatory)*

- **Rollout Plan**: Planning-first rollout; implementation follows after tasks and can be released behind feature flags or non-production endpoints initially
- **Migration Requirements**: None in the repository now; implementation must create durable storage and initial schema later
- **Rollback Plan**: Revert repository planning artifacts if the canonical core design is rejected; later runtime rollback must disable new core endpoints and preserve audit evidence

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Ticket(s)**: `SACP-36`
- **Epic Key**: `SACP-2`
- **Protocol Scope**: `Multi-Protocol`
- **Surface Scope**: `Core`
- **Mode Scope**: `Both`
- **Risk Level**: `Critical`
- **Confluence Space**: `SACPM`
- **Confluence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217284617/Feature+SACP-36+-+Sovereign+checkout+session+and+SDE+lifecycle+core`, `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217284637/Plan+SACP-36+-+Sovereign+checkout+session+and+SDE+lifecycle+core`
- **ADR Links**: `N/A`
- **Gitflow Branch Type**: `feature/`
- **Confluence Page Field ID**: `customfield_10094`
- **Postman Required Field ID**: `customfield_10095`
- **QA Evidence Required Field ID**: `customfield_10096`
- **Postman Collection(s)**: `PENDING VERIFICATION`
- **QA Evidence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217481217/QA+Evidence+-+SACP-36+-+Sovereign+checkout+session+and+SDE+lifecycle+core`

## Complexity Tracking

> Fill only if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
