# Feature Specification: Adobe Commerce Authoritative Adapter Core

**Feature Branch**: `[feature/SACP-65-adobe-commerce-adapter-core]`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Continue with the next project spec after the sovereign checkout core slice."

**Spec Quality Target**: `SQ5 - Contract Ready`

## Executive Summary *(mandatory)*

This feature defines the authoritative Adobe Commerce adapter boundary for the
MVP. It establishes how catalog, product detail, cart lifecycle, pricing
authority, and order submission are consumed from Adobe Commerce without
allowing caller-supplied values or agent surfaces to become authoritative for
commerce truth.

The outcome is a vendor-specific adapter spec that plugs into the sovereign
checkout core while preserving clear authority boundaries, safe error handling,
and audit correlation across session, cart, and order references.

## Context & Objectives *(mandatory)*

- **Problem**: The sovereign checkout core is now defined, but the MVP still
  needs a concrete adapter boundary for Adobe Commerce as the authoritative
  system for product, pricing, cart, and order operations.
- **Primary Actor(s)**: Principal customer, authorized agent, commerce
  orchestration service, Adobe Commerce adapter operator, QA operator
- **Objective**: Define a reviewable, implementation-ready adapter specification
  that preserves Adobe Commerce as authority for catalog, pricing, cart, and
  order creation while staying compatible with the canonical checkout core.
- **In Scope**:
  - authoritative catalog and product detail retrieval
  - cart creation, retrieval, mutation, and summary semantics
  - pricing and totals authority enforcement
  - order submission boundary from sovereign checkout core into Adobe Commerce
  - adapter-level error, timeout, duplicate, and evidence semantics
- **Out of Scope**:
  - Stripe payment semantics
  - ACP and UCP surface payload design
  - storefront UX or merchandising strategy
  - Adobe Commerce admin customization not required by the MVP adapter contract
  - multi-store, multi-market, or multi-currency expansion beyond MVP defaults

## Constraints *(mandatory)*

- Adobe Commerce MUST remain authoritative for catalog data, product detail,
  cart calculation, pricing, and order creation.
- Caller-supplied pricing MUST never be treated as authoritative by the adapter.
- The adapter MUST remain compatible with both assisted and unattended checkout
  modes defined by the sovereign checkout core.
- The MVP defaults remain Europe and `EUR`.
- All adapter behavior must remain traceable to Jira `SACP-65`, epic `SACP-3`,
  and Confluence `SACPM`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authoritative Catalog and Product Detail Retrieval (Priority: P1)

As a commerce orchestration service, I need Adobe Commerce to act as the
authoritative source for catalog and product detail data so that agent surfaces
do not invent or cache non-authoritative product truth.

**Why this priority**: Catalog and product authority is the first adapter boundary
needed before cart and checkout behaviors can be trusted.

**Independent Test**: A reviewer can inspect the specification and determine what
catalog and product data the adapter retrieves, how authority is preserved, and
how stale or unavailable product information is handled.

**Acceptance Scenarios**:

1. **Given** a product discovery or product detail request, **When** the adapter
   queries Adobe Commerce, **Then** it returns only Adobe-authoritative product
   data and marks the Adobe response as the source of truth for that snapshot.
2. **Given** a requested product is unavailable or no longer valid, **When** the
   adapter resolves the request, **Then** it returns a non-authoritative outcome
   that blocks downstream checkout progression and records the failure cause.

---

### User Story 2 - Authoritative Cart and Pricing Lifecycle (Priority: P1)

As a sovereign checkout orchestration service, I need Adobe Commerce to own cart
state and totals calculation so that agent actions cannot bypass authoritative
pricing, quantities, or line-item validation.

**Why this priority**: Cart and pricing authority are mandatory before unattended
or assisted checkout can be trusted.

**Independent Test**: A reviewer can inspect the specification and determine how
cart creation, update, removal, summary, and total recalculation behave, and how
caller-supplied price or stale totals are rejected.

**Acceptance Scenarios**:

1. **Given** a cart mutation request, **When** the adapter sends it to Adobe
   Commerce, **Then** the resulting cart state, totals, and item validation come
   from Adobe Commerce and not from the caller payload.
2. **Given** a caller attempts to supply non-authoritative price or total values,
   **When** the adapter evaluates the request, **Then** it ignores or rejects
   those values and preserves Adobe totals as the only authoritative commerce outcome.

