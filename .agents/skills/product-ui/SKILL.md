---
name: product-ui
description: UI, copy and page rules for the VaayuEdge app (apps/web) and the InferEdge AI company site (apps/company). Use before changing any page, component, styling or marketing copy.
---

# Product UI (VaayuEdge + InferEdge AI)

These are product pages for a real company. The user should trust it in 5 seconds and finish the core task (speak English → hear Telugu) without reading instructions.

## Product rules (non-negotiable)

- One "Agree" click sets everything up; end users never run a terminal command. Native engine lives under "Advanced" only.
- Show honest setup progress (real download bytes / steps), never a fake timer bar.
- No GitHub links. Contact = https://x.com/NeuralMastery only. No email shown.
- Company page: no "how we build", no model names. VaayuEdge page may say "runs on your device" and "works offline after setup".
- No "prototype", "beta roadmap", "coming soon" filler. If a feature doesn't work, it isn't on the page.
- Claims ("private", "offline", latency numbers) must be true and measured; numbers link to evidence in `docs/evidence/`.

## Design

- Core task visible above the fold on a 1366×768 laptop and on a 375px phone: record button, transcript, Telugu output, play.
- States designed explicitly: first visit, downloading models, ready, recording, processing, result, error (mic denied, out of memory, unsupported browser) with a clear recovery action each.
- Telugu text uses a font with full Telugu coverage (Noto Sans Telugu) at ≥18px.
- Same banned AI-slop tells as Neural Mastery (`neuralmastery/platform-vite/.agents/skills/ui-design/SKILL.md`): no gradient text, no emoji icons, no generic 3-card feature grids, no glow, no fake stats or testimonials.
- Both themes if the page has a toggle; contrast ≥ 4.5:1; keyboard and screen reader can complete the core flow.
- SEO pages under `apps/company/*/` keep their static HTML content, canonical URL, OG tags and sitemap entry in sync.

## Verify

Run the flow for real in the browser preview: Agree → models load → record a sentence → Telugu audio plays. Check 375px and desktop, console clean. Then `ship-gate`.
