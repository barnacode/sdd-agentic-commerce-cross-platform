# Contract: Sovereign Checkout Core Canonical Artifacts

## Purpose

Define the minimum canonical contracts that all later middleware APIs, adapters,
and agent surfaces must honor for the sovereign checkout core.

## Scope

This contract governs the shape and semantics of:

- `CheckoutSession`
- `SovereignDecisionEnvelope`
- `DecisionEvaluation`
- `ExecutionIntent`
- `AuditCorrelationRecord`

## CheckoutSession Contract

The canonical `CheckoutSession` MUST expose at least:

- `checkout_session_id`
- `mode_scope`
- `principal_ref`
- `authorized_agent_ref`
- `state`
- `authoritative_commerce_context_ref`
- `active_decision_id`
- `latest_decision_evaluation_id`
- `latest_execution_intent_id`
- `payment_attempt_refs`
- `order_refs`
- `correlation_ids`
- `created_at`
- `updated_at`

It MUST support the following state set:

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

## SovereignDecisionEnvelope Contract

The canonical `SDE` MUST expose at least:

- `decision_id`
- `principal`
- `authorized_agent`
- `intent`
- `allowed_actions`
- `constraints`
- `merchant_scope`
- `amount_scope`
- `currency_scope`
- `time_window`
- `risk_ceiling`
- `payment_method_policy`
- `trust_artifacts`
- `revocation_policy`
- `evidence_refs`
- `issued_at`
- `expires_at`
- `status`

The `status` MUST be one of:

- `issued`
- `active`
- `evaluated`
- `consumed`
- `expired`
- `revoked`
- `rejected`

## DecisionEvaluation Contract

Every policy evaluation record MUST expose at least:

- `decision_evaluation_id`
- `decision_id`
- `checkout_session_id`
- `requested_action`
- `evaluation_result`
- `failed_constraints`
- `authority_snapshot_ref`
- `evaluated_at`
- `evaluator_ref`

`evaluation_result` MUST distinguish:

- `accepted`
- `rejected`
- `blocked_pending_review`

## ExecutionIntent Contract

Every irreversible or externally authoritative action request MUST expose at least:

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

`status` MUST be one of:

- `requested`
- `accepted_for_execution`
- `in_flight`
- `succeeded`
- `failed`
- `timed_out`
- `compensating`
- `compensated`

## AuditCorrelationRecord Contract

Every canonical audit record MUST expose enough data to correlate:

- session
- decision
- evaluation
- execution intent
- actor
- target authority
- resulting outcome
- timestamped evidence

At minimum it MUST include:

- `audit_record_id`
- `checkout_session_id`
- `decision_id`
- `decision_evaluation_id`
- `execution_intent_id`
- `actor_ref`
- `event_type`
- `event_status`
- `timestamp`
- `evidence_ref`

## Semantic Rules

- No irreversible action may be requested without a valid `decision_evaluation_id`.
- No adapter may redefine the meaning of canonical states.
- External commerce and payment references remain authoritative only for their own domains.
- Audit records are append-only and never overwritten.
- Duplicate execution intents MUST be distinguishable by `idempotency_key`.

## Future Interface Implications

When the implementation introduces APIs or events, they MUST preserve:

- explicit separation between trust validation and execution
- explicit reversible vs irreversible command classes
- explicit correlation identifiers in requests, responses, and emitted events
- compatibility with Postman-based validation for operator workflows
