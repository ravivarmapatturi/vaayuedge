# Design brief: common rules (InferEdge AI and VaayuEdge)
The owner says the site looks very bad. Treat this as a real redesign, not a text edit. Judge by looking at screenshots.

Read first: AGENTS.md, .agents/skills/product-ui/SKILL.md.
Positioning (owner's words, must hold): InferEdge AI is a general on-device AI company, not "English to Telugu". VaayuEdge is on-device speech-to-text, translation and text-to-speech, initially focused on English to Telugu and Telugu to English. Today only English to Telugu is live; say Telugu to English is in development.
Inspiration for quality only, never copy text, layout or assets: udgamlabs.com (calm, typographic, real demo high on page, dated index, honest numbers) and artificialanalysis.ai/leaderboards/models (dense, sortable, clear comparison).

Design standard:
- One confident visual identity shared by both sites: a defined type scale with a distinctive display face and a readable body face, a restrained palette as CSS variables, an 8px spacing grid, consistent components.
- Light theme is default, dark supported through prefers-color-scheme. Contrast at least 4.5:1.
- Real content is the visual: live translation example, real leaderboard numbers, real research entries. Draw simple original SVG diagrams only where they explain how on-device processing works.
- Telugu in Noto Sans Telugu at 18px or more.
- Fast: no heavy libraries, no layout shift, images and fonts optimized. Works at 375, 768, 1366 and 1920px with no horizontal scroll. Keyboard and screen reader usable. Keep all canonical, OG, JSON-LD and sitemap entries valid.
Banned: gradient text, glowing blobs, emoji icons, generic 3-card feature grids, oversized empty sections, centred marketing heroes, words such as revolutionary, seamless, cutting-edge, empowering.
Honesty, no exceptions: invent no number, customer, partner, team, testimonial, award, or date. Change no scores or sizes. Do not change the facts on /leaderboard/ or /research/, only their presentation. Do not claim on-device privacy beyond what the code does. No GitHub links; contact is https://x.com/NeuralMastery only.
Machine rules: 8 GB RAM, one heavy command at a time. Do not touch models, inference or translation logic. Commit on your own branch. Do NOT push or deploy. Save before and after screenshots at 375 and 1366px to artifacts/design-review/ and list anything you could not verify.
