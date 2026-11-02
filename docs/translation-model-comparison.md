# Translation model comparison for VaayuEdge

Updated 2026-11-02. This comparison uses only evidence already retained in this repository. Scores are measured results unless explicitly labelled otherwise.

## Decision

The evidence does **not** justify replacing the current browser Opus-MT translation path with either fine-tuned IndicTrans2 checkpoint.

The 100-step IndicTrans2 checkpoint has the strongest external evidence, but its result is mixed: measured chrF++ improved on BPCC test by `+0.9589` and IN22 conversation by `+0.2192`, while IN22 general changed by `-0.0540`. The exploratory 95% paired-bootstrap interval includes zero on IN22 general. The 1000-step checkpoint improved the internal 412-row validation score by `+4.1447` chrF++ over its fixed upstream baseline, but it has not been run on the frozen held-out suites. Neither checkpoint has native-speaker review, browser-export parity, or named-device memory and latency measurements.

## Evidence in scope

| System | Evidence | What it establishes | Important limit |
|---|---|---|---|
| Current Opus-MT path | Browser worker uses the published q8 ONNX model; native Opus-MT baseline measured on complete IN22 Conv and Gen sets | Native baseline: Conv BLEU `3.8522`, chrF++ `28.3675`; Gen BLEU `3.6755`, chrF++ `26.8627` | The measurements are native Opus-MT, not the browser q8 end-to-end runtime |
| Historical fine-tuned Opus, 100 steps | Complete held-out rescore in `docs/benchmark-comparison-results.md` | It regressed against its own Opus baseline and is not a release candidate | Different architecture/evaluation path from IndicTrans2 |
| Fine-tuned IndicTrans2, 100 steps (frozen v5) | 2,953 held-out pairs, matching environment, complete predictions, independent rescore, paired bootstrap | Small measured gains on BPCC and conversation; essentially flat/mixed general-domain result; zero empty outputs | No training-seed uncertainty, human review, browser runtime, or production approval |
| Fine-tuned IndicTrans2, 1000 steps | Complete 412-row internal validation rescore | Internal chrF++ `58.3145`, BLEU `27.5138`, zero empty; `+4.1447` chrF++ versus the fixed upstream validation baseline | Validation-only result; no held-out generalization evidence may be transferred from v5 |

The upstream/native benchmark results suggest that IndicTrans2 is a much stronger translation family than native Opus-MT on the retained IN22 references. That is useful architecture-selection evidence, but it is not a production swap test: decoding, export and runtime differ, and the current deployed browser artifact itself was not evaluated in the matched comparison.

## In-browser feasibility

The current browser route is deployable because an ONNX q8 Opus artifact is already wired into Transformers.js. The fine-tuned IndicTrans2 exports are PyTorch/SafeTensors research packages with custom model code. The verified 100-step frozen export is 1,108,559,190 bytes across 13 manifested files; the 1000-step model uses the same roughly 211.8-million-parameter architecture. This is stored-weight evidence, not a browser peak-memory measurement.

No retained evidence shows a successful ONNX/WebGPU/WASM export of either fine-tuned IndicTrans2 checkpoint, tokenizer/processor parity in JavaScript, quantized full-validation retention, browser cold start, download size after conversion, peak RAM, or 375px/mobile-device reliability. The existing upstream INT8 feasibility experiment failed its quality-retention gate on a 32-row subset. Therefore in-browser feasibility remains open.

Before a swap: export one frozen checkpoint to a browser-supported format; verify exact output parity on the complete internal validation set; run the frozen held-out suites without tuning; measure download bytes, peak memory and latency on named laptop and phone targets; obtain native Telugu review; and re-audit the full ASR→MT→TTS experience.

## Commercially usable Telugu TTS options

These are candidates, not implementation approvals. Provider terms can change; legal review, privacy review, pricing, quality evaluation and data-processing configuration remain necessary.

| Option | Verified Telugu support | Commercial-use basis | Deployment consequence |
|---|---|---|---|
| Microsoft Azure Speech prebuilt neural voices | Microsoft lists `te-IN-ShrutiNeural` and `te-IN-MohanNeural` | Microsoft Product Terms state that paid-tier TTS customers may use audio from prebuilt neural voices commercially | Hosted API; not offline and text leaves the device unless a separately licensed supported local offering is used |
| Google Cloud Text-to-Speech | Google lists Telugu `te-IN` Standard and Chirp 3 HD voices | Google documents generated audio for use in applications/media subject to Google Cloud terms | Hosted API; not offline; review service-specific AI restrictions and data handling |
| ElevenLabs Eleven v3/v4 | ElevenLabs lists Telugu (`te`) for its current broad-language models | ElevenLabs documents commercial rights for output generated on paid plans; free-plan output is non-commercial | Hosted API; confirm the exact selected model supports Telugu and evaluate pronunciation before use |

Official pages opened and checked on 2026-11-02:

- Azure language support: https://learn.microsoft.com/en-gb/azure/ai-services/speech-service/language-support?tabs=tts
- Azure Product Terms: https://www.microsoft.com/licensing/terms/product/MicrosoftAzure/all
- Google voice list: https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types
- Google Cloud TTS use and terms link: https://docs.cloud.google.com/text-to-speech/docs/basics
- ElevenLabs language support: https://elevenlabs.io/docs/help-center/other/what-languages-do-you-support
- ElevenLabs commercial plan rights: https://elevenlabs.io/docs/overview/administration/billing

Meta MMS-TTS Telugu is deliberately excluded from the commercial list: the repository's ship gate records its weights as CC-BY-NC, so it must not be wired into a paid or monetized path. The browser's operating-system Web Speech voice is also not a dependable product dependency because voice presence and applicable platform terms vary by device.

## Repository evidence

- `docs/published-research-checkpoints.md`
- `docs/frozen-v5-heldout-results.md`
- `docs/evidence/frozen-v5-real-integrity.json`
- `docs/evidence/indic-heldout-uncertainty-v1.json`
- `docs/benchmark-comparison-results.md`
- `docs/edge-int8-feasibility.md`

