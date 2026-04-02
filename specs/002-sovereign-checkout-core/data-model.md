# Data Model: Sovereign Checkout Session and SDE Lifecycle Core

## CheckoutSession

- **Purpose**: Canonical orchestration aggregate for assisted and unattended checkout.
- **Core Fields**:
  - `checkout_session_id`
  - `mode_scope`
  - `principal_ref`
  - `authorized_agent_ref`
  - `state`
  - `authoritative_commerce_context_ref`
  - `active_decision_id`
  - `latest_decision_evaluation_id`
  - `latest_execution_intent_id`
  - `payment_attempt_refs[]`
  - `order_refs[]`
  - `correlation_ids`
  - `created_at`
  - `updated_at`
- **Invariants**:
  - one active autonomy mode per session
  - no irreversible state transition without accepted `DecisionEvaluation`
  - session state changes only through the canonical state machine

## SovereignDecisionEnvelope

- **Purpose**: Canonical bounded delegated authority artifact.
- **Core Fields**:
  - `decision_id`
  - `principal`
  - `authorized_agent`
  - `intent`
  - `allowed_actions[]`
  - `constraints`
  - `merchant_scope`
  - `amount_scope`
  - `currency_scope`
  - `time_window`
  - `risk_ceiling`
  - `payment_method_policy`
  - `trust_artifacts`
  - `revocation_policy`
  - `evidence_refs[]`
  - `issued_at`
  - `expires_at`
  - `status`
- **Invariants**:
  - decision status is explicit and never inferred
  - expiry and revocation must be evaluable independently
  - allowed actions must be explicit before unattended execution is possible

## DecisionEvaluation

- **Purpose**: Immutable policy result for a specific action against a specific checkout context.
- **Core Fields**:
  - `decision_evaluation_id`
  - `decision_id`
  - `checkout_session_id`
  - `requested_action`
  - `evaluation_result`
  - `failed_constraints[]`
  - `authority_snapshot_ref`
  - `evaluated_at`
  - `evaluator_ref`
- **Invariants**:
  - immutable after creation
  - every irreversible execution references one accepted evaluation
  - rejected evaluations retain explicit reasons

## ExecutionIntent

- **Purpose**: Canonical request to perform irreversible or externally authoritative work.
- **Core Fields**:
  - `execution_intent_id`
  - `checkout_session_id`
  - `decision_evaluation_id`
  - `action_type`
  - `idempotency_key`
  - `status`
  - `target_authority`
  - `requested_at`
  - `completed_at`
  - `result_ref`
- **Invariants**:
  - idempotency key required
  - action type must map to a reversible or irreversible class
  - execution intent cannot exist without session context

## AuditCorrelationRecord

- **Purpose**: Append-only evidence record for reconstruction and QA analysis.
- **Core Fields**:
  - `audit_record_id`
  - `checkout_session_id`
  - `decision_id`
  - `decision_evaluation_id`
  - `execution_intent_id`
  - `payment_attempt_id`
  - `order_id`
  - `actor_ref`
  - `event_type`
  - `event_status`
  - `timestamp`
  - `evidence_ref`
- **Invariants**:
  - append-only
  - must correlate to at least one canonical aggregate
  - must be sufficient to reconstruct failure and compensation paths

## Relationships

- `CheckoutSession` may reference zero or more `SovereignDecisionEnvelope` artifacts over its lifetime, but at most one active decision at a time.
- `SovereignDecisionEnvelope` may produce many `DecisionEvaluation` records.
- `CheckoutSession` may produce many `ExecutionIntent` records.
- `AuditCorrelationRecord` may reference any combination of session, decision,
  evaluation, execution intent, payment attempt, and order identifiers.

## State References

### CheckoutSession State Set

- `draft`
- `prepared`
- `awaiting_authority`
- `authorized_for_execution`
- `executing_irreversible_action`
- `partially_completed`
- `completed`
- `blocked`
- `compensating`
- `failed`
- `cancelled`

### SovereignDecisionEnvelope State Set

- `issued`
- `active`
- `evaluated`
- `consumed`
- `expired`
- `revoked`
- `rejected`

### ExecutionIntent State Set

- `requested`
- `accepted_for_execution`
- `in_flight`
- `succeeded`
- `failed`
- `timed_out`
- `compensating`
- `compensated`
