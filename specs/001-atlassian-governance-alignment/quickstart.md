# Quickstart: Atlassian Governance Alignment for Spec Kit

## Objective

Use the verified governance model for future feature work.

## Inputs

- Jira project: `SACP`
- Confluence space: `SACPM`
- Branch naming: `feature/<jira-key>-<slug>`
- Governance config: `config/atlassian/project-governance.json`

## Workflow

1. Create or identify the Jira issue and epic in `SACP`.
2. Create or reserve the Confluence page in `SACPM`.
3. Open a Gitflow branch that includes the Jira issue key.
4. Create the local spec and populate the mandatory traceability section.
5. Continue with plan and tasks using the same Jira and Confluence references.

## Notes For Spec Kit Scripts

Current Spec Kit bash scripts still expect numeric or timestamp feature identifiers.
When a script requires that pattern, use:

```bash
SPECIFY_FEATURE=001-atlassian-governance-alignment <command>
```

This is a compatibility bridge for tooling and does not replace the actual Gitflow
branch naming policy.
