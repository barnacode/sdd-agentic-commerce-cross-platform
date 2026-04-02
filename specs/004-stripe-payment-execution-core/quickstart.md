# Quickstart: Stripe Payment Execution and Webhook Core

## Objective

Validate that the Stripe payment design preserves payment authority, replay
safety, and webhook-driven reconciliation before implementation begins.

## Inputs

- Jira issue: `SACP-94`
- Epic: `SACP-4`
- Branch: `feature/SACP-94-stripe-payment-execution-core`
- Spec page: `217186347`
- Plan page: `217415727`
- QA evidence page: `217186351`

## Review Workflow

1. Open [`spec.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/004-stripe-payment-execution-core/spec.md) and confirm Stripe is authoritative for payment execution state while the core remains authoritative for execution eligibility.
2. Open [`plan.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/004-stripe-payment-execution-core/plan.md) and confirm the authority matrix separates sovereign authority, commerce authority, Stripe payment authority, and webhook evidence.
3. Open [`data-model.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/004-stripe-payment-execution-core/data-model.md) and confirm the payment reference, execution outcome, and webhook evidence aggregates match the spec.
4. Open [`stripe-payment-execution-contract.md`](/Users/jumartgo/www/sdd-agentic-commerce-cross-platform/specs/004-stripe-payment-execution-core/contracts/stripe-payment-execution-contract.md) and confirm canonical payment contracts are sufficient for later API derivation.
5. Walk through these scenarios:
   - replay-safe payment attempt creation
   - duplicate create/confirm/capture request
   - timeout after Stripe accepts a request
   - webhook-first delivery before local synchronous persistence
   - `requires_action` in `Human Not Present` mode
   - revocation after authorization and before final capture
6. Record planning validation outcomes in the Confluence QA evidence page for `SACP-94`.

## Notes For Spec Kit Scripts

Current Spec Kit bash scripts still expect numeric or timestamp feature identifiers.
For this feature, use:

```bash
SPECIFY_FEATURE=004-stripe-payment-execution-core <command>
```

This preserves the Jira-key Gitflow branch while generating artifacts in
`specs/004-stripe-payment-execution-core/`.
