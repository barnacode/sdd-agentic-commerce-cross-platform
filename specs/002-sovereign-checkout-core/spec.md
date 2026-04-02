# Feature Specification: Sovereign Checkout Session and SDE Lifecycle Core

**Feature Branch**: `[feature/SACP-36-sovereign-checkout-core]`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Continue with the next project spec after the Atlassian governance slice."

**Spec Quality Target**: `SQ5 - Contract Ready`

## Executive Summary *(mandatory)*

This feature defines the canonical core for sovereign checkout in the MVP. It
establishes the `CheckoutSession` domain, the `SovereignDecisionEnvelope` (`SDE`)
lifecycle, the trust and authority boundaries for assisted and unattended flows,
and the minimum persistence and audit requirements needed before Adobe Commerce,
Stripe, ACP, or UCP adapters are added.

The outcome is a single governed model for how an authorized agent can prepare,
validate, execute, revoke, and audit checkout decisions without leaving authority,
idempotency, or evidence semantics implicit.

## Context & Objectives *(mandatory)*

- **Problem**: The roadmap requires a core middleware slice for sovereign checkout,
  but the project does not yet define the canonical session model, the decision
  lifecycle, or the authority boundaries that later adapters and agent surfaces
  must obey.
- **Primary Actor(s)**: Principal customer, authorized agent, trust/policy service,
  commerce orchestration service, platform operator, QA operator
- **Objective**: Define a reviewable, implementation-ready specification for the
  canonical sovereign checkout core so later integrations can reuse one session,
  decision, and audit model.
- **In Scope**:
  - canonical `CheckoutSession` lifecycle for assisted and unattended flows
  - canonical `SovereignDecisionEnvelope` lifecycle and validation outcomes
  - authority boundaries across trust, orchestration, commerce, and payment layers
  - persistence and correlation requirements for session, decision, payment, and order references
  - audit and evidence requirements for reversible and irreversible state transitions
- **Out of Scope**:
  - Adobe Commerce adapter behavior
  - Stripe payment execution details
  - ACP or UCP surface-specific payloads
  - UI or conversational experience design
  - detailed database or API schema design

## Constraints *(mandatory)*

- The core MUST support both `Human Present` and `Human Not Present` autonomy modes.
- No irreversible checkout transition may proceed without a valid, non-expired,
  scope-compliant `SDE`.
- The core MUST remain vendor-neutral and MUST NOT make Adobe Commerce or Stripe
  semantics authoritative for the sovereign decision model.
- The MVP market remains Europe and the default currency remains `EUR`.
- The feature must preserve traceability to Jira `SACP-36`, epic `SACP-2`, and
  Confluence `SACPM`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Governed Checkout Session Creation (Priority: P1)

As a platform architect, I need a canonical `CheckoutSession` model so that every
surface and adapter can create, update, and inspect checkout state using one
governed lifecycle.

**Why this priority**: Without one session model, the later commerce, payment,
and agent surfaces will drift in state semantics and break auditability.

**Independent Test**: A reviewer can inspect the core specification and determine
the allowed session states, state transitions, correlation identifiers, and
assisted versus unattended mode boundaries without referring to adapter-specific behavior.

**Acceptance Scenarios**:

1. **Given** a new buyer intent enters the platform, **When** a `CheckoutSession`
   is created, **Then** it records a canonical session identifier, autonomy mode,
   actor references, requested commerce context, and an initial non-terminal state.
2. **Given** an existing `CheckoutSession`, **When** the platform receives a valid
   domain event such as cart recalculation, payment authorization, or revocation,
   **Then** the session transitions only through the allowed canonical state machine.

---

### User Story 2 - Sovereign Decision Enforcement (Priority: P1)

As a trust and policy operator, I need every unattended or irreversible checkout
transition to be gated by a valid `SDE` so that agent autonomy remains explicit,
bounded, and auditable.

**Why this priority**: The MVP cannot safely support agentic checkout without
authoritative decision validation and revocation semantics.

**Independent Test**: A reviewer can inspect the specification and confirm that
the core defines when `SDE` validation is required, what is validated, what
causes rejection, and how revocation blocks further irreversible work.

**Acceptance Scenarios**:

1. **Given** an unattended checkout attempt, **When** the platform evaluates the
   associated `SDE`, **Then** it verifies principal, authorized agent, allowed
   actions, merchant scope, amount scope, currency scope, time window, risk ceiling,
   payment method policy, and revocation status before allowing any irreversible transition.
2. **Given** a previously valid `SDE`, **When** it expires, is revoked, or its
   constraints no longer match the session, **Then** the platform blocks new
   irreversible actions and records the rejection reason and correlation evidence.

---

