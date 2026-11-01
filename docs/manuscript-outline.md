# Working manuscript: conversational adaptation of IndicTrans2

Status: evidence-backed manuscript outline, not submitted or accepted. Authorship and affiliations require finalization. The current two-column PDF includes the IndicTrans2 results and was rendered for layout review; it remains a preliminary research draft.

## Proposed title and research question

**Small-Budget English-Telugu Conversational Adaptation: Reproducible Quality Gains and Unresolved Edge Deployment Constraints**

Does a bounded conversational adaptation improve a pretrained translator on matched held-out conversation data, and what evidence remains necessary for memory-constrained deployment? InferEdge AI addresses multimodal intelligence; VaayuEdge is its first conversation product. This experiment isolates text translation, not the complete ASR/TTS experience.

## Abstract draft

We study a100-step full-parameter adaptation of AI4Bharat's211.8-million-parameter distilled IndicTrans2 English-to-Indic model for English-to-Telugu conversation. A licensed BPCC-H-Daily corpus yields 7673 training, 412 validation and 426 internal test pairs. The checkpoint is frozen before matched baseline/candidate evaluation on the internal test and complete IN22 conversation and general-domain sets. Independent rescoring verifies all 2953 paired examples. Adaptation changes chrF++ by+0.9589 on the internal test,+0.2192 on1503 conversation examples and-0.0540 on1024 general examples. Exploratory paired-bootstrap 95% intervals are[+0.3810,+1.6155],[+0.0173,+0.4114] and[-0.1698,+0.0633], respectively. These results support a small conversational gain under this protocol, while general-domain improvement remains unestablished. We report exact provenance and limitations; target-device memory, latency, energy and native-speaker quality remain unmeasured. We make no universal superiority or edge-readiness claim.

## Methods and attribution

Base: `ai4bharat/indictrans2-en-indic-dist-200M`, revision `2cfd0a20057756d756bf3e53528f492afc52f91a`;211,776,512 parameters. Pretraining, architecture and toolkit are upstream contributions. Full-parameter adaptation with PyTorch Lightning: AdamW 2e-6,100 steps, batch 2, accumulation 1, seed 42, CPU. Approximately 200 examples processed; no full epoch. Final export manifest SHA256 `5235276b82864e619e7868d374bfc4acaa21b204c8cf2f99addbf347c6575515`.

BPCC-H-Daily Telugu: 8511 cleaned pairs, attributed to AI4Bharat/IndicTrans2; recorded Daily-component license CC-BY-4.0. Source-normalized deterministic split. Zero exact normalized-source overlaps found against IN22; this does not exclude near duplicates, document overlap or upstream model pretraining exposure. Validation selection is separate from frozen held-out inference; opened test sets must not guide subsequent tuning.

Matched inference: IndicProcessor eng_Latn to tel_Telu, three beams, max 256 generation tokens,batch 4, four CPU threads. Environment Python 3.13.15, Torch 2.11.0+cpu, Transformers 4.51.3, IndicTransToolkit 1.1.1, SacreBLEU 2.6.0. Verify actual complete metric signatures in retained reports rather than reconstructing them from defaults.

## Results to include

| Corpus | N | Base BLEU | Adapted BLEU | Base chrF++ | Adapted chrF++ |
|---|---:|---:|---:|---:|---:|
| BPCC test |426|19.9198|21.5296|53.6451|54.6040|
| IN22 conversation |1503|13.0600|13.5208|44.6710|44.8902|
| IN22 general |1024|18.2014|18.2476|51.4335|51.3796|

All six passes produce zero empty outputs. Internal 412-row validation chrF++ 54.1698 to 55.0722 is selection evidence and must not be pooled with held-out tests. BLEU and chrF may disagree; report both.

## Statistical interpretation

Independent analysis checks corpus hashes, full ordered source/reference membership, metric scores/signatures, environment/decoding agreement and candidate manifest before1000 paired sentence resamples, seed 20261030. Corpus chrF++ is recomputed, not averaged from sentence scores. Per-split percentile intervals are exploratory, unadjusted for multiple comparisons, and do not cover training-seed uncertainty. Conversation gain is small. General-domain interval includes zero; neither improvement nor equivalence is established. Document-level dependence is an unresolved limitation.

## Earlier negative experiment

Retain the 100-step 76.9M Opus-MT adaptation as a separate pilot: IN22-Conv chrF++ 28.367 to27.150; IN22-Gen 26.863 to19.986. Do not pool architectures, optimizer budgets or environments into one ablation, and do not hide this regression. Historical Opus results are not a matched current-provider comparison.

## Remaining experiments and limits

1. Blinded native Telugu adequacy/fluency review, including negation, names, numerals, register and context. No human scores yet.
2. Matched deployed-pipeline and licensed competitor evaluation. The user's provider name “swaram” remains unresolved; do not silently identify it as Sarvam or claim provider superiority.
3. Export parity and named-device peak RAM, artifact size, cold/warm latency distributions, throughput and instrumented energy. Upstream INT8 explorations do not establish candidate-device performance.
4. Further adaptation budgets/multiple seeds selected on training/validation data only; obtain fresh untouched final evaluation data for later confirmatory claims.
5. Complete ASR-translation-TTS evaluation separately from text translation.

## Reproducibility and release

Training run 363628232; matched validation 363634942; held-out inference 363645611; rescore/bootstrap 363664956. Raw predictions and model files retained in Kaggle; local UI-extracted structured evidence in `docs/evidence/indic-heldout-v7-observed.json` and `docs/evidence/indic-heldout-uncertainty-v1.json`. Research model card: `docs/frozen-v5-model-card-draft.md`. No Hugging Face publication or production replacement is asserted. Include exact upstream license copies and attribution before distribution.

## Primary references for final bibliography

- AI4Bharat, IndicTrans2 paper: https://arxiv.org/abs/2305.16307
- AI4Bharat model: https://huggingface.co/ai4bharat/indictrans2-en-indic-dist-200M
- AI4Bharat data/code: https://github.com/AI4Bharat/IndicTrans2
- Matt Post, A Call for Clarity in Reporting BLEU Scores: https://aclanthology.org/W18-6319/

References identify already recorded primary sources; verify bibliography metadata and exact license attachments during final manuscript assembly.
