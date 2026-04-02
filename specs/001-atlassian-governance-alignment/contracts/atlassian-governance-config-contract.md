# Contract: Atlassian Governance Config

## Purpose

Define the minimum contract for `config/atlassian/project-governance.json`.

## Scope

This contract governs how repository automation and reviewers consume the local
reflection of Jira `SACP` and Confluence `SACPM`.

## Required Sections

- `version`
- `status`
- `verified_at`
- `pending_verifications`
- `atlassian.site_url`
- `atlassian.cloud_id`
- `atlassian.jira`
- `atlassian.confluence`
- `traceability_policy`

## Jira Contract

The `atlassian.jira` object MUST contain:

- `project_key`
- `project_name`
- `project_id`
- `issue_types.actual_available`
- `issue_types.localized_names`
- `issue_types.ids`
- `custom_fields`
- `labels`
- `branch_rules`

`custom_fields` MUST include at least:

- `protocol_scope`
- `surface_scope`
- `mode_scope`
- `risk_level`
- `confluence_page`
- `postman_required`
- `qa_evidence_required`

Each custom field entry MUST contain:

- `id`
- `name`

## Confluence Contract

The `atlassian.confluence` object MUST contain:

- `space_key`
- `space_name`
- `space_id`
- `home_page_id`
- `page_tree`

`page_tree` MUST represent the current governance hierarchy used by the project.

## Traceability Contract

Any feature that uses this config MUST be able to derive:

- Jira project key
- Jira issue type names or IDs
- Confluence space key
- Confluence page identifiers
- branch naming convention

## Change Rules

- Any change in Jira issue types or field IDs MUST update this contract consumer.
- Any change in Confluence hierarchy MUST update `page_tree`.
- Any mismatch between Jira/Confluence live state and this file MUST be treated as
  a governance defect.
