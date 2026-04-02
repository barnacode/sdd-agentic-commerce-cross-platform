# Contract: Stripe Payment Execution and Webhook Core

## Purpose

Define the minimum canonical contracts that the Stripe payment adapter must
present to the sovereign checkout core and later agent surfaces.

## Scope

This contract governs the shape and semantics of:

- `StripePaymentReference`
- `PaymentExecutionOutcome`
- `StripeWebhookEvidence`
- `PaymentActionRecord`

## StripePaymentReference Contract

Every canonical Stripe payment reference MUST expose at least:

- `stripe_payment_reference_id`
- `checkout_session_id`
- `decision_id`
- `execution_intent_id`
- `stripe_payment_id`
- `payment_status`
- `capture_policy`
- `authoritative_amount_ref`
- `authoritative_currency`
- `created_at`
- `last_reconciled_at`

The payment reference MUST bind to authoritative commerce amount context and
MUST remain replay-safe for duplicate create semantics.

## PaymentExecutionOutcome Contract

Every canonical payment outcome MUST expose at least:

- `payment_execution_outcome_id`
- `operation_type`
- `source_authority`
- `result_status`
- `stripe_refs`
- `failure_reason`
- `recorded_at`

`result_status` MUST distinguish at least:

- `accepted`
- `failed`
- `canceled`
- `requires_action`
- `requires_capture`
- `processing`
- `uncertain`

## StripeWebhookEvidence Contract

Every webhook evidence record MUST expose at least:

- `stripe_webhook_evidence_id`
- `stripe_event_id`
- `stripe_payment_id`
- `event_type`
- `verification_status`
- `received_at`
- `reconciled_at`
- `reconciliation_outcome`
- `evidence_ref`

Webhook evidence MUST record whether verification succeeded before event data is
allowed to become authoritative for reconciliation.

## PaymentActionRecord Contract

Every payment action record MUST expose enough data to correlate:

- checkout session
- decision
- execution intent
- Stripe payment identity
- requested operation
- idempotency material
- resulting outcome
- evidence timestamp

At minimum it MUST include:

- `payment_action_record_id`
- `checkout_session_id`
- `decision_id`
- `execution_intent_id`
- `stripe_payment_id`
- `operation_type`
- `request_correlation_id`
- `idempotency_material`
- `outcome_status`
- `timestamp`
- `evidence_ref`

## Semantic Rules

- Stripe is the authoritative source for payment execution status and terminal payment outcomes.
- The sovereign checkout core is authoritative for whether an irreversible payment action may be attempted.
- Adobe Commerce remains authoritative for commerce amount and order context bound to the payment.
- Duplicate create, confirm, capture, and cancel attempts MUST be distinguishable and replay-safe.
- Asynchronous Stripe event delivery MUST remain explicit and verified before reconciliation changes canonical payment state.
- Canonical payment contracts MUST preserve correlation back to the sovereign checkout core artifacts and authoritative commerce context.

## Future Interface Implications

When implementation introduces APIs or events, they MUST preserve:

- explicit separation between sovereign execution authority and Stripe payment authority
- explicit duplicate and uncertain-outcome handling
- explicit webhook verification and reconciliation semantics
- compatibility with Postman-based operator validation
