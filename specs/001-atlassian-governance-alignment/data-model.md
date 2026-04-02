# Data Model: Atlassian Governance Alignment for Spec Kit

## JiraProjectGovernance

- **Purpose**: Represent the verified Jira project state used by the repository.
- **Fields**:
  - `project_key`
  - `project_id`
  - `project_name`
  - `bootstrap_issue_key`
  - `issue_types.actual_available[]`
  - `issue_types.localized_names`
  - `issue_types.ids`
  - `custom_fields`
  - `labels`
  - `branch_rules`
- **Invariants**:
  - `project_key` must be `SACP` for this repository
  - issue type names and IDs must match live Jira state
  - custom field IDs must be usable in Jira issue payloads

## ConfluenceSpaceGovernance

- **Purpose**: Represent the verified Confluence documentation structure.
- **Fields**:
  - `space_key`
  - `space_id`
  - `space_name`
  - `home_page_id`
  - `page_tree`
  - `confluence_blueprints`
- **Invariants**:
  - `space_key` must be `SACPM` for this repository
  - page IDs must resolve to current Confluence pages
  - page titles must reflect the agreed governance tree

## TraceabilityBinding

- **Purpose**: Correlate Jira, Confluence, Git, and local feature artifacts.
- **Fields**:
  - `jira_project_key`
  - `jira_issue_key`
  - `epic_key`
  - `confluence_space`
  - `confluence_page`
  - `git_branch`
  - `spec_path`
  - `protocol_scope`
  - `surface_scope`
  - `mode_scope`
  - `risk_level`
  - `postman_required`
  - `qa_evidence_required`
- **Invariants**:
  - no relevant feature should exist without this minimum binding
  - the branch should include the Jira issue key when possible
  - `confluence_page` should be known before planning

## SpecKitGovernanceRequirement

- **Purpose**: Define the governance metadata required by planning artifacts.
- **Fields**:
  - `required_spec_fields[]`
  - `required_plan_fields[]`
  - `required_tasks_dimensions[]`
- **Invariants**:
  - spec, plan, and tasks templates remain mutually consistent
  - mandatory fields reflect current Jira and Confluence operational reality
