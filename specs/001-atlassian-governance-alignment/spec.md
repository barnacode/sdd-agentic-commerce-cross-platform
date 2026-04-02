# Feature Specification: Atlassian Governance Alignment for Spec Kit

**Feature Branch**: `[feature/SACP-9-atlassian-governance-alignment]`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Persist the Jira and Confluence configuration, integrate it in main, return to this branch, and create the spec."

**Spec Quality Target**: `SQ4 - Governed Architecture`

## Executive Summary *(mandatory)*

This feature formalizes the repository governance model that links Jira, Confluence,
Gitflow, and Spec Kit for the project. The outcome is a reviewable operating model
where relevant work has explicit Jira and Confluence traceability, the repository
knows the real Jira issue types and field identifiers, and future specs and plans
must carry the required governance metadata.

## Context & Objectives *(mandatory)*

- **Problem**: The project already had Jira and Confluence enabled, but the repository
  did not have an authoritative, versioned source describing the real Jira issue
  types, the Confluence structure, the custom field identifiers, and the minimum
  traceability required by Spec Kit.
- **Primary Actor(s)**: Principal architect, repository maintainer, technical lead,
  QA operator
- **Objective**: Ensure all relevant work in the repository can be traced to Jira and
  Confluence using the actual project configuration and enforce that requirement in
  Spec Kit artifacts.
- **In Scope**:
  - canonical Jira and Confluence repository configuration
  - Confluence documentation structure for governance and feature documentation
  - Jira issue type and custom field alignment with repository expectations
  - Spec Kit template hardening for mandatory traceability
  - alignment of the active branch with the Jira-key naming convention
- **Out of Scope**:
  - changing payment or commerce runtime behavior
  - redefining the MVP product scope
  - automating Jira administration
  - changing external vendor APIs

## Constraints *(mandatory)*

- The authoritative Jira project is `SACP`.
- The authoritative Confluence space is `SACPM`.
- Existing Atlassian configuration must be used as truth, not assumed from prior notes.
- The active branch for this feature must include the Jira key `SACP-9`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Governed Feature Setup (Priority: P1)

As a repository maintainer, I need the repository to expose the real Jira and
Confluence governance configuration so that new work can be traced without relying
on memory or informal conventions.

**Why this priority**: This is the prerequisite for governed planning and delivery.

**Independent Test**: A reviewer can open the repository configuration and identify
the active Jira project, Confluence space, initial epic set, and custom field IDs.

**Acceptance Scenarios**:

1. **Given** the repository governance files, **When** a maintainer reviews them,
   **Then** the maintainer can identify the Jira project key, Confluence space, and
   real issue types in use.
2. **Given** the repository governance files, **When** a maintainer inspects them,
   **Then** the maintainer can identify the field IDs for `Protocol Scope`,
   `Confluence Page`, and the other mandatory custom fields.

---

### User Story 2 - Spec Kit Traceability Enforcement (Priority: P1)

As an architect, I need Spec Kit artifacts to require Jira and Confluence metadata
so that future specs, plans, and tasks cannot omit operational traceability.

**Why this priority**: Without template-level enforcement, the governance model is
not durable.

**Independent Test**: A reviewer opens the `spec`, `plan`, and `tasks` templates and
confirms they require Jira, epic, Confluence, risk, and scope metadata.

**Acceptance Scenarios**:

1. **Given** a new feature specification, **When** it is created from the template,
   **Then** it must include Jira project, Jira issue, epic, Confluence page, and the
   new governance fields.
2. **Given** a new implementation plan, **When** it is created from the template,
   **Then** it must include the Jira and Confluence linkage and the actual Jira field
   identifiers used by the project.

---

### User Story 3 - Jira-Key Branch Compliance (Priority: P2)

As a technical lead, I need the active branch to follow the Jira-key naming
convention so that the repository governance model remains consistent end-to-end.

**Why this priority**: A compliant branch name removes an avoidable governance gap.

**Independent Test**: The branch name contains the Jira issue key and the spec
reflects that compliant branch name in its traceability section.

**Acceptance Scenarios**:

1. **Given** the active branch for this feature, **When** the team reviews the
   feature documentation, **Then** the branch name includes `SACP-9` and is
   treated as compliant with the Gitflow and Jira traceability convention.

### Edge Cases *(mandatory)*

