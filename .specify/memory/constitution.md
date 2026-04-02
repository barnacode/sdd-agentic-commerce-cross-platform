<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: placeholder template -> product-aligned governance baseline
- Added sections: Core Principles, Delivery Workflow, Governance
- Removed sections: placeholder-only sections from the template
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs:
  - Define canonical Jira project keys and Confluence space/page naming conventions
  - Materialize target monorepo structure in source code when implementation begins
-->
# SDD Agentic Commerce Cross Platform Constitution

## Core Principles

### I. Sovereign Decision First
Every flow with economic, contractual, operational, or reputational effect MUST be
authorized by an explicit Sovereign Decision Envelope (`SDE`) or an equivalent
canonical artifact with the same semantics. The `SDE` MUST cover at least:
`decision_id`, `principal`, `authorized_agent`, `intent`, `allowed_actions`,
`constraints`, `merchant_scope`, `amount_scope`, `currency_scope`,
`time_window`, `risk_ceiling`, `payment_method_policy`, `trust_artifacts`,
`revocation_policy`, `evidence_refs`, `issued_at`, `expires_at`, and `status`.
No irreversible flow may proceed unless creation, verification, propagation,
revocation, auditability, and correlation of this artifact are specified.

### II. Trust And Authority Are Explicit
Identity, delegation, consent, attestation, non-repudiation, and agent
authorization MUST be modeled explicitly and MUST NOT be inferred from opaque
session state. Every plan MUST define a trust model, an authority or
source-of-truth matrix, and the boundary between principal identity and agent
authorization. Human-present and human-not-present autonomy modes MUST be treated
as different trust contexts.

### III. Spec Graph Before Code
Delivery MUST start from specification artifacts, not from ad hoc implementation.
At minimum, every relevant feature MUST produce a reviewable `spec.md`, `plan.md`,
and `tasks.md`. When the feature touches protocol surfaces, adapters, authority,
persistence, security, or simulations, the plan MUST derive specialized specs for
those concerns. The repository currently contains planning assets only; the target
monorepo structure is an architectural objective and MUST be marked as such until
materialized in code.

### IV. Protocol Boundaries Are Non-Negotiable
Protocols MUST be used only for their natural responsibilities. ACP is for
discovery, catalog, cart, and checkout orchestration surfaces. UCP is for
capability and commerce data exchange. AP2 is for authorization, mandate,
instruction, payment validation, and receipt or evidence. A2A is for agent
coordination and handoff. MCP is for tools and context access. x402 is for
machine-native payment execution when the use case justifies it. The trust layer
remains the single authority boundary across all protocols. Plans MUST justify
why each protocol is used, why alternatives are not, and what artifacts cross
the layer boundaries.

### V. Auditability, Idempotency, And Reversibility
Money-moving or order-affecting flows MUST include idempotency, replay
protection, bounded retries, safe compensation, and append-only evidence trails.
Caller-supplied pricing MUST never be authoritative. Pricing authority, payment
authority, order authority, and session authority MUST be explicit. Logs and
persistence MUST exclude PCI and other forbidden sensitive data. Observability
MUST support correlation by decision, checkout session, payment attempt, order,
and receipt.

## Delivery Workflow

Work MUST follow Spec-Driven Development using the established Spec Kit flow:
constitution, specification, clarification, plan, tasks, analysis, implementation,
review, and validation. The default deliverables for any relevant feature are:

- Executive summary
- Context and objectives
- Constraints
- Assumptions
- Domain model
- Protocol selection matrix
- Sovereign decision model
- Trust model
- Sequence diagrams or equivalent flow descriptions
- Error, failure, and compensation model
- Data or event contracts
- Security and abuse analysis
- Observability plan
- Test strategy
- Rollout, migration, and rollback plan
- Open questions
- ADRs for structural decisions when needed

Specifications MUST be evaluated with the following quality scale:

- `SQ1 - Exploratory`: early idea capture, not eligible for planning
- `SQ2 - Functional`: business intent is visible, but architecture and risk are
  still underspecified
