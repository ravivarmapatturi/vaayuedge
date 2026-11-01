# Next controlled adaptation experiment

Status: submitted as Kaggle run363813322; CUDA12.8/TeslaT4 confirmed. Recovery preflight and training completion remain pending. The 10-minute automation remains deleted.

Start from the same pinned upstream model, not the test-exposed v5 weights. Retain v5 unchanged as historical pilot evidence. Use existing 7673 training and 412 validation pairs; do not load BPCC test or IN22 in this training notebook. Dataset manifest may describe test rows, but the experiment must neither copy nor read encoded test data.

First bounded run: 1000 optimizer steps, batch2, accumulation1, AdamW2e-6, seed42. About2000 examples processed, approximately0.26 epochs, not full-corpus training. Save one rolling latest recovery state every100 optimizer steps and select by validation loss; then verify generation on all412 validation examples against the fixed upstream baseline. Larger budget is selected before new results; do not change it in response to historical test weaknesses.

Expected training use: one T4 through Lightning devices=1. Kaggle currently offers T4 x2; the unused second device may still count toward allocation quota. Reserve up to2 GPU-hours for a one-hour training cap, plus setup/validation allowance. This is an estimate, not measured throughput. Launch only after current free quota is explicitly checked and at least2.5 GPU-hours are available; no paid fallback. GPU remained off during preparation; only the committed experiment allocates it. A second seed is a separate bounded run after first-run execution/recovery and validation have been reviewed, not automatic quota consumption.

Required before the larger training loop: real frozen-v5 integrity report; reviewed portable export/reload path (already exercised in v7 inference); training source/data fingerprints; periodic checkpoint and resume verification (GPU fixture runs first and fails closed); no held-out inputs in notebook; verified free quota. Preserve run.json, result.json, checkpoint-selection step, environment and source digest with outputs. Fail on missing CUDA if GPU is requested rather than silently calling CPU training a GPU run.

Internal decision rule: independently recompute validation generation scores and check source identities; candidate chrF++ must not regress relative to upstream54.16978391, no added empty predictions and output length ratio within10%. This is an internal retention screen, not a confirmatory superiority test. Compare against pilot55.07216595 descriptively but do not promise improvement. Select no production model solely from teacher-forced loss.

Fresh independently sourced and reviewed evaluation material is needed before future confirmatory claims. Repeated use of BPCC test and IN22 must be disclosed as historical/exploratory. Native Telugu review and named-device memory/latency/export parity remain separate required gates.
