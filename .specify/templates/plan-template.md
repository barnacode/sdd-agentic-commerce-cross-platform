# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Summary

[Summarize the planned solution, why it fits the spec, and the main technical approach]

## Technical Context

**Language/Version**: [e.g., TypeScript 5.x or NEEDS CLARIFICATION]  
**Primary Dependencies**: [frameworks, SDKs, protocol libraries, or NEEDS CLARIFICATION]  
**Storage**: [e.g., PostgreSQL, Redis, object storage, or N/A]  
**Testing**: [test frameworks, contract testing, simulation approach]  
**Target Platform**: [runtime or deployment target]  
**Project Type**: [e.g., monorepo web-service, adapter package, library]  
**Performance Goals**: [e.g., p95, throughput, latency expectations]  
**Constraints**: [security, protocol, compliance, rollout, operational constraints]  
**Scale/Scope**: [expected usage, package boundaries, systems touched]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Sovereign decision impact identified and handled explicitly
- [ ] Trust model and authority matrix defined
- [ ] Protocol roles and boundaries justified
- [ ] Idempotency, replay protection, and compensation considered
- [ ] Auditability and observability planned
- [ ] Jira/Confluence traceability captured
- [ ] Gitflow branch strategy identified for the work
- [ ] Endpoint validation artifacts and Postman updates planned when APIs change
- [ ] Target architecture vs current repo reality called out where they differ

## Architecture Overview *(mandatory)*

### Target Architecture

[Describe the architecture at the level needed for implementation planning]

### Bounded Contexts

- **[Context Name]**: [Responsibility, boundaries, interfaces]
- **[Context Name]**: [Responsibility, boundaries, interfaces]

### Layer Mapping

| Layer | Responsibility | Key Artifacts |
|-------|----------------|---------------|
| Sovereign Decision Layer | [Responsibility] | [Artifacts] |
| Trust Layer | [Responsibility] | [Artifacts] |
| Commerce Orchestration Layer | [Responsibility] | [Artifacts] |
| Agent Interoperability Layer | [Responsibility] | [Artifacts] |
| Tooling and Context Layer | [Responsibility] | [Artifacts] |
| Payment Execution and Settlement Layer | [Responsibility] | [Artifacts] |
| Observability, Audit and Governance Layer | [Responsibility] | [Artifacts] |

## Protocol Selection Matrix *(mandatory when protocols or external surfaces are involved)*

| Protocol / Interface | Why It Enters | Why Alternatives Do Not | Boundary | Crossing Artifacts |
|----------------------|---------------|--------------------------|----------|--------------------|
| [ACP/UCP/AP2/A2A/MCP/x402/HTTP/etc.] | [Reason] | [Reason] | [Boundary] | [Artifacts] |

## Domain Model *(mandatory)*

- **[Entity/Aggregate]**: [Purpose, invariants, lifecycle]
- **[Entity/Aggregate]**: [Purpose, invariants, lifecycle]

## Sovereign Decision Model *(mandatory when applicable)*

- **Decision Artifact**: [SDE or equivalent]
- **Issuance**: [How it is created]
- **Verification**: [How it is validated]
- **Propagation**: [How it crosses layers and protocols]
- **Revocation**: [How it is revoked or expires]
- **Evidence**: [How audit and receipts are correlated]

## Trust Model *(mandatory)*

- **Principals**: [Who they are]
- **Authorized Agents**: [Who can act]
- **Trust Artifacts**: [tokens, signatures, attestations, mandates, receipts]
- **Policy Enforcement Points**: [Where checks are enforced]
- **Privacy & Data Minimization**: [Sensitive data handling]

## Threat Model *(mandatory)*

- **Threat**: [Replay, overspend, authority confusion, forged callback, etc.]
- **Impact**: [What fails]
- **Mitigation**: [Control]
- **Residual Risk**: [What remains]

## State Machines & Flows *(mandatory)*

### Core State Machines

- **[State Machine Name]**: [States, transitions, terminal conditions]

### Sequence / Flow Coverage

