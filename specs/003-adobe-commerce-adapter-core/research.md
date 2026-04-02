# Research: Adobe Commerce Authoritative Adapter Core

## Decision 1: Keep Adobe Commerce as sole commerce authority

- **Decision**: Adobe Commerce remains authoritative for catalog, product, cart,
  totals, and order creation outcomes.
- **Rationale**: The roadmap already fixes Adobe Commerce as commerce authority.
  The adapter must enforce, not dilute, that decision.
- **Alternatives considered**:
  - Accept caller-computed totals for speed: rejected because it breaks authority and auditability.
  - Duplicate product/pricing truth in the core: rejected because it would create authority confusion.

## Decision 2: Model adapter outputs as canonical authority outcomes

- **Decision**: Translate Adobe-specific responses into canonical
  `CommerceAuthorityOutcome`, `AdobeCartReference`, and `AdobeOrderReference` artifacts.
- **Rationale**: The sovereign checkout core and later surfaces need stable,
  vendor-contained semantics rather than raw Adobe response shapes.
- **Alternatives considered**:
  - Expose raw Adobe response payloads across the system: rejected because it couples downstream slices to one vendor.
  - Hide Adobe outcomes in opaque status strings: rejected because it weakens audit and QA clarity.

## Decision 3: Reject caller-supplied pricing at the adapter boundary

- **Decision**: The adapter either ignores or rejects caller-provided pricing and
  totals whenever Adobe can provide authoritative values.
- **Rationale**: The constitution explicitly forbids caller-supplied pricing as authority.
- **Alternatives considered**:
  - Accept caller price if it matches a recent cache: rejected because Adobe still owns pricing truth.
  - Accept caller price for assisted mode only: rejected because authority cannot vary by UX convenience.

## Decision 4: Treat uncertain Adobe order outcome as a first-class state

- **Decision**: Use an explicit `uncertain` order authority outcome when Adobe
  times out or cannot confirm order creation synchronously.
- **Rationale**: Silent retry or false rejection after timeout would create duplicate-order risk and poor auditability.
- **Alternatives considered**:
  - Auto-retry blindly after timeout: rejected because duplicate order creation becomes possible.
  - Treat every timeout as rejection: rejected because Adobe may have accepted the command.

## Decision 5: Refresh authority before critical cart and order steps

- **Decision**: The adapter design requires authoritative refresh around cart and
  order-critical points to catch stale product or totals drift.
- **Rationale**: The MVP lacks real-time stock guarantees, so authoritative
  refresh is the main guard against stale commerce state.
- **Alternatives considered**:
  - Trust prior snapshots until payment time: rejected because it delays failure detection too far.
  - Refresh on every read indiscriminately: rejected because it adds cost without always changing correctness.

## Decision 6: Preserve adapter-local evidence for every Adobe-facing command

- **Decision**: Every Adobe-facing catalog, cart, and order command must write a
  correlated adapter evidence record.
- **Rationale**: The adapter is a trust boundary for commerce authority and must
  support QA, defect diagnosis, and replay-safe reasoning.
- **Alternatives considered**:
  - Only log failures: rejected because successful authoritative outcomes also need correlation evidence.
  - Rely only on Adobe logs: rejected because the platform needs local auditability.

## Decision 7: Leave exact Adobe API version as implementation-time verification

- **Decision**: Keep exact Adobe API version and endpoint binding as `PENDING VERIFICATION` for implementation planning.
- **Rationale**: The repository already establishes Adobe as the authority, but
  the exact tenant/version details are not needed to settle the domain boundary.
- **Alternatives considered**:
  - Block planning until implementation credentials exist: rejected because the authority model is still planable.
  - Invent exact endpoint contracts now: rejected because that would risk hallucinating vendor details.
