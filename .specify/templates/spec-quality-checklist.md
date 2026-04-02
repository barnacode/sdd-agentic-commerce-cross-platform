# Spec Quality Checklist

Use this checklist before advancing from `spec.md` to `plan.md`.

## Quality Level

- [ ] The spec declares its current quality level (`SQ1` to `SQ5`)
- [ ] The spec is at least `SQ4`
- [ ] If the feature involves money, delegation, consent, checkout, or trust-sensitive flows, the spec targets `SQ5`

## Core Quality

- [ ] The problem is explicit
- [ ] The objective is explicit
- [ ] In-scope and out-of-scope boundaries are explicit
- [ ] Primary actors are explicit
- [ ] Requirements are testable and non-ambiguous
- [ ] Acceptance scenarios use verifiable `Given/When/Then`
- [ ] Success criteria are measurable
- [ ] Constraints are explicit
- [ ] Assumptions are explicit
- [ ] Open questions are minimal and material only

## Sovereignty, Trust, And Authority

- [ ] The spec states whether a sovereign decision is required
- [ ] If required, the `Sovereign Decision Model` is explicit
- [ ] Principal and authorized agent are not conflated
- [ ] Trust boundaries are explicit
- [ ] Protocol roles are justified
- [ ] Authority/source-of-truth ownership is explicit

## Failure And Operability

- [ ] Timeout behavior is considered
- [ ] Duplicate submission behavior is considered
- [ ] Revocation behavior is considered when applicable
- [ ] Hard-fail and partial completion paths are considered
- [ ] QA implications are identified
- [ ] Endpoint implications are identified
- [ ] Postman implications are identified for endpoint work

## Traceability

- [ ] Jira linkage exists or is marked `PENDING VERIFICATION`
- [ ] Confluence linkage exists or is marked `PENDING VERIFICATION`
- [ ] Material pending verifications are explicit

## Reject Conditions

Reject the spec if any of these are true:

- [ ] Decision sovereignty is required but not modeled
- [ ] Identity and agent authorization are mixed without boundary
- [ ] Protocols are named without boundary justification
- [ ] Authority/source-of-truth is missing
- [ ] Critical failure paths are omitted
- [ ] There are more than three material ambiguities
- [ ] Implementation detail dominates the `what` and `why`
