# Tasks: Sovereign Checkout Session and SDE Lifecycle Core

**Input**: Design documents from `/specs/002-sovereign-checkout-core/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/sovereign-checkout-core-contract.md`

**Tests**: Unit, integration, contract, simulation, Postman, and manual architecture validation are mandatory for this scope because the feature defines money-adjacent authority, state transitions, and audit requirements.

**Organization**: Group tasks by user story so each sovereign checkout slice remains reviewable, traceable, and independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependency)
- **[Story]**: Which user story or slice the task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions
- Keep every task traceable to `SACP` / `SACP-36` / `SACP-2` / `SACPM`

## Mandatory Traceability

Every task set in this feature preserves traceability to:

- Jira project key: `SACP`
- Jira work item: `SACP-36`
- Epic key: `SACP-2`
- Protocol scope: `Multi-Protocol`
- Surface scope: `Core`
- Mode scope: `Both`
- Risk level: `Critical`
- Confluence space: `SACPM`
- Confluence spec page: `217284617`
- Confluence plan page: `217284637`
- QA evidence target: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217481217/QA+Evidence+-+SACP-36+-+Sovereign+checkout+session+and+SDE+lifecycle+core`

## Phase 1: Governance & Setup

**Purpose**: Establish the feature-local execution baseline and keep repository, Jira, and Confluence references synchronized.

- [ ] T001 Confirm the branch, Jira issue, spec page, plan page, and QA evidence page references in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`
- [ ] T002 Link the implementation scope and contract baseline in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`
- [ ] T003 Confirm the future implementation directories and package boundaries described in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`

---

## Phase 2: Foundations

**Purpose**: Define the shared domain, authority, persistence, and validation foundations that block all story work.

**CRITICAL**: No user story work begins before these tasks complete.

- [ ] T004 Extend the canonical core design baseline in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/research.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`
- [ ] T005 [P] Define the authority matrix, reversible vs irreversible action classes, and compensation triggers in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`
- [ ] T006 [P] Define the canonical persistence, idempotency, and audit evidence expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`

**Checkpoint**: Foundations complete, story work can proceed in parallel where safe.

---

## Phase 3: User Story 1 - Governed Checkout Session Creation (Priority: P1)

**Goal**: Define the canonical `CheckoutSession` lifecycle and boundaries so later adapters and surfaces share one orchestration model.

**Independent Test**: A reviewer can derive the allowed session states, transitions, actor references, and reversible versus irreversible boundaries from the resulting artifacts without consulting adapter-specific documentation.

### Tests

- [ ] T007 [P] [US1] Define unit and state-machine validation scenarios for `CheckoutSession` in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`
- [ ] T008 [P] [US1] Define contract validation scenarios for the `CheckoutSession` payload in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`

### Implementation

- [ ] T009 [P] [US1] Refine the `CheckoutSession` aggregate fields, invariants, and relationships in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md`
- [ ] T010 [US1] Refine the canonical `CheckoutSession` state machine and transition gates in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`
- [ ] T011 [US1] Define the canonical session command and response expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`
- [ ] T012 [US1] Update scenario walkthroughs and reviewer steps for canonical session behavior in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Sovereign Decision Enforcement (Priority: P1)

**Goal**: Define deterministic `SDE` validation, revocation, and irreversible execution gating semantics for assisted and unattended checkout.

**Independent Test**: A reviewer can determine when an `SDE` is required, how it is evaluated, what blocks execution, and how revocation affects in-flight work.

### Tests

- [ ] T013 [P] [US2] Define policy-evaluation, revocation, expiry, and duplicate-command test scenarios in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`
- [ ] T014 [P] [US2] Define contract validation expectations for `SovereignDecisionEnvelope`, `DecisionEvaluation`, and `ExecutionIntent` in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`

### Implementation

- [ ] T015 [P] [US2] Refine the `SovereignDecisionEnvelope` and `DecisionEvaluation` models in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md`
- [ ] T016 [US2] Refine the authority matrix, policy enforcement points, and action eligibility rules in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`
- [ ] T017 [US2] Refine revocation, expiry, and irreversible execution semantics in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`
- [ ] T018 [US2] Define canonical request/response semantics for authority evaluation and irreversible execution intents in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Correlated Audit and Evidence Trail (Priority: P2)

**Goal**: Define immutable audit, correlation, operator visibility, and QA evidence expectations for every significant decision and transition.

**Independent Test**: A reviewer can trace a session, its decision, policy evaluations, execution attempts, and resulting outcomes through one canonical evidence model.

### Tests

- [ ] T019 [P] [US3] Define audit, timeout, partial-completion, and compensation validation scenarios in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`
- [ ] T020 [P] [US3] Define contract validation expectations for `AuditCorrelationRecord` and correlation identifiers in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`

### Implementation

- [ ] T021 [P] [US3] Refine the `AuditCorrelationRecord` model and correlation rules in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md`
- [ ] T022 [US3] Refine observability, append-only evidence, and operator visibility rules in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`
- [ ] T023 [US3] Define compensation and QA-evidence linkage expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`
- [ ] T024 [US3] Align the QA evidence strategy and planning validation notes with `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`

**Checkpoint**: All planned stories are independently functional and verifiable.

---

## Final Phase: Hardening & Release Readiness

**Purpose**: Close planning with implementation-ready validation, Postman intent, and residual risk handling.

- [ ] T025 Define the Postman collection scope and API validation placeholders in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md`
- [ ] T026 Run cross-artifact consistency validation across `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md`
- [ ] T027 Resolve or explicitly carry forward the open revocation-policy decision in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`
- [ ] T028 Update planning readiness, residual risks, and QA evidence expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/quickstart.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md`

---

## Dependencies & Execution Order

- Phase 1 must complete first because it establishes the execution baseline and traceability.
- Phase 2 blocks all user stories because the authority matrix, persistence expectations, and canonical contracts are shared foundations.
- `US1` should complete before `US2` because `SDE` evaluation and irreversible execution rules rely on the canonical session model.
- `US2` should complete before `US3` because audit and evidence rules depend on final authority and execution semantics.
- Final hardening depends on all intended stories being complete and validated.

## Parallel Execution Examples

- `US1`: T007 and T008 can run in parallel; T009 and T011 can run in parallel once T004 completes.
- `US2`: T013 and T014 can run in parallel; T015 and T018 can run in parallel once T005 completes.
- `US3`: T019 and T020 can run in parallel; T021 and T022 can run in parallel once T006 completes.

## Implementation Strategy

- MVP first: complete Phase 1, Phase 2, and `US1` to lock the canonical session model.
- Increment 2: complete `US2` to lock sovereign decision enforcement and irreversible execution gates.
- Increment 3: complete `US3` to lock correlated audit, operator visibility, and QA evidence semantics.
- Finish with the final hardening phase so Postman scope, residual risk, and planning readiness are explicit before implementation.
