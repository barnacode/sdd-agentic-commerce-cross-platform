# Research: Atlassian Governance Alignment for Spec Kit

## Decision 1: Treat Jira and Confluence as operational source of truth

- **Decision**: Use live Jira `SACP` and Confluence `SACPM` state as the authority
  for issue types, field IDs, page IDs, and hierarchy.
- **Rationale**: The repository cannot safely infer or invent admin state. Live
  Atlassian metadata is the only authoritative operational source.
- **Alternatives considered**:
  - Rely on handoff notes only: rejected because handoff text was already stale on
    issue type and field availability.
  - Define repo-only conventions first: rejected because it would permit drift.

## Decision 2: Persist localized Jira issue type names

- **Decision**: Persist localized operational names such as `Historia`, `Error`,
  `Tarea`, and `Subtarea` in the governance config.
- **Rationale**: Jira issue creation failed when English names were used. Using the
  real localized names avoids automation failures.
- **Alternatives considered**:
  - Normalize to English names only: rejected because the Jira API expects the
    localized project values.
  - Hide names and store IDs only: rejected because human review also matters.

## Decision 3: Use machine-readable governance config plus human-readable operating model

- **Decision**: Maintain both `config/atlassian/project-governance.json` and
  `docs/governance/jira-confluence-operating-model.md`.
- **Rationale**: Automation needs stable field IDs and page IDs, while reviewers
  need narrative rules and operating context.
- **Alternatives considered**:
  - Markdown only: rejected because field IDs are better consumed as structured data.
  - JSON only: rejected because governance decisions and tradeoffs become opaque.

## Decision 4: Enforce governance in Spec Kit templates

- **Decision**: Make Jira, epic, Confluence, protocol, surface, mode, and risk
  metadata mandatory in `spec`, `plan`, and `tasks`.
- **Rationale**: Governance that depends on memory or reviewer habit is not durable.
- **Alternatives considered**:
  - Leave governance in README only: rejected because templates would still allow omissions.
  - Enforce later during tasks only: rejected because traceability must begin at spec time.

## Decision 5: Keep Gitflow + Jira-key branch naming and bridge Spec Kit with override

- **Decision**: Keep the actual branch as
  `feature/SACP-9-atlassian-governance-alignment` and use `SPECIFY_FEATURE` when a
  Spec Kit script requires a numeric feature identifier.
- **Rationale**: The repo policy now requires Jira-key branch naming, but Spec Kit
  bash scripts still validate numeric/timestamp feature names.
- **Alternatives considered**:
  - Revert to numeric branch naming: rejected because it weakens Jira traceability.
  - Patch Spec Kit scripts immediately in this feature: rejected because the current
    slice is about governance alignment, not toolchain redesign.
