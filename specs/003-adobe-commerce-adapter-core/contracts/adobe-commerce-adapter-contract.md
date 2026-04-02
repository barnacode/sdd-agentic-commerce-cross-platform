# Contract: Adobe Commerce Authoritative Adapter

## Purpose

Define the minimum canonical contracts that the Adobe Commerce adapter must
present to the sovereign checkout core and later agent surfaces.

## Scope

This contract governs the shape and semantics of:

- `AdobeCatalogSnapshot`
- `AdobeProductDetailSnapshot`
- `AdobeCartReference`
- `AdobeOrderReference`
- `CommerceAuthorityOutcome`
- `AdapterAuditRecord`

## AdobeCatalogSnapshot Contract

The canonical catalog snapshot MUST expose at least:

- `catalog_snapshot_id`
- `source_system`
- `query_context`
- `items`
- `retrieved_at`
- `authority_status`

`source_system` MUST identify Adobe Commerce as the authority.

## AdobeProductDetailSnapshot Contract

The canonical product detail snapshot MUST expose at least:

- `product_detail_snapshot_id`
- `adobe_product_id`
- `sku`
- `product_attributes`
- `availability_status`
- `retrieved_at`
- `authority_status`

The adapter MUST not mark product detail authoritative if Adobe indicates the
product is unavailable or invalid for the requested operation.

## AdobeCartReference Contract

Every Adobe cart correlation object MUST expose at least:

- `adobe_cart_reference_id`
- `checkout_session_id`
- `adobe_cart_id`
- `cart_status`
- `item_snapshot`
- `totals_snapshot`
- `last_authoritative_refresh_at`
- `authority_outcome`

The adapter MUST preserve Adobe totals as authoritative and MUST never replace
them with caller-supplied values.

## AdobeOrderReference Contract

Every Adobe order correlation object MUST expose at least:

- `adobe_order_reference_id`
- `checkout_session_id`
- `execution_intent_id`
- `adobe_order_id`
- `submission_status`
- `submitted_at`
- `resolved_at`
- `authority_outcome`

`submission_status` MUST support:

- `submission_requested`
- `submitted_waiting_outcome`
- `accepted`
- `rejected`
- `uncertain`
- `reconciled`

## CommerceAuthorityOutcome Contract

Every canonical adapter outcome MUST expose at least:

- `commerce_authority_outcome_id`
- `operation_type`
- `source_authority`
- `result_status`
- `authoritative_refs`
- `failure_reason`
- `recorded_at`

`result_status` MUST distinguish:

- `accepted`
- `rejected`
- `partially_applied`
- `uncertain`

## AdapterAuditRecord Contract

Every adapter evidence record MUST expose enough data to correlate:

- checkout session
- decision
- execution intent
- Adobe cart or order reference
- operation type
- outcome status
- evidence timestamp

At minimum it MUST include:

- `adapter_audit_record_id`
- `checkout_session_id`
- `decision_id`
- `execution_intent_id`
- `operation_type`
- `request_correlation_id`
- `outcome_status`
- `timestamp`
- `evidence_ref`

## Semantic Rules

- Adobe Commerce is the authoritative source for catalog, product, cart, totals,
  and order outcomes.
- Caller-supplied price or total values MUST never override Adobe-authoritative results.
- Duplicate order submission MUST be distinguishable and replay-safe.
- Uncertain order outcomes MUST remain explicit until reconciled.
- Adapter contracts MUST preserve correlation to the sovereign checkout core artifacts.

## Future Interface Implications

When implementation introduces APIs or events, they MUST preserve:

- explicit separation between sovereign execution authority and Adobe commerce authority
- explicit authoritative cart and totals refresh semantics
- explicit duplicate and uncertain-order handling
- compatibility with Postman-based operator validation
