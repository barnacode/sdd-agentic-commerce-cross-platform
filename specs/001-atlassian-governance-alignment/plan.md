# Implementation Plan: Atlassian Governance Alignment for Spec Kit

**Branch**: `[feature/SACP-9-atlassian-governance-alignment]` | **Date**: 2026-04-02 | **Spec**: [/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/001-atlassian-governance-alignment/spec.md)
**Input**: Feature specification from `/specs/001-atlassian-governance-alignment/spec.md`

## Summary

This plan formalizes the repository governance layer that connects Jira `SACP`,
Confluence `SACPM`, Gitflow, and Spec Kit. The implementation approach is document-
 and contract-first: persist the verified Atlassian configuration, define the local
 traceability contract, harden templates so governance metadata is mandatory, and
 keep the actual branch strategy explicit where it diverges from Spec Kit's numeric
 branch assumptions.

## Technical Context

**Language/Version**: Markdown, JSON, Bash, Node.js 22.x  
**Primary Dependencies**: Git, Jira Cloud via Atlassian MCP, Confluence Cloud via Atlassian MCP, Spec Kit bash tooling  
**Storage**: Repository files only (`config/`, `docs/`, `specs/`)  
**Testing**: Manual governance validation, Jira metadata inspection, Confluence structure verification, JSON parse validation  
**Target Platform**: GitHub-hosted repository with Atlassian Cloud integration  
**Project Type**: Spec-driven planning repository  
**Performance Goals**: Reviewer can locate canonical Jira and Confluence traceability data in under 5 minutes  
**Constraints**: Must use verified Jira/Confluence state as source of truth; must preserve Gitflow with Jira-key branch naming; must keep branch/tooling divergence explicit when Spec Kit expects numeric prefixes  
**Scale/Scope**: Repository-wide governance assets, Spec Kit templates, one Jira issue, one Confluence feature page, one local feature directory

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

The target architecture for this feature is a repository-governance slice, not a
runtime service. It introduces a vendor-verified governance configuration layer in
the repo, a human-readable operating model, and Spec Kit enforcement points that
bind future features to Jira and Confluence. Atlassian remains the operational
authority, while the repository becomes the local canonical reflection of that
verified state.

### Bounded Contexts

- **Atlassian Governance Context**: Captures Jira project metadata, issue types,
  field identifiers, Confluence structure, and epic/page correlation.
- **Spec Kit Enforcement Context**: Extends `spec`, `plan`, and `tasks` templates so
  future work cannot omit required traceability metadata.
- **Repository Documentation Context**: Holds the machine-readable config, the
  operating model, and the local feature artifacts derived from the spec graph.

### Layer Mapping

| Layer | Responsibility | Key Artifacts |
|-------|----------------|---------------|
| Sovereign Decision Layer | Not applicable for runtime authorization in this feature | Explicit `No` decision impact in spec |
| Trust Layer | Define authority between Jira, Confluence, Git, and local repo | trust model, authority matrix |
| Commerce Orchestration Layer | Not applicable | N/A |
| Agent Interoperability Layer | Not applicable | N/A |
| Tooling and Context Layer | Bridge Atlassian MCP, Spec Kit scripts, and repo files | `mcp.json`, `scripts/atlassian-mcp-tool.mjs`, `specs/001-*` |
| Payment Execution and Settlement Layer | Not applicable | N/A |
| Observability, Audit and Governance Layer | Persist and enforce traceability requirements | `config/atlassian/project-governance.json`, `docs/governance/*`, templates |

## Protocol Selection Matrix *(mandatory when protocols or external surfaces are involved)*

