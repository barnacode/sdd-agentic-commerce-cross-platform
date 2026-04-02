# Data Model: Adobe Commerce Authoritative Adapter Core

## AdobeCatalogSnapshot

- **Purpose**: Immutable authoritative catalog or discovery result from Adobe Commerce.
- **Core Fields**:
  - `catalog_snapshot_id`
  - `source_system`
  - `query_context`
  - `items[]`
  - `retrieved_at`
  - `authority_status`
- **Invariants**:
  - source system must be Adobe Commerce
  - snapshot is immutable after capture
  - downstream surfaces must treat it as authoritative only until refreshed or invalidated

## AdobeProductDetailSnapshot

- **Purpose**: Immutable authoritative product detail record.
- **Core Fields**:
  - `product_detail_snapshot_id`
  - `adobe_product_id`
  - `sku`
  - `product_attributes`
  - `availability_status`
  - `retrieved_at`
  - `authority_status`
- **Invariants**:
  - tied to one Adobe product identity
  - no caller mutation allowed
  - stale or unavailable products must be surfaced explicitly

## AdobeCartReference

- **Purpose**: Correlate a canonical checkout session to one Adobe Commerce cart.
- **Core Fields**:
  - `adobe_cart_reference_id`
  - `checkout_session_id`
  - `adobe_cart_id`
  - `cart_status`
  - `item_snapshot`
  - `totals_snapshot`
  - `last_authoritative_refresh_at`
  - `authority_outcome`
- **Invariants**:
  - one active Adobe cart reference per active commerce path
  - totals snapshot must come from Adobe
  - caller-supplied totals never overwrite authoritative snapshot

## AdobeOrderReference

- **Purpose**: Correlate a canonical execution intent to one Adobe order outcome.
- **Core Fields**:
  - `adobe_order_reference_id`
  - `checkout_session_id`
  - `execution_intent_id`
  - `adobe_order_id`
  - `submission_status`
  - `submitted_at`
  - `resolved_at`
  - `authority_outcome`
- **Invariants**:
  - every order submission attempt is recorded
  - uncertain outcomes remain explicit until reconciled
  - duplicate order submission must be detectable

## CommerceAuthorityOutcome

- **Purpose**: Canonical outcome emitted by the adapter after an Adobe operation.
- **Core Fields**:
  - `commerce_authority_outcome_id`
  - `operation_type`
  - `source_authority`
  - `result_status`
  - `authoritative_refs`
  - `failure_reason`
  - `recorded_at`
- **Invariants**:
  - source authority must be Adobe Commerce
  - result status is explicit
  - authoritative refs must point to Adobe-originating identifiers when accepted

## AdapterAuditRecord

- **Purpose**: Append-only evidence record for Adobe-facing adapter operations.
- **Core Fields**:
  - `adapter_audit_record_id`
  - `checkout_session_id`
  - `decision_id`
  - `execution_intent_id`
  - `adobe_cart_id`
  - `adobe_order_id`
  - `operation_type`
  - `request_correlation_id`
  - `outcome_status`
  - `timestamp`
  - `evidence_ref`
- **Invariants**:
  - append-only
  - must correlate at least to session or execution context
  - must record uncertain outcomes explicitly

## Relationships

- `AdobeCatalogSnapshot` may seed `AdobeProductDetailSnapshot` lookups but does
  not replace product detail authority.
- `CheckoutSession` may reference one active `AdobeCartReference`.
- `ExecutionIntent` may create zero or one `AdobeOrderReference` per order attempt.
- `CommerceAuthorityOutcome` can describe catalog, cart, or order operations.
- `AdapterAuditRecord` can correlate snapshots, cart references, order references, and canonical core identifiers.

## State References

### AdobeCartReference State Set

- `created`
- `active`
- `recalculating`
- `updated`
- `partially_applied`
- `invalidated`
- `failed`

### AdobeOrderReference State Set

- `submission_requested`
- `submitted_waiting_outcome`
- `accepted`
- `rejected`
- `uncertain`
- `reconciled`

### CommerceAuthorityOutcome State Set

- `accepted`
- `rejected`
- `partially_applied`
- `uncertain`
