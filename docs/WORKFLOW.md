# Working model — user + assistant + Codex/Claude + PCM

**Intention:** design with the user, prototype visually, validate, delegate implementation to Codex, use Claude Code or independent reviewer as a second perspective, and keep a compact checkpoint in private PCM.

\`\`\`text
Question / user intent
    → short mechanism specification and alternatives
    → interactive Mechanics Lab preview (isolated)
    → user acceptance of expected behavior
    → implement core module (Codex) in feature branch
    → unit/property tests and real-device/performance evidence
    → independent code review and user signoff
    → merge and deploy
    → verify deployed SHA and log PCM checkpoint
\`\`\`

## Who owns what
- **User:** product priority, mechanics behavior and release approval.
- **Assistant:** explain tradeoffs, structure design options, create/refine specs, evaluate demos and review results.
- **Codex:** implement agreed interfaces/algorithm, tests and benchmarks; report uncertainties rather than guessing biology.
- **Claude Code / second reviewer (optional):** review architecture, regressions, model assumptions and performance independently.
- **PCM:** private contextual index of decisions, changelog, tasks, evidence and handoff; not a second copy of all source or chat text.

## Checkpoint content
Project: ASCean. Date; repo/branch/commit; mechanism ID; decision state/change; source PR; tests, OS/browser/device; evidence links; quantitative metrics if measured; known caveats; next action; release/rollback status. **No fabricated token/energy/time usage.**

## Branching / integration
- Each bounded milestone/mechanism on \`feature/*\` or \`docs/*\` branch.
- Open a PR, use CI, approve and only then merge. No auto-merge/deploy from a proposal.
- On any conflict, refresh source state; do not force-push over unknown user changes.
- The public ASCean Pages may host demonstrations and docs; PCM itself stays private with owner-only access.

## Codex working contract
Codex receives \`AGENTS.md\`, the decision IDs, target files, constraints, acceptance criteria, tests and a bounded implementation request. It should not consume the full chat transcript or turn provisional mock values into production equations.
