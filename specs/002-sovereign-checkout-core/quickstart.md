# Quickstart: Sovereign Checkout Session and SDE Lifecycle Core

## Objective

Validate that the sovereign checkout core design is reviewable before implementation.

## Inputs

- Jira issue: `SACP-36`
- Epic: `SACP-2`
- Branch: `feature/SACP-36-sovereign-checkout-core`
- Spec page: `217284617`
- QA evidence page: `217481217`

## Review Workflow

1. Open [`spec.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/spec.md) and confirm the sovereign decision model is explicit.
2. Open [`plan.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/plan.md) and confirm the authority matrix separates trust, orchestration, commerce, payment, and audit domains.
3. Open [`data-model.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/data-model.md) and confirm the aggregates and state sets match the spec.
4. Open [`sovereign-checkout-core-contract.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/002-sovereign-checkout-core/contracts/sovereign-checkout-core-contract.md) and confirm canonical payload and event expectations are sufficient for future adapters.
5. Walk through these scenarios:
   - assisted session creation without irreversible execution
   - unattended session with valid `SDE`
   - expired or revoked `SDE`
   - duplicate irreversible execution request
   - partial completion requiring compensation or operator review
6. Record planning validation outcomes in the Confluence QA evidence page for `SACP-36`.

## Notes For Spec Kit Scripts

Current Spec Kit bash scripts still expect numeric or timestamp feature identifiers.
For this feature, use:

```bash
SPECIFY_FEATURE=002-sovereign-checkout-core <command>
```

This keeps Gitflow branch naming with Jira key intact while allowing the Spec Kit
tooling to generate artifacts in `specs/002-sovereign-checkout-core/`.
