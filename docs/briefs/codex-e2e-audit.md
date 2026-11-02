# Brief for Codex: VaayuEdge end-to-end audit and fixes

Read AGENTS.md, skills ship-gate and product-ui. Branch `e2e-audit`; do not merge or push to main. No GPU, no publishing, no production model swap.
Audit apps/web: consent/setup, download progress honesty, recording, transcript, translate, Telugu playback, every error state (mic denied, out of memory, unsupported browser, failed download), offline after setup, 375px and desktop. Audit apps/company copy against the product rules.
Fix real bugs with a test for each. Run `cd apps/web && npm test && npm run build` once at the end, and the API tests if touched. Microphone flows you cannot run: mark untested, never claim them.
Also write docs/translation-model-comparison.md from existing docs/evidence only: current Opus-MT vs the fine-tuned IndicTrans2 checkpoints, whether the evidence justifies a swap, and in-browser feasibility. Also list commercially usable Telugu TTS options with licence links opened and verified.
Write docs/e2e-audit-report.md: findings by severity, fixed or open, how verified. Commit often and push the branch.