- `SQ3 - Planable`: sufficient for early planning, but still allows material
  ambiguity in trust, contracts, or operational flow
- `SQ4 - Governed Architecture`: minimum acceptable level for this repository;
  sufficient for the agent to draft `plan.md` under user supervision without
  inventing critical decisions
- `SQ5 - Contract Ready`: includes the precision needed to derive contracts and
  specialized specs with minimal rework

No feature may proceed to planning below `SQ4`. Features involving money,
delegation, consent, checkout, or trust-sensitive protocol boundaries SHOULD
target `SQ5`.

The plan MUST describe the target architecture in layered form:

1. Sovereign Decision Layer
2. Trust Layer
3. Commerce Orchestration Layer
4. Agent Interoperability Layer
5. Tooling and Context Layer
6. Payment Execution and Settlement Layer
7. Observability, Audit and Governance Layer

If the target monorepo structure is referenced, it MUST be labeled as target
architecture until the directories and packages exist in the repository.

## Quality Gates

Every relevant feature MUST satisfy these gates before delivery:

- Jira task linkage and Confluence traceability are captured in the planning artifacts
- Work follows the Gitflow branching model using the appropriate `feature/`,
  `release/`, `bugfix/`, or `hotfix/` branch type
- The spec has been reviewed against the project spec quality standard and is at
  least `SQ4`
- Acceptance scenarios and measurable outcomes are defined
- Threats, abuse paths, and compensations are documented for risky flows
- Tests are defined and executed for the implemented scope
- Contract changes are reflected in the relevant contracts and Postman collections
- Rollback remains feasible
- Known risks, assumptions, and pending verifications are explicit

If QA validation detects defects, remediation MUST be tracked with a dedicated bug
or error item in Jira and the diagnosis, impact, evidence, and resolution path MUST
be documented in Confluence before closure.

The minimum quality bar for a spec to pass `SQ4` is:

- problem, objective, and scope are explicit
- actors and authority boundaries are explicit
- requirements are testable and non-ambiguous
- acceptance scenarios are independently verifiable
- constraints are explicit
- `Sovereign Decision Model` is defined when applicable
- `Trust & Protocol Boundaries` are explicit
- authority or source-of-truth ownership is explicit
- edge cases cover timeout, duplication, revocation, and failure handling
- success criteria are measurable
- assumptions and open questions are minimized and explicit
- Jira and Confluence traceability exists or is marked `PENDING VERIFICATION`

The spec MUST be rejected if any of the following occur:

- decision sovereignty is required but not modeled
- identity and agent authorization are conflated
- protocols are named without boundary justification
- authority or source-of-truth is missing
- critical failure paths are omitted
- there are more than three material ambiguities
- implementation detail dominates the problem statement
- endpoint work exists without QA and Postman implications

The system MUST model and validate, when applicable:

- happy path
- soft-fail path
- hard-fail path
- timeout path
- duplicate submission path
- partial completion path
- compensation path

## Governance

This constitution supersedes generic planning defaults when they conflict.
Amendments MUST document the reason, impacted templates, migration notes, and the
semantic version bump rationale. All reviews MUST treat this constitution as the
non-negotiable authority for planning and execution quality. If the repository,
official protocol specifications, and external documentation disagree, the order
of precedence is:

1. Repository specs, ADRs, tests, and code
2. Official protocol specifications
3. Versioned documentation verified through Context7 when applicable
4. Official vendor documentation
5. Secondary references

Uncertainty MUST be labeled explicitly using `ASSUMPTION`, `RISK`, `OPEN QUESTION`,
or `PENDING VERIFICATION`. No workflow may silently downgrade sovereign decision,
trust, audit, or payment safety requirements for convenience or demo speed.

Every endpoint introduced or modified by a feature MUST be represented in a
maintained Postman collection suitable for automated validation. Postman artifacts
complement but do not replace contract, integration, or simulation testing.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