- What happens when Jira issue types exist but use localized names instead of the
  English names expected by automation?
- How does the system handle legacy branches that predate the enforced Jira-key
  naming convention?
- How is traceability preserved when a Jira field exists for one issue type but is
  not exposed for another issue type?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST contain a machine-readable configuration that
  records the active Jira project, Confluence space, issue types, and Jira custom
  field IDs used for traceability.
- **FR-002**: The repository MUST contain a human-readable operating model that
  explains the Jira and Confluence structure and the required linkage rules.
- **FR-003**: Spec Kit templates MUST require Jira project, Jira issue, epic,
  Confluence space, Confluence page, protocol scope, surface scope, mode scope,
  and risk level for relevant work.
- **FR-004**: The governance artifacts MUST record the initial Jira epic set and
  their corresponding Confluence mother pages.
- **FR-005**: The governance artifacts MUST explicitly record any known deviations
  and pending decisions that still affect Jira and Confluence traceability.

### Key Entities *(include if feature involves data)*

- **Jira Governance Configuration**: Canonical repository representation of project
  keys, issue types, field IDs, and labels.
- **Confluence Governance Structure**: Canonical representation of the space tree,
  page IDs, and documentation roles.
- **Traceability Record**: The minimum set of references required to correlate Jira,
  Confluence, branch, and Spec Kit artifacts.

## Sovereign Decision Model *(mandatory for money, consent, trust, or delegation flows)*

- **Decision Required**: No
- This feature governs repository traceability and delivery process. It does not
  authorize money movement, consent, delegated checkout, or trust-sensitive runtime
  behavior.

## Trust & Protocol Boundaries *(mandatory)*

- **Trust Boundary**: Governance is enforced at the repository planning layer and
  cross-referenced with Jira and Confluence.
- **Protocol Roles**:
  - `MCP` is used to inspect and update Jira and Confluence.
  - Jira remains authoritative for work items, issue types, and custom field values.
  - Confluence remains authoritative for documentation hierarchy and evidence pages.
- **Authority/Source of Truth**:
  - Jira `SACP` is authoritative for work item taxonomy and field IDs.
  - Confluence `SACPM` is authoritative for documentation tree and page IDs.
  - The repository is authoritative for local governance rules once verified against
    Jira and Confluence.
- **Privacy/Security Notes**: No secrets, tokens, or sensitive runtime customer data
  should be persisted in the governance artifacts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can identify the real Jira issue types and custom field IDs
  from repository governance artifacts in under five minutes.
- **SC-002**: `spec`, `plan`, and `tasks` templates require the governance metadata
  needed for Jira and Confluence traceability.
- **SC-003**: The governance operating model explicitly documents the current Jira
  project, Confluence space, epic baseline, and the Jira-key branch convention.
- **SC-004**: The feature is traceable to one Jira work item and one Confluence page.

## Assumptions *(mandatory)*

- **ASSUMPTION**: Jira `SACP` and Confluence `SACPM` remain the authoritative
  Atlassian surfaces for this repository.
- **ASSUMPTION**: Once renamed, this feature branch becomes the compliant reference
  branch for the governance alignment work item.

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Issue Key**: `SACP-9`
- **Epic Key**: `SACP-7`
- **Protocol Scope**: `Internal`
- **Surface Scope**: `Runbooks`
- **Mode Scope**: `N/A`
- **Risk Level**: `Medium`
- **Confluence Space**: `SACPM`
- **Confluence Page**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186305/Feature+SACP-9+-+Atlassian+governance+alignment+for+Spec+Kit`
- **Related QA Evidence**: `PENDING VERIFICATION`
- **Postman Required**: `No`
- **Postman Impact**: `N/A`
- **QA Evidence Required**: `Yes`

## Open Questions *(include only if unresolved and material)*

- **OPEN QUESTION**: Should the validation issue `SACP-8` remain in Jira as a
  documented probe, or should it be removed after the governance alignment is accepted?
- **PENDING VERIFICATION**: Whether the obsolete remote branch name will be retained
  as historical residue or removed after the rename is complete.

## Spec Quality Gate *(mandatory before planning)*

- **Current Quality Level**: `SQ4`
- **Ready for `/speckit.plan`**: Yes
- **Quality Notes**: The spec is planable and reviewable and assumes the feature
  branch is aligned to the Jira-key naming convention.
