# InferEdge AI / VaayuEdge — agent harness

This file is the single source of truth for every agent: **Claude Code, Codex, and agy (Antigravity)**. `CLAUDE.md` and `GEMINI.md` only point here. Skills live in `.agents/skills/` (mirrored to `.claude/skills` and `.agent/skills` by symlink — edit the `.agents` copy only).

## Team and lanes
| Agent | Default lane |
| --- | --- |
| Claude Code | Lead/reviewer: plans, reviews diffs from the others, owns product UX and final ship decisions. |
| Codex | Research + model pipeline (`scripts/`, `docs/evidence/`, training/eval). |
| agy | Product web work (`apps/web`, `apps/company`) and SEO pages. |

The user can reassign lanes at any time; the user's latest instruction wins.

## This machine has 8 GB RAM (hard rule for every agent)

One heavy command at a time (model loading, `npm run build`, pytest with ML extras). Never load models while a web build runs. Training belongs on Kaggle, never locally. Kill servers you started when done.

## How to build, test and run (VaayuEdge / InferEdge)

```bash
# API (FastAPI) — mock adapters, no model download
python3 -m venv .venv && . .venv/bin/activate
pip install -r services/api/requirements.txt
PYTHONPATH=services/api pytest services/api/tests/ -q
python3 scripts/benchmark.py --mode mock

# Web app (React + Vite), served at /vaayuedge/
cd apps/web && npm ci && npm test && npm run build && npm run dev   # dev on :5173

# Company site: static files in apps/company/, no build step. Preview:
python3 -m http.server 8080 -d apps/company
```
Research scripts use the interpreter named in `docs/environment-unblock.md`. Deploy = push to `main` (`.github/workflows/deploy.yml` builds apps/web and publishes with apps/company at the root).

## Every session, in order
1. Read this file and the tail of `docs/model-development-progress.md`.
2. `git status` — if another agent left uncommitted work in files you need, stop and ask instead of overwriting.
3. Do the task.
4. Run `.agents/skills/ship-gate/SKILL.md`. Not done until it passes.
5. Commit your files only, append a dated progress entry (who, what, how verified, next).

## Skills
- `ship-gate` — definition of done, product rules, evidence labels. Mandatory.
- `product-ui` — any change to apps/web or apps/company (layout, copy, states, SEO pages).

---

## Working memory

## Mission and product
- InferEdge AI develops intelligence across modalities for devices with limited memory, compute, energy, and connectivity. It is not solely a translation company.
- VaayuEdge is the first product: English-to-Telugu conversation, with recognition, translation, and speech generation considered as a complete user experience.
- The objective is an InferEdge-trained model with demonstrated competitive advantages, not merely a renamed upstream checkpoint. Attribute upstream models and data accurately.
- Compare against the actual deployed pipeline and relevant competitors, including the provider the user calls “swaram” (identify the exact provider before making comparisons).
- Establish competition through reproducible quality, memory, latency, energy, and deployment measurements. Do not claim universal superiority, novelty, or SOTA without evidence.

## Execution preferences
- User explicitly directs autonomous progress without routine approval requests; ask only for missing access, information, or decisions that cannot be safely inferred.
- Use both AGY and Claude for useful bounded parallel work whenever their usage allowance is available. If either is unavailable or rate-limited, skip it and continue independently; retry only on later scheduled runs or after its reported reset. Helpers must never block main-agent progress. Continuous operation is subject to host availability and account limits, not a guaranteed 24/7 service.
- Record new durable requirements and decisions in repository documentation before beginning substantial work. Never store credentials or private account data here.
- Check AGY CLI and Claude CLI availability for substantial research and implementation work. Delegate bounded tasks and request independent critiques when available; continue useful work when unavailable or rate-limited. Retry on later work sessions rather than repeatedly polling or starting paid fallback services.
- Keep CLI collaborators scoped to this project; do not grant unrelated filesystem access or permission bypasses. Review their outputs and verify citations independently.
- Keep Kaggle GPU sessions OFF until research, model selection, data, deployment feasibility, and training code are ready. The user explicitly stopped a premature GPU session on 2026-10-28.
- Never publish fabricated results, replace production with an unevaluated model, or represent a draft manuscript as an accepted arXiv paper.

## Autonomous continuation protocol

This is a project-level mission. Completing an individual task is not completion.

For each work cycle:
1. Read this file and `docs/model-development-progress.md`.
2. Inspect the repository and current Git state.
3. Identify unsatisfied objectives and select the highest-priority actionable task.
4. Implement or investigate it, validate the result, and fix issues where practical.
5. Record evidence, decisions, blockers, and the next action in the progress file.
6. Continue to another actionable task when one is blocked or complete.

A status report is a checkpoint, not a reason to stop. Ask the user only for unavailable access, genuinely unknowable information, high-impact decisions, or actions outside the established scope. Helpers must never block progress.

## Project completion

Do not declare completion while actionable work remains. Before completion, audit this mission and the acceptance criteria in `docs/model-development-progress.md`, and support every claimed result with evidence.

## Compute discipline

Keep Kaggle GPU off until the checkpoint, license and attribution, data, leakage-safe evaluation method, baseline, training code, checkpoint recovery, and deployment feasibility are documented and validated. Record expected GPU hours before any training run. No paid compute without a user-supplied budget.

## Evidence discipline

Label findings as measured results, reproduced third-party results, published claims, hypotheses, targets, or estimates. Never present assumptions as results. Competitive claims must cite reproducible evaluations.

## Access established
- Hugging Face CLI was authenticated as ravivarmapatturi on 2026-10-28. Recheck before publishing.
- Kaggle browser sign-in was verified. Notebook: https://www.kaggle.com/code/ravivarmapatturi/inferedge-english-telugu-training/edit
- Kaggle reported 30 GPU hours remaining and offered T4 x2 on 2026-10-28; quota and availability must be rechecked before use.
- Lightning AI platform access was unavailable during a security incident; PyTorch Lightning can still be used independently of its hosting service.

## Direct execution preference (2026-10-28)
User requested that this assistant work directly instead of the shell continuation runner. Do not start codex-autonomous.sh or spawn replacement Codex CLI loops. Continue authorized work in this chat; heartbeat runs may resume direct work without duplicate workers.