---

### User Story 3 - Order Submission and Checkout Correlation (Priority: P2)

As a platform operator, I need Adobe Commerce order submission to remain
correlated with the sovereign checkout core so that order creation, failures, and
partial completion can be audited and reconciled without ambiguity.

**Why this priority**: The MVP must correlate session, decision, cart, and order
references before payment and surface features are added on top.

**Independent Test**: A reviewer can inspect the specification and determine how
an Adobe Commerce order reference links back to `CheckoutSession`, `SDE`,
cart snapshot, and adapter evidence.

**Acceptance Scenarios**:

1. **Given** a checkout session is authorized for order submission, **When** the
   adapter submits the order to Adobe Commerce, **Then** the resulting order
   reference is correlated back to the canonical checkout and decision artifacts.
2. **Given** order submission times out or partially fails, **When** the adapter
   records the result, **Then** operators can distinguish whether Adobe Commerce
   accepted, rejected, or left the outcome uncertain and what follow-up is required.

### Edge Cases *(mandatory)*

- What happens when a product is present in a prior catalog snapshot but is no
  longer purchasable when the cart or order action is attempted?
- How does the adapter handle Adobe Commerce totals changing between cart review
  and final order submission?
- How is duplicate cart or order submission detected and reconciled against the
  canonical checkout session?
- What happens when Adobe Commerce times out after receiving an order request but
  before returning a definitive response?
- How does the adapter represent a cart that Adobe Commerce accepts partially,
  such as quantity reductions or item-level rejection?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat Adobe Commerce as the authoritative source for
  catalog data, product detail, cart state, cart totals, and order creation.
- **FR-002**: The adapter MUST define authoritative retrieval semantics for
  product discovery and product detail snapshots consumed by later agent surfaces.
- **FR-003**: The adapter MUST define canonical cart creation, cart mutation,
  cart removal, and cart summary behaviors against Adobe Commerce.
- **FR-004**: The adapter MUST reject or ignore caller-supplied price or total
  values whenever Adobe Commerce can provide the authoritative commerce result.
- **FR-005**: The adapter MUST define how Adobe-authoritative cart and product
  snapshots correlate back to `CheckoutSession` and sovereign decision artifacts.
- **FR-006**: The adapter MUST define order submission semantics from the core
  checkout context into Adobe Commerce, including correlation of resulting order references.
- **FR-007**: The adapter MUST define timeout, duplicate, and partial-completion
  handling for Adobe-facing catalog, cart, and order operations.
- **FR-008**: The adapter MUST define canonical failure outcomes for unavailable
  products, invalid carts, pricing drift, and uncertain order submission.
- **FR-009**: The adapter MUST define which Adobe response fields become
  authoritative inputs to later payment and surface slices.
- **FR-010**: The adapter MUST preserve audit and evidence metadata sufficient to
  reconstruct what Adobe Commerce was asked to do and what response or lack of response occurred.
- **FR-011**: The adapter MUST remain compatible with both `Human Present` and
  `Human Not Present` modes governed by the sovereign checkout core.
- **FR-012**: The adapter MUST define operator-visible evidence and Postman
  validation needs for all exposed adapter endpoints or commands.

### Key Entities *(include if feature involves data)*

- **AdobeCatalogSnapshot**: Authoritative product or discovery result retrieved
  from Adobe Commerce, including source metadata and retrieval timestamp.
- **AdobeProductDetailSnapshot**: Authoritative product-detail view correlated to
  a product request and later cart operations.
- **AdobeCartReference**: Canonical mapping between `CheckoutSession` and the
  corresponding Adobe Commerce cart identifier, totals snapshot, and item set.
- **AdobeOrderReference**: Canonical mapping between `CheckoutSession`,
  `ExecutionIntent`, and the resulting Adobe Commerce order identifier or uncertain outcome.
- **CommerceAuthorityOutcome**: Canonical representation of whether Adobe
  Commerce accepted, rejected, partially applied, or left uncertain a commerce operation.

## Sovereign Decision Model *(mandatory for money, consent, trust, or delegation flows)*

- **Decision Required**: Yes. The adapter must respect the bounded authority
  already defined by the sovereign checkout core when creating or mutating carts
  and when submitting orders.
- **Principal**: The buyer or account owner represented by the sovereign checkout core.
- **Authorized Agent**: The delegated agent or commerce orchestration actor using
  the adapter within the limits of the canonical `SDE`.
