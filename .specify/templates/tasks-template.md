---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: `plan.md`, `spec.md`, and any required supporting artifacts

**Tests**: Tests are mandatory for the implemented scope. If a task changes contracts,
money movement, trust, security, or state transitions, include the corresponding
test coverage explicitly.

**Organization**: Group tasks by user story or vertical slice so each slice remains
reviewable, traceable, and independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependency)
- **[Story]**: Which user story or slice the task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions
- Include artifact references where relevant (`FR-###`, `SC-###`, `surface.spec`, etc.)

## Mandatory Traceability

Every task set MUST preserve traceability to:

- specification requirement(s)
- plan section or specialized spec
- Jira work item
- Confluence documentation target when applicable

## Phase 1: Governance & Setup

**Purpose**: Establish traceability, scope alignment, and project scaffolding

- [ ] T001 Create or confirm the correct Gitflow branch type for the work
- [ ] T002 Link feature scope to Jira and Confluence references in `/specs/[###-feature-name]/`
- [ ] T003 Capture or update ADR references required by the plan
- [ ] T004 Create or align directory structure defined in `plan.md`
- [ ] T005 [P] Establish contract, fixture, simulation, and Postman asset folders required by the feature

---

## Phase 2: Foundations

**Purpose**: Implement prerequisites that block all user stories

**CRITICAL**: No user story work begins before these tasks complete

- [ ] T006 Implement or extend core domain models and invariants
- [ ] T007 [P] Implement trust, authorization, or policy enforcement prerequisites
- [ ] T008 [P] Implement idempotency, replay protection, or state guard prerequisites
- [ ] T009 Implement shared error handling, logging, and correlation IDs
- [ ] T010 Implement baseline contracts or adapters required across stories

**Checkpoint**: Foundations complete, story work can proceed in parallel where safe

---

## Phase 3: User Story 1 - [Title] (Priority: P1)

**Goal**: [What this story delivers]

**Independent Test**: [How this story is validated independently]

### Tests

- [ ] T011 [P] [US1] Add unit tests for the core story invariants
- [ ] T012 [P] [US1] Add integration or contract tests for the story flow
- [ ] T013 [P] [US1] Add simulation coverage if the story touches trust, money, or critical state
- [ ] T014 [P] [US1] Create or update Postman requests and automated checks for changed endpoints

### Implementation

- [ ] T015 [P] [US1] Implement domain entities or value objects in [path]
- [ ] T016 [US1] Implement application/service logic in [path]
- [ ] T017 [US1] Implement protocol surface, adapter, or contract changes in [path]
- [ ] T018 [US1] Implement observability and audit trail requirements in [path]
- [ ] T019 [US1] Update traceability artifacts and documentation references

**Checkpoint**: User Story 1 is independently functional and verifiable

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [What this story delivers]

**Independent Test**: [How this story is validated independently]

### Tests

- [ ] T020 [P] [US2] Add unit tests for the core story invariants
- [ ] T021 [P] [US2] Add integration or contract tests for the story flow
- [ ] T022 [P] [US2] Create or update Postman requests and automated checks for changed endpoints

### Implementation

- [ ] T023 [P] [US2] Implement domain or adapter changes in [path]
- [ ] T024 [US2] Implement service or orchestration logic in [path]
- [ ] T025 [US2] Implement contract, protocol, or persistence changes in [path]
- [ ] T026 [US2] Update observability, runbooks, or documentation references

**Checkpoint**: User Story 2 is independently functional and verifiable

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [What this story delivers]

**Independent Test**: [How this story is validated independently]

### Tests

- [ ] T027 [P] [US3] Add unit tests for the core story invariants
- [ ] T028 [P] [US3] Add integration, contract, or simulation tests as applicable
- [ ] T029 [P] [US3] Create or update Postman requests and automated checks for changed endpoints

### Implementation

- [ ] T030 [P] [US3] Implement domain or adapter changes in [path]
- [ ] T031 [US3] Implement orchestration or workflow logic in [path]
- [ ] T032 [US3] Update contracts, documentation, and observability in [path]

**Checkpoint**: All planned stories are independently functional and verifiable

---

## Final Phase: Hardening & Release Readiness

**Purpose**: Cross-cutting quality gates before delivery

- [ ] T033 Run the defined test suite and record results
- [ ] T034 Run QA validation and record evidence
- [ ] T035 If QA finds defects, create Jira bug items and document diagnosis/resolution in Confluence
- [ ] T036 Validate contract changes and update related collections or fixtures
- [ ] T037 Validate rollback assumptions and operational readiness
- [ ] T038 Update feature documentation, audit references, and open risks

---

## Dependencies & Execution Order

- Governance & Setup must complete first
- Foundations block all user story work
- User stories may proceed in parallel only after foundations are complete and only
  when they do not create conflicting file or contract changes
- Hardening and release readiness depend on all intended stories being complete

## Notes

- Each story should map back to `spec.md` and `plan.md`
- Prefer vertical slices over horizontal technical task dumps
- Explicitly call out task dependencies when a later task depends on contracts,
  migrations, or trust-layer artifacts from an earlier one
- Do not omit tests for implemented behavior
