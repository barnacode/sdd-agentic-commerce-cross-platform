# Research: Sovereign Checkout Session and SDE Lifecycle Core

## Decision 1: Make `CheckoutSession` the canonical orchestration aggregate

- **Decision**: Use `CheckoutSession` as the primary orchestration aggregate and
  correlate all decision, payment, and order references through it.
- **Rationale**: The roadmap already positions the middleware around checkout
  orchestration. A canonical session aggregate gives every later adapter and
  surface one stable coordination unit.
- **Alternatives considered**:
  - Center the core on cart alone: rejected because payment and delegated authority outlive cart-only semantics.
  - Center the core on order alone: rejected because authority validation and reversible preparation begin before order creation.

## Decision 2: Treat `SovereignDecisionEnvelope` as a separate aggregate, not a session field blob

- **Decision**: Model `SDE` independently from `CheckoutSession`, with explicit
  issuance, verification, expiry, revocation, and evidence semantics.
- **Rationale**: Decision authority must remain explicit, reusable, and auditable.
  Embedding it as opaque session state would blur trust boundaries and revocation behavior.
- **Alternatives considered**:
  - Store authority implicitly inside session metadata: rejected because it conflates trust state with orchestration state.
  - Depend on vendor payment mandates as the primary authority artifact: rejected because the core must remain vendor-neutral.

## Decision 3: Introduce an immutable `DecisionEvaluation` record

- **Decision**: Every significant authority check produces an immutable
  `DecisionEvaluation` record tied to the exact checkout context and requested action.
- **Rationale**: A later payment or order action must prove which policy result
  authorized it. Recomputing authority from mutable state is not audit-safe.
- **Alternatives considered**:
  - Re-derive policy decisions on demand from current state only: rejected because it loses evidence of what was evaluated at execution time.
  - Use only log messages for evaluation evidence: rejected because logs are insufficient as canonical domain evidence.

## Decision 4: Separate reversible preparation from irreversible execution

- **Decision**: The core state machine explicitly separates preparation states
  from irreversible execution states and records which category each command belongs to.
- **Rationale**: The constitution requires explicit reversibility, compensation,
  and replay safety for money- or order-affecting actions.
- **Alternatives considered**:
  - Treat all commands uniformly: rejected because it hides compensation and revocation semantics.
  - Let adapters decide what counts as irreversible: rejected because the core must govern that boundary.

## Decision 5: Use append-only audit records with correlation identifiers

- **Decision**: Persist immutable `AuditCorrelationRecord` entries for every
  material decision or session transition.
- **Rationale**: The MVP requires auditable evidence from day one, and later QA
  and dispute analysis depend on immutable correlated evidence.
- **Alternatives considered**:
  - Store only current state snapshots: rejected because snapshots alone cannot reconstruct failure and compensation paths.
  - Emit audit only after implementation in adapters: rejected because the core must define evidence semantics first.

## Decision 6: Keep commerce and payment authorities external to the core

- **Decision**: The core defines references and invariants for commerce and
  payment state but does not own authoritative pricing, cart, payment, or order truth.
- **Rationale**: The roadmap already states Adobe Commerce and Stripe as those
  later authorities. The core should orchestrate, not absorb their domain authority.
- **Alternatives considered**:
  - Make the core authoritative for pricing or payment settlement: rejected because it would contradict the roadmap authority matrix.
  - Ignore those authorities until adapter features: rejected because the core must define the future boundary now.

## Decision 7: Use PostgreSQL as the canonical durable store in the target implementation

- **Decision**: Plan for PostgreSQL as the durable store for session, decision,
  evaluation, and audit persistence.
- **Rationale**: The core requires transactional integrity, relational joins
  across correlated identifiers, and durable audit history from the first implementation slice.
- **Alternatives considered**:
  - Document store first: rejected because relational invariants and cross-entity audit queries are first-class requirements.
  - In-memory state for MVP: rejected because the roadmap explicitly requires real persistence from day one.

## Decision 8: Continue planning using repository truth because Context7 is unavailable

- **Decision**: Rely on repository artifacts and roadmap evidence for stack and
  protocol planning in this turn because Context7 MCP returns an invalid API key.
- **Rationale**: The constitution gives repository specs and documents higher
  precedence than external docs, and this planning slice does not require a disputed external API detail to proceed.
- **Alternatives considered**:
  - Block planning entirely until Context7 is restored: rejected because no external version-dependent ambiguity blocks the domain design.
  - Invent undocumented vendor or protocol details from memory: rejected because that would reduce planning quality.