- [ ] Happy path
- [ ] Soft-fail path
- [ ] Hard-fail path
- [ ] Timeout path
- [ ] Duplicate submission path
- [ ] Partial completion path
- [ ] Compensation path

## Contracts & Spec Graph *(mandatory)*

### Core Artifacts

```text
specs/[###-feature]/
├── spec.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Specialized Specs To Derive When Applicable

- `surface.spec`
- `adapter.spec`
- `package.spec`
- `authority.spec`
- `persistence.spec`
- `security.spec`
- `flow.spec`
- `simulation.spec`

## Project Structure

### Current Repository Reality

[Describe the directories that actually exist today]

### Target Structure For This Feature

```text
[Document the concrete paths this feature will create or extend]
```

**Structure Decision**: [Explain the chosen structure and any divergence from the target monorepo]

## Error Handling & Compensation *(mandatory)*

- **Failure Classes**: [validation, upstream, timeout, policy, reconciliation, etc.]
- **Retry Strategy**: [bounded retries, backoff, idempotency expectations]
- **Compensation Strategy**: [how partial completion is repaired or reversed]
- **Operator Visibility**: [how failures are surfaced]

## Observability Plan *(mandatory)*

- **Logs**: [structured events and forbidden data]
- **Metrics**: [latency, failure, retries, authorization outcomes]
- **Tracing/Correlation**: [decision_id, checkout_session_id, payment_attempt_id, order_id]
- **Audit Trail**: [append-only evidence and receipt strategy]

## Test Strategy *(mandatory)*

- **Unit Tests**: [scope]
- **Integration Tests**: [scope]
- **Contract Tests**: [APIs/events/protocols]
- **Simulation Tests**: [red-team or scenario coverage]
- **Postman Collection Strategy**: [collections to create or update for each endpoint added or changed]
- **Manual Validation**: [operator or business checks]
- **QA Failure Workflow**: [how QA defects create Jira bug items and Confluence evidence]

## Rollout / Migration / Rollback *(mandatory)*

- **Rollout Plan**: [phased or direct]
- **Migration Requirements**: [data, contracts, environment]
- **Rollback Plan**: [safe rollback approach]

## Traceability *(mandatory)*

- **Jira Project Key**: [`SACP` or `PENDING VERIFICATION`]
- **Jira Ticket(s)**: [IDs or `PENDING VERIFICATION`]
- **Epic Key**: [Epic ID or `PENDING VERIFICATION`]
- **Protocol Scope**: [`ACP` | `UCP` | `AP2` | `A2A` | `MCP` | `x402` | `Internal` | `Multi-Protocol` | `PENDING VERIFICATION`]
- **Surface Scope**: [`Core` | `Adobe Commerce` | `Stripe` | `OpenAI ACP` | `Gemini UCP` | `Observability` | `QA` | `Postman` | `Runbooks` | `PENDING VERIFICATION`]
- **Mode Scope**: [`Human Present` | `Human Not Present` | `Both` | `N/A` | `PENDING VERIFICATION`]
- **Risk Level**: [`Low` | `Medium` | `High` | `Critical` | `PENDING VERIFICATION`]
- **Confluence Space**: [`SACPM` or `PENDING VERIFICATION`]
- **Confluence Page(s)**: [links or `PENDING VERIFICATION`]
- **ADR Links**: [if structural decisions are introduced]
- **Gitflow Branch Type**: [`feature/`, `release/`, `bugfix/`, or `hotfix/`]
- **Confluence Page Field ID**: [`customfield_10094` or `PENDING VERIFICATION`]
- **Postman Required Field ID**: [`customfield_10095` or `PENDING VERIFICATION`]
- **QA Evidence Required Field ID**: [`customfield_10096` or `PENDING VERIFICATION`]
- **Postman Collection(s)**: [paths, names, or `PENDING VERIFICATION`]
- **QA Evidence Page(s)**: [links or `PENDING VERIFICATION`]

## Complexity Tracking

> Fill only if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [Example] | [Reason] | [Reason] |
