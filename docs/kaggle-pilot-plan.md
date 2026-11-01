# First Kaggle pilot — 2026-10-28

Scope: fine-tune Helsinki-NLP/opus-mt-en-dra pinned at 5ecfd223f954f860b67f1b4c42e6f4c70d347581 on the BPCC-H-Daily Telugu component (upstream IndicTrans2 LICENSE section explicitly CC-BY-4.0; NOTICE retained). This scope excludes Bodhan, Gemma and Samanantar. BPCC files are uploaded privately to the authorized Kaggle account.

Input regenerated from the exact-overlap-decontaminated corpus: 7,673 train / 412 validation / 426 internal test. Keep external IN22 evaluation excluded. Near-duplicate/upstream pretraining contamination remains a limitation. Existing baseline is complete on Conv and Gen. Marian architecture already supports the deployed ONNX pipeline; fine-tuned export quality/runtime still require measurement before release.

Bounded pilot: 100 optimizer steps, batch 4, maximum length 128, AdamW learning rate 2e-5, seed 42, one GPU used by Lightning. Kaggle T4 x2 selected; session was off, quota UI displayed 00:01 / 30 hrs on inspection. Estimate 0.1–0.5 session hours; trainer subprocess capped at 1,800 seconds. No paid compute. Save checkpoints every 25 steps and export at completion. This is experimental training, with no superiority claim or production replacement.

CPU pretrained optimizer and checkpoint restore have been exercised. Disk cleanup restored 50 GB host space. State: private input upload initiated; GPU optimizer steps NOT yet observed.

Kaggle UI: private dataset `ravivarmapatturi/inferedge-telugu-pilot-20261028` created and attached successfully. Actual training cell installed in existing notebook. Run-current-cell invoked; UI reports Session is starting. Optimizer steps not yet verified. Notebook uses one GPU from selected T4 x2, 100 steps and subprocess timeout 1,800 seconds.