| Protocol / Interface | Why It Enters | Why Alternatives Do Not | Boundary | Crossing Artifacts |
|----------------------|---------------|--------------------------|----------|--------------------|
| MCP | Required to inspect and update Jira/Confluence from the working environment | Direct admin API integration is unnecessary for this repository-governance slice | External tool boundary to Atlassian | issue metadata, page metadata, comments |
| Git | Required to persist governance state in the repository | No alternative local source of truth exists for versioned repo artifacts | Repo persistence boundary | commits, branch names, feature artifacts |
| Jira Cloud | Authoritative for work item taxonomy and custom field definitions | Repo cannot invent issue type or field state | Work management boundary | issue keys, issue types, field IDs |
| Confluence Cloud | Authoritative for documentation hierarchy and feature pages | Repo cannot invent page IDs or space structure | Documentation boundary | page IDs, page URLs, page hierarchy |

## Domain Model *(mandatory)*

- **JiraProjectGovernance**: Canonical representation of project key, project ID,
  localized issue types, custom fields, and labels. Invariant: values must be
  verified against Jira before being persisted locally.
- **ConfluenceSpaceGovernance**: Canonical representation of the Confluence space,
  root tree, templates, and mother pages. Invariant: page IDs and titles must
  correspond to current Confluence state.
- **TraceabilityBinding**: Correlates Jira issue, epic, Confluence page, branch,
  and local spec paths. Invariant: no relevant feature artifact should exist
  without this minimum binding.
- **SpecKitGovernanceRequirement**: Template-level requirement set for future
  specs, plans, and tasks. Invariant: required governance metadata cannot be omitted.

## Sovereign Decision Model *(mandatory when applicable)*

- **Decision Artifact**: Not applicable to runtime economic authorization
- **Issuance**: N/A
- **Verification**: The feature spec explicitly states `Decision Required: No`
- **Propagation**: Governance data propagates through repo artifacts and Atlassian references, not through payment or delegation protocols
- **Revocation**: Changes are governed by versioned repository updates and Atlassian edits
- **Evidence**: Git commits, Jira issue `SACP-9`, and Confluence page `217186305`

## Trust Model *(mandatory)*

- **Principals**: Repository maintainer, project architect, Jira project owner,
  Confluence space owner
- **Authorized Agents**: Codex acting through Git and Atlassian MCP
- **Trust Artifacts**: Jira issue keys, Confluence page IDs, Git commit SHAs,
  local governance configuration, branch names
- **Policy Enforcement Points**: Spec Kit templates, constitution gates, Jira issue
  creation, Confluence feature page creation, branch naming convention
- **Privacy & Data Minimization**: Only non-sensitive governance metadata should be
  persisted; no tokens or secret material belong in repo artifacts

## Threat Model *(mandatory)*

- **Threat**: Authority confusion between repo documentation and live Jira/Confluence state
- **Impact**: Team follows stale issue types, fields, or page conventions
- **Mitigation**: Treat Jira and Confluence as operational truth and persist only verified values
- **Residual Risk**: Drift may reappear if admins change Jira or Confluence without updating the repo
- **Threat**: Branch naming divergence from Spec Kit expectations
- **Impact**: Automated scripts may fail or produce incorrect paths
- **Mitigation**: Use `SPECIFY_FEATURE` override and document the boundary explicitly
- **Residual Risk**: Future users may forget the override until the tooling is adapted
- **Threat**: Localized Jira issue type names differ from automation assumptions
- **Impact**: Issue creation fails when English names are used
- **Mitigation**: Persist localized names and IDs in machine-readable config
- **Residual Risk**: Locale changes or project reconfiguration would require re-verification

## State Machines & Flows *(mandatory)*

### Core State Machines

- **Governance Alignment Lifecycle**: discovered -> verified -> persisted ->
  enforced -> maintained. Terminal condition for this slice is `enforced`, where
  repo artifacts and templates reflect verified Atlassian state.

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
specs/001-atlassian-governance-alignment/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── contracts/
    └── atlassian-governance-config-contract.md
