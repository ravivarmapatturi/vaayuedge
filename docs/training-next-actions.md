# Immediate execution queue

The prior runner repeated unchanged checks under a network-disabled sandbox. Corrected runner enables network while retaining workspace filesystem restrictions, and explicitly uses `/tmp/inferedge-model-env/bin/python`.

1. Validate actual environment imports; do not reinstall globally.
2. Audit and pin Helsinki-NLP/opus-mt-en-dra license and exact checkpoint. Use it as the first compact experimental derivative rather than waiting for unrelated Bodhan gated terms.
3. Validate BPCC-H-Daily CC-BY-4.0 rights from upstream and regenerate splits from the decontaminated corpus with complete provenance.
4. Export pinned IN22 references (check repository revision strings against Hugging Face API), download the baseline, and generate baseline predictions. Score with sacrebleu.
5. Complete and CPU-dry-run `scripts/train-translation-lightning.py` using actual pretrained weights, validation, checkpoint recovery, and export. Tiny GRU smoke tests do not satisfy this step.
6. Package a bounded Kaggle run; verify current free quota and document expected GPU hours before launching. Notify the user only once actual fine-tuning optimizer steps begin, including the run link.

Do not rerun unchanged passing test suites as the principal work of a cycle. Keep GPU off until the documented prerequisites are satisfied. No paid compute.

## General baseline runtime correction

The repeated bounded Gen probes discard completed work and prevent completion. At the observed 16–21 rows/minute, 1,024 rows require an estimated 49–64 minutes, not a reason to stop after 2–3 minutes. Run one monitored CPU pass with a sufficient wall-time budget (up to 2 hours), avoid restarting it between cycles, and checkpoint predictions with provenance if implementing resumability. Do not repeatedly discard partial work merely because generation takes longer than one agent turn. This is an estimate; only full measured output qualifies for scoring.

## Scope and rights-audit correction

Disk cleanup has restored about 50 GB free; the old ENOSPC blocker is obsolete (recheck available space before writing). Upstream IndicTrans2 README explicitly assigns CC-BY-4.0 to newly added BPCC-H-Daily. Missing Hub license metadata alone does not negate an upstream license statement. Verify that the pinned daily/tel_Telu.tsv is this named component, preserve the upstream source and attribution, and make a reasoned component-level decision. Do not require an extra rights manifest solely because Hub cardData.license is null. Scope the initial experiment to Helsinki Opus-MT and BPCC-H-Daily: unrelated Bodhan/Gemma or Samanantar holds must not block a run that uses neither. Complete actual remaining prerequisites and Kaggle preparation rather than adding more reporting gates.
