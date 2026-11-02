# VaayuEdge end-to-end audit

Audit branch: `e2e-audit`  
Audit date: 2026-11-02

## Findings

| Severity | Area | Finding | Status |
|---|---|---|---|
| High | Product claims | The homepage described every flow as local/offline even before the on-device engine was ready; browser speech recognition can have browser-dependent data handling | Fixed: claims now attach privacy/offline behavior to the visible Ready state |
| High | Commercial licensing | Product copy did not disclose that the current MMS Telugu voice weights are non-commercial | Fixed in FAQ and comparison; commercial alternatives documented; no production TTS provider changed |
| High | Recording | Missing `mediaDevices`/`MediaRecorder`, or a constructor failure after permission, could throw and leave the microphone stream open | Fixed with support checks, track cleanup and recovery copy |
| High | Setup errors | Unsupported-browser, out-of-memory and failed-download errors all produced one generic message | Fixed with deterministic classification and recovery actions; regression tests added |
| Medium | Download honesty | Setup showed only an aggregate percentage, with no received/total bytes or current file | Fixed: live aggregate bytes and current file are displayed; completion remains capped below 100 until initialization resolves |
| Medium | Company copy | Company homepage contained unmeasured latency/privacy/cost claims, “state-of-the-art” language, a GitHub link and implementation-focused model content | Fixed on the homepage with evidence-calibrated product language and no GitHub links |
| Medium | Accessibility | Setup dialog lacked an accessible name; errors and progress were not announced; Telugu output could render below the required 18px size | Fixed with dialog labelling, alert/status live regions, `lang="te"`, and 18px Telugu text |
| Medium | Offline reload | Model caching existed, but the application shell had no explicit offline navigation/asset fallback | Fixed with a scoped service worker; an offline reload passed after first load |
| Medium | Static-mode console | The published client repeatedly probed an absent loopback daemon, producing severe console errors before Advanced setup | Fixed: loopback calls are gated to daemon/dev hosting or explicit Advanced opt-in |
| Medium | Mobile core task | At 375×812, Telugu output and Play initially fell below the fold | Fixed: compact mobile field/spacing rules and mobile-hidden preset ribbon put record, transcript, translate, output and Play in one viewport |
| Medium | Translation swap | No single document compared deployed Opus-MT with both fine-tuned IndicTrans2 checkpoints and browser feasibility | Fixed in `docs/translation-model-comparison.md`; decision is no swap |
| Open | Full local model setup | The three large model downloads and offline reload require real network/cache/device resources not available in the automated browser audit | Open; unit logic and UI states verified, but a full first-run model download is not claimed |
| Open | Microphone/audio | A real microphone and native Telugu speaker/output device were unavailable to automation | Untested; no claim that physical capture or audible playback passed |
| Open | IndicTrans2 browser deployment | No browser-compatible export and parity/runtime evidence exists | Open; production swap rejected |

## Verification

- `cd apps/web && npm test && npm run build`: 5 test files, 18 tests passed; TypeScript and Vite production build passed. The gate was rerun after the final mobile change.
- Local production build in headless Chrome, 1366×768 and 375×812: no horizontal overflow and no severe console errors. Typed `How are you?`, translated to `మీరు ఎలా ఉన్నారు?`, and exercised the Telugu playback control/fallback.
- Consent dialog had an accessible name. Simulated missing recording APIs produced the recovery state instead of throwing.
- After the service worker became ready, Chrome network emulation was set offline and a full reload retained the app shell and core controls.
- Company homepage passed desktop and mobile checks. `/about/`, `/edge-ai/`, and `/english-to-telugu/` loaded at 375px with no horizontal overflow.
- Screenshots: `docs/evidence/e2e-audit-web-desktop.png`, `e2e-audit-web-mobile.png`, `e2e-audit-company-desktop.png`, and `e2e-audit-company-mobile.png`.

Physical microphone capture, actual audible speaker output, and the complete three-model first download were **not tested**. The browser connector was unavailable, so the visual/interactions used local Selenium + headless Chrome. Setup error mapping and byte aggregation were covered by unit tests; this is not a claim that model download succeeded on a real target device.
