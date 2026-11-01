---
name: ship-gate
description: Definition of done for InferEdge AI / VaayuEdge. Use before claiming any task is finished, before committing, and before pushing to main (which auto-deploys inferedgeai.com).
---

# Ship gate (VaayuEdge / InferEdge AI)

A task is done only when every applicable check below was **run in this session** and its output observed. "Should work" is not done.

## 1. Run the checks that match what you touched

| Touched | Command (from repo root) | Must see |
| --- | --- | --- |
| `services/api/**` | `PYTHONPATH=services/api pytest services/api/tests/ -q` | 0 failed |
| `scripts/benchmark.py` or pipeline code | `python3 scripts/benchmark.py --mode mock` | exit 0 |
| `apps/web/**` | `cd apps/web && npm test && npm run build` | exit 0 both |
| `apps/company/**` (static site) | open the page in a browser preview at 375px and desktop; check console | no errors, no horizontal scroll |
| Anything user-visible | screenshot of the real page (built-in browser) | attach or describe what you saw |

Model / research work uses the interpreter in `docs/environment-unblock.md`, not system Python.

## 2. Product rules a reviewer will reject on sight

- End users never run terminal commands. One "Agree" click must set everything up (in-browser engine). Native engine is "Advanced" only.
- No GitHub repo links on either site. All contact = https://x.com/NeuralMastery. No email addresses.
- Company page (`apps/company`) shows no "how we build" section and no model names.
- No prototype / roadmap / "coming soon" copy presented as product.
- Never delete `apps/company/google10cb3441dae7a3fc.html` (Search Console) or the IndexNow key `.txt`.
- MMS-TTS Telugu is CC-BY-NC: never wire it into a paid/monetized path.
- HF model IDs stay `vayyuedge-*` (intentional). Product name is **VaayuEdge**.

## 3. Evidence rules (research + marketing copy)

Every number shown to users or written in docs is labelled one of: *measured (with run id / file)*, *reproduced third-party*, *published claim (cite)*, *target*, *estimate*. No "SOTA", "best", "beats X" without a reproducible eval in `docs/evidence/`.

## 4. Commit hygiene

- Commit only files related to your task. No `tmp/`, `output/` scratch, model weights, `.env`, tokens.
- Conventional message: `feat(web): …`, `fix(api): …`, `docs(research): …`.
- Append one dated entry to `docs/model-development-progress.md` (research) or the "Log" section of `AGENTS.md` handoff (product): what changed, how it was verified, what is next.
- If a check failed and you could not fix it, say so in the handoff — never weaken a test to pass.
