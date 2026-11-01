# VaayuEdge — Benchmark Methodology & Quality Evaluation

## 1. Quality & Performance Metrics

To transition from a prototype to a dependable edge product, VaayuEdge tracks empirical metrics:

| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| **ASR Word Error Rate (WER)** | < 12% on clean audio | Automated alignment against human-transcribed English ground truth. |
| **Translation Quality (chrF++ / BLEU)** | chrF++ > 55, BLEU > 28 | Evaluation on 50 curated English sentences with native Telugu references. |
| **Meaning Preservation** | Human rating >= 4/5 | Semantic fidelity review by fluent Telugu speakers. |
| **End-to-End Latency** | < 4.0s for 10s audio | Clock delta from end of audio upload to Telugu translation display on CPU. |
| **Peak RAM Consumption** | < 1.5 GB total | `psutil` sampling during concurrent ASR + Translation inference. |
| **Offline Privacy Audit** | 0 WAN packets | Network socket monitoring during inference execution. |

## 2. Evaluation Dataset Structure
Evaluation samples are maintained under `tests/fixtures/eval_set.json` containing:
- Domain categories: Conversational, Inquiries, Instructions, Numbers & Dates, Accented Speech.
- Audio duration: 3s – 15s.
- Ground truth English transcript.
- Reference Telugu translation (verified by native speakers).

## 3. Running Benchmarks
Use the automated benchmark script (the supported modes are `real`, `mock`,
and `fixture`; `mock` validates the harness without loading model files):
```bash
python3 scripts/benchmark.py --mode mock --output /tmp/vaayuedge-benchmark.json
```
The JSON artifact includes sampled peak RSS rather than only the final RSS
snapshot. Mock output is diagnostic evidence only and must not be reported as
neural-model latency or quality.
Translation score artifacts also include an evaluator version, input paths,
byte/row counts, and SHA-256 fingerprints for both JSONL files; retain these
fields with any reported score so the exact inputs can be audited. The
evaluator also requires the exact model/deployed-pipeline name that produced
the predictions and records an optional revision plus the pipeline source;
never report a score without this provenance.
For conversational Telugu review, store one JSONL row per prediction with
`source`, a pseudonymous `reviewer_id`, and an integer `rating` from 1 through
5. Validate complete coverage and summarize supplied judgments with:
`python3 scripts/validate-human-review.py --predictions PREDICTIONS.jsonl
--reviews REVIEWS.jsonl --output human-review-summary.json`. The summary is
measured review evidence only; reviewer qualifications, inter-rater agreement,
and sampling representativeness must be documented separately.
This script profiles inference time, memory watermark, and Telugu-script output
presence. In `real` mode, ASR and MT model loading/timing are real when their
bundles are available, but the current runner deliberately uses synthetic tone
audio, fixed source text, and `MockTTSAdapter`. Its output is therefore a
partial ASR/MT timing diagnostic, not an end-to-end speech quality or neural
TTS result. No quality metric is computed by this runner.

For a speech-grounded harness check, provide a JSON array whose rows contain
`audio_path`, `transcript`, and `reference_translation` (plus optional
`category`) and run `python3 scripts/benchmark.py --mode fixture --fixture
PATH`. Fixture mode reads the supplied audio and feeds the ASR transcript into
MT, but records the transcript/reference only as provenance. It does not
compute WER, BLEU, chrF++, or human-quality scores; the current regression
uses mock ASR, MT, and TTS and is harness evidence only.

Before attempting a real local benchmark, run the dependency-free deployment
preflight. It reports configured bundle paths and on-disk sizes without loading
or downloading models:

```bash
python3 scripts/assess-deployment-feasibility.py \
  --output /tmp/vaayuedge-deployment-preflight.json
```

Missing bundles mean the real benchmark is not runnable locally. A complete
preflight still does not establish licensing, quality, RAM usage, or latency.
