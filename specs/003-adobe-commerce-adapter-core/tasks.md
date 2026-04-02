# Tasks: Adobe Commerce Authoritative Adapter Core

**Input**: Design documents from `/specs/003-adobe-commerce-adapter-core/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/adobe-commerce-adapter-contract.md`

**Tests**: Unit, integration, contract, simulation, Postman, and manual authority-boundary validation are mandatory for this scope because the feature defines authoritative commerce behavior, order-submission semantics, and audit requirements.

**Organization**: Group tasks by user story so each Adobe authority slice remains reviewable, traceable, and independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependency)
- **[Story]**: Which user story or slice the task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions
- Keep every task traceable to `SACP` / `SACP-65` / `SACP-3` / `SACPM`

## Mandatory Traceability

Every task set in this feature preserves traceability to:

- Jira project key: `SACP`
- Jira work item: `SACP-65`
- Epic key: `SACP-3`
- Protocol scope: `Multi-Protocol`
- Surface scope: `Adobe Commerce`
- Mode scope: `Both`
- Risk level: `High`
- Confluence space: `SACPM`
- Confluence spec page: `217415700`
- Confluence plan page: `217219080`
- QA evidence target: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186327/QA+Evidence+-+SACP-65+-+Adobe+Commerce+authoritative+adapter+core`

## Phase 1: Governance & Setup

**Purpose**: Establish the feature-local execution baseline and keep repository, Jira, and Confluence references synchronized.

- [ ] T001 Confirm the branch, Jira issue, spec page, plan page, and QA evidence page references in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md`
- [ ] T002 Link the implementation scope and contract baseline in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`
- [ ] T003 Confirm the feature artifact structure and future adapter package boundaries described in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`

---

## Phase 2: Foundations

**Purpose**: Define the shared authority, correlation, evidence, and contract foundations that block all story work.

**CRITICAL**: No user story work begins before these tasks complete.

- [ ] T004 Extend the canonical adapter baseline in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/research.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`
- [ ] T005 [P] Define the Adobe-versus-core authority matrix, stale-data refresh rules, and policy enforcement points in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T006 [P] Define the canonical correlation, idempotency, duplicate-detection, and evidence expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`

**Checkpoint**: Foundations complete, story work can proceed in parallel where safe.

---

## Phase 3: User Story 1 - Authoritative Catalog and Product Detail Retrieval (Priority: P1)

**Goal**: Define how Adobe Commerce product discovery and product detail retrieval remain the only authoritative commerce read boundary for later agent surfaces.

**Independent Test**: A reviewer can derive which catalog and product fields are Adobe-authoritative, how unavailable products are surfaced, and how stale snapshots are invalidated without consulting implementation notes.

### Tests

- [ ] T007 [P] [US1] Define catalog and product-detail validation scenarios in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md`
- [ ] T008 [P] [US1] Define contract validation expectations for `AdobeCatalogSnapshot` and `AdobeProductDetailSnapshot` in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`

### Implementation

- [ ] T009 [P] [US1] Refine the `AdobeCatalogSnapshot` and `AdobeProductDetailSnapshot` aggregates, invariants, and stale-data semantics in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md`
- [ ] T010 [US1] Refine authoritative catalog/product retrieval, failure handling, and refresh expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T011 [US1] Define canonical read-boundary request/response semantics in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`
- [ ] T012 [US1] Update reviewer walkthroughs and authority notes for catalog and product-detail behavior in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md`

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Authoritative Cart and Pricing Lifecycle (Priority: P1)

**Goal**: Define deterministic cart ownership, totals authority, caller-price rejection, and partial-cart handling semantics with Adobe Commerce as sole pricing authority.

**Independent Test**: A reviewer can determine how cart creation, cart mutation, totals refresh, pricing drift, and partial line-item acceptance behave and verify that caller-supplied prices never become authoritative.

### Tests

- [ ] T013 [P] [US2] Define cart mutation, totals recalculation, pricing-drift, and caller-price rejection scenarios in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md`
- [ ] T014 [P] [US2] Define contract validation expectations for `AdobeCartReference` and cart-scoped `CommerceAuthorityOutcome` in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`

### Implementation

- [ ] T015 [P] [US2] Refine the `AdobeCartReference` model, state set, and totals-authority invariants in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md`
- [ ] T016 [US2] Refine cart create/update/remove/summary semantics, totals refresh rules, and partial-application handling in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T017 [US2] Refine explicit caller-price rejection and stale-cart handling expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T018 [US2] Define canonical cart command and authority-outcome semantics in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Order Submission and Checkout Correlation (Priority: P2)

**Goal**: Define replay-safe Adobe order submission, uncertain-outcome handling, and audit correlation back to `CheckoutSession`, `ExecutionIntent`, and `SDE`.

**Independent Test**: A reviewer can trace one order attempt from authorized checkout context to Adobe order outcome, including duplicate detection, timeout handling, and reconciliation expectations.

### Tests

- [ ] T019 [P] [US3] Define duplicate-order, timeout, uncertain-outcome, and reconciliation validation scenarios in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md`
- [ ] T020 [P] [US3] Define contract validation expectations for `AdobeOrderReference`, order-scoped `CommerceAuthorityOutcome`, and `AdapterAuditRecord` in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`

### Implementation

- [ ] T021 [P] [US3] Refine the `AdobeOrderReference`, `CommerceAuthorityOutcome`, and `AdapterAuditRecord` models in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md`
- [ ] T022 [US3] Refine order submission sequencing, uncertain-outcome treatment, and reconciliation workflow expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T023 [US3] Refine duplicate-detection, compensation, and operator-visible evidence expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T024 [US3] Align the QA evidence and audit-correlation walkthrough with `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`

**Checkpoint**: All planned stories are independently functional and verifiable.

---

## Final Phase: Hardening & Release Readiness

**Purpose**: Close planning with implementation-ready validation, Postman intent, and residual risk handling.

- [ ] T025 Define the Postman collection scope and adapter validation placeholders in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md`
- [ ] T026 Run cross-artifact consistency validation across `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md`
- [ ] T027 Resolve or explicitly carry forward the open Adobe order-outcome verification question in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`
- [ ] T028 Update planning readiness, residual risks, and QA evidence expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/quickstart.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md`

---

## Dependencies & Execution Order

- Phase 1 must complete first because it establishes execution traceability and artifact boundaries.
- Phase 2 blocks all user stories because the authority matrix, idempotency rules, and correlation model are shared foundations.
- `US1` should complete before `US2` because authoritative cart behavior depends on the canonical read boundary and product-authority semantics.
- `US2` should complete before `US3` because order submission semantics depend on final cart authority, totals handling, and duplicate-protection rules.
- Final hardening depends on all intended stories being complete and validated.

## Parallel Execution Examples

- `US1`: T007 and T008 can run in parallel; T009 and T011 can run in parallel once T004 completes.
- `US2`: T013 and T014 can run in parallel; T015 and T018 can run in parallel once T005 completes.
- `US3`: T019 and T020 can run in parallel; T021 and T022 can run in parallel once T006 completes.

## Implementation Strategy

- MVP first: complete Phase 1, Phase 2, and `US1` to lock the authoritative Adobe read boundary.
- Increment 2: complete `US2` to lock cart ownership, totals authority, and caller-price rejection.
- Increment 3: complete `US3` to lock order submission correlation, uncertain-outcome handling, and audit evidence semantics.
- Finish with the final hardening phase so Postman scope, residual risk, and QA evidence readiness are explicit before implementation.
