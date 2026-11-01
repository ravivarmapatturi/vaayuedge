# IndicTrans2 CPU INT8 feasibility (preliminary)

This transforms the pinned upstream model; it is not an InferEdge-trained checkpoint. Dynamic quantization affected 289 linear layers. On the deterministic32-row internal validation subset, chrF++ changed from 57.3689 to 56.4188; BLEU changed from 21.6556 to 21.0162. No empty outputs. The predeclared no-regression gate fails.

Generation took 9.0688s, excluding model loading and quantization. A paired FP32 run with the current evaluator is pending. This is not single-request latency, a controlled speedup, memory measurement, mobile/browser compatibility, external benchmark, or production approval.

Evidence: artifacts/indic-validation-int8-v1 and docs/evidence/indic-int8-retention-v1.json. Next: controlled paired runtime, larger internal validation, model footprint and peak memory; explore selective quantization only using internal validation.

Paired FP32 completed with identical recorded environment and evaluator: 19.8702s vs INT8 9.0688s; observed single-run ratio 2.191. Loading/quantization excluded. No repeat-run variance or peak memory measured; do not generalize the ratio. Full internal INT8 validation pending.
