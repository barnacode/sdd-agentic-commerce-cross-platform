# Quickstart: Adobe Commerce Authoritative Adapter Core

## Objective

Validate that the Adobe Commerce adapter design preserves commerce authority and
remains compatible with the sovereign checkout core before implementation begins.

## Inputs

- Jira issue: `SACP-65`
- Epic: `SACP-3`
- Branch: `feature/SACP-65-adobe-commerce-adapter-core`
- Spec page: `217415700`
- Plan page: `217219080`
- QA evidence page: `217186327`

## Review Workflow

1. Open [`spec.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/spec.md) and confirm Adobe Commerce is authoritative for catalog, pricing, cart, and order outcomes.
2. Open [`plan.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/plan.md) and confirm the authority matrix separates Adobe Commerce authority from sovereign checkout authority.
3. Open [`data-model.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/data-model.md) and confirm the cart, order, and authority outcome aggregates match the spec.
4. Open [`adobe-commerce-adapter-contract.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/003-adobe-commerce-adapter-core/contracts/adobe-commerce-adapter-contract.md) and confirm canonical adapter contracts are sufficient for later API derivation.
5. Walk through these scenarios:
   - authoritative product discovery and product detail retrieval
   - cart mutation with caller-supplied price rejection
   - pricing drift between cart review and order submission
   - duplicate order submission attempt
   - uncertain Adobe order outcome after timeout
6. Record planning validation outcomes in the Confluence QA evidence page for `SACP-65`.

## Notes For Spec Kit Scripts

Current Spec Kit bash scripts still expect numeric or timestamp feature identifiers.
For this feature, use:

```bash
SPECIFY_FEATURE=003-adobe-commerce-adapter-core <command>
```

This preserves the Jira-key Gitflow branch while generating artifacts in
`specs/003-adobe-commerce-adapter-core/`.
