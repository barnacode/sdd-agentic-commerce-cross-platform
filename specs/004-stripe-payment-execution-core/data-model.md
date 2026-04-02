# Data Model: Stripe Payment Execution and Webhook Core

## StripePaymentReference

- **Purpose**: Correlate a canonical checkout execution intent to one Stripe payment identity.
- **Core Fields**:
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
- **Invariants**:
  - one active Stripe payment reference per irreversible payment intent unless an explicit replacement flow exists
  - payment reference must bind to authoritative commerce amount context
  - duplicate creation must be detectable

## PaymentExecutionOutcome

- **Purpose**: Canonical outcome emitted by the payment adapter after a Stripe-facing action.
- **Core Fields**:
  - `payment_execution_outcome_id`
  - `operation_type`
  - `source_authority`
  - `result_status`
  - `stripe_refs`
  - `failure_reason`
  - `recorded_at`
- **Invariants**:
  - source authority must be Stripe
  - result status is explicit and non-ambiguous
  - outcome must indicate whether the result is terminal, recoverable, or uncertain

## StripeWebhookEvidence

- **Purpose**: Append-only evidence record for Stripe event delivery and verification.
- **Core Fields**:
  - `stripe_webhook_evidence_id`
  - `stripe_event_id`
  - `stripe_payment_id`
  - `event_type`
  - `verification_status`
  - `received_at`
  - `reconciled_at`
  - `reconciliation_outcome`
  - `evidence_ref`
- **Invariants**:
  - event identity must remain unique and replay-detectable
  - verification result must be explicit before reconciliation is authoritative
  - rejected events never mutate authoritative payment state silently

## PaymentActionRecord

- **Purpose**: Append-only evidence record for local payment actions requested through the Stripe boundary.
- **Core Fields**:
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
- **Invariants**:
  - append-only
  - every irreversible or authority-relevant payment action is recorded
  - duplicate action attempts remain distinguishable

## Relationships

- `StripePaymentReference` binds one canonical payment attempt to one Stripe payment identity.
- `PaymentExecutionOutcome` can describe create, confirm, capture, cancel, retrieve, or reconcile operations.
- `StripeWebhookEvidence` can reconcile one Stripe event to one `StripePaymentReference`.
- `PaymentActionRecord` can correlate local payment actions, Stripe outcomes, and webhook evidence to the same checkout execution context.

## State References

### StripePaymentReference State Set

- `created`
- `awaiting_confirmation`
- `processing`
- `requires_action`
- `requires_capture`
- `succeeded`
- `canceled`
- `failed`
- `uncertain`
- `reconciled`

### PaymentExecutionOutcome State Set

- `accepted`
- `failed`
- `canceled`
- `requires_action`
- `requires_capture`
- `processing`
- `uncertain`

### StripeWebhookEvidence State Set

- `received`
- `verified`
- `rejected`
- `reconciled`
- `ignored`