```

### Specialized Specs To Derive When Applicable

- `authority.spec` equivalent is covered by the operating model and governance config contract
- No protocol surface, payment, or adapter specialized spec is required for this repository-governance slice

## Project Structure

### Current Repository Reality

The repository is a planning-first workspace with `.specify/`, documentation files,
Atlassian support scripts, and the new `specs/001-atlassian-governance-alignment/`
feature directory. It is not yet a fully materialized runtime monorepo.

### Target Structure For This Feature

```text
/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/
├── config/atlassian/project-governance.json
├── docs/governance/jira-confluence-operating-model.md
├── .specify/memory/constitution.md
├── .specify/templates/spec-template.md
├── .specify/templates/plan-template.md
├── .specify/templates/tasks-template.md
└── specs/001-atlassian-governance-alignment/
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    ├── checklists/requirements.md
    └── contracts/atlassian-governance-config-contract.md
```

**Structure Decision**: The feature uses the standard `specs/001-*` local feature
directory even though the active Git branch follows Gitflow with Jira key naming.
This preserves Spec Kit artifact locality without forcing another branch rename.

## Error Handling & Compensation *(mandatory)*

- **Failure Classes**: Atlassian metadata mismatch, branch/tooling mismatch, stale
  repo config, missing Confluence or Jira linkage
- **Retry Strategy**: No automatic retries in repo artifacts; corrections happen by
  explicit edit, verification, and recommit
- **Compensation Strategy**: If a persisted governance value is wrong, update the
  repo artifact, update Jira/Confluence references if needed, and preserve the fix
  through versioned history
- **Operator Visibility**: Mismatch is surfaced in spec, plan, open questions, and
  pending verification markers

## Observability Plan *(mandatory)*

- **Logs**: Not applicable as runtime logs; evidence is repository diffs and Atlassian artifacts
- **Metrics**: Manual governance metrics only, such as traceability completeness and reviewer discovery time
- **Tracing/Correlation**: `SACP-9`, `SACP-7`, Confluence page `217186305`, branch
  `feature/SACP-9-atlassian-governance-alignment`, commit SHAs
- **Audit Trail**: Git history plus Jira comments and Confluence version history

## Test Strategy *(mandatory)*

- **Unit Tests**: N/A
- **Integration Tests**: Manual verification against Jira and Confluence metadata via Atlassian MCP
- **Contract Tests**: Validate the machine-readable governance config against the documented contract
- **Simulation Tests**: N/A
- **Postman Collection Strategy**: `No` for this feature because no runtime endpoint contract changes occur
- **Manual Validation**: Confirm issue types, custom fields, Confluence tree, branch naming, and template requirements
- **QA Failure Workflow**: Any governance defect should create a Jira `Error` or `Tarea`
  under the relevant epic and a Confluence bug analysis or QA evidence page

## Rollout / Migration / Rollback *(mandatory)*

- **Rollout Plan**: Direct, because this feature modifies repository governance and documentation only
- **Migration Requirements**: None beyond keeping Jira `SACP` and Confluence `SACPM` available
- **Rollback Plan**: Revert the repository commits and update Jira/Confluence references if the governance model is rejected

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Ticket(s)**: `SACP-9`
- **Epic Key**: `SACP-7`
- **Protocol Scope**: `Internal`
- **Surface Scope**: `Runbooks`
- **Mode Scope**: `N/A`
- **Risk Level**: `Medium`
- **Confluence Space**: `SACPM`
- **Confluence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186305/Feature+SACP-9+-+Atlassian+governance+alignment+for+Spec+Kit`
- **ADR Links**: `N/A`
- **Gitflow Branch Type**: `feature/`
- **Confluence Page Field ID**: `customfield_10094`
- **Postman Required Field ID**: `customfield_10095`
- **QA Evidence Required Field ID**: `customfield_10096`
- **Postman Collection(s)**: `N/A`
- **QA Evidence Page(s)**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217415681/QA+Evidence+-+SACP-9+-+Atlassian+governance+alignment+for+Spec+Kit`

## Complexity Tracking

> Fill only if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Spec Kit branch compatibility override | Spec Kit setup scripts require numeric/timestamp feature identifiers, while the repo policy now requires Gitflow + Jira-key branch naming | Renaming the branch back to a numeric prefix would violate the current governance convention and remove Jira-key traceability from Gitflow |
