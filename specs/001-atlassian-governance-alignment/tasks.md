# Tasks: Atlassian Governance Alignment for Spec Kit

**Input**: Design documents from `/specs/001-atlassian-governance-alignment/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/atlassian-governance-config-contract.md`

**Tests**: Manual validation and contract/config verification are mandatory for the implemented scope because this feature changes governance rules, template enforcement, and traceability requirements.

**Organization**: Group tasks by user story so each governance slice remains reviewable, traceable, and independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependency)
- **[Story]**: Which user story or slice the task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions
- Keep every task traceable to `SACP` / `SACP-9` / `SACP-7` / `SACPM`

## Mandatory Traceability

Every task set in this feature preserves traceability to:

- Jira project key: `SACP`
- Jira work item: `SACP-9`
- Epic key: `SACP-7`
- Protocol scope: `Internal`
- Surface scope: `Runbooks`
- Mode scope: `N/A`
- Risk level: `Medium`
- Confluence space: `SACPM`
- Confluence page: `217186305`
- QA evidence target: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217415681/QA+Evidence+-+SACP-9+-+Atlassian+governance+alignment+for+Spec+Kit`

## Phase 1: Governance & Setup

**Purpose**: Establish the feature-local traceability scaffolding and the branch/tooling compatibility boundary.

- [ ] T001 Confirm the compliant Gitflow branch naming and compatibility note in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/quickstart.md`
- [ ] T002 Link the feature traceability metadata and current Atlassian references in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/plan.md`
- [ ] T003 Confirm the feature artifact structure expected by the plan in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/plan.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/contracts/atlassian-governance-config-contract.md`

---

## Phase 2: Foundations

**Purpose**: Persist the shared governance contract and repository-wide rules that block all user stories.

**CRITICAL**: No user story work begins before these tasks complete.

- [ ] T004 Extend the canonical governance contract and verified metadata model in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/contracts/atlassian-governance-config-contract.md`
- [ ] T005 [P] Align the human-readable governance policy with the verified Atlassian operating model in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/docs/governance/jira-confluence-operating-model.md`
- [ ] T006 [P] Align constitution-level governance gates with the feature plan in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/memory/constitution.md`

**Checkpoint**: Foundations complete, story work can proceed in parallel where safe.

---

## Phase 3: User Story 1 - Governed Feature Setup (Priority: P1)

**Goal**: Persist the real Jira and Confluence governance state so reviewers and automation can discover authoritative project metadata quickly.

**Independent Test**: A reviewer can inspect the repository and identify Jira `SACP`, Confluence `SACPM`, the baseline epic/page map, localized issue types, and custom field IDs in under five minutes.

### Tests

- [ ] T007 [P] [US1] Validate the governance config shape against `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/contracts/atlassian-governance-config-contract.md` using `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json`
- [ ] T008 [P] [US1] Re-verify the documented Jira and Confluence baseline described in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/docs/governance/jira-confluence-operating-model.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/quickstart.md`

### Implementation

- [ ] T009 [US1] Persist the verified Jira project metadata, issue type names, issue type IDs, and custom field IDs in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json`
- [ ] T010 [P] [US1] Persist the Confluence space tree, page IDs, and epic mother-page mapping in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json`
- [ ] T011 [US1] Document the authoritative Jira/Confluence operating rules, known deviations, and pending verifications in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/docs/governance/jira-confluence-operating-model.md`
- [ ] T012 [US1] Surface the governance entry points for maintainers in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/README.md`

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Spec Kit Traceability Enforcement (Priority: P1)

**Goal**: Make Jira and Confluence metadata mandatory in Spec Kit so future features cannot bypass governance.

**Independent Test**: A reviewer opens the Spec Kit templates and confirms they require Jira, epic, Confluence page, scope, and risk metadata that matches the live `SACP` configuration.

### Tests

- [ ] T013 [P] [US2] Review the mandatory governance fields in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/templates/spec-template.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/templates/plan-template.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/templates/tasks-template.md` against `FR-003`
- [ ] T014 [P] [US2] Re-run the Spec Kit planning flow documented in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/quickstart.md` to confirm the templates carry the required traceability markers

### Implementation

- [ ] T015 [P] [US2] Enforce mandatory traceability fields in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/templates/spec-template.md`
- [ ] T016 [P] [US2] Enforce mandatory Jira/Confluence linkage and field-ID references in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/templates/plan-template.md`
- [ ] T017 [P] [US2] Enforce task-level traceability dimensions and QA/Postman expectations in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/templates/tasks-template.md`
- [ ] T018 [US2] Align the repository-level governance guidance with the template rules in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/.specify/memory/constitution.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/README.md`

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Jira-Key Branch Compliance (Priority: P2)

**Goal**: Keep the active feature branch compliant with the Jira-key naming convention without hiding the current Spec Kit compatibility workaround.

**Independent Test**: The branch name contains `SACP-9`, and the spec and quickstart explain how the branch naming convention coexists with the `SPECIFY_FEATURE` override.

### Tests

- [ ] T019 [P] [US3] Validate that the compliant branch name and compatibility bridge are documented consistently in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md`, `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/plan.md`, and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/quickstart.md`

### Implementation

- [ ] T020 [US3] Confirm the active branch remains on the Jira-key convention and record the compliant branch reference in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md`
- [ ] T021 [P] [US3] Persist the branch rules and compatibility note in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/quickstart.md`
- [ ] T022 [US3] Update the branch-governance narrative and remaining drift notes in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/docs/governance/jira-confluence-operating-model.md`

**Checkpoint**: All planned stories are independently functional and verifiable.

---

## Final Phase: Hardening & Release Readiness

**Purpose**: Close the governance slice with validation evidence and residual risk review.

- [ ] T023 Run JSON/config validation for `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/config/atlassian/project-governance.json` and record the result in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/quickstart.md`
- [ ] T024 Run end-to-end Jira/Confluence governance validation and record the expected QA evidence target in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md`
- [ ] T025 Resolve or explicitly carry forward the open governance questions in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md` and `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/docs/governance/jira-confluence-operating-model.md`
- [ ] T026 Update the implementation status, residual risks, and delivery notes in `/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/plan.md`

---

## Dependencies & Execution Order

- Phase 1 must complete first because it establishes the feature-local traceability and compatibility context.
- Phase 2 blocks all user stories because `config/atlassian/project-governance.json`, the operating model, and the constitution are shared governance foundations.
- `US1` should complete before `US2` so template enforcement references the verified field IDs and governance rules already persisted.
- `US3` depends on the branch rules established in Phase 2 and should complete after the compliant branch naming strategy is explicit in the governance config.
- Final hardening depends on all intended stories being complete and validated.

## Parallel Execution Examples

- `US1`: T007 and T008 can run in parallel; T009 and T010 can run in parallel once T004 completes.
- `US2`: T013 and T014 can run in parallel; T015, T016, and T017 can run in parallel once T006 completes.
- `US3`: T019 and T021 can run in parallel once branch compliance is confirmed and the feature docs are in place.

## Implementation Strategy

- MVP first: complete Phase 1, Phase 2, and `US1` to make the verified governance state discoverable.
- Increment 2: complete `US2` to make the governance durable through Spec Kit enforcement.
- Increment 3: complete `US3` to keep branch-governance drift closed and document the Spec Kit compatibility bridge.
- Finish with the final hardening phase so QA evidence, residual risks, and rollback assumptions stay explicit.
