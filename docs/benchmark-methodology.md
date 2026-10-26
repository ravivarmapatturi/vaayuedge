# VayyuEdge — Benchmark Methodology & Quality Evaluation

## 1. Quality & Performance Metrics

To transition from a prototype to a dependable edge product, VayyuEdge tracks empirical metrics:

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
Use the automated benchmark script:
```bash
python3 scripts/benchmark.py --mode local --samples 10
```
This script profiles inference time, memory watermark, CPU usage percentage, and output fidelity.
