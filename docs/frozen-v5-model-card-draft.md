# InferEdge English–Telugu adaptation v5 — research model card draft

Status: **unreleased research candidate**, not approved for production. This document describes actual retained weights; it does not imply a Hugging Face release exists.

## Identity and attribution

Fine-tuned by the InferEdge AI / VaayuEdge project from AI4Bharat `ai4bharat/indictrans2-en-indic-dist-200M`, revision `2cfd0a20057756d756bf3e53528f492afc52f91a`. Architecture and pretrained knowledge are upstream contributions. The model has211,776,512 parameters; it is not a foundation model trained from scratch, a new architecture, or a complete speech system.

Frozen exported manifest SHA256: `5235276b82864e619e7868d374bfc4acaa21b204c8cf2f99addbf347c6575515`.

Retained privately in Kaggle dataset `ravivarmapatturi/inferedge-indictrans2-adaptation-v5-retained`. Training commit363628232; matched baseline verification363634942; held-out inference363645611; independent rescore/bootstrap363664956. Check all export file hashes before executing the reviewed custom model code.

## Training

BPCC-H-Daily Telugu is attributed to AI4Bharat and the IndicTrans2 authors. The recorded upstream README identifies this Daily component as CC-BY-4.0; this statement must not be extended to every BPCC component. Cleaning retained8511 pairs, deterministically split by normalized source into7673 train,412 validation,426 internal test. Exact normalized-source decontamination found no overlap with the two IN22 evaluation inputs; near-duplicate/document overlap and upstream pretraining exposure remain unresolved.

PyTorch Lightning full-parameter adaptation:100 optimizer steps, batch2, accumulation1, AdamW learning rate2e-6, seed42, CPU. Approximately200 training examples processed, below one epoch. This small adaptation budget is a pilot. Internal generation selection used the412-row validation set; the frozen checkpoint preceded held-out evaluation. No held-out-driven hyperparameter tuning is authorized.

## Measured quality

Matched baseline and candidate use IndicProcessor English Latin to Telugu script, three beams, maximum generation length256, batch4 and four CPU threads. SacreBLEU2.6.0 scores were independently reproduced from complete saved predictions and hashed references. Environment and metric signatures were checked.

| Corpus | N | Base chrF++ | Adapted chrF++ | Base BLEU | Adapted BLEU |
|---|---:|---:|---:|---:|---:|
| BPCC test |426|53.6451|54.6040|19.9198|21.5296|
| IN22 conversation |1503|44.6710|44.8902|13.0600|13.5208|
| IN22 general |1024|51.4335|51.3796|18.2014|18.2476|

Exploratory1000-resample paired sentence bootstrap, seed20261030, corpus chrF++ recalculated per resample:

| Corpus | Candidate minus base |95% percentile interval |
|---|---:|---:|
|bpcc-test|+0.9589|[+0.3810, +1.6155]|
|in22-conv|+0.2192|[+0.0173, +0.4114]|
|in22-gen|-0.0540|[-0.1698, +0.0633]|

Intervals are per split with no multiplicity adjustment and no training-seed uncertainty. Sentence independence may be imperfect. Conversation improvement is small; general-domain chrF++ has a slightly negative point estimate and an interval spanning zero. These results do not demonstrate universal superiority, human preference, or improvement over current commercial providers. All six prediction passes had zero empty outputs.

## Intended use and limitations

Research on English-to-Telugu text translation. ASR, TTS, code switching, noisy speech, safety-critical correctness and unseen domains are not established by this text benchmark. Native Telugu review is pending. No phone/browser latency, peak memory, energy, or end-to-end speech measurement supports an edge-performance claim. CPU generation totals from one benchmark run are not deployment latency measurements.

## Distribution gates

Before uploading a release: recheck authorized Hugging Face identity; verify actual export bytes; include exact upstream MIT license text and notices, training-data attribution and modified-code notices; audit the final file allowlist for credentials and unintended data; provide a tested loading example and disclose custom-code requirements. Preserve upstream usage/access terms as applicable. No license clearance is inferred from this draft.

A research release must carry these limitations. Production replacement additionally requires native review, matched deployed-pipeline comparison, export parity and measured runtime/memory on named target devices. Quantization experiments on the upstream checkpoint do not establish quantized-candidate quality.

## Evidence

See `docs/frozen-v5-heldout-results.md`, `docs/evidence/indic-heldout-v7-observed.json`, and `docs/evidence/indic-heldout-uncertainty-v1.json`. Training/evaluation code lives in `scripts/train-indictrans2-lightning.py`, `scripts/evaluate-frozen-indictrans2.py` and `scripts/analyze-heldout-pairs.py`. Raw predictions and checkpoints remain retained in Kaggle; local evidence includes UI-extracted reports rather than a claim of locally downloaded weights.