### User Story 3 - Correlated Audit and Evidence Trail (Priority: P2)

As a platform operator and QA reviewer, I need every checkout decision and state
transition to remain correlated so that defects, disputes, and release evidence
can be reconstructed without ambiguity.

**Why this priority**: The MVP claims auditability from day one, so missing
correlation would invalidate that operating model.

**Independent Test**: A reviewer can inspect the specification and determine how
session, decision, payment, order, and receipt references correlate and which
events must be preserved as evidence.

**Acceptance Scenarios**:

1. **Given** a `CheckoutSession` advances through evaluation and execution states,
   **When** audit evidence is recorded, **Then** each record includes correlation
   references linking the session, `SDE`, actor, payment attempt, commerce order,
   and outcome status.
2. **Given** a timeout, duplicate submission, or partial completion, **When** the
   platform records the failure path, **Then** operators can distinguish what was
   attempted, what became authoritative, and what compensation or manual follow-up
   is required.

### Edge Cases *(mandatory)*

- What happens when an unattended checkout session is created before a final `SDE`
  is attached, but later attempts an irreversible action?
- How does the platform handle an `SDE` whose amount scope or merchant scope no
  longer matches the latest authoritative checkout state?
- How is duplicate submission handled when the same principal, agent, and cart
  intent are replayed with the same or different idempotency material?
- What happens when payment authorization succeeds but order submission fails, or
  order submission succeeds but the payment outcome remains uncertain?
- How does the core represent revocation received while a session is waiting on an
  external dependency or manual review?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define a canonical `CheckoutSession` model with
  explicit states, allowed transitions, autonomy mode, actor references, and
  correlation identifiers for assisted and unattended checkout flows.
- **FR-002**: The system MUST define a canonical `SovereignDecisionEnvelope`
  lifecycle covering issuance, verification, active use, revocation, expiry, and
  terminal evidence status.
- **FR-003**: The system MUST require successful `SDE` validation before any
  irreversible transition, including payment authorization, payment capture,
  order submission, or any equivalent external commitment.
- **FR-004**: The system MUST evaluate `SDE` constraints against the authoritative
  checkout context, including allowed actions, merchant scope, amount scope,
  currency scope, time window, risk ceiling, and payment method policy.
- **FR-005**: The system MUST distinguish between reversible preparatory actions
  and irreversible execution actions and MUST record which category each state
  transition belongs to.
- **FR-006**: The system MUST define how revocation, expiry, duplicate submission,
  timeout, and partial completion affect session state and further agent actions.
- **FR-007**: The system MUST persist the minimum canonical references required to
  correlate a session with its `SDE`, authoritative cart or checkout snapshot,
  payment attempts, order reference, receipt or evidence references, and operator-facing audit trail.
- **FR-008**: The system MUST define a canonical policy evaluation outcome that
  explains why an `SDE` was accepted, rejected, or blocked pending further action.
- **FR-009**: The system MUST define which layer is authoritative for decision
  validation, session orchestration, commerce state, payment state, and audit evidence.
- **FR-010**: The system MUST support idempotent command handling semantics for
  session- and decision-affecting actions so duplicates can be detected and replayed safely.
- **FR-011**: The system MUST define evidence requirements for happy path,
  soft-fail, hard-fail, timeout, duplicate, partial completion, and compensation flows.
- **FR-012**: The system MUST remain reusable across later Adobe Commerce, Stripe,
  ACP, and UCP integrations without changing the core semantics of session,
  decision, and audit correlation.

### Key Entities *(include if feature involves data)*

- **CheckoutSession**: Canonical representation of the governed checkout lifecycle,
  including autonomy mode, actor references, state, authoritative commerce snapshot
  reference, payment reference set, order reference set, timestamps, and correlation IDs.
- **SovereignDecisionEnvelope**: Canonical decision artifact that authorizes an
  agent within bounded constraints and records issuance, validation, expiry,
  revocation, and evidence references.
- **DecisionEvaluation**: Immutable record of a policy evaluation outcome for an
  `SDE` against a specific checkout context, including result, failed constraints,
  evaluator reference, and timestamps.
- **AuditCorrelationRecord**: Append-only evidence record linking a session,
  decision, actor, event, external reference, and resulting state transition.
- **ExecutionIntent**: Canonical representation of a requested irreversible action
  such as authorize payment, capture payment, or submit order, with idempotency
  and policy metadata.

## Sovereign Decision Model *(mandatory for money, consent, trust, or delegation flows)*

- **Decision Required**: Yes. This feature defines the core artifact and lifecycle
  that authorizes delegated checkout behavior.