- **Intent**: Discover products, manage cart state, and submit an order only
  within the authority already granted by the sovereign checkout core.
- **Allowed Actions**: Product discovery, product detail retrieval, cart create,
  cart update, cart remove, cart summary retrieval, and order submission where allowed.
- **Constraints**: Merchant scope, amount scope, currency scope, allowed action
  list, and autonomy mode must still be enforced upstream before irreversible order submission.
- **Revocation Model**: If the `SDE` becomes revoked or invalid, the adapter must
  not execute further commerce operations that the core classifies as blocked or
  irreversible.
- **Evidence & Correlation**: Adobe cart and order references must correlate back
  to `CheckoutSession`, `decision_id`, and adapter evidence records.

## Trust & Protocol Boundaries *(mandatory)*

- **Trust Boundary**: The sovereign checkout core remains authoritative for
  delegated authority. Adobe Commerce is authoritative only for commerce data and outcomes.
- **Protocol Roles**:
  - `Internal` sovereign checkout core provides session and decision authority context.
  - Adobe Commerce adapter provides commerce authority translation and evidence capture.
  - `ACP` and `UCP` consume the resulting authoritative commerce state later; they do not define commerce authority here.
- **Authority/Source of Truth**:
  - Sovereign checkout core: authoritative for `CheckoutSession`, `SDE`, and execution eligibility.
  - Adobe Commerce: authoritative for catalog, product detail, cart totals, and order creation outcome.
  - Audit layer: authoritative for correlated evidence of adapter requests and Adobe responses.
- **Privacy/Security Notes**: The adapter must minimize persisted commerce data to
  what is needed for correlation and QA, avoid implicit trust in caller payloads,
  and preserve replay-safe operation handling.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can determine in under ten minutes which commerce fields
  are authoritative from Adobe Commerce and which are never trusted from callers.
- **SC-002**: The spec defines explicit handling for product unavailability,
  pricing drift, timeout, duplicate submission, partial cart update, and uncertain order creation.
- **SC-003**: The spec defines unambiguous correlation between Adobe cart/order
  references and the sovereign checkout core artifacts.
- **SC-004**: The feature is fully traceable to Jira `SACP-65`, epic `SACP-3`,
  Confluence spec page `217415700`, and QA evidence page `217186327`.

## Assumptions *(mandatory)*

- **ASSUMPTION**: Adobe Commerce exposes the minimum product, cart, pricing, and
  order operations needed by the MVP without requiring a second commerce authority.
- **ASSUMPTION**: The sovereign checkout core remains the only authority for
  delegated execution eligibility and Adobe Commerce is not used to infer agent authority.
- **ASSUMPTION**: The MVP works with one default market and `EUR`, even though the
  adapter should not encode those values in a way that prevents future extension.

## Traceability *(mandatory)*

- **Jira Project Key**: `SACP`
- **Jira Issue Key**: `SACP-65`
- **Epic Key**: `SACP-3`
- **Protocol Scope**: `Multi-Protocol`
- **Surface Scope**: `Adobe Commerce`
- **Mode Scope**: `Both`
- **Risk Level**: `High`
- **Confluence Space**: `SACPM`
- **Confluence Page**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217415700/Feature+SACP-65+-+Adobe+Commerce+authoritative+adapter+core`
- **Related QA Evidence**: `https://barnacode.atlassian.net/wiki/spaces/SACPM/pages/217186327/QA+Evidence+-+SACP-65+-+Adobe+Commerce+authoritative+adapter+core`
- **Postman Required**: `Yes`
- **Postman Impact**: `Adobe Commerce adapter endpoints and validation flows must be added to the project Postman collection during planning and implementation`
- **QA Evidence Required**: `Yes`

## Open Questions *(include only if unresolved and material)*

- **PENDING VERIFICATION**: Whether Adobe Commerce order submission for the MVP
  will be synchronous enough to avoid a separate reconciliation poll workflow in the first implementation slice.

## Spec Quality Gate *(mandatory before planning)*

- **Current Quality Level**: `SQ5`
- **Ready for `/speckit.plan`**: Yes
- **Quality Notes**: The spec defines the Adobe authority boundary, failure
  semantics, and sovereign-checkout correlation requirements without depending on
  implementation-specific code or vendor SDK details.
