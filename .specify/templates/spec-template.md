# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## Executive Summary *(mandatory)*

[Summarize the user value, business goal, and scope boundary in 3-5 lines]

## Context & Objectives *(mandatory)*

- **Problem**: [What problem is being solved]
- **Primary Actor(s)**: [Principal, authorized agent, merchant, operator, etc.]
- **Objective**: [What successful outcome looks like]
- **In Scope**: [Business capabilities included]
- **Out of Scope**: [Adjacent capabilities intentionally excluded]

## Constraints *(mandatory)*

- [Regulatory, trust, protocol, privacy, latency, money, or rollout constraint]
- [Dependency or compatibility constraint]
- [Operational constraint]

## User Scenarios & Testing *(mandatory)*

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the business value and urgency]

**Independent Test**: [Describe how this can be validated independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the business value and urgency]

**Independent Test**: [Describe how this can be validated independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the business value and urgency]

**Independent Test**: [Describe how this can be validated independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

### Edge Cases *(mandatory)*

- What happens when [boundary condition]?
- How does the system handle [error scenario]?
- How is duplicate submission, timeout, or partial completion handled?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST [specific capability]
- **FR-002**: System MUST [specific capability]
- **FR-003**: Users or agents MUST be able to [key interaction]
- **FR-004**: System MUST [data or policy requirement]
- **FR-005**: System MUST [observability, security, or audit behavior]

Use `[NEEDS CLARIFICATION: ...]` only when the ambiguity materially changes
scope, security, user experience, or economic risk.

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents and relevant attributes]
- **[Entity 2]**: [What it represents and relevant attributes]

## Sovereign Decision Model *(mandatory for money, consent, trust, or delegation flows)*

- **Decision Required**: [Yes/No; explain why]
- **Principal**: [Who owns the decision]
- **Authorized Agent**: [Which agent acts on behalf of the principal]
- **Intent**: [What the decision authorizes]
- **Allowed Actions**: [Bounded list of actions]
- **Constraints**: [Budget, scope, TTL, merchant/category limits, etc.]
- **Revocation Model**: [How the decision may be revoked]
- **Evidence & Correlation**: [How the decision links to orders, payments, and receipts]

If this section is marked `No`, explain why the feature has no sovereign decision
impact.

## Trust & Protocol Boundaries *(mandatory)*

- **Trust Boundary**: [Where identity, delegation, and authorization are verified]
- **Protocol Roles**: [ACP/UCP/AP2/A2A/MCP/x402/other only if applicable]
- **Authority/Source of Truth**: [Which system is authoritative for each critical domain]
- **Privacy/Security Notes**: [Consent, data minimization, PCI, replay protection, etc.]

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: [Measurable user or operator outcome]
- **SC-002**: [Performance, availability, or correctness outcome]
- **SC-003**: [Auditability, trust, or operational outcome]
- **SC-004**: [Business or delivery outcome]

## Assumptions *(mandatory)*

- **ASSUMPTION**: [Reasonable default used to keep planning moving]
- **ASSUMPTION**: [Scope, environment, or dependency assumption]

## Open Questions *(include only if unresolved and material)*

- **OPEN QUESTION**: [Question]
- **PENDING VERIFICATION**: [Dependency, API, spec version, or org process to verify]