- **Principal**: The buyer or account owner who grants bounded authority.
- **Authorized Agent**: The delegated agent or automation surface acting on behalf
  of the principal within the limits of the `SDE`.
- **Intent**: Discover, prepare, and when permitted execute checkout actions for a
  specific cart or checkout context.
- **Allowed Actions**: Session creation, session update, cart-affecting actions,
  price review, payment authorization request, payment capture request, order
  submission request, cancellation, and evidence retrieval, each only when within scope.
- **Constraints**: Merchant scope, amount scope, currency scope, time window, risk
  ceiling, allowed autonomy mode, payment method policy, and any explicit denial conditions.
- **Revocation Model**: Revocation changes the `SDE` to a non-usable state and
  blocks new irreversible actions immediately; in-flight work must be classified as
  reversible, compensatable, or operator-review-required.
- **Evidence & Correlation**: Every `SDE` must correlate to `decision_id`,
  `CheckoutSession`, evaluation outcomes, payment attempts, order references,
  audit records, and any receipt or compensation evidence.

## Trust & Protocol Boundaries *(mandatory)*

- **Trust Boundary**: The trust layer is authoritative for `SDE` issuance status,
  validation outcome, revocation status, and allowed agent authority. The
  orchestration layer consumes those outcomes but must not mint authority on its own.
- **Protocol Roles**:
  - `Internal` core governs the canonical session and decision semantics.
  - `ACP` and `UCP` are downstream consumers of the core state model in later phases.
  - `AP2`-like mandate semantics inform the decision and evidence model, but this
    feature does not require an external AP2 integration yet.
  - `MCP` may support tooling and documentation, not runtime authority.
- **Authority/Source of Truth**:
  - Trust layer: authoritative for `SDE` validity and revocation.
  - Sovereign checkout core: authoritative for session state machine, policy
    evaluation records, and correlation model.
  - Commerce authority: external in later phases for cart, pricing, and order state.
  - Payment authority: external in later phases for payment authorization and capture state.
  - Audit layer: authoritative append-only evidence of what was requested, evaluated, and executed.
- **Privacy/Security Notes**: The core must enforce least privilege, replay
  protection, data minimization, explicit agent authorization, and evidence
  retention without persisting forbidden sensitive payment data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can derive the canonical `CheckoutSession` and `SDE`
  lifecycle, including all irreversible transition gates, from the spec in under
  ten minutes without consulting adapter-specific artifacts.
- **SC-002**: The spec defines explicit handling for happy path, soft-fail,
  hard-fail, timeout, duplicate submission, partial completion, and compensation flows.
- **SC-003**: The spec identifies authoritative ownership for trust, orchestration,
  commerce, payment, and audit state with no critical ambiguity remaining.
- **SC-004**: The feature is fully traceable to Jira `SACP-36`, epic `SACP-2`,
  Confluence spec page `217284617`, and QA evidence page `217481217`.

## Assumptions *(mandatory)*

- **ASSUMPTION**: Assisted checkout may create or enrich a session before final
  authorization exists, but no irreversible action is allowed before a valid `SDE`
  is attached and re-evaluated against the authoritative checkout context.
- **ASSUMPTION**: Adobe Commerce and Stripe integrations arrive in later features,
  so this core slice defines authoritative references and invariants rather than
  vendor-specific field mappings.
- **ASSUMPTION**: The MVP supports Europe and `EUR` first, but the core semantics
  should not hard-code those values beyond default policy assumptions.

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Issue Key**: `SACP-36`
- **Epic Key**: `SACP-2`
- **Protocol Scope**: `Multi-Protocol`
- **Surface Scope**: `Core`
- **Mode Scope**: `Both`
- **Risk Level**: `Critical`
- **Confluence Space**: `SACPM`
- **Confluence Page**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217284617/Feature+SACP-36+-+Sovereign+checkout+session+and+SDE+lifecycle+core`
- **Related QA Evidence**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217481217/QA+Evidence+-+SACP-36+-+Sovereign+checkout+session+and+SDE+lifecycle+core`
- **Postman Required**: `Yes`
- **Postman Impact**: `Core checkout session and sovereign decision APIs to be defined during planning and captured in the project Postman collection`
- **QA Evidence Required**: `Yes`

## Open Questions *(include only if unresolved and material)*

- **PENDING VERIFICATION**: Whether revocation after external payment authorization
  but before capture will default to compensation-first or operator-review-first in the MVP.

## Spec Quality Gate *(mandatory before planning)*

- **Current Quality Level**: `SQ5`
- **Ready for `/speckit.plan`**: Yes
- **Quality Notes**: The spec defines explicit sovereign decision semantics, trust
  boundaries, edge cases, and traceability for the core sovereign checkout slice
  without relying on implementation-specific details.
