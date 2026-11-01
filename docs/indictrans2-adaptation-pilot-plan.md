# IndicTrans2 bounded adaptation pilot

Status: planned, not started. Upstream base remains ai4bharat/indictrans2-en-indic-dist-200M at2cfd0a20057756d756bf3e53528f492afc52f91a; accurately attribute upstream weights and BPCC-H-Daily data.

Full-parameter CPU save/resume succeeded in Kaggle version4 (363621478). Use the higher-memory free CPU environment first: GPU hours0, no paid compute. Estimated wall time10–30minutes, not a guarantee. Bound training subprocess to1800seconds and generation evaluation to900seconds. Train100optimizer steps, batch2, accumulation1, AdamW2e-6, seed42, complete7673-row training split available, no fixture restriction. This exposes at most200 examples in this pilot and is not a full epoch. Validate loss at100batches, save final state and selected checkpoint; retain selected-step/score evidence. Cache/dependencies under /tmp, model/results only under /kaggle/working.

Then generate all412 internal validation examples from selected export with the pinned language/script processing and beams3/max256, using the existing deterministic ordering. Recompute chrF++ and compare against baseline54.16978391 (BLEU21.34070359). Predeclared gate: no chrF++ regression, no new empty outputs, length ratio within10% of baseline. Passing is an internal-selection result only; reserve426 internal test and IN22 for final evaluation. Neither test split may influence this pilot. Do not change the gate after seeing results.

No Hugging Face public release or production replacement based on this pilot alone. Full external quality, native Telugu human review and device memory/latency gates remain required. If regression occurs, preserve evidence and analyze internal errors before choosing a new training budget or recipe.
