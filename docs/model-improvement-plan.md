# Improvement plan after the measured pilot regression

## Findings

Measured: 726/1,024 Gen sentences lose sentence chrF++, versus 291 improving; conversational losses/improvements are 684/655. Mean general output length falls from 121.36 to 96.09 characters. This suggests omissions worth inspecting, not proof of a single cause. Review queues contain 30 largest regressions and 10 improvements per benchmark under docs/evidence/pilot-error-audit. Sentence scores are diagnostics; they are not human adequacy ratings.

Measured: zero of 7,673 training targets exceed 128 tokenizer tokens (median 12). Training-target truncation is therefore not supported as an explanation. A 100-step batch-four pilot only processes about 400 examples; it cannot determine the best adaptation budget. Sparse conversational data and full-parameter updates plausibly damage general translation, but this requires controlled experiments.

Measured: 76.9M Opus baseline is already far below released IndicTrans2 outputs. Architecture choice matters: do not assume longer Opus training can close that gap. Historical external output comparisons have identical references/metric settings but unknown generation/revision differences. Sarvam/current services and real compact IndicTrans2 inference remain unmeasured.

## Changes implemented for future runs

Trainer explicitly enters train mode, rejects optimization in eval mode, supports gradient accumulation, linear warmup/decay and periodic validation. New settings are bound into the resume manifest. Compilation and focused existing resume-contract checks pass; end-to-end runtime check of new scheduling/validation is still required. Prior checkpoint/results are unchanged. Do not silently resume old checkpoints into changed scheduler semantics.

## Ordered next experiments

1. Establish a validation selection protocol and human-review queue before more external-test-driven tuning. IN22 has already been examined repeatedly; reserve a fresh licensed independent final test for publication. Do not use the external outputs as training targets.
2. Run compact IndicTrans2 200M unadapted on the identical benchmark as a stronger candidate and measure CPU peak RSS/latency. Review and pin any custom model code before execution. This is the architecture decision gate; do not download a multi-billion-parameter competitor as the edge student by default.
3. Compare one controlled Opus recovery run with small learning rate (hypothesis: 2e-6), effective batch 32 via accumulation, 10% warmup, and periodic validation. Budget at most one epoch initially; select by validation quality with a general-domain retention set. Parameters are experimental targets, not demonstrated best settings. Compute estimate/quota must be recorded before launch.
4. If the stronger model wins, adapt it conservatively or distill licensed teacher translations into a smaller student using a separately audited training corpus. Sequence-level distillation is established prior work, not claimed as our novelty: https://arxiv.org/abs/1606.07947 . Consider LoRA as an ablation, not an automatic quality fix: https://arxiv.org/abs/2106.09685 . Verify teacher output-use permissions before generation.
5. Evaluate quantized exports against full precision; report chrF++/BLEU, RAM, model bytes and p50/p95 latency on named laptops/phones. A defensible edge contribution requires a quality/resource tradeoff against actual candidates, not a universal beating claim.

## Acceptance for a candidate release

Improve conversational validation and independently reviewed adequacy without an unacceptable general-domain regression; document paired uncertainty on final reporting; meet measured device budgets specified before evaluation. No existing evidence establishes competitive superiority. Keep production unchanged until these gates are satisfied. A paper may transparently report negative results, but a formatting update does not make the experiment publication-ready.
