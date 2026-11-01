# Pilot recovery and evaluation

1. Recover Kaggle output without rerunning training. Verify final.ckpt, export/model.safetensors, tokenizer files, run-manifest.json and artifact-manifest.json. Preserve an output-inclusive notebook version before stopping the draft session.
2. Download to a dedicated local model artifact directory. Verify hashes against artifact-manifest.json; preserve provenance. Do not upload an unvalidated model publicly.
3. Generate predictions with the recovered export on the same pinned IN22-Conv and IN22-Gen references, target prefix >>tel<<, maximum length 256, three beams. Preserve occurrence-aware source alignment and full coverage. Keep inference on CPU initially.
4. Compare to measured baseline: Conv BLEU 3.852172500944975 / chrF++ 28.36747647035544; Gen BLEU 3.6754650954298835 / chrF++ 26.86266519014733. Verify baseline artifact paths and hashes before comparison. Validation loss alone cannot establish translation improvement.
5. Review the trainer's eval-mode warning before scaling the run; ensure train/eval transitions are explicit and measured. A 100-step pilot at batch four is about 400 training examples, not an epoch over 7,673 rows.
6. Only after quality evidence: evaluate export compatibility, peak RAM, latency and quantization impact on representative devices; then decide on longer training and publication.

Recovery preparation: generate-baseline-predictions.py now accepts --export-dir for the recovered fine-tuned SafeTensors export, preserving the same decoding settings and recording every export file hash. Baseline behavior remains the default. CLI/help and compilation checks passed; real derivative evaluation awaits artifact recovery. Browser control retry still fails; no duplicate training launched.
