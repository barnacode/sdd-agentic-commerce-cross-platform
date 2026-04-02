# Research: Stripe Payment Execution and Webhook Core

## Decision 1: Use Stripe PaymentIntent as the authoritative payment execution primitive

- **Decision**: The payment slice will model Stripe payment execution around the
  PaymentIntent lifecycle as the canonical vendor-specific authority primitive.
- **Rationale**: Stripe documents PaymentIntent as the object that tracks a
  payment from creation through confirmation, additional authentication, capture,
  processing, success, or cancellation.
- **Alternatives considered**:
  - Model payment state around charges directly: rejected because it weakens the
    lifecycle and authentication semantics Stripe now centers on PaymentIntents.
  - Hide Stripe authority behind opaque local statuses only: rejected because the
    canonical model still needs authoritative mapping to Stripe states.

## Decision 2: Treat asynchronous webhook evidence as required for authoritative completion

- **Decision**: The platform must reconcile authoritative asynchronous Stripe
  outcomes through webhook evidence and not rely solely on local synchronous responses.
- **Rationale**: Stripe recommends using webhooks for payment completion and
  status monitoring, especially for asynchronous outcomes and reliable fulfillment decisions.
- **Alternatives considered**:
  - Rely only on synchronous API responses: rejected because timeout and
    asynchronous method behavior would create false certainty.
  - Poll Stripe only: rejected because polling alone weakens timeliness and misses
    the trust boundary created by verified event delivery.

## Decision 3: Make create, confirm, capture, and cancel replay-safe through canonical idempotency binding

- **Decision**: Bind payment actions to canonical execution intent and duplicate
  detection material before sending Stripe requests.
- **Rationale**: Payment duplication is the highest-risk failure class in this
  slice and Stripe's API supports idempotent request semantics that fit the model.
- **Alternatives considered**:
  - Rely on local retries without canonical binding: rejected because duplicate
    authorization or capture becomes plausible.
  - Treat only create as idempotent and not capture or cancel: rejected because
    irreversible follow-up actions also need replay safety.

## Decision 4: Preserve `requires_action`, `requires_capture`, and `uncertain` as first-class canonical outcomes

- **Decision**: Canonical payment outcomes will distinguish interactive action
  required, capture pending, and uncertainty instead of collapsing them into generic pending states.
- **Rationale**: Stripe's PaymentIntent lifecycle includes materially different
  operational states that change what the platform can safely do next.
- **Alternatives considered**:
  - Collapse everything non-terminal into one pending status: rejected because
    operator action and autonomy-mode decisions would become ambiguous.
  - Treat `requires_action` as generic failure: rejected because it can remain recoverable in `Human Present` flows.

## Decision 5: Bind payment attempts to authoritative commerce totals and invalidate on drift

- **Decision**: Stripe payment attempts must be correlated to authoritative
  commerce totals and order context, and amount drift must be classified explicitly before confirm or capture.
- **Rationale**: Adobe Commerce remains the source of truth for commerce amount,
  so payment execution cannot silently outrun that authority.
- **Alternatives considered**:
  - Allow local amount overrides for payment convenience: rejected because it breaks commerce authority.
  - Ignore drift until settlement time: rejected because that delays a critical correctness check too far.

## Decision 6: Leave default capture policy as a planning-time open question

- **Decision**: Keep the default capture policy (`manual` for all eligible flows
  versus selective use) as `PENDING VERIFICATION`.
- **Rationale**: Stripe supports manual capture for eligible methods, but the MVP
  policy depends on business and operational decisions not yet fixed in the repo.
- **Alternatives considered**:
  - Force manual capture everywhere now: rejected because some payment methods
    and flows may not support or require it.
  - Force automatic capture everywhere now: rejected because it could remove a needed sovereignty checkpoint.

## Source Notes

- Repository truth was treated as the primary local authority for project
  boundaries and prior slices.
- Context7 MCP was unavailable in this environment because it returned `Invalid API key`.
- External verification used official Stripe documentation for:
  - PaymentIntent lifecycle and statuses
  - payment status monitoring and webhook-driven completion
  - idempotent request semantics
  - manual capture and `requires_capture` behavior
