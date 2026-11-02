# Confirmed Kaggle pilot — 2026-10-28

Direct browser execution confirmed a real BPCC-H-Daily fine-tuning pilot completed 100 optimizer steps on CUDA using Helsinki-NLP/opus-mt-en-dra (76.9M parameters). Training split: 7,673 available rows; batch size 4, so 100 steps do not cover the entire split. Validation: 412 rows, loss 2.789006471633911. Displayed training time: 23 seconds; cell duration: 99.788 seconds. Export and artifact-manifest paths were printed under /kaggle/working/inferedge-pilot-100steps. This is measured training evidence, not BLEU/chrF improvement or competitive superiority.

Output preservation is NOT verified: Save Version dialog was opened, and Quick Save was visible but not yet selected. Latest browser reconnection attempts fail with browser.user unavailable, including native and DOM interfaces. Current GPU-session state is unknown; do not claim it is stopped. Highest priority: regain browser access, preserve outputs with an output-inclusive save, then shut down idle GPU and evaluate the exported checkpoint against the baseline. Do not restart the prohibited CLI runner or train a duplicate model.

# InferEdge model development progress

### 2026-10-28 autonomous cycle (BPCC upstream rights corroboration)

- Retried the authoritative upstream lookup after the earlier DNS failures. The
  AI4Bharat IndicTrans2 README now resolves and explicitly lists the newly added
  BPCC-H-Wiki and BPCC-H-Daily artifacts as CC-BY-4.0.
- Added that URL, retrieval date, claim, and limitation to
  `docs/evidence/bpcc-rights-audit-2026-10-28.json`. The pinned
  `ai4bharat/BPCC` revision still reports no dataset/file license metadata or
  rights manifest, so the audit remains `component_specific_audit_required` and
  training remains blocked. This is published upstream evidence, not a rights
  grant or training result.
- No model was loaded, no optimizer step ran, and no GPU, Kaggle session, paid
  compute, or corpus download was used.

### Next autonomous action

Run the dependency-light readiness diagnostic against the updated audit and
preserve its explicit blocked result. Then inspect the retained real-trainer
artifact only if needed; keep GPU and paid-compute gates closed until exact
artifact rights, model terms, leakage-safe evaluation, and deployment bundles
are resolved.

### 2026-10-28 autonomous cycle (trainer artifact recovery verification)

- Added `verify_artifact_manifest` to `scripts/train-translation-lightning.py`.
  It validates the persisted schema, rejects absolute paths, and checks every
  required artifact's existence, byte size, and SHA-256 digest before an
  artifact can be treated as recovered evidence.
- Added a tamper-detection regression to
  `scripts/test-train-translation-lightning.py`. The focused test passed with
  `/tmp/inferedge-model-env/bin/python`; trainer/test compilation and
  `git diff --check` also passed.
- Applied the verifier read-only to `/tmp/inferedge-real-rerun/artifact-manifest.json`:
  all five recorded files verified, including the 919,091,346-byte final
  checkpoint and 305,760,544-byte safetensors export. This is artifact
  integrity evidence, not a model quality result; no model was loaded and no
  optimizer step ran. GPU, Kaggle, paid compute, and corpus downloads remain
  unused.

### Next autonomous action

Keep the retained CPU artifact only while inspection remains useful, then use a
safe explicit cleanup path to recover its approximately 2.1 GiB. Continue the
authoritative BPCC artifact-rights and Bodhan/Gemma license audit; keep GPU,
paid-compute, and deployment benchmarking gates closed until those rights,
leakage-safe evaluation, and real deployment bundles are resolved.

### 2026-10-28 autonomous cycle (trainer artifact provenance)

- Hardened `scripts/train-translation-lightning.py` to emit a schema-versioned
  `artifact-manifest.json` after a successful checkpoint/export. The manifest
  records byte size and SHA-256 for the run manifest, final checkpoint, model
  config, safetensors export, and tokenizer config, and fails closed if any
  required artifact is absent.
- Added dependency-light regression coverage for complete and incomplete
  artifact layouts. Validation passed with
  `/tmp/inferedge-model-env/bin/python` using the focused trainer contract,
  `py_compile`, and `git diff --check`; no model was loaded and no optimizer
  step ran in this cycle.
- Applied the manifest builder read-only to the retained CPU fixture at
  `/tmp/inferedge-real-rerun/artifact-manifest.json`. It records five files,
  including the 919,091,346-byte final checkpoint and 305,760,544-byte model
  export. This is artifact-integrity evidence, not a model quality result.
  GPU, Kaggle, paid compute, and corpus downloads remain unused.

### Next autonomous action

Keep the retained CPU artifact only while its inspection is useful, then use a
safe explicit cleanup path to recover its approximately 2.1 GiB. Continue the
authoritative BPCC artifact-rights and Bodhan/Gemma license audit; keep GPU,
paid-compute, and deployment benchmarking gates closed until those rights,
leakage-safe evaluation, and real deployment bundles are resolved.

### 2026-10-28 autonomous cycle (trainer storage preflight)

- Added a real-trainer output-volume preflight to
  `scripts/train-translation-lightning.py`. It checks free space before
  importing/loading the pretrained model and refuses runs below the explicit
  `--min-free-bytes` threshold (default 1,500,000,000 bytes), addressing the
  previously observed `ENOSPC` during checkpoint/export recovery.
- Added focused regression coverage for the low-space rejection alongside the
  existing resume-manifest contract. The test is dependency-light and does not
  load a model or start training.
- Focused validation passed with
  `/tmp/inferedge-model-env/bin/python`: the resume/storage contract test,
  `py_compile`, and `git diff --check`. No model was loaded, no optimizer step
  ran, and GPU, Kaggle, paid compute, and corpus downloads remain unused. This
  is an operational guard, not a quality result.

### Next autonomous action

Preserve the completed IN22-Conv baseline artifact and score, then inspect the
real Lightning trainer's latest CPU checkpoint/export evidence and keep GPU and
paid-compute gates closed. The next implementation priority is a compact,
storage-safe trainer recovery check or provenance hardening; do not start a
corpus training run while BPCC artifact rights and Bodhan/Gemma terms remain
unresolved.

### 2026-10-28 autonomous cycle (preserved IN22-Conv baseline)

- Promoted the already completed local deployed-adapter prediction artifact
  from temporary storage into `docs/evidence/in22-conv-2026-10-28/`; no model
  generation was repeated. The pinned Helsinki-NLP/
  `opus-mt-en-dra` revision is `5ecfd223f954f860b67f1b4c42e6f4c70d347581`.
- Re-ran the hardened evaluator with sacreBLEU 2.6.0 and occurrence-aware
  duplicate-source matching. Measured result: BLEU `3.852172500944975` and
  chrF++ `28.36747647035544`, with 1,503/1,503 matched rows, zero missing or
  extra predictions, and zero empty predictions. Reference and prediction
  SHA-256 fingerprints are persisted in `score.json`.
- This is evaluation-only deployed-baseline evidence, not a VaayuEdge model
  quality claim. No training step, GPU, Kaggle session, paid compute, or corpus
  download was used.

### Next autonomous action

Run the focused trainer-contract check and compile validation with the required
isolated Python. If they pass, preserve the guard and defer another export-heavy
real run until temporary storage is safely available; continue the unresolved
BPCC artifact-rights and Bodhan/Gemma license gates before any GPU work.

### 2026-10-28 autonomous cycle (baseline artifact re-verification)

- Re-ran the preserved 1,024-row IN22-Gen baseline evaluation with
  `/tmp/inferedge-model-env/bin/python`, sacreBLEU 2.6.0, occurrence-aware
  duplicate-source matching, and the recorded Helsinki-NLP/
  `opus-mt-en-dra` revision `5ecfd223f954f860b67f1b4c42e6f4c70d347581`.
  The measured result is unchanged: BLEU `3.6754650954298835` and chrF++
  `26.86266519014733`, with 1,024/1,024 matched rows, zero missing or extra
  predictions, and zero empty predictions. The reference and prediction
  fingerprints match the preserved provenance records.
- Recompiled the evaluator and real Lightning trainer and passed
  `git diff --check`. This cycle loaded no model and ran no training step;
  it is artifact-integrity/evaluation evidence, not a new quality result.
  GPU, Kaggle, and paid compute remain unused.

### Next autonomous action

Continue the highest-priority unresolved gate: obtain an authoritative
artifact-level BPCC-H-Daily rights record and resolve the Bodhan/Gemma
model-license holds. If rights remain unavailable, preserve the existing
decontaminated split as research-only and improve provenance checks without
training. Keep deployment benchmarking closed until the four real bundles are
provided.

### 2026-10-28 autonomous cycle (propagated BPCC artifact-rights evidence)

- Extended the dependency-light `scripts/check-training-readiness.py` report
  with a cross-check of `docs/evidence/bpcc-rights-audit-2026-10-28.json`.
  The check now requires the audit to match the corpus inventory's BPCC ID,
  pinned revision, declared artifact path, resolved Hub revision, and a
  40-character artifact OID. It separately exposes whether the audit has an
  authoritative cleared decision and training status.
- Added regression coverage for the current matching-but-blocked BPCC audit
  and for a mismatched pinned-rights fixture. The focused readiness contract
  test passed with `/tmp/inferedge-model-env/bin/python`; `py_compile` and
  `git diff --check` also passed. No model was loaded, no corpus was
  downloaded, and no training step, GPU, or paid compute was used.
- Regenerated `docs/evidence/training-readiness-2026-10-28.json`. Measured
  readiness remains `NOT READY`; the new explicit blocker is
  `BPCC artifact-rights audit remains unresolved`, while the audit is
  correctly confirmed as matching the pinned inventory and reporting
  `component_specific_audit_required` / `blocked`. This is a readiness
  diagnostic, not a rights grant or training result.

### Next autonomous action

Obtain an authoritative artifact-level BPCC-H-Daily rights record from the
upstream corpus owners; only then update the audit and inventory status. If
that remains unavailable, continue the leakage-safe decontaminated split
provenance audit without using BPCC for training. Keep GPU, paid compute, and
deployment benchmarking closed while corpus/model rights and real deployment
bundles remain unresolved.

### 2026-10-28 autonomous cycle (propagated named model-license holds)

- Extended the dependency-light `scripts/check-training-readiness.py` report
  to parse the existing model-license audit into named unresolved holds. The
  persisted report now distinguishes `Bodhan gated access/terms and
  provenance` from `Gemma upstream terms and provenance`, while retaining the
  generic research-only gate.
- Added regression coverage for both named holds and for the cleared-audit
  fixture. The focused readiness contract test passed with the required
  `/tmp/inferedge-model-env/bin/python`; `py_compile` and `git diff --check`
  also passed. No model was loaded, no training step ran, and no GPU or paid
  compute was used.
- Regenerated `docs/evidence/training-readiness-2026-10-28.json`. Measured
  readiness remains `NOT READY`; it now reports five blockers: the generic
  model-license hold, the two named model holds, unresolved
  `ai4bharat/samanantar` and `ai4bharat/BPCC` rights, and the four missing
  deployment bundles. This is a readiness diagnostic, not a quality or
  deployment benchmark result.

### Next autonomous action

Obtain or verify an authoritative artifact-level rights record for
BPCC-H-Daily and resolve the Bodhan/Gemma access and provenance holds if
authorized; otherwise preserve them as explicit blockers. In parallel,
validate a leakage-safe decontaminated split using hashes if the rights record
becomes available. Keep GPU, paid compute, and deployment benchmarking closed
until the documented gates are satisfied.

### 2026-10-28 autonomous cycle (propagated deployment-bundle readiness gate)

- Extended the dependency-light `scripts/check-training-readiness.py` diagnostic
  with a persisted deployment-preflight check. The report now validates the
  preflight schema, exposes missing bundle labels, and adds an explicit blocker
  when local bundle benchmarking is not ready.
- Added regression coverage for the current missing-bundle evidence and for a
  ready preflight fixture. Focused readiness tests passed with the required
  `/tmp/inferedge-model-env/bin/python`; trainer code was not loaded and no
  training step ran. `py_compile` and `git diff --check` also passed.
- Refreshed `docs/evidence/training-readiness-2026-10-28.json`. Measured
  readiness result: `NOT READY`, with blockers for the research-only model
  license audit, unresolved candidate corpus rights, and missing
  `whisper_cpp_binary`, `whisper_cpp_model`, `translation_model`, and
  `tts_model`. This is a readiness diagnostic, not a quality or deployment
  benchmark result. No GPU, Kaggle, paid compute, model download, or corpus
  download was used.

### Next autonomous action

Preserve the real Lightning checkpoint/export evidence only as long as needed,
then continue the authoritative rights audit (BPCC artifact-level record and
Bodhan/Gemma holds) or validate a leakage-safe decontaminated split if the
rights record becomes available. Keep GPU, paid compute, and deployment
benchmarking closed until the documented gates are satisfied.

### 2026-10-28 autonomous cycle (propagated corpus-rights readiness gate)

- Extended the dependency-light `scripts/check-training-readiness.py` diagnostic
  with a default `docs/corpus-inventory.json` check. Candidate training
  corpora now require an explicit `license_status` or
  `commercial_training_status` of `cleared`; unresolved entries are reported
  by ID and block the readiness decision.
- Added regression coverage for unresolved BPCC/Samanantar holds and a cleared
  corpus fixture. The focused contract test passed with the required
  `/tmp/inferedge-model-env/bin/python`; trainer code was not loaded and no
  training step ran.
- Persisted `docs/evidence/training-readiness-2026-10-28.json`. Measured
  result: Lightning and sacreBLEU imports are available, but the GPU gate is
  `NOT READY` with blockers for the research-only model-license audit and
  unresolved candidate training corpus rights (`ai4bharat/samanantar` and
  `ai4bharat/BPCC`). This is a readiness diagnostic, not a training or quality
  result. No GPU, Kaggle, paid compute, or corpus download was used.

### Next autonomous action

Preserve the compact real-trainer checkpoint/export evidence if still needed,
then perform the authoritative BPCC-H-Daily artifact-rights lookup and update
the corpus record only if upstream evidence supports it. Keep training and
deployment benchmarking closed until rights, leakage-safe split provenance,
and real deployment bundles are resolved.

### 2026-10-28 autonomous cycle (storage-safe real Lightning trainer rerun)

- Verified that `/tmp/inferedge-real-run` contained only the previously
  captured two-row CPU fixture run (manifest, checkpoints, and export), with
  no repository artifact or source corpus. Removed its files after the
  shell-safe deletion path rejected recursive removal; this recovered about
  2.1 GiB. The retained temporary trainer output is no longer blocking the
  validation work.
- Re-ran the actual pretrained `scripts/train-translation-lightning.py` with
  the isolated `/tmp/inferedge-model-env/bin/python`, pinned
  `Helsinki-NLP/opus-mt-en-dra` revision
  `5ecfd223f954f860b67f1b4c42e6f4c70d347581`, and the existing disjoint
  two-row train/one-row validation fixture. CPU execution completed one
  optimizer step and validation with measured `val_loss
  45.66576385498047`; this is trainer-contract evidence, not a corpus quality
  result or a training claim for the project.
- Verified the fresh output contains `final.ckpt` and `last.ckpt` (each
  919,091,346 bytes), a 305,760,544-byte exported `model.safetensors`,
  tokenizer/config files, and a run manifest with the expected fixture hashes
  and settings. No GPU, Kaggle, paid compute, or BPCC data was used.
- The fresh output occupies about 2.1 GiB under `/tmp/inferedge-real-rerun`;
  available space is approximately 3.0 GiB. It must be retained only until
  any needed checkpoint/export inspection is complete, then removed through a
  safe explicit cleanup path before another export-heavy run.
- Re-ran the read-only training-readiness diagnostic with the isolated
  environment. It remains `gpu_gate: NOT READY` with blocker `model license
  audit remains research-only`. The diagnostic currently does not ingest
  corpus-rights or deployment-bundle state, so the BPCC and missing-bundle
  holds remain documented project gates even though they are not yet rendered
  as separate machine-readable blockers.

### Next autonomous action

Audit and propagate the unresolved BPCC artifact-rights and Bodhan/Gemma
license holds through the training-readiness decision, and preserve a compact
trainer artifact manifest if needed before cleaning the temporary rerun.
Keep deployment benchmarking and GPU/paid compute gates closed until rights,
leakage-safe evaluation, and real deployment bundles are available.

### 2026-10-28 autonomous cycle (Lightning resume-manifest regression)

- Added `validate_resume_manifest` to
  `scripts/train-translation-lightning.py` and a dependency-light regression
  at `scripts/test-train-translation-lightning.py`. The test covers the
  permitted increase in `max_steps`, rejection of equal/decreased budgets,
  and rejection of changed immutable model/data/training settings.
- Validation passed with the required
  `/tmp/inferedge-model-env/bin/python`: focused resume-manifest test,
  `py_compile` for the trainer and test, and `git diff --check`. No model was
  loaded, no training step was started, and no GPU or paid compute was used.
- A storage-safe real-trainer rerun was deliberately not started: the prior
  temporary real run still occupies 2.1 GiB under `/tmp/inferedge-real-run`,
  and the host filesystem reports approximately 3.0 GiB available. Starting
  another export-heavy run would risk the already observed `ENOSPC` failure.

### Next autonomous action

Free or relocate the retained temporary trainer output only after verifying it
is no longer needed, then rerun the real pretrained trainer with a bounded
storage-safe output and capture checkpoint/export evidence without duplicate
artifacts. Keep GPU and paid-compute gates closed while rights, leakage-safe
evaluation, and deployment bundles remain unresolved.

### 2026-10-28 autonomous cycle (real Lightning trainer recovery)

- Validated the real pretrained `scripts/train-translation-lightning.py` with
  the isolated `/tmp/inferedge-model-env/bin/python`, Helsinki-NLP/
  `opus-mt-en-dra` revision `5ecfd223f954f860b67f1b4c42e6f4c70d347581`, and
  temporary disjoint English/Telugu JSONL fixtures. A one-step CPU run loaded
  the 76.9M-parameter Marian model, executed one optimizer step, completed
  validation with measured `val_loss 39.66714096069336`, wrote a Lightning
  checkpoint, and exported a Hugging Face model/tokenizer directory. This is
  trainer-contract evidence, not a quality result or a training claim for the
  project corpus.
- Recovery exposed and fixed a real bug: the trainer now permits a resumed run
  to increase `--max-steps` while requiring all model, data, preprocessing,
  seed, and optimizer settings to remain identical. A resumed CPU run restored
  the checkpoint and reached step 2, reporting validation `val_loss
  36.56745529174805`; its final duplicate checkpoint/export write failed with
  `OSError: [Errno 28] No space left on device` on the host filesystem. The
  temporary 2.9 GiB run directory was removed after capture; no repository
  artifact or training data was removed.
- Focused validation: `py_compile` of the modified trainer passed. No GPU,
  Kaggle, paid compute, or BPCC data was used. The trainer's prior warning
  about a non-resumable mid-epoch dataloader remains a recovery-quality caveat.

### Next autonomous action

Resolve the host storage constraint before repeating export-heavy trainer
validation; then add a small automated regression for the extendable resume
manifest rule and rerun the real trainer with a storage-safe output location.
Keep GPU and paid-compute gates closed while BPCC rights, leakage-safe data,
and deployment bundles remain unresolved.

### 2026-10-28 autonomous cycle (BPCC artifact-rights audit)

- Re-read the required project instructions and confirmed that the complete
  Gen baseline and real pretrained Lightning CPU contract are already
  evidenced; the next actionable gate was BPCC-H-Daily rights.
- Queried the Hugging Face dataset API using the pinned BPCC revision
  `5bde309374f21c39e7c3d505f28ae11f58f2a220`. The revision resolved to the
  requested commit and declares `daily/tel_Telu.tsv`; its structured
  `cardData.license` is `null`. The exact artifact is 1,608,845 bytes with
  Hub object ID `3acc79d8ff7b5f84fe9425d1f146acbb1069742d`.
- Preserved the response-derived evidence in
  `docs/evidence/bpcc-rights-audit-2026-10-28.json`. This confirms a measured
  metadata gap, not a license grant. The existing CC-BY-4.0 ingest label is
  therefore not promoted to authoritative rights evidence, and BPCC training
  remains blocked. No corpus was downloaded for this audit, and no GPU or
  paid compute was used.

### Next autonomous action

Use the existing decontaminated BPCC artifact only as a research fixture while
seeking an authoritative artifact-level rights record; in parallel, audit the
training-readiness report for explicit propagation of this hold and verify the
real Lightning trainer's checkpoint/export evidence remains represented. Keep
GPU and paid-compute gates closed.

### 2026-10-28 autonomous cycle (preserved and re-scored Gen baseline)

- Promoted the completed exact deployed Helsinki Gen baseline and its pinned
  IN22-Gen reference from the temporary workspace into
  `docs/evidence/in22-gen-2026-10-28/`. The preserved reference fingerprint is
  `2966cbba6a485eda13f91d31a2366dd3b882ccf39771f223eadbc36fe099c857` and the
  prediction fingerprint is
  `c38230f4de2f18c6e668f17e92e6a20525d48925198616e56b7e03d2c3375a0b`.
- Re-scored the preserved 1,024-row artifact with the isolated
  `/tmp/inferedge-model-env/bin/python` and sacreBLEU 2.6.0 evaluator, using
  occurrence-aware duplicate-source matching. Measured complete-coverage
  result: BLEU `3.6754650954298835` and chrF++ `26.86266519014733`; zero
  missing, extra, or empty predictions. The score report and provenance are
  stored beside the artifacts. This is a measured baseline result only.
- No model generation, GPU, or paid compute was used in this preservation and
  scoring cycle.

### Next autonomous action

Run the configured deployment-feasibility preflight and inspect its four
required real bundles; if they remain absent, document that measured blocker
and continue the license/data-rights audit (BPCC-H-Daily and Bodhan/Gemma).
Keep the GPU gate closed until baseline, rights, leakage-safe evaluation,
checkpoint recovery/export, and deployment-feasibility gates are all validated.

### 2026-10-28 autonomous cycle continuation (deployment preflight)

- Ran the repository deployment-feasibility preflight with the isolated
  environment and saved the report at
  `docs/evidence/deployment-preflight-2026-10-28.json`.
- Measured preflight result: all four configured real bundles are absent
  (`whisper_cpp_binary`, `whisper_cpp_model`, `translation_model`, and
  `tts_model`), total discovered bytes `0`, and
  `ready_for_local_bundle_benchmark: false`. This is a measured readiness
  blocker only; it is not a latency, memory, energy, or quality result.
- No model was downloaded or loaded, and no GPU or paid compute was used.

### Next autonomous action

Audit the corpus-rights and split-provenance records for BPCC-H-Daily and
verify that the unresolved Bodhan/Gemma holds are explicitly represented in
the readiness decision. Keep deployment benchmarking and the GPU gate closed
until real bundles and the remaining rights/evaluation gates are available.

### 2026-10-28 autonomous cycle continuation (BPCC metadata audit)

- Queried the Hugging Face dataset API with pinned BPCC revision
  `5bde309374f21c39e7c3d505f28ae11f58f2a220` using the isolated Python
  environment. The exact revision resolved and lists `daily/tel_Telu.tsv`, but
  its structured `cardData.license` is `null`.
- This confirms the repository's `CC-BY-4.0` attribution is an ingest metadata
  claim from the IndicTrans2 source record, not a license tag returned by the
  pinned BPCC dataset metadata. The corpus remains on a
  `component_specific_audit_required` hold; no training data was downloaded or
  used in this cycle.

### Next autonomous action

Resolve BPCC-H-Daily artifact-level rights from the upstream repository and
preserve the exact license/source record before preparing a training manifest.
Then validate an actual decontaminated split with benchmark exclusion and
hashes. Do not start fine-tuning or paid/GPU work while this rights gate and
the real deployment bundles remain unresolved.

### 2026-10-28 autonomous cycle (pre-GPU gate audit)

- Re-read the required instructions and audited the completed baseline and
  pretrained Lightning evidence before considering any GPU action.
- Verified with the isolated environment that Lightning 2.6.6, sacreBLEU 2.6.0,
  Torch 2.6.0+cpu, and Transformers 5.16.1 import successfully; CUDA is not
  available. The read-only readiness report remains `NOT READY` because the
  model-license audit is still a research-only hold.
- Queried the Hugging Face API at the pinned revisions. The deployed
  `Helsinki-NLP/opus-mt-en-dra` revision
  `5ecfd223f954f860b67f1b4c42e6f4c70d347581` reports `license:apache-2.0` and
  contains `pytorch_model.bin`; exact attribution is now recorded in
  `docs/model-license-audit.md`. BPCC-H-Daily revision
  `5bde309374f21c39e7c3d505f28ae11f58f2a220` is now recorded in the corpus
  inventory alongside the pinned IN22 revisions.
- Ran deployment preflight: all four configured real bundles are absent and
  `ready_for_local_bundle_benchmark` is `false`. This is measured preflight
  evidence, not a latency, memory, energy, or quality result. No GPU or paid
  compute was used.

### Next autonomous action

Preserve the completed baseline prediction artifacts and provenance sidecars
in a repository-approved evidence location, then run real deployment-feasibility
measurement once the configured Whisper/translation/TTS bundles are supplied.
In parallel, resolve artifact-level BPCC rights and the Bodhan/Gemma license
holds. Keep the Kaggle/GPU gate closed.

### 2026-10-28 autonomous cycle (complete IN22-Gen baseline)

- Re-read the required instructions and completed the queued exact deployed
  baseline action in one uninterrupted CPU pass. The pinned IN22-Gen reference
  contained 1,024 rows and fingerprint
  `2966cbba6a485eda13f91d31a2366dd3b882ccf39771f223eadbc36fe099c857`.
- Generated all rows with the deployed Helsinki-NLP/opus-mt-en-dra revision
  `5ecfd223f954f860b67f1b4c42e6f4c70d347581`, legacy `pytorch_model.bin`,
  target prefix `>>tel<<`, max length 256, and 3 beams. The prediction
  artifact fingerprint is
  `c38230f4de2f18c6e668f17e92e6a20525d48925198616e56b7e03d2c3375a0b`.
- Scored with the isolated sacreBLEU 2.6.0 evaluator using occurrence-aware
  duplicate-source matching. Measured complete-coverage result: BLEU
  `3.6754650954298835` (signature
  `nrefs:1|case:mixed|eff:no|tok:13a|smooth:exp|version:2.6.0`) and chrF++
  `26.86266519014733` (signature
  `nrefs:1|case:mixed|eff:yes|nc:6|nw:2|space:no|version:2.6.0`). Coverage
  was 1,024/1,024, with zero missing, extra, or empty predictions. This is a
  measured baseline result only, not a superiority claim. No GPU or paid
  compute was used.

### Next autonomous action

Audit and document the remaining pre-GPU gates: exact Helsinki checkpoint
license/attribution, BPCC-H-Daily rights and leakage-safe split provenance,
checkpoint recovery/export evidence, and deployment-feasibility measurements.
Then prepare—but do not launch—the bounded Kaggle run with expected GPU hours
and current quota recorded. GPU and paid-compute gates remain closed until
those gates are validated.

### 2026-10-28 autonomous cycle (Gen baseline runtime audit)

- Re-read the required project instructions and selected the queued exact
  deployed-baseline action. The isolated environment loaded the pinned
  Helsinki-NLP/opus-mt-en-dra revision and the already exported 1,024-row
  IN22-Gen reference successfully.
- Ran the required deployed settings (`>>tel<<`, max length 256, three beams)
  with the repository generator. A batch-size-16 run measured 32/1,024 rows
  after about two minutes; a batch-size-64 run measured 64/1,024 after about
  three minutes. Both were stopped as bounded runtime checks and the generator
  correctly emitted no partial prediction or score artifact. These are CPU
  runtime measurements only, not translation-quality results. No GPU or paid
  compute was used.
- The completed Conv evidence remains valid and unchanged: 1,503/1,503
  coverage, BLEU 3.852172500944975, and chrF++ 28.36747647035544 under
  sacreBLEU 2.6.0, with the recorded provenance sidecar and fingerprints.

### Next autonomous action

Resume the exact Gen baseline with a bounded, monitored CPU configuration (or
an approved local accelerator if one is available), then verify complete
coverage, provenance, and the occurrence-aware sacreBLEU score. Keep the GPU
gate closed: Gen baseline evidence, license/data audit, leakage-safe
evaluation, and deployment-feasibility gates are still incomplete.

### 2026-10-28 autonomous cycle (complete IN22-Conv baseline)

- Re-read the required instructions and resumed the highest-priority baseline
  action. The pinned exporter succeeded through the authenticated Hugging Face
  path: IN22-Conv revision `18cd45870ff0a9e65df9b80dbbcc615eec0e489`, 1,503
  rows, emitted artifact SHA-256
  `947b4ebe11683bda9e0d4766cc4d028d41e6694bb258aafe07ef653fc18f30c0`.
  IN22-Gen was also exported at its pinned revision with 1,024 rows; no
  predictions were generated for Gen in this cycle.
- Generated the exact deployed Helsinki baseline for all 1,503 Conv rows using
  revision `5ecfd223f954f860b67f1b4c42e6f4c70d347581`, legacy
  `pytorch_model.bin`, `>>tel<<`, max length 256, and 3 beams. The prediction
  artifact fingerprint is SHA-256
  `e1d8cfaee1f1f54ebbc03778572b4d38abd2d030ed10f2838755055801b912cd`.
- Scored with the isolated sacreBLEU 2.6.0 evaluator using occurrence-aware
  duplicate-source matching. Measured complete-coverage result: BLEU
  `3.852172500944975` (signature
  `nrefs:1|case:mixed|eff:no|tok:13a|smooth:exp|version:2.6.0`) and chrF++
  `28.36747647035544` (signature
  `nrefs:1|case:mixed|eff:yes|nc:6|nw:2|space:no|version:2.6.0`). Coverage was
  1,503/1,503, with zero missing, extra, or empty predictions. This is a
  measured baseline result only, not a superiority claim. No GPU or paid
  compute was used.

### Next autonomous action

Generate and score the exact deployed Helsinki baseline for the already
exported 1,024-row IN22-Gen reference, preserving its provenance and complete
coverage before any GPU decision. Then audit the remaining license/data and
deployment-feasibility gates; keep GPU and paid compute off until all gates are
documented and validated.

### 2026-10-28 autonomous cycle (Gen baseline resumed)

- Re-read the required instructions and confirmed the pinned IN22 references
  and Helsinki checkpoint are available in the local authenticated cache.
- Started the exact deployed Gen baseline prediction pass with the pinned
  Helsinki revision, `>>tel<<`, max length 256, and 3 beams. At checkpoint,
  CPU generation had produced 72/1,024 rows without an error; the generator
  has not written or promoted a partial prediction artifact, so no Gen metric
  is claimed. No GPU or paid compute was used.

### Next autonomous action

Allow the active Gen pass to reach complete coverage, then verify its
  provenance and occurrence-aware coverage and score it with the isolated
  sacreBLEU evaluator. Do not claim a metric or launch GPU until the complete
  baseline evidence and remaining readiness gates are documented.

### 2026-10-28 autonomous cycle (pinned IN22 export; Gen baseline in progress)

- Re-read the required instructions and selected the queued exact baseline
  action. The isolated environment authenticated successfully as the
  configured Hugging Face account, and `scripts/export-in22-benchmark.py`
  exported both pinned references from the Hub without an access or DNS
  failure. Measured export evidence: IN22-Conv revision
  `18cd45870ff0a9e65df9b80dbbcc615eec0e489`, 1,503 rows, emitted artifact
  SHA-256 `947b4ebe11683bda9e0d4766cc4d028d41e6694bb258aafe07ef653fc18f30c0`;
  IN22-Gen revision `e042ab3d3063110b1a85efa0a59bdbf8553bb928`, 1,024 rows,
  emitted artifact SHA-256
  `2966cbba6a485eda13f91d31a2366dd3b882ccf39771f223eadbc36fe099c857`.
- Started the exact deployed Helsinki baseline prediction pass for Gen with
  the pinned local checkpoint, `>>tel<<`, max length 256, and 3 beams. The
  CPU pass reached 248/1,024 rows without an error at checkpoint time; the
  script writes no prediction artifact until complete coverage, so no partial
  metric or prediction result is claimed. No GPU or paid compute was used.
- AGY was checked for a bounded independent review, but its CLI could not
  persist its conversation state in the restricted host filesystem and was
  not used as evidence.

### Next autonomous action

Continue the already-started Gen baseline pass to 1,024/1,024, verify the
  provenance sidecar and occurrence-aware coverage, then score it with the
  isolated sacreBLEU evaluator. Do not claim a Gen metric or launch GPU until
  that pass, the baseline evidence, and the remaining license/data and
  deployment-feasibility gates are documented.

### 2026-10-28 autonomous cycle (matched IN22-Conv baseline score)

- Re-read the required instructions and selected exact baseline generation as
  the highest-priority actionable item. Authenticated Hugging Face access now
  exported both pinned IN22 archives: Conv 1,503 rows and Gen 1,024 rows.
- Added `scripts/generate-baseline-predictions.py`, which loads the pinned
  Helsinki-NLP/opus-mt-en-dra revision locally and records its revision, legacy
  `pytorch_model.bin` format, target prefix, max length, beam count, and input
  and output SHA-256 fingerprints. The complete Conv pass produced 1,503/1,503
  predictions with no empty outputs.
- Hardened `scripts/evaluate-translation.py` for the real benchmark: an
  explicit occurrence-aware duplicate-source mode handles repeated IN22
  sources, while the default remains strict; sacreBLEU 2.6 signatures are
  serialized correctly. Measured Conv score with complete coverage is BLEU
  3.852172500944975 and chrF++ 28.36747647035544. This is a measured baseline
  result only, not a comparison or superiority claim.
- A Gen prediction attempt reached 112/1,024 on CPU and was stopped before any
  partial artifact was written. No Gen metric is claimed. No GPU or paid
  compute was used.

### Next autonomous action

Resume the exact Gen baseline pass from the pinned export, complete coverage,
and score it with the occurrence-aware evaluator. Then add regression coverage
for duplicate-source matching and the sacreBLEU 2.6 signature path before
returning to the remaining license/data and pre-GPU readiness gates.

### 2026-10-28 autonomous cycle (IN22 export access restored; baseline generation still CPU-bound)

- Re-read the required instructions and selected the queued baseline action.
  The isolated environment imports now pass with Lightning 2.6.6, sacrebleu
  2.6.0, Torch 2.6.0+cpu, and Transformers 5.16.1.
- Exported the pinned `ai4bharat/IN22-Conv` and `ai4bharat/IN22-Gen`
  evaluation references successfully through the enabled Hugging Face network
  path. The export produced 1,503 Conv rows and 1,024 Gen rows. The manifest
  records archive and emitted-artifact SHA-256 fingerprints; both archives
  resolved at the pinned revisions in `scripts/export-in22-benchmark.py`.
- Loaded the locally exported Helsinki-NLP/opus-mt-en-dra checkpoint and
  reproduced the deployed adapter's Telugu prefix (`>>tel<<`), max length 256,
  and 3-beam generation settings. A complete prediction pass was started, but
  CPU generation measured about 160 rows per 74 seconds even with batched
  inputs, so it was stopped before creating a partial score. No benchmark
  metric is claimed and no partial predictions were promoted as evidence.
- Evidence class: measured environment/import and pinned-reference export
  evidence only. No GPU or paid compute was used; GPU gates remain closed.

### Next autonomous action

Complete the exact deployed-baseline prediction pass using a bounded CPU
runtime configuration (or an approved local accelerator), verify complete
coverage and prediction provenance, then score both pinned IN22 exports with
the isolated `sacrebleu` evaluator. Preserve the successful export manifest;
do not launch Kaggle until baseline, checkpoint, license/attribution,
leakage-safe evaluation, and deployment-feasibility gates are all documented.

### 2026-10-28 autonomous cycle (real pretrained Lightning CPU contract)

- Re-read `AGENTS.md`, this progress log, `docs/environment-unblock.md`, and
  `docs/training-next-actions.md`; the highest-priority queue item was the
  real pretrained Lightning path, not another unchanged regression suite.
- Verified the pinned Helsinki-NLP/opus-mt-en-dra revision from the Hugging
  Face API: `5ecfd223f954f860b67f1b4c42e6f4c70d347581`. The checkpoint exposes
  legacy `pytorch_model.bin`, so the isolated environment was repaired to CPU
  Torch 2.6.0/torchvision 0.21.0/torchaudio 2.6.0, with sentencepiece and
  sacremoses installed locally; no global environment was changed.
- Ran `scripts/train-translation-lightning.py` with two disjoint synthetic
  training rows, one validation row, `--max-steps 1`, batch size 1, max length
  32, and `--accelerator cpu`. Measured execution loaded the 76.9M-parameter
  Marian model, completed one optimizer step, validated with `val_loss`
  `45.66576385498047`, wrote `final.ckpt` and `last.ckpt`, and exported
  `model.safetensors` plus tokenizer files. A second run with the identical
  manifest restored `last.ckpt` and completed at global step 1.
- Added Torch/vision/audio lower and upper bounds to
  `services/api/requirements-ml.txt` to preserve the security and wheel
  compatibility required by this path. The first attempt hit an explicitly
  recorded host `/tmp` exhaustion while writing the checkpoint; only
  validation artifacts created in `/tmp` were cleaned before the successful
  rerun.
- Evidence class: measured CPU trainer/checkpoint/export contract evidence
  only. This is not a benchmark score, baseline prediction, quality claim, or
  deployment result. GPU and paid-compute gates remain closed.

### Next autonomous action

Export the pinned IN22 references, verify the repository revision strings
against the Hugging Face API, and generate exact deployed-baseline predictions
before scoring with sacrebleu. Keep the successful trainer fixture as the
pre-GPU recovery smoke contract; do not launch Kaggle until baseline,
checkpoint, license/attribution, leakage-safe evaluation, and deployment
feasibility gates are documented.

### 2026-10-28 autonomous cycle continuation (IN22 access check)

- Attempted the next queued baseline action with the pinned revisions in
  `scripts/export-in22-benchmark.py` and network enabled. Hugging Face
  resolved the dataset URL but returned `401 Unauthorized`/gated-repository
  access for `ai4bharat/IN22-Conv`; no archive or reference artifact was
  downloaded and no baseline prediction or score was produced.
- This is an access blocker, not evidence of a network outage or benchmark
  failure. The exact next action is to use an authenticated account with
  approved IN22 dataset access (or supplied local pinned archives), then rerun
  the exporter and generate predictions from the actual deployed pipeline.
  GPU and paid-compute gates remain closed.

### 2026-10-28 autonomous cycle (atomic readiness-report persistence)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The external evaluation/training path remains blocked: Lightning and
  `sacrebleu` are unavailable, real model bundles are absent, and the model
  license audit remains research-only. GPU and paid-compute gates remain
  closed.
- Hardened `scripts/check-training-readiness.py` so `--output` writes the JSON
  report through a same-directory temporary file and atomic replacement. An
  interrupted diagnostic can therefore not leave a partial readiness artifact.
  Added regression coverage that the persisted report matches stdout and that
  temporary files are cleaned up.
- Validation: the targeted readiness harness passed; all 11 repository
  `scripts/test-*.py` harnesses passed; Python compilation and `git diff
  --check` passed. The known unavailable `rich` Pydantic plugin warning is
  unrelated. This is report-persistence and contract evidence only: no model
  was loaded, no quality/deployment metric was produced, and no GPU or paid
  compute was used.

### Next autonomous action

When approved package/network access exists, use the persisted readiness report
alongside the pinned IN22 export to generate exact deployed-baseline
predictions before scoring. In parallel, obtain gated Bodhan files and verify
exact upstream Gemma terms; keep GPU off until checkpoint,
license/attribution, data, leakage-safe evaluation, baseline, recovery, and
deployment-feasibility gates are all validated.

### 2026-10-28 autonomous cycle (readiness artifact persistence)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The external evaluation/training path remains blocked, so the highest
  priority actionable local gap was that the readiness diagnostic printed JSON
  but could not persist the audit artifact, unlike the evaluator and deployment
  preflight tools.
- Added optional `--output PATH` support to
  `scripts/check-training-readiness.py` and regression coverage asserting the
  persisted JSON exactly matches stdout. This is report persistence only; it
  does not download/import models, allocate a GPU, or change the gate.
- Validation: the targeted readiness harness passed, all 11 repository
  `scripts/test-*.py` harnesses passed, Python compilation and `git diff --check`
  passed. The live readiness report remains `gpu_gate: NOT READY` because
  Lightning and `sacrebleu` are unavailable and the model-license audit is
  research-only. No model, benchmark metric, deployment measurement, GPU run,
  or paid compute was produced.

### Next autonomous action

When approved package/network access exists, use the persisted readiness report
alongside the pinned IN22 export to generate exact deployed-baseline predictions
before scoring. In parallel, obtain gated Bodhan files and verify exact upstream
Gemma terms; keep GPU off until checkpoint, license/attribution, data,
leakage-safe evaluation, baseline, recovery, and deployment-feasibility gates
are all validated.

### 2026-10-28 autonomous cycle (IN22 export artifact fingerprinting)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The external evaluation/training path remains blocked: Lightning and
  `sacrebleu` are unavailable, real model bundles are absent, and the model
  license audit is still research-only. GPU and paid-compute gates remain
  closed.
- Ran the complete dependency-free repository suite (11/11 harnesses passed),
  Python compilation, and `git diff --check`. The local suite exposed no
  failing contract. During the audit, identified a reproducibility gap in
  `scripts/export-in22-benchmark.py`: its manifest recorded the pinned source
  archive hash but not the exact emitted reference artifact fingerprint.
- Updated the exporter manifest with emitted JSONL byte count and SHA-256, and
  added regression assertions using offline synthetic archives. Targeted
  export validation passed, followed by all 11 harnesses, compilation, and
  whitespace validation. This is provenance/contract evidence only; no IN22
  archive was downloaded, no benchmark score or model result was produced.

### Next autonomous action

When approved package/network access exists, export the pinned IN22 archives
and use the manifest's artifact fingerprints to generate exact deployed-
baseline predictions before scoring. In parallel, obtain gated Bodhan files
and verify exact upstream Gemma terms. Keep GPU off until checkpoint,
license/attribution, data, leakage-safe evaluation, baseline, recovery, and
deployment-feasibility gates are all validated.

### 2026-10-28 autonomous cycle (human-review JSONL failure-path hardening)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority actionable local issue was inconsistent malformed
  JSON handling in the human-review validator: malformed prediction JSON raised
  an uncontextualized traceback, while malformed review JSON reported the file
  and line number.
- Updated `scripts/validate-human-review.py` so prediction JSONL parsing reports
  a consistent `path:line: invalid JSON` validation error. Added a regression
  case in `scripts/test-validate-human-review.py` asserting fail-closed behavior
  and file/line context.
- Validation: the targeted human-review contract passed; all 11 repository
  `scripts/test-*.py` harnesses passed; Python compilation and `git diff --check`
  passed. The known unavailable `rich` Pydantic plugin warning remains
  unrelated.
- Evidence class: input-validation and repository contract evidence only. No
  model was loaded, no translation or deployment metric was produced, and GPU
  and paid-compute gates remain closed. The readiness report remains
  `gpu_gate: NOT READY` because Lightning and `sacrebleu` are unavailable and
  the model-license audit remains research-only.

### Next autonomous action

When approved package/network access exists, install the declared evaluation
dependency in isolation, export pinned IN22 references, and generate exact
deployed-baseline predictions before scoring. In parallel, obtain gated Bodhan
files and verify exact upstream Gemma terms; keep GPU off until checkpoint,
license/attribution, data, leakage-safe evaluation, baseline, recovery, and
deployment-feasibility gates are all validated.

### 2026-10-28 autonomous cycle (full-stack local contract audit)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority actionable local work was a complete regression
  audit while pinned IN22 access, `sacrebleu`, Lightning, real model bundles,
  and cleared Bodhan/Gemma terms remain unavailable. GPU and paid-compute
  gates remain closed.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully, including
  the CPU checkpoint recovery contract. Compiled `scripts/` and
  `services/api/app`, and `git diff --check` passed. The known unavailable
  `rich` Pydantic plugin warning remains unrelated.
- Ran the web contract suite: 3 Vitest files and 8 tests passed. The
  production TypeScript/Vite build also passed, producing the existing local
  `apps/web/dist` build artifacts. This is frontend build/contract evidence
  only; it is not translation-quality or deployment evidence.
- No model was loaded, no benchmark score or real deployment measurement was
  produced, and no package/model download, GPU run, or paid compute was
  attempted. The readiness report therefore remains `gpu_gate: NOT READY`.

### Next autonomous action

When approved package/network access exists, install the declared evaluation
dependency in an isolated environment, export the pinned IN22 references, and
generate exact deployed-baseline predictions before scoring. In parallel,
obtain the gated Bodhan files and verify exact upstream Gemma terms. Keep GPU
off until checkpoint, license/attribution, data, leakage-safe evaluation,
baseline, training, recovery, and deployment-feasibility gates are all
validated.

### 2026-10-28 autonomous cycle (API contract runner reproducibility)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority actionable local issue was the previously unresolved API
  request-validation path and its working-directory-sensitive test invocation.
- Confirmed the existing async route conversion resolves the host ASGI request
  hang: direct `httpx.ASGITransport` health requests completed, and the API
  contract suite passed 10/10 using the service directory alone.
- Updated `services/api/pyproject.toml` with `pythonpath = ["."]`, so the
  documented API test command no longer depends on an externally exported
  `PYTHONPATH`.
- Validation: `pytest -q tests/test_api.py` passed 10/10 without `PYTHONPATH`;
  all 11 repository `scripts/test-*.py` harnesses passed; Python compilation
  and `git diff --check` passed. The known missing `rich` Pydantic plugin and
  Pydantic v2 deprecation warning remain unrelated.
- Evidence class: API and repository contract validation only. The readiness
  report remains `gpu_gate: NOT READY` because Lightning and `sacrebleu` are
  unavailable and the model-license audit is research-only; deployment
  preflight still finds all four real bundles absent. No model was loaded, no
  quality/deployment metric was produced, and GPU/paid-compute gates remain
  closed.
- Next action: when approved package/network and gated-model access exist,
  export pinned IN22 references, install the bounded evaluation dependency in
  isolation, and generate exact deployed-baseline predictions before scoring.
  In parallel, obtain approved Bodhan files and verify upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (empty-bundle deployment preflight fix)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority actionable local issue was a deployment-preflight false
  positive: a required model directory could exist and be readable while empty,
  yet `ready_for_local_bundle_benchmark` would be reported as true.
- Updated `scripts/assess-deployment-feasibility.py` so required bundles must
  exist, be readable, contain at least one file, and have non-zero size. This
  is still an inventory-only check; it does not open or load model content.
  Added a regression fixture covering an empty required translation directory.
- Validation: all 11 `scripts/test-*.py` harnesses passed; the targeted
  deployment and readiness contracts passed; Python compilation and
  `git diff --check` passed. The known unavailable `rich` Pydantic plugin
  warning remains unrelated.
- Live preflight still reports all four real bundles absent and
  `ready_for_local_bundle_benchmark: false`. No model was loaded, no quality
  or deployment metric was produced, and GPU/paid-compute gates remain closed.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In parallel,
  obtain gated Bodhan files and verify upstream Gemma terms; keep GPU off until
  every documented readiness gate passes.

### 2026-10-28 autonomous cycle (CPU checkpoint harness resolution)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority actionable local issue was the previously reported
  aggregate timeout in `scripts/test-train-cpu-smoke.py`; external evaluation,
  model, license, GPU, and paid-compute gates remain closed.
- Reproduced the complete checkpoint contract with a bounded 90-second run.
  It passed in 13.6 seconds and exercised first-run save, resume, exact
  resumed-vs-uninterrupted model/optimizer equality, stale-checkpoint
  rejection, and truncated-checkpoint rejection. The prior timeout was an
  environment/run-boundary issue, not a trainer failure; this is CPU pipeline
  evidence only.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully, compiled
  `scripts/` and `services/api/app`, validated the JSON inventories, and passed
  `git diff --check`. The known unavailable `rich` Pydantic plugin warning
  remains unrelated.
- Readiness remains `gpu_gate: NOT READY` because Lightning and `sacrebleu`
  are absent and the model-license audit is research-only. Deployment
  preflight still finds all four real bundles absent and reports
  `ready_for_local_bundle_benchmark: false`. No model was loaded; no quality
  metric, deployment measurement, GPU run, or paid compute was produced.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify upstream Gemma terms; keep
  GPU off until the documented readiness gates pass.

### 2026-10-28 autonomous cycle (CPU smoke timeout isolation)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git
  state. The highest-priority actionable local issue was the intermittent
  CPU checkpoint harness timeout; external evaluation, model, license, GPU,
  and paid-compute gates remain closed.
- Isolated `scripts/test-train-cpu-smoke.py` with per-run timing. The runner
  itself completes successfully for first-run, resume, uninterrupted, stale,
  and malformed-checkpoint cases. On this host, each fresh subprocess spends
  about 4.7--6.4 seconds importing/initializing PyTorch; the five-process
  contract therefore takes roughly 26 seconds. The prior 12--15 second
  wrapper timeout was too short and caused a timeout without identifying a
  trainer failure. This is timing evidence only, not a model result.
- Re-ran the dependency-free readiness and deployment diagnostics. Readiness
  remains `gpu_gate: NOT READY` because Lightning and `sacrebleu` are absent
  and the model-license audit is research-only. All four real deployment
  bundles remain absent; no model was loaded.
- Validation: the seven fast harnesses completed successfully, but the full
  CPU checkpoint harness still did not complete within a 40-second bounded
  run after its subprocesses had been individually shown to succeed. Python
  compilation and `git diff --check` passed. No package/model download,
  benchmark metric, deployment measurement, GPU run, or paid compute was
  performed.
- Next action: instrument `scripts/test-train-cpu-smoke.py` around each child
  process and checkpoint-load assertion to identify the residual aggregate
  stall; keep the CPU smoke path unchanged until that is understood. Then
  complete the dependency-free regression audit and proceed to the blocked
  isolated evaluation-dependency/IN22 export path when network access returns.
  Separately obtain gated Bodhan files and verify upstream Gemma terms.

### 2026-10-28 autonomous cycle (CPU smoke runner startup cost)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The external evaluation/training gates remain blocked, so the highest-priority
  safe local issue was an intermittent timeout in the CPU checkpoint harness.
- Updated `scripts/train_cpu_smoke.py` to constrain PyTorch to one CPU thread.
  This is appropriate for the tiny deterministic fixture and avoids
  host-sized thread-pool startup/oversubscription costs; it does not change a
  production model path or enable GPU work.
- Validation: direct `scripts/test-train-cpu-smoke.py` passed after the change;
  the harness exercises first-run save, resume, exact state equality, stale
  resume rejection, and truncated-checkpoint rejection. The repeated
  all-harness loop still intermittently reaches its 15-second timeout at this
  test, so the full suite is not reported as green. No model quality result,
  benchmark metric, deployment measurement, GPU run, or paid compute was
  produced. `git diff --check` and Python compilation remain required follow-up
  checks after the intermittent timeout is isolated.
- Next action: isolate the residual CPU-harness timeout with per-subprocess
  timing and environment diagnostics, then rerun the complete dependency-free
  suite. Independently, obtain gated Bodhan/Gemma terms and, when network
  access returns, export pinned IN22 references and install the bounded scoring
  dependency; keep GPU off.

### 2026-10-28 autonomous cycle (fixture provenance contract)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The external evaluation and model gates remain blocked, so the highest-priority
  safe local task was closing a benchmark-artifact contract gap.
- Updated `scripts/benchmark.py` fixture mode to persist each supplied audio path,
  transcript, reference translation, and category in `fixture_provenance`. This
  matches the documented provenance-only behavior and does not compute or imply
  WER, BLEU, chrF++, or human-quality evidence.
- Added regression assertions in `scripts/test-benchmark-fixture.py` for the
  exact provenance payload. Targeted fixture validation passed, Python
  compilation passed, and `git diff --check` passed. The known unavailable
  `rich` Pydantic plugin warning remains unrelated.
- Evidence class: benchmark harness contract only. No model was loaded, no
  quality metric or deployment measurement was produced, and GPU/paid-compute
  gates remain closed.
- Next action: when package/network access is available, install the bounded
  evaluation dependency, export pinned IN22 references, and generate exact
  deployed-baseline predictions. In parallel, resolve gated Bodhan access and
  verify upstream Gemma terms before training or redistribution.

### 2026-10-28 autonomous cycle (full dependency-free regression and gate audit)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority safe repository task was a complete local
  regression/readiness audit while package/network access, real model bundles,
  Bodhan files, and license clearance remain unavailable. GPU and paid-compute
  gates remain closed.
- Ran all 11 `scripts/test-*.py` harnesses successfully, compiled `scripts/`
  and `services/api/app`, and passed `git diff --check`. The only emitted
  warning was the known unavailable `rich` Pydantic plugin.
- The read-only readiness report remains `gpu_gate: NOT READY`, blocked by
  missing Lightning, missing `sacrebleu`, and the research-only model-license
  hold. Deployment preflight reports all four required real bundles missing
  and `ready_for_local_bundle_benchmark: false`.
- Evidence class: dependency-free contract and readiness diagnostics only.
  No package/model download, benchmark metric, real deployment measurement,
  GPU run, or paid compute was produced. No code change was warranted because
  the repository-controlled contracts passed and external prerequisites are
  still unavailable.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (fresh dependency-free gate audit)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external work remains blocked by unavailable
  pinned IN22/package access, missing `sacrebleu` and Lightning, absent real
  model bundles, and unresolved gated Bodhan/Gemma terms. GPU and paid-compute
  gates remain closed.
- Probed the installed AGY and Claude CLIs with bounded `--help` commands;
  both are available, but no collaborator review was started or used as
  evidence in this cycle.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully, compiled
  `scripts/` and `services/api/app`, and passed `git diff --check`. The only
  output warning was the known unavailable `rich` Pydantic plugin.
- The live readiness report remains `gpu_gate: NOT READY`, with blockers for
  missing Lightning, missing `sacrebleu`, and the research-only model-license
  audit. Deployment preflight reports all four required real bundles missing
  and `ready_for_local_bundle_benchmark: false`.
- Evidence class: dependency-free contract and readiness diagnostics only.
  No package/model download, benchmark metric, real deployment measurement,
  GPU run, or paid compute was produced.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (full dependency-free regression audit)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git
  state. The highest-priority safe repository task was a complete local
  regression/readiness audit while package/network access, real model bundles,
  Bodhan files, and license clearance remain unavailable. GPU and paid-compute
  gates remain closed.
- Ran all 11 `scripts/test-*.py` harnesses successfully, compiled `scripts/`
  and `services/api/app`, passed `git diff --check`, and ran the API contract
  suite with 10/10 tests passing. The only output warnings were the known
  unavailable `rich` Pydantic plugin and a Pydantic deprecation warning.
- The read-only readiness report remains `gpu_gate: NOT READY`, blocked by
  missing Lightning, missing `sacrebleu`, and the research-only model-license
  audit. Deployment preflight reports
  `ready_for_local_bundle_benchmark: false`; no model was loaded.
- Evidence class: dependency-free contract and readiness diagnostics only.
  No package/model download, benchmark metric, real deployment measurement,
  GPU run, or paid compute was produced. No code change was warranted because
  the repository-controlled contracts passed.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (dependency-free gate audit)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external work remains blocked by unavailable
  package/network access, missing real model bundles, gated Bodhan files, and
  unresolved upstream Gemma terms; GPU and paid-compute gates remain closed.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully. Python
  compilation and `git diff --check` also passed. The only warning was the
  known unavailable `rich` Pydantic plugin; it did not fail a harness.
- Re-ran the dependency-free readiness diagnostic. It reports
  `gpu_gate: NOT READY` with blockers for missing Lightning, missing
  `sacrebleu`, and the research-only model-license hold. Deployment preflight
  reports all four required real bundles missing and
  `ready_for_local_bundle_benchmark: false`.
- Evidence class: repository contract and readiness diagnostics only. No
  package/model download, benchmark metric, real deployment measurement, GPU
  run, or paid compute was produced. No code change was warranted by this
  audit because the existing contracts passed.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (full local validation and gate recheck)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority external work remains blocked by unavailable package/
  network access, gated Bodhan files, and unresolved upstream Gemma terms; GPU
  and paid-compute gates remain closed.
- Validated the current repository-controlled benchmark/API changes: all 11
  `scripts/test-*.py` harnesses passed, the API contract suite passed 10/10,
  Python compilation passed, and `git diff --check` passed. The only warnings
  were the known unavailable `rich` Pydantic plugin and a Pydantic deprecation.
- Correctly reran the dependency-free readiness diagnostic after one attempted
  invocation with its unsupported `--output` option. The valid report remains
  `gpu_gate: NOT READY`, blocked by missing Lightning, missing `sacrebleu`,
  and the research-only model-license hold. No package/model download,
  benchmark metric, real deployment measurement, GPU run, or paid compute was
  produced.
- Deployment preflight still reports all four required real bundles missing and
  `ready_for_local_bundle_benchmark: false`. This is inventory evidence only;
  it does not establish model quality, memory, latency, energy, or license
  rights.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In parallel,
  obtain gated Bodhan files and verify exact upstream Gemma terms; keep GPU off
  until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (current repository audit and validation)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority actionable repository work was validating the
  current benchmark/API changes while package, network, model-license, GPU,
  and paid-compute gates remain closed.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully. Python
  compilation and `git diff --check` also passed. The API contract suite
  passed all 10 tests with the explicit ASGI transport fixture. The only
  warnings were the known unavailable `rich` Pydantic plugin and a Pydantic
  deprecation warning.
- Re-ran the dependency-free readiness diagnostic from the repository root:
  `gpu_gate: NOT READY`, blocked by missing Lightning, missing `sacrebleu`,
  and the research-only model-license hold. Deployment preflight still finds
  all four real bundles absent and reports
  `ready_for_local_bundle_benchmark: false`.
- A first readiness invocation used an unsupported `--output` option and a
  second invocation was run from the API subdirectory; both were corrected.
  These were command-context errors, not repository failures.
- Evidence class: dependency-free contract and readiness diagnostics only.
  No model/package download, benchmark metric, real deployment measurement,
  GPU run, or paid compute was produced.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (full dependency-free gate recheck)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external work remains blocked by unavailable
  package/network access, gated Bodhan files, and unresolved upstream Gemma
  terms; GPU and paid-compute gates remain closed.
- Ran every repository `scripts/test-*.py` harness (11/11 passed), compiled
  `scripts/` and `services/api/app`, and passed `git diff --check`. The only
  test warning is the known unrelated unavailable `rich` Pydantic plugin.
- Re-ran `scripts/check-training-readiness.py`. It reports
  `gpu_gate: NOT READY` with blockers for missing Lightning, missing
  `sacrebleu`, and the research-only model-license hold. This is a readiness
  diagnostic, not a training or quality result.
- No code change was warranted by this audit: split-manifest fingerprints,
  training-contract validation, CPU checkpoint recovery, evaluator input
  validation, benchmark fixture plumbing, and deployment preflight all passed.
  No package/model download, benchmark metric, deployment measurement, GPU
  run, or paid compute was produced.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms.
  Keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (benchmark and deployment preflight validation)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority repository-controlled item was validating the benchmark
  and deployment-preflight contracts while package/network, model-license,
  GPU, and paid-compute gates remain closed.
- Ran the mock benchmark, fixture benchmark contract, mock pipeline checks,
  and deployment-feasibility checks. The mock artifact reports 5/5 Telugu
  script outputs and 13.24 ms mean pipeline latency, but is explicitly marked
  `mock diagnostic; not a model quality result`; it uses fixed text, synthetic
  tone audio, and mock TTS. Deployment preflight correctly finds all four real
  bundles absent and reports `ready_for_local_bundle_benchmark: false`.
- Validation: all repository `scripts/test-*.py` harnesses passed; API suite
  passed 10 tests; Python compilation and `git diff --check` passed. The only
  test warnings are the known unavailable `rich` Pydantic plugin and a
  Pydantic deprecation warning. No model/package download, quality metric,
  real deployment measurement, GPU run, or paid compute was produced.
- Evidence class: dependency-free benchmark harness and deployment preflight
  diagnostics; mock timings are not deployment or model results.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms.
  Keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (deployment preflight inventory safety)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The pinned IN22/evaluation path and Bodhan/Gemma license decision remain
  blocked by unavailable network/package access and gated file access; GPU and
  paid-compute gates remain closed. All 11 dependency-free repository
  harnesses were passing before and after this cycle.
- Strengthened `scripts/assess-deployment-feasibility.py` so each configured
  model bundle reports deterministic file count and readability metadata, and
  a required bundle is not considered benchmark-ready merely because its path
  exists but cannot be read. Added regression coverage for the directory
  inventory fields. This is a local preflight contract; it does not load a
  model or establish quality, RAM, latency, energy, or license rights.
- Validation: targeted deployment-feasibility harness passed; all 11
  `scripts/test-*.py` harnesses passed; all scripts compiled; `git diff
  --check` passed. The live readiness diagnostic remains `gpu_gate: NOT READY`
  with blockers for missing Lightning, missing `sacrebleu`, and the
  research-only model-license audit. A mock timing run was executed only as a
  plumbing diagnostic and produced no model or deployment result.
- Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify upstream Gemma terms. Keep
  GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (explicit ASGI API contract tests)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git
  state. The highest-priority repository-controlled item was the unresolved
  API request boundary: the legacy Starlette `TestClient` path hung in this
  environment even though direct ASGI requests could complete.
- Replaced the API test module's host-dependent `TestClient` with a small
  synchronous facade that creates `httpx.AsyncClient` plus explicit
  `httpx.ASGITransport` for each request. This preserves the existing test
  call sites while making the async transport boundary explicit; it does not
  change production adapter behavior or claim a deployment result.
- Validation: `PYTHONPATH=. pytest -q tests/test_api.py` from `services/api`
  passed all 10 API contract tests in 0.61s. All 11 repository
  `scripts/test-*.py` dependency-free harnesses passed, Python compilation
  passed, and `git diff --check` passed. The known unrelated Pydantic warning
  about the unavailable `rich` plugin remains.
- The readiness diagnostic still reports `gpu_gate: NOT READY` because
  Lightning and `sacrebleu` are unavailable and the model-license audit is
  research-only. No package/model download, benchmark metric, deployment
  measurement, GPU run, or paid compute was produced.
- Next action: when approved network/package access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, resolve gated Bodhan file access and verify upstream Gemma terms;
  keep GPU off until every documented readiness gate passes.

### 2026-10-28 autonomous cycle (ASGI sync-handler boundary)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority actionable blocker was the unresolved API request hang;
  GPU, paid-compute, package-download, benchmark, and model-license gates
  remain unchanged and closed.
- Isolated the runtime behavior with a local version/matrix probe. A minimal
  FastAPI app served an `async def` route through `httpx.ASGITransport`, while
  an otherwise identical synchronous route hung in Starlette/AnyIO's threadpool
  path. The VaayuEdge app showed the same pre-fix behavior. Converted the
  lightweight synchronous API handlers in `app/api/router.py` to `async def`
  so they do not depend on that broken threadpool boundary. This is a runtime
  compatibility fix, not a model or deployment result.
- Validation: direct `httpx.AsyncClient` + `ASGITransport` request to
  `/health` now returns HTTP 200 with a valid health payload; router bytecode
  compilation and `git diff --check` pass. `fastapi.testclient.TestClient`
  still hangs on the request, including against a minimal FastAPI app, so no
  pytest API result is counted as passing. The existing unrelated Pydantic
  `rich` plugin warning remains.
- Evidence class: local ASGI runtime diagnosis and contract-level smoke check;
  no translation metric, deployment benchmark, GPU run, or paid compute.
- Next action: replace the host-dependent `TestClient` request path with an
  explicitly async `ASGITransport` test fixture (or pin/repair the local
  Starlette/AnyIO test stack when package access is available), then rerun the
  API contract suite. In parallel, when network access exists, install the
  declared evaluation dependency and export pinned IN22 references. Keep GPU
  off until all documented readiness gates pass.

### 2026-10-28 autonomous cycle (dependency-free audit and ASGI runtime blocker)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. AGY is installed but could not start in the restricted environment:
  its log directory is read-only and its local language-server socket is not
  permitted. Claude is installed but remains subject to the documented weekly
  limit. No collaborator output was used as evidence.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully, including
  CPU checkpoint recovery, training-contract/readiness, split fingerprints,
  evaluator input validation, and deployment-feasibility checks. Python
  compilation and `git diff --check` also passed. The only test output issue
  was the known unrelated missing-`rich` Pydantic plugin warning.
- The live readiness report remains `gpu_gate: NOT READY`: Lightning and
  `sacrebleu` are unavailable, the model-license audit remains research-only,
  and the temporary manifest has matching row counts but no declared split
  hashes. No package/model download, benchmark metric, deployment result,
  GPU run, or paid compute was produced.
- Reconfirmed the API-runtime blocker with
  `timeout 15s env PYTHONPATH=. pytest -q tests/test_api.py::test_health_endpoint`
  from `services/api`: collection succeeds, then the request hangs until the
  timeout (`exit 124`). A direct `httpx.AsyncClient` with `ASGITransport`
  shows the same timeout, so this is an environment/runtime symptom rather
  than evidence that the health route passes or fails. An initial probe without
  `PYTHONPATH=.` only exposed a test-import setup error and is not counted as
  a test result.
- Evidence class: dependency-free contract diagnostics and an unresolved
  host-level ASGI request hang; no model-quality or deployment claim.
- Next action: isolate the ASGI hang with a minimal environment/version
  matrix (without network or paid compute), then repair only the test/runtime
  boundary if the cause is repository-controlled. In parallel, when approved
  package/network access exists, install the declared evaluation dependency in
  isolation, export pinned IN22 references, and generate exact deployed-
  baseline predictions. Keep GPU off until all documented gates pass.

### 2026-10-28 autonomous cycle (checkpoint-path safety contract)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external evaluation and training gates remain
  blocked by unavailable package/network access and unresolved Bodhan/Gemma
  licensing; GPU and paid-compute gates remain closed.
- Strengthened `scripts/validate-training-contract.py` so a future CPU-first
  training contract must name a non-empty, dedicated relative checkpoint
  directory. Blank, whitespace-only, and `.` paths now fail closed, avoiding
  accidental checkpoint writes beside the contract or into an ambiguous
  working directory. Added regression coverage in
  `scripts/test-validate-training-contract.py`.
- Validation passed: the targeted contract harness, all repository
  `scripts/test-*.py` harnesses, Python compilation, and `git diff --check`.
  The known unrelated fixture warning about unavailable `rich` remains. No
  package/model download, benchmark metric, deployment measurement, GPU run,
  or paid compute was produced.
- Evidence class: dependency-free training-contract and pipeline-integrity
  diagnostics only. Next action: when approved package/network access exists,
  install the declared evaluation dependency in isolation, export pinned IN22
  references, and generate exact deployed-baseline predictions; independently
  verify gated Bodhan access and upstream Gemma terms before any training or
  redistribution decision. Keep GPU off until every documented gate passes.

### 2026-10-28 autonomous cycle (training-contract hash alphabet validation)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22/evaluation path, Lightning installation, and cleared
  Bodhan/Gemma licensing remain unavailable; GPU and paid-compute gates stay
  closed. AGY and Claude binaries are available, but no collaborator output
  was used as evidence.
- Hardened `scripts/validate-training-contract.py` so the source-artifact
  `input_sha256` and every declared split SHA-256 must be 64-character
  hexadecimal digests, matching the existing readiness checker. This closes
  a fail-open path where non-hex text of the right length could pass contract
  validation. Added regression coverage for malformed input and split hashes
  in `scripts/test-validate-training-contract.py`.
- Validation passed: all 11 repository `scripts/test-*.py` harnesses, Python
  compilation, and `git diff --check`. The live readiness report remains
  `gpu_gate: NOT READY` with blockers for missing Lightning, missing
  `sacrebleu`, the research-only model-license hold, and the temporary
  manifest's invalid/missing inputs. No model/package download, benchmark
  metric, deployment measurement, GPU run, or paid compute was produced.
- Evidence class: dependency-free training-contract and readiness diagnostics
  only. Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions; independently obtain
  gated Bodhan access and verify exact upstream Gemma terms before any
  training or redistribution decision. Keep GPU off until all gates pass.

### 2026-10-28 autonomous cycle (strict hash provenance validation)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external gates remain blocked: Lightning and
  `sacrebleu` are unavailable, the Bodhan/Gemma license hold remains
  unresolved, and GPU/paid-compute gates stay closed.
- Hardened `scripts/check-training-readiness.py` so input and split SHA-256
  fields must be valid 64-character hexadecimal digests, not merely strings of
  the correct length. This makes malformed provenance fail closed before a
  training manifest can be treated as structurally valid. Added regression
  coverage for malformed input and split hashes in
  `scripts/test-check-training-readiness.py`.
- Validation passed: the targeted readiness harness, all repository
  `scripts/test-*.py` harnesses, Python compilation, and `git diff --check`.
  The live readiness report remains `gpu_gate: NOT READY`; its temporary
  counts-based manifest is correctly rejected because split hashes do not
  match, alongside the missing-dependency and research-only-license blockers.
  The known unrelated fixture warning about unavailable `rich` remains. No
  package/model download, benchmark metric, deployment measurement, GPU run,
  or paid compute was produced.
- Evidence class: dependency-free provenance and readiness diagnostics only.
  Next action: when approved package/network access exists, install the
  declared evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions. Independently obtain
  gated Bodhan access and verify exact upstream Gemma terms before any
  training, redistribution, or hosted-service decision. Keep GPU off until all
  documented gates are satisfied.

### 2026-10-28 autonomous cycle (source-artifact provenance binding)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external gates remain blocked: Lightning and
  `sacrebleu` are unavailable, the Bodhan/Gemma license hold remains
  unresolved, and GPU/paid-compute gates stay closed. AGY and Claude binaries
  are present; no collaborator was used as evidence because prior AGY sandbox
  restrictions and Claude's weekly limit remain documented.
- Strengthened `scripts/validate-training-contract.py` and
  `scripts/check-training-readiness.py` so a counts-based training manifest
  must include a 64-character `input_sha256` in addition to validated split
  files, row counts, and per-split hashes. This binds a future training
  contract to the exact source artifact fingerprint and fails closed on
  incomplete provenance. Updated regression fixtures accordingly.
- Validation passed: training-contract, training-readiness, and split-manifest
  harnesses; Python compilation; and `git diff --check`. The live readiness
  report still shows `gpu_gate: NOT READY`; the temporary manifest has a
  source hash and matching row counts but no split hashes, so it is correctly
  rejected. No package/model download, benchmark metric, deployment
  measurement, GPU run, or paid compute was produced.
- Evidence class: dependency-free provenance and readiness diagnostics only.
  Next action: promote/regenerate the split artifact with source and per-split
  hashes, then when approved access exists install the declared evaluation
  dependency in isolation, export pinned IN22 references, and generate exact
  deployed-baseline predictions. Keep GPU off until every documented gate is
  satisfied.

### 2026-10-28 autonomous cycle (evaluation provenance required fields)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22 inputs, `sacrebleu`, Lightning, and cleared
  Bodhan/Gemma licensing remain unavailable; GPU and paid-compute gates stay
  closed.
- Hardened `scripts/evaluate-translation.py` so `--model-name`, optional
  `--model-revision` when supplied, and `--pipeline-source` reject blank
  values. The pipeline source is now required instead of silently defaulting
  to `unspecified`, preventing a complete benchmark report from carrying
  unusable prediction provenance.
- Added regression coverage for blank model and pipeline provenance fields
  in `scripts/test-evaluate-translation.py`. Validation passed for the
  evaluator harness, Python compilation, and `git diff --check`. No
  `sacrebleu` scoring, benchmark metric, model/package download, deployment
  measurement, GPU run, or paid compute was produced.
- Evidence class: dependency-free evaluator input/provenance contract
  diagnostics only. Next action: when approved access exists, export pinned
  IN22 references and generate exact deployed-baseline predictions with
  non-empty provenance, then run the evaluator. Keep GPU off until all
  documented gates are satisfied.

### 2026-10-28 autonomous cycle (ML dependency contract alignment)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. Pinned IN22 access, local `sacrebleu`, Lightning installation, and
  cleared Bodhan/Gemma licensing remain unavailable; GPU and paid-compute
  gates stay closed.
- Added the bounded `lightning>=2.2,<3` declaration to
  `services/api/requirements-ml.txt`, matching the existing readiness
  diagnostic's import check. Added a regression assertion so the dependency
  contract cannot omit the package that the readiness gate requires. This
  does not install Lightning or authorize accelerator use.
- Validation passed: readiness-contract, training-contract, and CPU smoke
  checkpoint harnesses; Python compilation; `git diff --check`; and the live
  readiness report. The report remains `gpu_gate: NOT READY` with blockers
  for missing Lightning, missing `sacrebleu`, and the research-only model
  license audit. No package/model download, benchmark metric, deployment
  measurement, GPU run, or paid compute was produced.
- Evidence class: dependency-contract and CPU-only readiness diagnostics.
- Next action: when approved package/network access exists, install the
  declared ML environment in isolation and rerun readiness; independently
  obtain gated Bodhan access and verify exact upstream Gemma terms. Then
  export pinned IN22 references and generate exact deployed-baseline
  predictions before any training decision. Keep GPU off until all gates are
  satisfied.

### 2026-10-28 autonomous cycle (training-contract manifest integrity)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22 inputs and `sacrebleu` remain unavailable, Lightning
  is not installed, and the Bodhan/Gemma license audit remains research-only;
  GPU and paid-compute gates stay closed.
- Hardened `scripts/validate-training-contract.py` so a future training
  contract now requires `train`, `validation`, and `test` split files,
  positive row counts, and matching per-split SHA-256 fingerprints in the
  manifest. The contract fails closed on missing files, malformed hashes,
  hash mismatches, or row-count mismatches before a training entry point can
  consume changed data. Added regression coverage for missing hashes and a
  changed split file.
- Validation passed: the training-contract, training-readiness, and
  training-input harnesses, Python compilation, and `git diff --check`. The
  live readiness report still reports `NOT READY`; the existing temporary
  manifest has matching row counts but no declared split hashes, so it is
  correctly rejected by the strengthened gate. No model/package download,
  benchmark metric, deployment measurement, GPU run, or paid compute was
  produced. Evidence class: dependency-free contract and input-integrity
  diagnostics only.
- Next action: regenerate/promote the split artifact with per-split hashes,
  then install the evaluation dependency in isolation when package access is
  available, export pinned IN22 references, and generate exact deployed-
  baseline predictions. Keep GPU off until the documented gates are all
  satisfied.

### 2026-10-28 autonomous cycle (regenerated split-manifest evidence)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22/sacrebleu path, Lightning installation, and cleared
  Bodhan/Gemma licensing remain unavailable; GPU and paid-compute gates stay
  closed.
- Regenerated the deterministic daily split artifact from
  `/tmp/inferedge-data-prep/daily.clean.jsonl` with `scripts/split-bitext.py`
  in a fresh temporary directory. The producer emitted 7,673 train, 412
  validation, and 426 test rows with input SHA-256
  `0bee5c0f6c8df5441d2fc7a953d7389a77caeef127d8a00e5dc505bcbab74076`.
  The manifest's three split SHA-256 values were independently recomputed
  from the emitted files and matched exactly; this confirms the refreshed
  artifact satisfies the per-split fingerprint contract. The artifact remains
  temporary and was not promoted to a training input.
- Validation passed: `scripts/test-split-bitext.py`,
  `scripts/test-check-training-readiness.py`, Python compilation, and
  `git diff --check`. The readiness report recognized the manifest as valid
  (`split_hashes_match: true`, `split_row_counts_match: true`) but remains
  `gpu_gate: NOT READY` with blockers for missing Lightning, missing
  sacrebleu, and the research-only model license audit. No model/package
  download, benchmark score, deployment measurement, GPU run, or paid
  compute was produced.
- Next action: preserve this manifest-generation command as the data-refresh
  step when the preparation artifact is next promoted; then, once approved
  access exists, export pinned IN22 references, install the evaluation
  dependency in isolation, and generate exact deployed-baseline predictions.
  Keep GPU off until the documented training gates are all satisfied.

### 2026-10-28 autonomous cycle (split-manifest fingerprint contract)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22 references and `sacrebleu` remain unavailable,
  Lightning is not installed, and the Bodhan/Gemma license hold remains
  unresolved; GPU and paid-compute gates stay closed.
- Added `scripts/test-split-bitext.py`, a dependency-free regression harness
  for the existing deterministic split producer. It verifies that emitted
  manifests preserve the input fingerprint, report all three split hashes,
  and exactly match the bytes written to each split file. This closes the
  producer-side regression gap behind the readiness check's per-split hash
  requirement; it does not establish training readiness or data quality.
- Validation passed: the new split-manifest harness, the readiness harness,
  all repository `scripts/test-*.py` harnesses, Python compilation, live
  readiness-report JSON parsing against the existing daily split manifest,
  and `git diff --check`. The known unrelated fixture warning about missing
  `rich` remains. No model/package download, benchmark metric, deployment
  measurement, GPU run, or paid compute was produced.
- Next action: regenerate the daily split manifest with the producer when the
  data-preparation artifact is next refreshed; then, once approved access is
  available, install the evaluation dependency in isolation, export pinned
  IN22 references, generate exact deployed-baseline predictions, and run the
  provenance-preserving evaluator. Keep GPU off until every documented gate
  is satisfied.

### 2026-10-28 autonomous cycle (manifest fingerprint readiness gate)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22 files, `sacrebleu`, Lightning, and cleared Bodhan /
  Gemma licensing remain unavailable; GPU and paid-compute gates stay closed.
- Hardened `scripts/check-training-readiness.py` so a counts-based training
  manifest is not considered structurally ready when it omits per-split
  SHA-256 fingerprints. This closes a reproducibility gap: row counts alone
  cannot detect changed split contents. Added regression coverage for the
  missing-fingerprint case in `scripts/test-check-training-readiness.py`.
- Validation passed: the readiness harness, Python compilation, and
  `git diff --check`. The live diagnostic against
  `/tmp/inferedge-data-prep/daily-splits-v1/manifest.json` now reports the
  existing missing split fingerprints explicitly, alongside the known
  missing-dependency and research-only-license blockers. Candidate inventory
  validation and row-count checks still pass.
- Evidence class: dependency-free readiness and input-integrity diagnostics
  only. No model/package download, benchmark metric, quality result,
  deployment measurement, GPU run, or paid compute was produced.
- Next action: regenerate the validated split manifest with per-split hashes
  when the data-preparation artifact is next refreshed; then, when approved
  access exists, install the evaluation dependency in isolation, export pinned
  IN22 references, generate exact deployed-baseline predictions, and run the
  provenance-preserving evaluator. Keep GPU off until all gates are satisfied.

### 2026-10-28 autonomous cycle (training-contract candidate uniqueness)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22 evaluation path, `sacrebleu`, Lightning, and cleared
  Bodhan/Gemma licensing remain unavailable; GPU and paid-compute gates stay
  closed.
- Hardened `scripts/validate-training-contract.py` so a future training
  contract fails closed when its candidate inventory is empty, contains a
  malformed entry, or contains duplicate candidate IDs. This aligns the
  training boundary with the existing readiness diagnostic and prevents an
  ambiguous candidate-to-checkpoint provenance decision.
- Added regression coverage for duplicate candidate IDs and a missing role in
  `scripts/test-validate-training-contract.py`.
- Validation passed: the targeted training-contract harness, all repository
  `scripts/test-*.py` harnesses, Python compilation, readiness JSON parsing,
  and `git diff --check`. The readiness report remains `NOT READY` with
  blockers for missing Lightning, missing `sacrebleu`, and the research-only
  model license audit.
- Evidence class: dependency-free contract and pipeline-integrity diagnostics
  only. No model/package download, benchmark metric, quality result,
  deployment measurement, GPU run, or paid compute was produced.
- Next action: when approved network/package and gated-model access are
  available, install the declared evaluation dependency in isolation, export
  pinned IN22 references, generate exact deployed-baseline predictions, and
  run the provenance-preserving evaluator. Until then, continue CPU-only
  contract work and keep GPU and paid compute off.

### 2026-10-28 autonomous cycle (candidate provenance binding)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22/sacrebleu path, Lightning installation, and cleared
  Bodhan/Gemma licensing remain unavailable; GPU and paid-compute gates stay
  closed.
- Hardened `scripts/validate-training-contract.py` so every future training
  contract must reference a relative candidate inventory and its
  `candidate_id` must be registered there. Invalid or escaping inventory paths
  and unregistered IDs now fail closed before any training entry point could
  load data or allocate accelerator memory. Added regression coverage for a
  valid inventory and an unknown candidate ID.
- Validation passed: the targeted training-contract harness, all 10 repository
  `scripts/test-*.py` harnesses, Python compilation, and `git diff --check`.
  The fixture benchmark retained the known unrelated local Pydantic warning
  about unavailable `rich`.
- Evidence class: dependency-free contract and pipeline-integrity diagnostics
  only. No model/package download, benchmark metric, quality result,
  deployment measurement, GPU run, or paid compute was produced.
- Next action: when approved network/package and gated-model access are
  available, install the declared evaluation dependency in isolation, export
  pinned IN22 references, generate exact deployed-baseline predictions, and
  run the provenance-preserving evaluator. Until then, continue CPU-only
  contract work and keep GPU and paid compute off.

### 2026-10-28 autonomous cycle (training-contract path containment)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The pinned IN22 export/evaluation path remains blocked by unavailable
  network/files and `sacrebleu`; Lightning is not installed and the Bodhan
  license audit remains research-only. GPU and paid-compute gates remain
  closed.
- Hardened `scripts/validate-training-contract.py`: relative manifest and
  checkpoint paths now reject absolute paths and `..` traversal, so a future
  contract cannot silently read inputs or place checkpoints outside its
  contract directory. Added regression coverage for both escape attempts in
  `scripts/test-validate-training-contract.py`.
- Validation passed: the targeted contract harness, all repository
  `scripts/test-*.py` harnesses, Python compilation, `git diff --check`, and
  readiness-report JSON parsing. The live readiness report remains `NOT READY`
  with blockers for missing Lightning, missing `sacrebleu`, and the
  research-only model license audit.
- Evidence class: dependency-free contract and readiness diagnostics only. No
  model/package download, benchmark metric, quality result, deployment
  measurement, GPU run, or paid compute was produced.
- Next action: when approved network/package and gated-model access are
  available, install the evaluation dependency in isolation, export pinned
  IN22 references, generate predictions from the exact deployed baseline, and
  run the provenance-preserving evaluator. Until then, continue CPU-only
  contract work and keep GPU and paid compute off.

### 2026-10-28 autonomous cycle (epoch-boundary checkpoint semantics)

- Audited the repository and confirmed the highest-priority external gates
  remain blocked: pinned IN22 files and `sacrebleu` are unavailable, Lightning
  is not installed, and the Bodhan model license audit remains research-only.
  GPU and paid-compute gates remain closed.
- Fixed `scripts/train_cpu_smoke.py` so checkpoints are persisted only after a
  complete training epoch. Previously, a checkpoint written after each row
  was labeled with the completed epoch and could misrepresent an interrupted
  epoch as safe to resume past. The checkpoint remains atomic and now has an
  explicit epoch-boundary recovery contract.
- Extended `scripts/test-train-cpu-smoke.py` to assert the epoch-boundary
  contract. Validation passed for the CPU checkpoint harness, all nine other
  repository `scripts/test-*.py` harnesses, Python compilation, and
  `git diff --check`. The fixture benchmark retained the known unrelated local
  Pydantic warning about unavailable `rich`.
- Evidence class: deterministic CPU checkpoint/pipeline-safety diagnostics
  only. No model quality result, benchmark metric, deployment measurement,
  package/model download, GPU run, or paid compute was produced.
- Next action: when approved access exists, install the declared evaluation
  dependency in isolation, export pinned IN22 references, generate predictions
  from the exact deployed baseline, and run the provenance-preserving
  evaluator. In parallel, obtain gated Bodhan access and verify exact
  upstream terms before any training or model redistribution; otherwise
  continue dependency-free contract work and keep GPU off.

### 2026-10-28 autonomous cycle (bounded training-contract inputs)

- Audited the repository and selected the highest-priority safe CPU-only task
  after confirming that pinned IN22 files, `sacrebleu`, Lightning, and cleared
  Bodhan licensing remain unavailable. GPU and paid-compute gates remain
  closed.
- Tightened `scripts/validate-training-contract.py`: source and target length
  fields must now be integers from 1 through 4,096. This enforces the contract's
  low-resource bounded-input claim and fails closed on pathological configurations
  before any future training entry point can load data or allocate accelerator
  memory. Added an oversized-length regression case.
- Validation passed: the targeted contract harness, all repository
  `scripts/test-*.py` harnesses, Python compilation, `git diff --check`, and the
  read-only readiness report. The fixture benchmark retained the known
  unrelated local Pydantic warning about missing `rich`.
- Evidence class: dependency-free training-contract and readiness diagnostics
  only. No model/package download, benchmark metric, quality result, deployment
  measurement, GPU run, or paid compute was produced. Current readiness remains
  `NOT READY` because Lightning and `sacrebleu` are absent and the model license
  audit is still research-only.
- Next action: when network/package and gated-model access are available, verify
  the accepted Bodhan/Gemma terms and install the bounded evaluation dependency
  in isolation, export pinned IN22 references, generate exact deployed-baseline
  predictions, and run the provenance-preserving evaluator. Until then, continue
  dependency-free contract work and keep GPU and paid compute off.

### 2026-10-28 autonomous cycle (candidate identity readiness gate)

- Audited the repository and confirmed the pinned IN22 evaluation path,
  `sacrebleu`, Lightning, and Bodhan licensing remain unavailable; GPU and
  paid-compute gates remain closed.
- Strengthened `scripts/check-training-readiness.py` so candidate inventory
  IDs must be unique in addition to being non-empty and paired with a role.
  Duplicate IDs could otherwise make candidate-to-manifest decisions
  ambiguous while appearing structurally ready.
- Added duplicate-ID regression coverage to
  `scripts/test-check-training-readiness.py`. This is a dependency-free
  readiness/schema diagnostic; it does not establish model quality, licensing,
  training readiness, or deployment performance.
- Next action: when access is available, install the bounded evaluation
  dependency in isolation, export pinned IN22 references, generate predictions
  from the exact deployed baseline, and run the provenance-preserving
  evaluator. Keep GPU and paid compute off until all gates are satisfied.

### 2026-10-28 autonomous cycle (dependency-free regression audit)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority external work remains blocked by unavailable
  pinned IN22 files and `sacrebleu`, while Lightning is not installed and the
  Bodhan checkpoint license audit remains research-only. GPU and paid-compute
  gates remain closed.
- Ran every repository `scripts/test-*.py` harness (10 total): deployment
  feasibility, benchmark fixture, training readiness, evaluator input,
  offline IN22 export, mock-pipeline measurement, CPU checkpoint recovery,
  human-review validation, training contract, and training-input validation
  all passed. `python3 -m compileall -q scripts`, readiness JSON parsing, and
  `git diff --check` also passed.
- The fixture benchmark retained the known unrelated local Pydantic warning
  about the unavailable `rich` module. No model/package download, benchmark
  metric, quality result, deployment measurement, GPU run, or paid compute
  was produced. Evidence class: dependency-free harness and readiness
  diagnostics only.
- Collaborator availability check: `agy --version` reported 1.4.9 and
  `claude --version` reported 2.1.310. No collaborator task was started or
  treated as evidence; the existing AGY sandbox/log restriction and Claude
  weekly-limit blocker remain documented below.
- Current readiness report records blockers for missing Lightning, missing
  `sacrebleu`, and the research-only model license audit; candidate inventory
  validation passes with four entries. Next action: when access is available,
  install the bounded evaluation dependency in isolation, export the pinned
  IN22 references, generate predictions from the exact deployed baseline, and
  run the provenance-preserving evaluator. Until then, continue only with
  dependency-free contract work and keep GPU and paid compute off.

### 2026-10-28 autonomous cycle (benchmark failure cleanup)

- Re-audited the repository state and selected the highest-priority safe
  CPU-only task after confirming that pinned IN22 files, `sacrebleu`,
  Lightning, and cleared checkpoint licensing remain unavailable. GPU and
  paid-compute gates remain closed.
- Hardened `scripts/benchmark.py`: fixture audio files now use context-managed
  reads, and the RSS sampler is stopped and joined when adapter initialization
  or a benchmark sample raises. This prevents leaked sampler threads and
  preserves the original exception for diagnosis.
- Validation passed: benchmark fixture contract, every repository
  `scripts/test-*.py` harness, Python compilation, `git diff --check`, and an
  injected adapter-failure cleanup check. The fixture benchmark retained the
  known unrelated local Pydantic warning about missing `rich`.
- Evidence class: benchmark harness reliability only. No translation metric,
  quality result, model/package download, GPU run, or paid compute was used.
- Next action: when approved IN22 files and isolated `sacrebleu` access are
  available, generate predictions from the exact deployed baseline and run
  the provenance-preserving evaluator; otherwise continue dependency-free
  contract work and keep GPU and paid compute off.

### 2026-10-28 autonomous cycle (mock pipeline measurement contract)

- Re-read the repository instructions, progress log, and Git state. The
  highest-priority benchmark/training gates remain blocked by unavailable
  pinned IN22 files, missing `sacrebleu` and Lightning, and the unresolved
  Bodhan license hold; GPU and paid-compute gates remain closed.
- Added `scripts/measure-mock-pipeline.py`, a CPU-only timing diagnostic with
  explicit warmup/iteration controls for the mock ASR -> translation -> TTS
  path. It records wall-time summaries, adapter-reported timing, and output
  size, and labels the evidence as mock-only. Added
  `scripts/test-measure-mock-pipeline.py` for deterministic schema and
  sanity checks.
- Validation passed: the new harness, every repository `scripts/test-*.py`
  harness, Python compilation, and `git diff --check`. A three-iteration
  diagnostic completed on CPU: mean wall time 16.80 ms, p50 17.37 ms, p95
  17.37 ms, and mean WAV output 38,444 bytes. These are mock-pipeline
  diagnostics only, not real-model latency, RAM, energy, or quality results.
  The known unrelated local Pydantic warning about missing `rich` remained.
- No model/package download, benchmark metric, GPU run, or paid compute was
  used. Next action: when approved IN22 archives and isolated `sacrebleu`
  access are available, generate predictions from the exact deployed
  baseline and run the provenance-preserving evaluator; otherwise continue
  dependency-free training/deployment contracts and keep GPU off.

### 2026-10-28 autonomous cycle (dependency-free training contract)

- Audited the repository and confirmed the highest-priority evaluation path is
  still blocked by unavailable pinned IN22 files, missing `sacrebleu`, missing
  Lightning, and the unresolved research-only model license hold. GPU and
  paid-compute gates remain closed.
- Added `scripts/validate-training-contract.py`, a dependency-free boundary
  check for a future attributed training entry point. It requires an explicit
  candidate ID, deterministic nonnegative seed, bounded source/target lengths,
  a relative checkpoint directory, and a three-way manifest with positive
  split counts. It rejects non-CPU GPU settings and does not import Lightning,
  load models, create directories, or allocate accelerator memory.
- Added `scripts/test-validate-training-contract.py` covering a valid contract,
  GPU-setting rejection, and invalid split-count rejection.
- Validation passed: the new contract harness, every repository
  `scripts/test-*.py` harness, Python compilation, and `git diff --check`.
  The fixture benchmark emitted the known unrelated local Pydantic warning
  about missing `rich`. No package/model download, benchmark metric, GPU run,
  or paid compute was used.
- Evidence class: training-contract and pipeline-integrity diagnostics only;
  this does not establish training readiness, model quality, or deployment
  performance.
- Next action: when approved IN22 archives and isolated `sacrebleu` access are
  available, export references and score exact deployed-baseline predictions;
  otherwise obtain the gated Bodhan license/provenance record or continue
  dependency-free deployment and training-contract work while keeping GPU and
  paid compute off.

### 2026-10-28 autonomous cycle (non-empty training split gate)

- Audited the repository state and selected the highest-priority safe CPU-only
  task after confirming that pinned IN22 files, `sacrebleu`, Lightning, and
  cleared checkpoint licensing remain unavailable. GPU and paid-compute gates
  remain closed.
- Tightened `scripts/check-training-readiness.py` so both supported training
  manifest schemas require positive row counts for train, validation, and test
  splits. An empty split can no longer be reported as structurally ready for a
  later training setup. Removed a duplicate internal result assignment while
  making this change.
- Extended `scripts/test-check-training-readiness.py` with an empty-training-
  split regression case. Validation passed: the targeted readiness harness,
  every repository `scripts/test-*.py` harness, Python compilation, and
  `git diff --check`.
- Evidence class: readiness/input-integrity diagnostics only. The live report
  remains `gpu_gate: NOT READY` because Lightning and `sacrebleu` are absent,
  the model license audit remains research-only, and no valid three-way
  training manifest was supplied. No model/package was downloaded, no
  benchmark metric or deployment measurement was produced, and no GPU or
  paid compute was used. The fixture benchmark retained the known unrelated
  local Pydantic warning about missing `rich`.
- Next action: when approved IN22 archives and isolated `sacrebleu` access are
  available, export references, generate predictions from the exact deployed
  baseline, and run the provenance-preserving evaluator. Otherwise continue
  dependency-free training/deployment contract work while keeping GPU and paid
  compute off.

### 2026-10-28 autonomous cycle (candidate inventory readiness contract)

- Audited the repository state and selected the highest-priority safe CPU-only
  task after confirming that pinned IN22 files, `sacrebleu`, Lightning, and
  cleared checkpoint licensing remain unavailable. GPU and paid-compute gates
  remain closed.
- Strengthened `scripts/check-training-readiness.py` so a candidate inventory
  must contain a non-empty list of candidate objects with nonblank `id` and
  `role` fields. The diagnostic now reports candidate count and entry validity;
  malformed inventories fail closed instead of passing on the top-level key.
- Extended `scripts/test-check-training-readiness.py` with valid-inventory and
  malformed-entry regression coverage. Validation passed: the targeted
  readiness harness, every repository `scripts/test-*.py` harness, Python
  compilation, and `git diff --check`.
- Evidence class: readiness/schema diagnostics only. No model or package was
  downloaded, no benchmark metric or deployment measurement was produced, and
  no GPU or paid compute was used. The fixture benchmark emitted the known
  unrelated local Pydantic warning about missing `rich`.
- Next action: when approved IN22 archives and isolated `sacrebleu` access are
  available, export references, generate predictions from the exact deployed
  baseline, and run the provenance-preserving evaluator. Otherwise continue
  dependency-free contract work while keeping GPU and paid compute off.

### 2026-10-28 autonomous cycle (adapter-aware deployment preflight)

- Audited the repository and selected the highest-priority available CPU-only
  task after confirming that pinned IN22 files and `sacrebleu` remain
  unavailable and the GPU gate is still **NOT READY**.
- Updated `scripts/assess-deployment-feasibility.py` so required local bundles
  are derived from the configured adapters. Mock ASR/translation/TTS adapters
  no longer create false missing-bundle blockers; unknown/non-mock components
  remain conservative and require their configured bundle. The report now
  records `required_bundles` separately from all inspected paths.
- Extended `scripts/test-assess-deployment-feasibility.py` with mixed-adapter
  and fully mocked-pipeline coverage. This is a presence/size preflight only;
  it does not load models or establish quality, latency, RAM, or licensing.
- Validation passed: deployment-feasibility, readiness, training-input, and
  CPU checkpoint contract harnesses; Python compilation; and `git diff --check`.
  No model/package download, benchmark metric, GPU run, or paid compute was
  used.
- Next action: when approved IN22 archives and isolated `sacrebleu` access
  arrive, generate predictions from the exact deployed baseline and run the
  provenance-preserving evaluator. Otherwise continue dependency-free
  Lightning/deployment contract work while keeping GPU and paid compute off.

### 2026-10-28 autonomous cycle (training-input hash enforcement)

- Audited the repository state and selected the highest-priority safe CPU-only
  task after confirming that Lightning, `sacrebleu`, pinned IN22 files, and
  cleared model licensing remain unavailable. No GPU, model/package download,
  network benchmark, or paid compute was used.
- Strengthened `scripts/validate-training-inputs.py` to validate optional
  `manifest.split_sha256` entries against the actual split bytes. Missing,
  malformed, or mismatched declared hashes now fail closed. The report states
  whether declared hashes were checked.
- Extended `scripts/test-validate-training-inputs.py` with a valid hash case
  and a tampered-training-file rejection case.
- Validation passed: the targeted harness, every `scripts/test-*.py` harness,
  Python compilation, and `git diff --check`. The readiness diagnostic still
  reports `NOT READY` with blockers for missing Lightning, missing
  `sacrebleu`, and the research-only model license audit. These are input
  integrity and readiness diagnostics only; no quality or deployment result
  was produced.
- Next action: when approved IN22 archives and isolated `sacrebleu` access
  arrive, export references and score predictions from the exact deployed
  baseline. Otherwise continue the dependency-free CPU training/deployment
  contracts while keeping GPU and paid compute off.

### 2026-10-28 autonomous cycle (license gate in readiness diagnostic)

- Audited the current readiness path after confirming that the pinned IN22
  files, `sacrebleu`, and Lightning remain unavailable. The existing model
  license audit is explicitly a research-only hold, but the checker did not
  surface that hold as a readiness blocker.
- Updated `scripts/check-training-readiness.py` to require and inspect the
  license-audit record. A missing audit or an explicit research-only/not-
  clearance status now blocks readiness. Added a CLI override for isolated
  audit fixtures so the transition can be regression-tested without editing
  the repository audit.
- Validation passed: readiness contract, all `scripts/test-*.py` harnesses,
  Python compilation, and `git diff --check`. The real read-only manifest
  still validates 7,673 train / 412 validation / 426 test rows; the report
  now records blockers for missing Lightning, missing `sacrebleu`, and the
  unresolved model license hold.
- Evidence class: readiness and license-gate diagnostics only. No model or
  package download, benchmark metric, quality result, GPU run, or paid
  compute was produced. The known unrelated local Pydantic warning about
  missing `rich` remained during fixture benchmark execution.
- Next action: obtain approved gated Bodhan access and capture the exact
  accepted license/model-card revision, or when package and benchmark access
  becomes available, run the isolated IN22 export/evaluation path. Keep GPU
  and paid compute off until licensing, evaluation, training, and deployment
  gates are all satisfied.

### 2026-10-28 autonomous cycle (upstream Gemma license audit record)

- Audited the official Google Gemma pages and recorded the result in
  `docs/model-license-audit.md`: Google currently publishes Gemma 4 under an
  Apache 2.0 license and the Gemma terms page explicitly points Gemma 4 to
  that license. The upstream page also requires license/notice preservation
  and modified-file notices for distributed derivatives.
- This does **not** clear `bodhan-ai/indic-translate`: gated checkpoint access,
  the exact accepted Bodhan license version, checkpoint provenance, dataset
  terms, and the treatment of any distilled/synthetic-output student remain
  unresolved. The candidate stays research-only; no weights were downloaded,
  no model was trained, and no GPU or paid compute was used.
- Validation target for this cycle: JSON syntax, documentation links/status,
  all dependency-free regression harnesses, Python compilation, and diff
  whitespace checks.
- Next action: when approved access exists, capture the exact gated Bodhan
  license/model-card revision and provenance; otherwise proceed with the
  blocked-safe baseline evaluator or CPU-only training contract work.
- Validation completed: both inventory files passed `python3 -m json.tool`,
  all repository `scripts/test-*.py` harnesses passed, `python3 -m compileall
  -q scripts` passed, and `git diff --check` passed. The fixture benchmark
  emitted the known unrelated local Pydantic warning about missing `rich`.

### 2026-10-28 autonomous cycle (dependency-free validation audit)

- Re-read `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority matched IN22 baseline remains blocked because
  the pinned benchmark files are unavailable and `sacrebleu` is not
  importable. Lightning is also unavailable, so the GPU gate remains
  **NOT READY**; no model/package download, GPU run, or paid compute was
  attempted.
- Ran every repository `scripts/test-*.py` harness. The benchmark fixture,
  readiness, evaluator-input, offline IN22 exporter, CPU checkpoint,
  human-review, training-input, and deployment-feasibility contracts all
  passed. Python compilation and `git diff --check` also passed.
- The fixture benchmark emitted the known unrelated local Pydantic warning
  about the missing `rich` module. It did not affect the checks. These are
  harness and pipeline-integrity results only: no BLEU/chrF++ score, quality
  result, latency/RAM measurement, or generalization result was produced.
- Next action: when approved IN22 files and isolated `sacrebleu` access are
  available, export the references, generate predictions from the exact
  deployed baseline with provenance, and run the complete evaluator. Until
  then, keep GPU and paid compute off and continue only with dependency-free
  contract work or the pending license audit.

### 2026-10-28 autonomous cycle (legacy manifest fingerprint verification)

- Audited the repository instructions, progress log, Git state, evaluator,
  readiness checker, and CPU-only regression harnesses. The matched IN22
  baseline remains blocked by unavailable pinned benchmark files and missing
  `sacrebleu`; no model/package download, GPU run, or paid compute was used.
- Strengthened `scripts/check-training-readiness.py` so the legacy per-split
  manifest schema now verifies adjacent JSONL file presence, nonblank row
  counts, and SHA-256 fingerprints instead of trusting declared metadata.
  Added regression coverage for matching files and hashes.
- Validation passed: training readiness, evaluator input, offline IN22 export,
  CPU checkpoint smoke, training-input, fixture benchmark, human-review,
  deployment-feasibility, Python compilation, and `git diff --check` checks.
  The fixture benchmark emitted the known unrelated local Pydantic warning
  about missing `rich`.
- Evidence class: training-input integrity and harness diagnostics only. No
  translation metric, quality result, deployment claim, or generalization
  result was produced.
- Next action: when approved IN22 files and isolated `sacrebleu` access arrive,
  generate predictions from the exact deployed baseline and run the complete
  provenance-preserving evaluator. Keep GPU off until licensing, checkpoint,
  training, and deployment gates are satisfied.

### 2026-10-28 autonomous cycle (fixture progress-count regression)

- Audited the repository instructions, progress log, Git state, and current
  benchmark/evaluation harnesses. The matched IN22 baseline remains blocked by
  unavailable pinned benchmark files and missing `sacrebleu`, so the next
  actionable CPU-only item was a fixture-mode correctness check.
- Fixed `scripts/benchmark.py` so progress output uses the loaded fixture
  count rather than the built-in evaluation-sample count. Extended
  `scripts/test-benchmark-fixture.py` to capture stdout and assert the exact
  `[1/1]` progress marker for a one-row fixture.
- Validation passed: fixture benchmark contract, deployment-feasibility
  contract, training-readiness contract, evaluator input contract, CPU
  checkpoint contract, Python compilation, and `git diff --check`. A local
  Pydantic plugin warning about missing `rich` was unrelated to the checks.
- Evidence class: benchmark harness correctness only. No translation metric,
  quality result, model/package download, GPU run, or paid compute was used.
- Next action: when approved IN22 files and isolated `sacrebleu` access arrive,
  generate predictions from the exact deployed baseline and run the complete
  provenance-preserving evaluator. Keep GPU off until licensing, checkpoint,
  training, and deployment gates are satisfied.

### 2026-10-28 autonomous cycle (training split fingerprint contract)

- The pinned IN22 export and isolated `sacrebleu` environment remain
  unavailable, so matched baseline scoring is still blocked; Lightning is
  also absent. No model/package download, GPU run, or paid compute was used.
- Strengthened the CPU-only readiness path: `scripts/split-bitext.py` now
  records SHA-256 fingerprints for `train.jsonl`, `validation.jsonl`, and
  `test.jsonl`; `scripts/check-training-readiness.py` verifies those hashes
  when present while preserving compatibility with the existing counts-only
  manifest. A changed split therefore cannot silently pass a newly generated
  readiness review.
- Added regression coverage for matching split hashes and a tampered-hash
  rejection. Validation passed: readiness, training-input, CPU checkpoint,
  and evaluator contract harnesses; Python compilation; and `git diff
  --check`. The existing read-only manifest still validates its 7,673 / 412 /
  426 counts but has no declared hashes, so the report explicitly records
  `split_hashes_present: false` and `split_hashes_match: null`.
- Evidence class: input-integrity and checkpoint-pipeline diagnostics only;
  no translation metric, quality result, or deployment claim.
- Next action: when approved benchmark files and package access arrive,
  export pinned IN22 references, install `sacrebleu` in isolation, generate
  predictions from the exact deployed baseline, and run the complete
  provenance-preserving evaluator. Keep GPU off until the licensing,
  checkpoint, training, and deployment gates are satisfied.

### 2026-10-28 autonomous cycle (human-review contract)

- Added `scripts/validate-human-review.py` and its regression harness. The
  validator requires complete normalized-source coverage for prediction rows,
  non-empty pseudonymous reviewer identifiers, and ratings in the declared
  1–5 range; it summarizes only judgments that were actually supplied.
- Validation passed: valid-summary, incomplete-coverage rejection, invalid
  rating rejection, Python compilation, and `git diff --check`. No human
  ratings, benchmark metric, model download, GPU run, or paid compute was
  produced.
- Next action: obtain the pinned IN22 references and isolated `sacrebleu`
  environment, generate predictions from the exact deployed baseline, and
  collect documented blinded Telugu review before reporting quality results.

### 2026-10-28 autonomous cycle (speech-grounded benchmark contract)

- Added `--mode fixture --fixture PATH` to `scripts/benchmark.py`. The
  dependency-free fixture schema requires nonempty `audio_path`, `transcript`,
  and `reference_translation` fields, verifies audio files exist, and feeds
  the ASR transcript into translation. The supplied transcript/reference are
  provenance only; no WER, BLEU, chrF++, or human score is computed.
- Added `scripts/test-benchmark-fixture.py` covering valid fixture execution
  and incomplete-row rejection. Existing mock mode remains unchanged and is
  still labelled diagnostic-only.
- Validation passed: fixture contract regression, mock benchmark artifact
  contract (5/5 Telugu-script outputs), Python compilation, and `git diff
  --check`. The benchmark emitted an unrelated local Pydantic plugin warning;
  it did not affect the checks. These are harness diagnostics, not model
  quality or deployment results. No model/package download, GPU run, or paid
  compute was used.
- Next action: when approved speech fixtures and local model bundles are
  available, run fixture mode with the real ASR/MT adapters and separately
  score transcript/prediction files using the pinned evaluation methodology.
  Keep GPU off until the existing licensing, benchmark, training, and
  deployment gates are satisfied.

## Current phase

Candidate and data preparation; GPU training is not ready.

### 2026-10-28 autonomous cycle (evaluation gate retry and offline validation)

- Re-audited `AGENTS.md`, this progress log, the repository inventory, and Git
  state. The highest-priority actionable item remains the matched IN22 baseline
  evaluation.
- Retried the pinned IN22 exporter with its correct positional CLI. The
  Hugging Face request failed closed after bounded retries with DNS resolution
  failure (`Temporary failure in name resolution`); no benchmark archive or
  benchmark text was created. A first exploratory invocation used an invalid
  `--output` option and exited with usage error; no files were modified by it.
- Confirmed `sacrebleu` is not importable (`ModuleNotFoundError`) and
  `lightning` is not installed. The GPU gate therefore remains **NOT READY**;
  no package/model download, GPU run, or paid compute was attempted.
- Validation passed: offline IN22 exporter regression, readiness contract,
  training-input validation, CPU checkpoint save/resume/recovery, evaluator
  input contract, deployment-feasibility contract, Python compilation, and
  `git diff --check`.
- The read-only readiness report validated the real split manifest and row
  counts: 7,673 train / 412 validation / 426 test, with all declared files
  present and matching. This is input-integrity evidence only, not a quality or
  generalization result.
- Next action: when network/package access or approved local archives become
  available, export the pinned IN22 references, install `sacrebleu` in an
  isolated environment, generate predictions from the exact deployed baseline
  with provenance, and run the complete evaluator. Keep GPU off meanwhile.

## Completed with evidence

- [x] Inspected current pipeline: browser uses Whisper base.en, an InferEdge-published q8 Opus-MT ONNX model, and MMS Telugu TTS; API uses Helsinki-NLP opus-mt-en-dra. Browser/native decoding settings differ.
- [x] Authenticated access verified for BPCC, IndicTrans2 distilled 200M, IN22-Conv, and IN22-Gen on 2026-10-28.
- [x] Pinned and downloaded BPCC Daily Telugu English pairs. `scripts/import-bpcc-daily.py` records revision and attribution.
- [x] Implemented exact normalized-source decontamination against pinned IN22-Conv and IN22-Gen English test sources in `scripts/decontaminate-bpcc.py`.
- [x] Measured: 8,511 BPCC Daily rows retained; 0 exact normalized overlaps and 0 duplicate sources. Run manifest and private output: `/tmp/inferedge-data-prep/decontaminated-v1`.
- [x] Reproducible internal 90/5/5 split produced 7,673/412/426; this is not the official external test benchmark.
- [x] Recorded candidate metadata and corpus licensing concerns in `docs/model-candidate-inventory.json` and `docs/corpus-inventory.json`.

## In progress

- [x] Resolve the publicly available portion of Bodhan Indic-Translate's license audit: Hugging Face gating, 7.94B parameters/15.9GB BF16 size, internal-use modification rights, exact-license derivative requirement, attribution, third-party-hosting approval, large-scale threshold, prohibited uses, and upstream-license dependency are recorded. Gated file access and Gemma/upstream terms remain pending.
- [ ] Build a matched baseline evaluator using IN22-Conv/Gen; include chrF++, BLEU with signature, and documented human review for conversational Telugu.
- [ ] Prepare Lightning training code for an attributed compact pretrained derivative; validate CPU imports/data path and checkpoint resume without starting a GPU.
- [ ] Assess inference/export feasibility for laptop and browser deployment before selecting student architecture.
- [ ] Define manuscript outline around measured contribution and ablations.

### 2026-10-28 autonomous cycle (offline benchmark handoff)

- Extended `scripts/export-in22-benchmark.py` with an explicit
  `--archive NAME=PATH` option for locally supplied pinned IN22-Conv and
  IN22-Gen archives. The exporter still validates aligned/nonblank rows,
  writes evaluation-only JSONL, records the pinned repository revision, and
  fingerprints each archive. It now records `archive_source` so a future
  score report distinguishes a local handoff from a Hugging Face download.
- Added `scripts/test-export-in22-benchmark.py`, which creates temporary
  archive fixtures for both benchmark layouts and verifies exported rows,
  evaluation-only metadata, and the archive SHA-256.
- Validation passed: offline exporter regression, evaluator input contract,
  readiness contract, training-input validation, CPU checkpoint recovery,
  Python compilation, and `git diff --check`. No real IN22 text, scoring
  dependency, model download, GPU run, or paid compute was used.
- This advances the handoff path but produces no benchmark metric. The pinned
  archives and `sacrebleu` remain unavailable in the environment.
- Next action: when the pinned archives arrive through an approved channel,
  run the offline exporter, generate predictions from the exact deployed
  baseline with recorded provenance, and execute the complete evaluator.

### 2026-10-28 autonomous cycle (training-manifest row-count integrity)

- Strengthened `scripts/check-training-readiness.py` so the `counts` manifest
  schema now counts nonblank rows in each declared `train.jsonl`,
  `validation.jsonl`, and `test.jsonl` file. A manifest is invalid when its
  declared counts do not match the files, preventing a stale or partial split
  from reaching a later training review.
- Added regression coverage for matching and mismatching row counts in
  `scripts/test-check-training-readiness.py`.
- Validation passed: readiness regression, CPU checkpoint recovery,
  training-input validation, evaluator input validation, Python compilation,
  and `git diff --check`. The real read-only readiness report validated
  7,673/412/426 observed rows against the split manifest. The GPU gate remains
  **NOT READY** because Lightning and sacrebleu are not installed.
- No model/package download, benchmark score, GPU run, or paid compute was
  attempted. The row-count check is integrity evidence only, not model-quality
  or generalization evidence.
- Next action: obtain the pinned IN22 export and an isolated sacrebleu
  environment when external access is available; then generate predictions
  from the actual deployed baseline with explicit provenance and score the
  complete benchmark. Keep GPU off until the remaining licensing, checkpoint,
  training, and deployment gates are satisfied.

### 2026-10-28 autonomous cycle (prediction provenance contract)

- Strengthened `scripts/evaluate-translation.py` so every scoring invocation
  requires `--model-name` and records the exact prediction model/pipeline,
  optional model revision, and pipeline source in the score artifact. The
  evaluator version advanced to `2026-10-28-input-provenance-v2`. This closes
  an audit gap where input files were fingerprinted but the producer of the
  predictions was not identified.
- Updated `docs/benchmark-methodology.md` and the evaluator regression harness
  to document and protect the requirement. No benchmark score was produced:
  `sacrebleu` and the pinned IN22 export remain unavailable.
- Validation passed: evaluator input contract, readiness contract,
  training-input validation, CPU checkpoint recovery, deployment-feasibility
  contract, Python compilation, and `git diff --check`. The readiness report
  validated the real split manifest (`counts` schema; train/validation/test
  files present) but remains `gpu_gate: NOT READY` because Lightning and
  `sacrebleu` are not installed.
- No model/package download, network benchmark, GPU run, or paid compute was
  attempted. This is provenance and pipeline-contract evidence only, not a
  translation-quality result.
- Next action: when external access is available, export the pinned IN22
  references, install the bounded evaluation dependency in isolation, and
  generate predictions from the actual deployed baseline with explicit model
  provenance before scoring. Keep GPU off until the remaining readiness and
  licensing gates are satisfied.

### 2026-10-28 autonomous cycle (training-manifest readiness contract)

- Reconciled `scripts/check-training-readiness.py` with the actual manifest
  emitted by `scripts/split-bitext.py`: the checker now accepts the repository's
  `counts` schema, verifies the train/validation/test split names and
  nonnegative counts, and requires the corresponding JSONL files to exist. The
  previous per-split `{rows, sha256}` fixture remains supported for regression
  coverage.
- Read-only readiness against `/tmp/inferedge-data-prep/daily-splits-v1` now
  reports `schema: counts`, valid split entries, and present split files. The
  only blockers remain missing `lightning` and `sacrebleu`; the GPU gate stays
  **NOT READY**. This does not establish model quality or authorize compute.
- Validation passed: readiness contract regression, real-manifest readiness
  check, training-input validation, CPU checkpoint recovery, evaluator input
  validation, deployment-feasibility regression, Python compilation, and
  `git diff --check`. No package/model download, GPU, or paid compute was used.
- Next action: obtain the pinned IN22 export and an isolated `sacrebleu`
  environment when external access is available; then generate predictions
  from the actual deployed baseline and preserve complete evaluator artifacts.
  Separately install/validate Lightning only after the checkpoint, data,
  attribution, and deployment contracts remain satisfied.

### 2026-10-28 autonomous cycle (evaluation provenance and readiness contract)

- Added immutable input provenance to `scripts/evaluate-translation.py` score
  artifacts: evaluator version, reference/prediction paths, byte counts, row
  counts, and SHA-256 fingerprints, plus the partial-scoring flag. Updated the
  benchmark methodology and regression coverage. This makes future matched
  IN22 score reports auditable without copying benchmark text into training
  artifacts.
- Fixed `scripts/check-training-readiness.py` so an unavailable `sacrebleu`
  installation is included in the reported blocker list. Current read-only
  readiness output remains `gpu_gate: NOT READY`: Lightning and sacrebleu are
  absent, and the supplied `/tmp/inferedge-data-prep/daily-splits-v1/manifest.json`
  does not satisfy the training-manifest schema. The candidate inventory is
  valid. No package/model download, GPU, or paid compute was used.
- Validation passed: evaluator input regression, training-input validation,
  CPU checkpoint recovery, Python compilation, and `git diff --check`. No
  translation metric was produced because the scoring dependency and pinned
  IN22 export remain unavailable.
- Next action: obtain the pinned IN22 export and an isolated `sacrebleu`
  environment when external access is available; then generate predictions
  from the actual deployed baseline and preserve the new provenance fields in
  the complete evaluator artifact. In parallel, reconcile the split-manifest
  schema before any GPU readiness review.

### 2026-10-28 autonomous cycle (deployment preflight)

- Added dependency-free `scripts/assess-deployment-feasibility.py` and its
  regression harness. The preflight resolves configured ASR, MT, and TTS bundle
  paths, reports file/directory sizes, and classifies whether a local bundle
  benchmark can run without loading or downloading models. It explicitly does
  not claim quality, latency, RAM, or licensing evidence.
- Validation passed: the regression harness, Python compilation, JSON artifact
  assertions, and `git diff --check`. The repository preflight artifact at
  `/tmp/vaayuedge-deployment-preflight.json` found 4 missing bundles and 0.0 MB
  of discovered model data, so the real local benchmark remains unavailable.
  No model download, GPU, or paid compute was used.
- Collaborator availability was checked: AGY 1.4.9 and Claude Code 2.1.310
  are installed; previously recorded sandbox/log and Claude quota blockers mean
  no collaborator output was used as evidence.
- Next action: when model bundles become available, rerun the preflight and
  only then run the real ASR/MT timing path; independently obtain the pinned
  IN22 files and isolated `sacrebleu` environment before reporting quality.

### 2026-10-28 autonomous cycle (readiness recheck)

- Audited `AGENTS.md`, this progress log, the current Git state, and the
  evaluation/training harnesses. The GPU gate remains **NOT READY**: local
  `sacrebleu` and Lightning are unavailable, the pinned IN22 export is not
  present, and Bodhan model files/upstream Gemma terms remain gated. No model
  or package download, GPU run, or paid compute was attempted.
- Validation passed: `scripts/test-validate-training-inputs.py`,
  `scripts/test-train-cpu-smoke.py`, and
  `scripts/test-evaluate-translation.py`; Python compilation and
  `git diff --check` also passed.
- The supported mock deployment benchmark completed and wrote
  `/tmp/vaayuedge-current-cycle.json`: 5/5 Telugu-script outputs, 12.21 ms
  mean mock pipeline latency, and 48.88 MB sampled peak RSS. This is harness
  diagnostic evidence only; it is not translation quality, neural latency,
  TTS, or deployment-readiness evidence. The run emitted only an unrelated
  local Pydantic plugin warning.
- Next action: obtain the pinned IN22 files and isolated `sacrebleu` install
  when external access is available; then generate predictions from the
  actual deployed baseline and run the complete evaluator with artifact and
  signature capture. Until then, continue CPU-only contract work and do not
  open the GPU gate.

### 2026-10-28 autonomous cycle (benchmark evidence classification)

- Audited the deployment benchmark's evidence boundary. The `real` mode loads
  real ASR/MT adapters when local model bundles exist, but the runner uses
  synthetic tone audio, translates fixed text rather than ASR output, and uses
  `MockTTSAdapter`. Updated `scripts/benchmark.py` to emit these four explicit
  limitations and classify real-mode output as `partial local ASR/MT timing;
  synthetic audio, fixed text, and mock TTS`; updated
  `docs/benchmark-methodology.md` to match. This prevents partial timing from
  being reported as end-to-end neural quality or TTS evidence.
- Validation passed: `python3 -m py_compile scripts/benchmark.py`, supported
  mock benchmark execution, JSON field assertions, and `git diff --check`.
  The fresh mock artifact at `/tmp/vaayuedge-cycle-benchmark.json` reported
  5/5 Telugu-script outputs, 11.85 ms mean mock pipeline latency, and 48.84 MB
  sampled peak RSS. These remain harness diagnostics only; no model-quality
  metric, GPU, network download, or paid compute was used.
- Next action: when dependencies and benchmark files become available, add a
  speech-grounded benchmark path with transcript/reference inputs and a
  non-mock TTS bundle; keep the current partial mode clearly labelled until
  then.

### 2026-10-28 autonomous cycle (environment and web validation)

- Re-audited the repository and confirmed the GPU gate remains **NOT READY**:
  `sacrebleu`, Lightning, and the pinned IN22 benchmark export are still
  unavailable locally. No package download, model download, GPU, or paid
  compute was attempted.
- Validation passed for the dependency-free model-development checks:
  `scripts/test-validate-training-inputs.py`,
  `scripts/test-train-cpu-smoke.py`, and
  `scripts/test-evaluate-translation.py`; all Python sources compiled and
  `git diff --check` passed. These checks establish input/checkpoint
  contracts only, not translation quality.
- Validation also passed for the web client: `npm test -- --run` reported
  3/3 test files and 8/8 tests passing; `npm run build` completed with
  TypeScript checking and a production Vite bundle. This is application
  regression evidence, not model or deployment-quality evidence.
- Available local packages were checked: PyTorch, Transformers, and psutil
  are present; `sacrebleu`, Lightning, and Datasets are absent. The existing
  isolated-install DNS failure remains the blocker for the evaluation metric.

### 2026-10-28 autonomous cycle (validation audit)

- Re-ran the dependency-free readiness checks after auditing the current
  repository state: `scripts/test-validate-training-inputs.py`,
  `scripts/test-train-cpu-smoke.py`, and `scripts/test-evaluate-translation.py`
  all passed. All Python scripts and API tests compiled, and `git diff --check`
  passed.
- Re-ran the supported mock deployment benchmark and validated its JSON
  artifact at `/tmp/vaayuedge-cycle-benchmark.json`: 5/5 Telugu-script outputs,
  12.00 ms mean mock pipeline latency, and 48.81 MB sampled peak RSS. This is
  harness diagnostic evidence only; it is not neural-model quality, real
  inference latency, or deployment-readiness evidence.
- An initial invocation used an unsupported `--samples` option and failed
  closed; the supported command (`--mode mock --output`) succeeded. No source
  change was needed. `sacrebleu` remains unavailable, so no translation metric
  was produced. No GPU, network download, or paid compute was used.
- Collaborator availability was checked: AGY 1.4.9 and Claude Code 2.1.310
  are installed. Existing sandbox/log and Claude quota blockers remain; no
  collaborator output was used as evidence.

### 2026-10-28 autonomous cycle (deployment/cache audit)

- Rechecked the highest-priority evaluation prerequisites. `sacrebleu` and
  `lightning` are still unavailable in the active Python environment. A
  read-only Hugging Face cache inspection found cached artifacts for unrelated
  models, but no verified local Whisper base.en or Helsinki-NLP
  opus-mt-en-dra bundle; therefore no real neural benchmark was attempted and
  no download was initiated.
- Ran the supported mock deployment benchmark and asserted its JSON artifact:
  5/5 Telugu-script outputs, 11.75 ms mean mock pipeline latency, and 48.86 MB
  sampled peak RSS. This is harness diagnostic evidence only, explicitly
  labelled `mock diagnostic; not a model quality result`; it is not a claim
  about neural-model latency, translation quality, or deployment readiness.
- Validation passed: `scripts/test-validate-training-inputs.py`,
  `scripts/test-train-cpu-smoke.py`, `scripts/test-evaluate-translation.py`,
  Python compilation for all scripts, and `git diff --check`. No GPU, network
  download, benchmark metric, or paid compute was used.

### 2026-10-28 autonomous cycle (evaluation artifact path)

- Added `--output PATH` to `scripts/evaluate-translation.py`. A successful
  scoring run now writes the same indented JSON report to a durable artifact
  path as well as stdout, including an explicit `evidence_class` distinguishing
  complete benchmark scores from exploratory partial scores. The option creates
  only the requested parent directory and does not copy benchmark text into
  training artifacts.
- Added a regression check that the new CLI option is exposed by help output.
  Validation passed: evaluator input harness, CPU checkpoint harness,
  training-input harness, Python compilation, and `git diff --check`.
- Re-ran the five-sample mock benchmark and JSON assertions successfully. The
  artifact reported 5/5 Telugu-script outputs, 11.95 ms mean mock pipeline
  latency, and 48.86 MB sampled peak RSS; these remain harness diagnostics and
  are not model-quality or neural-latency evidence.
- No `sacrebleu` package, IN22 benchmark export, GPU, or paid compute was used.

### 2026-10-28 autonomous cycle (deployment benchmark contract)

- Corrected the benchmark documentation/CLI mismatch: the supported modes are
  `real` and `mock`; the documented smoke command now uses
  `python3 scripts/benchmark.py --mode mock --output ...`.
- Extended `scripts/benchmark.py` with sampled peak RSS measurement and an
  optional JSON artifact containing latency, Telugu-script count, memory, and
  an explicit evidence classification. Mock results are labelled diagnostic
  only and are not model-quality or neural-latency evidence.
- Validation: `python3 -m py_compile scripts/benchmark.py`, mock benchmark
  execution over 5 samples, JSON parsing and field assertions, and
  `git diff --check` passed. Observed mock diagnostics were 11.39 ms mean
  pipeline latency, 48.91 MB sampled peak RSS, and 5/5 Telugu-script outputs;
  these values are harness diagnostics, not competitive results. No model
  download, GPU, or paid compute was used.

### 2026-10-28 autonomous cycle (training-input readiness)

- Added dependency-free `scripts/validate-training-inputs.py` and its regression
  harness. It validates the existing split manifest, required nonblank JSONL
  fields, NFC-normalized/case-folded source uniqueness within and across
  splits, row-count agreement, and per-split SHA-256 fingerprints. It is an
  input-integrity check only; it does not establish model quality, licensing,
  or benchmark generalization.
- Validation against `/tmp/inferedge-data-prep/daily-splits-v1` passed: 8,511
  total rows with 7,673 train / 412 validation / 426 test and 8,511 unique
  normalized sources. The generated report was written to
  `/tmp/vaayuedge-training-input-report.json`; no repository training data was
  copied or modified.
- Regression validation passed for the new checker, evaluator input checks,
  and CPU checkpoint recovery; all Python scripts compiled and `git diff
  --check` passed. `lightning` is not installed locally, so no Lightning
  import or training dry-run was claimed. No GPU, network download, or paid
  compute was used.

### 2026-10-28 autonomous cycle (continued)

- Attempted the highest-priority evaluation dependency path in a fresh isolated
  virtual environment. `sacrebleu>=2.4,<3` could not be installed because the
  environment cannot resolve the package index (`Temporary failure in name
  resolution`); no metric or benchmark result was produced. The pinned IN22
  exporter remains help-valid, but no benchmark files were fetched.
- Hardened `scripts/evaluate-translation.py` so malformed JSON and blank
  reference targets fail closed before scoring. Empty predictions remain
  allowed as explicit model failures for category-level counting. Extended
  `scripts/test-evaluate-translation.py` for these contracts. Validation:
  both evaluator and CPU checkpoint harnesses passed, all touched Python
  scripts compiled, the empty-prediction preservation check passed, and
  `git diff --check` passed. This is input-validation evidence only; no
  translation metric was recorded.
- Collaborator availability check: `agy --version` reported 1.4.9 and
  `claude --version` reported 2.1.310. No collaborator output was used as
  evidence: AGY's previously recorded sandbox log/listener restriction and
  Claude's weekly limit remain in force.

- Extended `scripts/test-evaluate-translation.py` with a subprocess-level
  regression check that incomplete prediction coverage fails closed before
  importing `sacrebleu`. This protects the distinction between missing
  benchmark rows and a missing scoring dependency. Validation: evaluator and
  CPU checkpoint regression harnesses passed, both evaluator scripts compiled,
  `git diff --check` passed, and the local import check confirmed
  `sacrebleu` remains unavailable. No benchmark prediction, translation
  metric, GPU, or paid compute was used.

- Hardened `scripts/train_cpu_smoke.py` checkpoint handling: it now validates
  required fields and smoke-only provenance before loading, rejects stale
  `--epochs` requests instead of falling through with no training loss, and
  creates missing checkpoint parent directories. Added
  `scripts/test-train-cpu-smoke.py` covering first-run save, resume, nested
  checkpoint paths, and stale-resume rejection. Validation: both smoke and
  evaluator regression harnesses passed, all scripts compiled, and
  `git diff --check` passed. This is pipeline evidence only; no model quality
  result, GPU run, or paid compute was involved.

- Strengthened `scripts/test-train-cpu-smoke.py` checkpoint recovery coverage:
  a one-epoch save followed by resume through epoch 2 is now compared against
  an uninterrupted two-epoch run for exact vocabulary, model-tensor, and
  optimizer-state equality. Validation: the checkpoint harness, evaluator
  boundary harness, Python compilation, and `git diff --check` all passed.
  This is deterministic CPU pipeline evidence only; no model quality result,
  GPU run, or paid compute was involved.

- Added `scripts/train_cpu_smoke.py`, a CPU-only character-level GRU smoke runner. It validates nonempty JSONL bitext, builds a deterministic vocabulary, saves a checkpoint with provenance, and resumes optimizer/model state from an existing checkpoint. This is pipeline evidence only; it is not a pretrained derivative, translation baseline, or quality result.
- Validation: Python compilation, a two-row CPU fixture, first run through epoch 1, checkpoint reload/resume through epoch 2, checkpoint epoch/provenance assertions, and `git diff --check` all passed. The fixture reported validation losses 2.3304 (epoch 1) and 1.9406 (epoch 2); these are smoke-test diagnostics and must not be compared with benchmark metrics. No GPU, network, or paid compute was used.

### 2026-10-28 autonomous cycle

- Audited Bodhan `indic-translate` using the current Hugging Face model card and canonical Bodhan-AI GitHub license text. Evidence: model card reports 7.94B parameters, 15.9GB BF16 weights, gated contact-information access, and official Transformers usage; the license grants internal fine-tuning/distillation/quantization but requires attribution, exact-license carry-through for distributed derivatives, prior approval for most third-party hosting, and independent upstream-term review. Updated `docs/model-candidate-inventory.json`; candidate remains research-only and is not a low-memory student selection.
- Validation: `python3 -m json.tool docs/model-candidate-inventory.json` and Python compilation passed. The evaluator's one-row fixture still fails closed with the explicit `sacrebleu` installation message. An isolated `/tmp/vaayuedge-eval-venv` install attempt failed because package-index DNS is unavailable; no score was recorded. No GPU or paid compute was used.
- Collaborator check: AGY and Claude binaries are present. AGY's bounded read-only review could not start because the sandbox denied its log writes and localhost listener; no collaborator output was treated as evidence. Claude was not invoked because AGY failure was environmental and the primary audit was independently completed from authoritative sources.

- Diagnosed the API test hang: `services/api/tests/conftest.py` used
  `setdefault`, allowing exported production adapter settings to win before
  router import constructed adapters. Changed the fixture to force all three
  adapters to `mock`; direct import validation now reports `mock mock mock`.
- Validation: pytest collection succeeds with 10 tests. Full request execution
  remains blocked in this environment: both `TestClient.get('/health')` and a
  mock-adapter Uvicorn process start but never complete/accept the request;
  bounded runs were stopped after 8–20 seconds. This is an environment/runtime
  blocker, not a passing test result.
- Evaluation dependency remains unavailable locally: `sacrebleu` import fails;
  no benchmark score was recorded. No GPU or paid compute was used.
- Hardened `scripts/evaluate-translation.py`: final scoring now fails closed on
  missing/extra prediction rows unless `--allow-partial` is explicit; reports
  `complete_coverage`; rejects blank or normalized-empty sources. Validation:
  `python3 -m py_compile scripts/evaluate-translation.py` and CLI help passed.
  No metric was recorded because `sacrebleu` is still unavailable.
- Added `scripts/export-in22-benchmark.py` to fetch pinned IN22-Conv and
  IN22-Gen test references into a fresh evaluation-only directory. It checks
  aligned/nonblank rows and writes a revision/hash manifest; it does not write
  training artifacts. Validation: Python compilation passed; export remains
  pending network/file availability. No metric was recorded.
- Export attempt on 2026-10-28: the pinned Hugging Face request failed with
  `Temporary failure in name resolution` after five retries (bounded exit
  124). No benchmark text or score was produced.

## Next priority queue

1. Obtain/verify gated Bodhan file access and audit Gemma-4-E4B-it/upstream terms before any training, redistribution, or hosted-service decision; keep the model research-only meanwhile.
2. Install the declared evaluation dependency in an isolated environment, generate baseline predictions from pinned IN22 files, and run the now-hardened evaluator; do not claim metrics until this succeeds.
3. Build and dry-run a CPU-only Lightning data/model setup against a tiny fixture; test save/resume behavior.
4. Establish device-memory and latency measurement scripts for current model and selected candidate.

## Blocked

- Samanantar distribution has CC-BY-NC-4.0 metadata while upstream summaries describe some underlying mined corpora as CC0. Do not use it commercially without artifact-level rights resolution.
- Local PyArrow installation has an ABI mismatch. Continue using pinned TSV where possible; isolate dependencies rather than changing global packages.
- AGY CLI attempt required interactive command permission and was denied in headless mode. Claude reported weekly limit; retry later, but proceed independently.
- Bodhan model files remain gated behind contact-information sharing. Public license text was independently reviewed from the canonical Bodhan-AI GitHub repository on 2026-10-28; this does not substitute for gated file access or upstream Gemma license review.
- The AGY CLI was available but could not start a bounded review in this sandbox: it attempted to write logs under `/home/ravivarma/.gemini` and open a localhost listener, both denied. No collaborator output was used as evidence.
- `sacrebleu` is not installed in the current environment. The evaluator's scoring path was exercised with a one-row fixture and stopped with an explicit install message; no metric was recorded.
- ML dependency declaration now includes `sacrebleu>=2.4,<3`, matching the evaluator's required scoring library. The environment still lacks the package, so no benchmark metric was recorded.
- API pytest validation was attempted with the mock adapters; the run produced no output after 60 seconds and was interrupted. This is an environment/test-run blocker, not evidence of passing or failing tests.
- API test isolation was corrected to override exported adapter settings, but request-level validation still hangs after the fix; investigate the local Starlette/AnyIO or sandbox networking runtime before claiming API tests pass.
- Follow-up diagnosis: `timeout 15s pytest -q tests/test_api.py::test_health_endpoint -vv -s` collects the test but hangs at the request; direct `get_health()` returns a valid response. A minimal FastAPI app and an `httpx.AsyncClient` using `ASGITransport` also hang on a request in the same environment, so this is not evidence against the VaayuEdge adapters or route implementation. No API test was counted as passing.
- Added `scripts/test-evaluate-translation.py`, a dependency-free regression harness for normalized-source joining and duplicate-source rejection. Validation: `python3 -m py_compile scripts/evaluate-translation.py scripts/test-evaluate-translation.py`, harness execution, JSON validation, and `git diff --check` all passed. It deliberately does not exercise BLEU/chrF++ and records no metric.
- Extended `scripts/test-evaluate-translation.py` with regression coverage for empty prediction files (coverage remains incomplete) and blank/whitespace-only sources. Validation: both evaluator scripts compile, the harness passes, and `git diff --check` passes. This remains input-validation evidence only; no translation metric was recorded.
- The CPU training smoke path is now validated, but the Lightning/pretrained-derivative path remains unimplemented. `scripts/train_cpu_smoke.py` is intentionally too small to support model selection or deployment claims; it should be replaced or extended only after the candidate, license, and data decisions are complete.

## GPU readiness

### 2026-10-28 autonomous cycle (checkpoint integrity)

- Hardened `scripts/train_cpu_smoke.py` checkpoint persistence: each checkpoint
  is written to a per-process temporary file and atomically replaced into
  place, preventing an interrupted save from leaving a partially written
  resume artifact. Loader errors from malformed/truncated files now fail
  closed with the existing invalid-checkpoint diagnostic.
- Extended `scripts/test-train-cpu-smoke.py` with a truncated-checkpoint
  regression case. Validation passed: CPU checkpoint save/resume and exact
  resumed-vs-uninterrupted state comparison, malformed-checkpoint rejection,
  training-input validation, evaluator input validation, Python compilation,
  and `git diff --check`.
- This is deterministic CPU pipeline-safety evidence only. It is not a
  pretrained derivative, translation-quality result, deployment benchmark,
  GPU run, or paid-compute result. No model/data download was attempted.
- Next action remains to obtain/verify gated Bodhan file access and upstream
  Gemma terms, or if access remains unavailable, install the declared
  evaluation dependency in an isolated environment and run the pinned IN22
  baseline when benchmark files are available.


- [x] Dataset access
- [x] Initial exact-overlap decontamination
- [ ] Final training corpus and licensing audited
- [ ] Baseline evaluation reproducible
- [ ] Training code validated
- [ ] Checkpoint recovery tested
- [ ] Deployment feasibility validated
- [ ] GPU budget and bounded experiment documented

Status: **NOT READY — keep GPU off.**

## Evidence table

| Work | Result | Reproducible | Artifact |
|---|---|---|---|
| BPCC Daily import | 8,512 raw rows at pinned revision | Yes | `scripts/import-bpcc-daily.py` |
| Initial cleaning | 8,511 retained | Yes | `scripts/prepare-bitext.py` |
| IN22 exact overlap | 0 overlap, 0 duplicate sources | Yes | `scripts/decontaminate-bpcc.py` |
| Internal split | 7,673 train / 412 validation / 426 test | Yes | `scripts/split-bitext.py` |
| Evaluation harness | Added deterministic normalized-source join, BLEU signature, chrF++, row counts, category empty-output counts, and fail-closed coverage checks | Syntax/help validated; metric run pending `sacrebleu` and benchmark predictions | `scripts/evaluate-translation.py` |
| Evaluation dependency alignment | Declared bounded `sacrebleu` dependency for ML/evaluation environment | `requirements-ml.txt` updated; local import unavailable | `services/api/requirements-ml.txt` |

## Next autonomous action

Retry the declared evaluation dependency and pinned IN22 export only when
network/package access is available; then generate baseline predictions and
run `scripts/evaluate-translation.py`. Until then, continue the dependency-
free work by isolating the host-level ASGI request hang and documenting the
CPU-only Lightning setup contract without installing or starting GPU work.
Separately, obtain gated Bodhan files and verify exact Gemma-4-E4B-it/upstream
terms before any training, redistribution, or hosted-service decision. Do not
start GPU or paid compute.

### 2026-10-28 autonomous cycle (training gate diagnostic)

- Added `scripts/check-training-readiness.py`, a read-only, dependency-free
  readiness report. It checks whether Lightning is importable and whether the
  candidate inventory and optional training manifest have the expected shape;
  it does not download, import a model, allocate a GPU, or alter the gate.
- Added `scripts/test-check-training-readiness.py` to assert the report schema
  and explicit diagnostic evidence class.
- Validation passed: readiness contract harness, Python compilation, and
  `git diff --check`. The current report remains **NOT READY** because
  Lightning is not installed; no package or model download, GPU run, or paid
  compute was attempted.
- Next action: when package/network access is available, install the bounded
  ML environment in isolation and rerun this diagnostic alongside the existing
  CPU checkpoint harness before writing a Lightning training entry point.

### 2026-10-28 autonomous cycle (manifest readiness contract)

- Strengthened `scripts/check-training-readiness.py`: when a training manifest
  is supplied, the read-only diagnostic now requires `train`, `validation`,
  and `test` split entries, nonnegative integer row counts, and 64-character
  SHA-256 fingerprints. This prevents a structurally incomplete manifest from
  being mistaken for training readiness; it does not verify model quality,
  licensing, or benchmark generalization.
- Added regression coverage for a valid three-way manifest and a missing
  manifest in `scripts/test-check-training-readiness.py`.
- Validation passed: readiness contract, training-input validation, CPU
  checkpoint recovery, evaluator input validation, deployment-feasibility
  contract, Python compilation, and `git diff --check`. The active report
  remains `NOT READY` because Lightning is not installed; no package/model
  download, network benchmark, GPU run, or paid compute was used.
- Next action: when package/network access is available, install the bounded
  ML environment in isolation and add the dependency-guarded Lightning data
  module against the validated split manifest; until then, retry the pinned
  IN22 export/evaluation dependency path and keep GPU off.

### 2026-10-28 autonomous cycle (full local gate audit)

- Re-read `AGENTS.md`, this progress log, repository inventory, and Git state.
  The highest-priority actionable local work was a complete dependency-free
  gate audit while pinned IN22 access, `sacrebleu`, Lightning, model bundles,
  and cleared Bodhan/Gemma terms remain unavailable. GPU and paid-compute
  gates remain closed.
- Ran all 11 repository `scripts/test-*.py` harnesses successfully, compiled
  the Python scripts and API package, and passed `git diff --check`. The only
  warning was the known unavailable `rich` Pydantic plugin.
- Readiness evidence from `/tmp/vaayuedge-readiness.json`: `gpu_gate: NOT
  READY`, blocked by missing Lightning, missing `sacrebleu`, and the
  research-only model-license hold. Deployment preflight found all four
  configured real bundles missing and reported
  `ready_for_local_bundle_benchmark: false`.
- The mock benchmark completed five samples with 13.26 ms mean pipeline time,
  but its artifact is explicitly `mock diagnostic; not a model quality result`
  and uses fixed text, synthetic audio, and mock adapters. No benchmark score,
  model inference result, GPU run, or paid compute was produced.
- Next action: when approved package/network access exists, install the
  bounded evaluation dependency in isolation, export pinned IN22 references,
  and generate exact deployed-baseline predictions before scoring. In
  parallel, obtain gated Bodhan files and verify exact upstream Gemma terms.
  Keep GPU off until every documented readiness gate passes.

### Direct work: manuscript scaffold and recovery hold

Created docs/manuscript-outline.md with observed baseline scores, pilot limitations and the specific missing experiments. It is an unpublished outline, not a finished paper. Browser artifact recovery remains unavailable on retry; no new compute or duplicate training was started. Next priority remains saving/recovering Kaggle outputs and establishing the session's current compute state, then evaluating the pilot export with the prepared local-export evaluator.

### Browser recovery — 2026-10-28 22:53 IST

Resetting the browser tool restored notebook access. The reopened authenticated notebook shows Draft Session off; GPU is therefore not currently running. Saved cell output still records all 100 optimizer steps, validation loss and export manifest path. Durable model files remain unverified: retained cell logs alone do not establish that working-directory files survived session shutdown. Next action: inspect notebook versions and output directory without rerunning training; recover/download if present. Recovery tab retained for next direct work cycle.

### Kaggle preservation audit — 2026-10-28 23:03 IST

Recovered browser control via fresh runtime again. Version History explicitly displays Starting Fresh with no saved versions. Expanding /kaggle/working in the stopped draft displays no files. Pilot logs survive but no recoverable checkpoint has been located. Do not claim weights were preserved. Before any replacement run, use an output-preserving committed notebook run and verify resulting downloadable files, so a browser interruption cannot leave preservation unfinished. GPU remains off; no rerun started in this audit.

### Saved Kaggle rerun verified

Version 1, scriptVersionId 363252210, completed successfully in 111.5 seconds total. Saved output page lists final.ckpt, last.ckpt, model.safetensors and tokenizer/config files plus manifests (11 files). GPU log explicitly says GPU available: True (cuda), used: True; TPU available: False. Training loop: 100/100 steps in about 24 seconds; validation loss 2.789006471633911. Output preservation is now verified in saved Kaggle version, superseding prior missing-artifact status. URL: https://www.kaggle.com/code/ravivarmapatturi/inferedge-english-telugu-training/output?scriptVersionId=363252210 . Screenshot: artifacts/kaggle-saved-pilot.png . Local downloads and hash verification pending. This is a short pilot, not one full epoch or a quality-validated model.

### Paper benchmark execution initiated

User prioritized checkpoint benchmarking for the paper. Download of committed Kaggle output version 363252210 initiated through authenticated browser. Direct local evaluation job scripts/benchmark-saved-pilot.py is running (exec session 8132): waits for the in-progress archive, verifies all saved manifest sizes/hashes, preserves references, then sequentially generates complete Conv/Gen predictions and BLEU/chrF reports using matched settings. Log: artifacts/pilot-benchmark-job.log. Results directory: artifacts/pilot-benchmark-v1. No metrics yet; no additional GPU compute. Do not start a duplicate evaluation job. This is a direct data-processing job, not a Codex continuation runner.

### Complete pilot benchmark and PDF draft — 2026-10-29

Local Kaggle archive integrity verification succeeded and both complete benchmark reports are saved under artifacts/pilot-benchmark-v1. Pilot: Conv BLEU 3.879240437710464, chrF++ 27.150355616378018 (1,503 rows); Gen BLEU 2.0128111256379952, chrF++ 19.986450692418202 (1,024 rows), zero missing/extra/empty predictions. Relative to recorded baseline, tiny Conv BLEU increase accompanies lower chrF++; general quality regresses substantially. Do not claim an improved model or deploy this checkpoint. Next: verify baseline pairing, diagnose mode warning and translation errors, quantify uncertainty before further training.

Created requested three-page research PDF at output/pdf/inferedge-english-telugu-research-draft.pdf. Includes measured results, protocol, provenance, limitations and references; authorship pending and not submitted. Rendered all three pages with system Poppler and visually inspected them. No new GPU training or public publication.

### Competitor comparison completed on official released predictions — 2026-10-29

Verified exact paired source order, reference SHA-256, score signatures and baseline/pilot prediction hashes. Retrieved pinned AI4Bharat translation_outputs archive, verified its English and Telugu references equal our benchmark rows exactly, and rescored seven external systems on both Conv and Gen. External predictions were released by upstream, not generated locally; no modern service-version claim. Results and limitations: docs/benchmark-comparison-results.md; full evidence: artifacts/competitor-comparison/official-rescored.json and comparison.json. Pilot ranks 8/9 Conv and 9/9 Gen by chrF++ in this restricted set. Sarvam matched inference and independent edge benchmarks remain unfinished; no superiority or publication-readiness claim. No GPU or paid compute used.

### Direct trainer-mode diagnosis — 2026-10-29

Recovered export loads with training=False. Verified explicit train() makes training=True and eval() restores False, without optimizer steps. Updated future trainer to explicitly enter training mode on attachment and each training epoch, and fail if training_step encounters eval mode. Compilation and actual local checkpoint mode-transition probe passed; evidence docs/evidence/trainer-mode-audit.json. This resolves an ambiguity exposed by pilot logs, but does not prove the cause of regression or improve the existing saved model. No new GPU training. Next: proper paired uncertainty and error diagnostics, then compare compact IndicTrans2 before selecting next training configuration.

### Improvement diagnosis and implementation — 2026-10-29

Ran tokenizer/data and paired sentence-error audit. Gen: 726 worse / 291 better; Conv: 684 worse / 655 better by sentence chrF++. Zero training targets over 128 tokens; median 12. Saved review queues and summary under docs/evidence/pilot-error-audit. Added gradient accumulation, warmup/linear decay and periodic validation to future trainer, with manifest binding; compilation, existing resume-contract tests and diff checks pass. End-to-end runtime validation of new features pending. Plan docs/model-improvement-plan.md separates measured findings, hypotheses, architecture comparison, controlled training, teacher rights, independent final-test needs and edge-performance acceptance. No GPU run or superiority claim.

### Compact IndicTrans2 benchmark started directly — 2026-10-29

Downloaded pinned 200M candidate SafeTensors/model code, inspected imports/file operations, and recorded source hashes in docs/evidence/indictrans2-code-review.json. Prepared separate /tmp/inferedge-indic-env with Transformers 4.51.3 and IndicTransToolkit 1.1.1; imports pass. Direct benchmark process (exec session 69519) loaded 211,776,512 parameters and produced first eight Conv predictions successfully. Scripts benchmark-indictrans2.py/start-indictrans2-benchmark.py run actual CPU inference with batch-persisted predictions, exact reference checks, pinned language preprocessing, three beams/max length256, sampled process RSS and batch timing. Log artifacts/indictrans2-benchmark-job.log; outputs artifacts/indictrans2-benchmark. Do not start a duplicate job. Both Conv and Gen scores are pending; no new GPU or paid compute and no Codex continuation runner.

### Compact IndicTrans2 full conversational benchmark — 2026-10-29

Direct pinned 211.8M candidate inference completed all 1,503 IN22-Conv rows: BLEU 13.05997209910534, chrF++ 44.67100614062819, complete coverage and zero missing/extra predictions. This is actual local inference with pinned toolkit and three-beam settings, distinct from the earlier official released-output comparison. It substantially exceeds pilot 3.879/27.150 and native Opus baseline 3.852/28.367 on this benchmark. General benchmark remains active (132/1,024 at checkpoint); do not interrupt or start duplicate inference. No adapted IndicTrans model or superiority over the field is established.

### Compact IndicTrans2 evaluation completed — 2026-10-29

Actual pinned CPU inference completed both complete test sets: Conv BLEU 13.05997209910534 / chrF++ 44.67100614062819; Gen BLEU 18.207419913813354 / chrF++ 51.43634600903732. All 1,503/1,024 rows matched without missing/extra predictions. Local compact candidate clearly exceeds current adapted Opus pilot in these observed scores, supporting architecture change. It is upstream, unadapted IndicTrans2, not an InferEdge-trained win. Runtime summary saved to docs/evidence/indictrans2-runtime-summary.json with sampled process RSS and batch timings; no comparable speed/energy advantage established. Full evidence artifacts/indictrans2-benchmark. Next priority: validation-driven adaptation protocol and a validated Lightning data path using IndicTransToolkit (including script normalization) before GPU; quantify paired uncertainty, reserve fresh independent final evaluation, and measure equivalent device workloads. No automatic new GPU run.

### IndicTrans2 training-data preparation validated — 2026-10-29

No model benchmark or training worker was active. Implemented scripts/prepare-indictrans2-training.py using the pinned tokenizer and IndicTransToolkit's official is_target=True pathway for Telugu targets, with inference=False (no inference entity placeholder lifecycle). Processed all 7,673/412/426 existing train/validation/test rows into separate encoded files. No empty encodings or source/target sequences over 256 tokens. Source and encoding hashes captured in artifacts/indictrans2-training-prepared/manifest.json. This is CPU preprocessing evidence, not trained model quality. Next: independently verify target normalization/roundtrip and padding/label masking, implement the Lightning collator/model path, then CPU forward/backward/resume checks and validation-based checkpoint selection before a bounded Kaggle run. GPU stays off. Existing externally inspected IN22 results must not become training targets or an unbiased final-test claim.

### Real compact IndicTrans2 training-path probe passed — 2026-10-29

Prepared isolated Indic environment to resolve Lightning 2.6.6 / Torch2.6CPU while retaining Transformers4.51.3. Added scripts/probe-indictrans2-training.py and ran actual pinned 211.8M model with two prepared training rows, upstream-style left input padding, attention masking and -100 target padding. Finite forward loss and finite gradients across 766 tensors verified; explicit training mode and variable-length label masking exercised. Probe forward/backward took ~2.73 seconds on CPU. Evidence docs/evidence/indictrans2-training-probe.json. Zero optimizer updates, no checkpoint quality claim, no GPU. Next: encapsulate collator in Lightning path, test optimizer checkpoint/resume and generation-based validation selection before bounded free Kaggle adaptation; old benchmark timings remain tied to prior environment versions.

### IndicTrans2 Lightning path implemented; CPU recovery probe active

Added scripts/train-indictrans2-lightning.py: pinned local model/tokenizer, hash-checked encoded splits, explicit mode, left-padded inputs and masked labels, validation-loss checkpoint callback, immutable resume configuration, final checkpoint/export. Actual one-step CPU fixture probe started (session50226), reports 519 modules in train mode and reached max_steps1. Checkpoint/export completion remains pending; do not duplicate it. Warning: the short fit did not produce val_loss before fit-end checkpoint selection; revise periodic-validation scheduling before any real adaptation. Final explicit validation/export still processing. No GPU or paid compute. Next: verify complete result artifacts, enforce mid-fit validation, then resume to step2 and capture optimizer recovery evidence.

### Lightning validation scheduling fixed; recovery check started

Previous CPU fixture finished one real optimizer step, explicit validation (two fixture rows; loss0.543868899345398), final checkpoint and export. This diagnostic loss is not full-validation quality. Corrected scheduling to validate during fit (every batch for fixtures, every100 batches for actual data), so monitored best-loss checkpoint sees val_loss; interval is bound into run config. Started clean v2 one-step save followed by explicit resume to step2 (session96605), log artifacts/indictrans2-lightning-recovery.log. Do not launch duplicates. Runtime completion pending; no GPU or production adaptation. Next: confirm checkpoint callbacks and optimizer restoration, assess exact mid-epoch data recovery caveat, and select adaptation schedule using held-out validation before free Kaggle use.

### CPU recovery memory failure and bounded retry

V2 full-parameter CPU save/resume probe exited137 (process killed) after writing a 2.4GiB best checkpoint; no final result or resume completion. Treat memory pressure as suspected, not kernel-confirmed OOM. Host only7.2GiB RAM; do not repeat full optimizer serialization unchanged. Added explicit --probe-last-layer-only (frozen model except final decoder layer) solely for low-memory recovery diagnostics, bound into resume config. last.ckpt now links to best checkpoint to avoid redundant writes. Started v3 one-step save then resume2 under that restricted diagnostic setting, session76975/log artifacts/indictrans2-lightning-recovery-v3.log. This does not validate full-parameter optimizer recovery or train a production candidate. GPU remains off. Next: inspect complete recovery artifacts and plan accelerator validation with measured memory budget if needed.

### Restricted recovery passes; data-order recovery corrected

V3 last-decoder-layer-only CPU diagnostic saved/exported and restored optimizer/model state to global step2. Two-row fixture val loss0.54239845 is a diagnostic, not generalization evidence. Lightning warns that the standard shuffled DataLoader cannot resume mid-epoch reliably, so step2 completion alone is not exact recovery evidence. Replaced future training loaders with torchdata0.11 StatefulDataLoader and bound the loader version into run manifests (old checkpoints are intentionally incompatible). Focused shuffled-order save/restore check confirms identical remaining batches; evidence docs/evidence/stateful-dataloader-recovery.json. Full Lightning integration and full-parameter recovery still require validation. No new GPU compute or production-model quality claim.

### Stateful Lightning integration recovery check active

Started v4 restricted-parameter CPU one-step save and explicit resume2 using actual StatefulDataLoader (session48956; artifacts/indictrans2-stateful-recovery.log). Model initialized with519 training-mode modules; completion pending. Do not duplicate worker or alter its run configuration. AGY CLI available; dispatched bounded60-second read-only review of the training script and improvement plan without permission bypass (artifacts/agy-training-review.txt). Existing Claude weekly-limit context retained; collaborator must not block main work. No GPU adaptation or superiority claim.

### Stateful integration succeeds; AGY critique incorporated

V4 restricted CPU Lightning save/resume completed step2 with a best checkpoint at epoch0-step2; two-row diagnostic loss0.5422270. This validates execution/restore for the restricted probe but not bitwise equality or full-parameter recovery. AGY's bounded review returned two substantive findings before timeout: final export ignored best-loss checkpoint, and teacher-forced loss cannot establish autoregressive translation quality. Independently verified export flaw in source and fixed future trainer to require a selected checkpoint, reload its weights via memory-mapped local checkpoint, validate it and export that model. Result metadata now distinguishes final vs selected validation. Compilation passes; new export branch runtime check pending. Generation-based validation remains necessary before scaled training. No GPU or quality improvement claim.

### Best-checkpoint export runtime passes; generation validation active

V5 restricted CPU test completed with selected checkpoint reload, revalidation and SafeTensors/tokenizer export. result.json explicitly records export_is_final_checkpoint=false and matching selected/final two-row diagnostic loss. No full-parameter quality claim. Implemented scripts/validate-indictrans2-generation.py: deterministic32-row sample exclusively from internal validation, actual Telugu preprocessing/postprocessing, three-beam generation, BLEU/chrF signatures, output length ratio and prediction preservation. Started paired baseline vs restricted one-step probe validation (session28833), log artifacts/indic-validation-generation.log; no IN22 used for selection. The adapted probe is only two training rows, not a candidate model or benchmark improvement experiment. Next: inspect generation-path equivalence and completeness, then plan a bounded real-data adaptation and independent retention validation; do not duplicate active workers.

### User-priority website search visibility work

Authenticated Search Console confirms home and product indexed. Brand queries collide with inferedge.com and Tata Vayu Edge. Shipped three substantive standalone company/edge/product guides, brand structured data and internal links in commit ad2bd77; deploy run40900599467 success, all new URLs HTTP200. Google accepted updated sitemap and shows5 discovered URLs (previously2). Product-guide indexing request undergoing Google live check. Evidence and limitations: docs/seo/search-console-audit-2026-10-29.md. No instant ranking or50-query coverage claimed. Model generation evaluation previously completed base32sample (BLEU21.65557/chrF57.3689) but adapted local export failed because custom Python files/auto_map are not self-contained; repair portable export before further training.

### Portable export repair underway

No active training/generation process found. Reproduced export metadata referencing upstream remote custom-code paths instead of packaging reviewed code. Repair will bundle only SHA256-verified pinned custom Python, localize auto_map, remove stale absolute tokenizer paths, preserve upstream model card attribution and write an export hash manifest. Verify reload in fresh offline Hugging Face cache and then run internal generation; no GPU enabled. AGY/Claude executable availability checked; recent bounded AGY critique already incorporated, Claude previously limited.

### Export reload diagnosis refined

Bundled reviewed source hashes and localized auto_map; fresh offline cache now loads code/tokenizer without upstream resolution. Actual generation then exposed a second upstream serialization issue: safe export omits lm_head.weight, but custom tie_weights copies FROM lm_head into decoder embeddings, leaving decoder embedding meta after loading. Added preservation of equal decoder/lm_head tensors in SafeTensors (no parameter edits), followed by regenerated manifest. Retesting32-row generation in session56180; no GPU. Existing source export preserved separately, portable copy uses independent config files and atomic weight replacement. SEO sitemap and product-guide indexing request both accepted; new page not claimed indexed yet.

### Portable offline generation verified

Repaired export completed32 internal-validation sentences with HF_HUB_OFFLINE and a fresh HF_HOME: BLEU21.65556988, chrF++57.36891572, zero empty outputs. 32/32 predictions identical to upstream baseline; tiny restricted two-row adaptation shows no measured gain. Two export blockers fixed: missing local custom code and missing serialized lm_head causing meta decoder embeddings. Trainer now invokes packager automatically; generation validator rejects remaining meta parameters early. Evidence: artifacts/indic-validation-portable-v6/metrics.json and docs/evidence/portable-export-manifest-check.json. No GPU used. Next: validate full-parameter recovery within memory budget, define real-data bounded adaptation with generation retention gates; do not release probe as competitive model.

### Internal generation retention gate implementation

The repaired export is only a two-row recovery probe, not a quality candidate. Next actionable preparation: a strict paired internal-validation gate that verifies identical dataset fingerprint, ordered examples, decoding settings and metric signatures; requires the complete412-row internal validation for readiness; reports relative chrF++ and empty/length regressions without consuming IN22 for tuning. Targets defined before future adaptation: chrF++ delta at least0, no new empty outputs, output/reference length ratio within10% of baseline. Passing this internal gate does not authorize production; separate external quality and device/runtime gates remain required. No full-parameter laptop run launched with only2.9GiB available RAM; previous kill137 remains unresolved for that configuration.

### Internal retention gate validated

Implemented scripts/compare-internal-validation.py with paired source/target ordering, split fingerprint, decoding/signature checks and independently recomputed chrF++. Actual32-row probe reproduces baseline exactly (delta0); gate correctly refuses readiness because complete412-row validation is absent. Negative checks reject fabricated chrF and mismatched beam settings. Report: docs/evidence/indic-portable-retention-v6.json. Export evidence status corrected to completed32/32. Next: expand genuine baseline internal validation to412 and use it unchanged for a bounded adaptation comparison; full-parameter recovery remains necessary before GPU work. No paid compute, GPU, production replacement or publication performed.

### Full internal baseline validation starting

No active model worker found. Starting CPU-only412-row generation baseline from pinned IndicTrans2 using unchanged deterministic sampling and decoding, output artifacts/indic-validation-base-full-v1. This consumes only internal validation, not external tests, and no GPU. It establishes a complete retention comparator for future adaptation. Preserve the active worker across heartbeat cycles and do not launch duplicates. Recent AGY critique applied; checking current CLI options for a bounded review of the newly added export/retention scripts.

### Complete internal baseline available

Pinned unadapted IndicTrans2 completed all412 internal validation examples on CPU: BLEU21.34070359, chrF++54.16978391, zero empty outputs, output/reference character ratio1.023030; generation383.52s (not individual request latency). Files artifacts/indic-validation-base-full-v1. Retention gate now checks actual validation bytes and deterministic ordered membership rather than trusting report fingerprints alone. Full baseline self-comparison passes; this is a gate consistency check, not an adapted model result. AGY45-second review timed out without actionable output; no helper work left active. Next: full-parameter recovery and bounded real-data adaptation; no GPU enabled or quality advantage claimed.

### Evaluation provenance hardening

Next action: record evaluator/source-code and local export manifest fingerprints plus actual library versions in future generation reports. Existing completed412-row baseline is retained unchanged as historical evidence; its generic small-subset limitation wording is inaccurate for full validation and will be corrected in future reports. This does not turn internal validation into external-test evidence. No active worker or GPU session started.

Future generation reports now preserve Python/platform, CPU thread count, Torch/Transformers/IndicTransToolkit/SacreBLEU/SafeTensors versions, evaluator SHA256, and local export manifest hash. Compilation passes. Historical full baseline was not retroactively assigned unmeasured environment values. Remaining actionable training prerequisite is full-parameter recovery under a viable memory budget; export portability and complete internal baseline are now available.

### CPU INT8 feasibility experiment

While full-parameter recovery awaits a viable memory budget, advance the edge deployment objective independently: run a bounded32-row internal-validation experiment applying PyTorch dynamic INT8 to linear layers of pinned IndicTrans2. This is an inference transformation of the unadapted upstream baseline, not our trained model. Preserve identical preprocessing/decoding, separate output evidence, record actual quantized layer count and runtime; do not claim phone/browser support or memory/latency improvement without measurements. No GPU compute.

Started CPU dynamic-INT8 validation worker session90822, log artifacts/indic-validation-int8-v1.log. No duplicate worker should be launched. Script compiles; quantization runtime and quality remain pending. Previous AGY review timed out with no content; helpers are not blocking this experiment.

### CPU INT8 pilot measured

Dynamic INT8 quantized289 linear layers and generated32 internal examples in9.0688s (generation only, excludes load/quantization). BLEU21.01619488, chrF++56.41883636, zero empty outputs; relative to32-row FP32 baseline chrF++ delta -0.95007936. Gate correctly rejects readiness (quality regression and incomplete sample). No controlled speedup or memory claim: earlier FP32 run used different timing context. Next run FP32 with identical current evaluator/environment to produce a paired runtime comparison; then expand INT8 validation if useful. This is upstream inference feasibility, not InferEdge-trained quality progress.

Paired current-evaluator FP32 worker active as session90288; output artifacts/indic-validation-fp32-paired-v1, log matching .log. Do not duplicate. INT832-row retention report saved docs/evidence/indic-int8-retention-v1.json;24/32 predictions unchanged,8 changed. Any speed estimate remains single-run exploratory until repeated controlled measurements and memory profiling.

### Paired FP32/INT8 timing available

Same evaluator hash, package versions, CPU threads and32-row inputs: FP32 generation19.8702s vs dynamic INT89.0688s, observed single-run ratio2.191. This is exploratory, excludes load/quantization and is not repeated benchmark/peak memory or phone evidence. Quality loss remains -0.9501chrF++; unapproved. No active worker; expanding INT8 to complete412 internal examples to characterize retention, not tune on IN22.

Full internal INT8 validation active session86575; artifacts/indic-validation-int8-full-v1.log. Preserve worker and inspect on next cycle. Existing base-full-v1 is the412-row comparator; future gate should verify exact ordered examples and reproduce chrF from predictions. No GPU or paid compute started.

### Full INT8 retention measured; selective experiment predefined

All412 internal validation rows completed: dynamic INT8 BLEU20.88754882, chrF++53.65336067 vs FP32 chrF++54.16978391 (delta -0.51642324); zero empty outputs. Strict retention gate fails. Generation135.63s excludes loading/quantization; historical full FP32 timing is not a controlled matched repeat. Next single predefined hypothesis: keep output lm_head in FP32 while quantizing remaining linear layers, because output-logit perturbations can alter beam choices. Test only on internal validation, record actual quantized layer count; no superiority or phone readiness claim. No active workers found; no GPU enabled.

Selective full412-row CPU worker session47015 active; artifacts/indic-validation-int8-selective-full-v1.log. Do not duplicate. Full all-linear INT8 report docs/evidence/indic-int8-full-retention-v1.json preserves256/412 identical predictions and the quality rejection. Training recovery and owned-model adaptation remain unfinished; this inference experiment is parallel prerequisite work, not a substitute claim of completion.

### Selective INT8 hypothesis rejected; return to adaptation recovery

Excluding lm_head quantized288 layers but reduced full internal chrF++ to53.16875445 (FP32 delta -1.00102946), worse than all-linear INT8. Zero empty outputs; generation255.73s excludes preparation and is not a controlled comparison. Both tested INT8 variants fail strict quality retention; stop expanding this family for now. Prioritize portable CPU recovery bundle for a higher-memory free environment, keeping GPU off until full-parameter save/resume succeeds. Laptop available RAM previously2.9GiB and full-parameter kill137 make another identical run unjustified. The bundle must contain only explicit code/data/provenance allowlist, no tokens, caches, model weights or personal data.

Created and verified artifacts/indictrans2-cpu-recovery-bundle.zip with explicit code/data/provenance allowlist and per-file SHA256 manifest. Excludes held-out test, tokens, caches and model weights. RECOVERY.md gives full-parameter CPU one-step/resume-two commands without frozen-layer shortcut, pinned upstream revision/dependencies and explicit GPU-off requirement. Archive integrity and every included hash verified; summary docs/evidence/indictrans2-recovery-bundle.json. Execution in higher-memory free environment remains pending; bundle creation is not recovery success.

### Kaggle CPU recovery environment inspection

Browser-authenticated Kaggle editor reachable again; draft session explicitly off, existing saved Opus pilot and input dataset intact. Accelerator menu exposes None and GPU T4x2; selected None without running a cell. No recovery code uploaded or compute started yet. Browser tab retained for next direct cycle. Kaggle CLI absent locally, so browser upload is the available path. Next: upload allowlisted recovery ZIP as private input, prepare a separate CPU-only recovery notebook cell, verify accelerator None and use committed run for persistent outputs. Do not rerun the existing Opus GPU cell or overwrite its saved results.

### Recovery bundle uploaded to Kaggle private input

Uploaded only the verified364,553-byte allowlisted ZIP through authenticated Kaggle dataset upload. Explicit visibility displayed Private; dataset title InferEdge IndicTrans2 CPU Recovery20261030, proposed URL https://www.kaggle.com/datasets/ravivarmapatturi/inferedge-indictrans2-cpu-recovery-20261030 . Create submitted; processing confirmation pending. No cell executed; draft remains off. Existing saved Opus pilot retained. Next: verify private input created/attached, add separate CPU-only recovery cell and ensure committed CPU run excludes legacy GPU cell.

Kaggle displayed "Success! Your dataset was created successfully." Private input creation confirmed, no compute started. Screenshot capture timed out; textual UI confirmation retained here, do not claim a screenshot artifact. Notebook tab retained for CPU recovery setup next cycle.

### Committed CPU recovery submitted

Private recovery dataset attached successfully in Kaggle editor. Replaced only notebook draft cell with scripts/kaggle-indic-cpu-recovery-cell.py; historical saved version1 retains prior Opus run. Verified Session options Accelerator None, Internet on. Save Version dialog explicitly selected Save & Run All (Commit), Run without an accelerator for this session. Submitted named IndicTrans2 full-parameter CPU recovery; UI Committing. This runs one-step then resume-two CPU fixtures with900s subprocess budgets; no GPU enabled. Dependencies/input hashes/pinned model download run before actual training; no claim optimizer has started yet. Model access may require existing HF authorization in Kaggle; failure is redacted, never embeds credentials. Inspect committed run outcome next cycle and preserve outputs.

### CPU recovery v2 failed before training; credential-free fallback

Committed Kaggle version2 id363609890 failed after49.8s at pinned upstream snapshot download, before any optimizer steps. Input hashes/copy stage succeeded. Kaggle Secrets panel explicitly No secrets added; do not request or embed a token unnecessarily. Existing authorized local pinned upstream snapshot can instead be uploaded as a private model input with provenance and reviewed code, allowing offline recovery without credentials. Prepare explicit allowlisted snapshot archive; do not include HF cache metadata, account files or tokens. GPU stays off. Failure page https://www.kaggle.com/code/ravivarmapatturi/inferedge-english-telugu-training?scriptVersionId=363609890 . Dependency warnings also indicate shared Kaggle image conflicts; future setup should use an isolated environment.

### Private offline snapshot upload active

Prepared1.11GB explicit pinned snapshot archive with per-file hashes (docs/evidence/indictrans2-offline-snapshot.json), including upstream weights/code/config/tokenizer and README attribution only. Upload to Kaggle private dataset IndicTrans2 Pinned Upstream Private Recovery active,7% observed. Proposed dataset URL https://www.kaggle.com/datasets/ravivarmapatturi/indictrans2-pinned-upstream-private-recovery . No Create submitted yet; preserve upload tab. CPU recovery cell locally updated to verify private snapshot bytes, populate exact pinned HF cache and set offline flags without credentials; compiled successfully. Not yet pasted/submitted. Continue upload then use revised cell; no optimizer/GPU run underway.

### Offline input upload completed; dataset creation pending

Kaggle1.11GB upload reached completed file state (Remove file replaces progress); visibility remained Private. Submitted Create for IndicTrans2 Pinned Upstream Private Recovery; processing pending, no model run active. Revised local CPU cell now creates isolated venv with system Torch access, installs pinned training dependencies there and launches trainer with that interpreter, avoiding replacing notebook-wide Transformers. Syntax verified. Next: confirm private dataset attached, replace draft with updated offline cell, commit CPU-only recovery again. No credentials transmitted or GPU started.

Kaggle confirms "Your dataset is being created", progress46, platform estimate15minutes. Treat estimate as Kaggle's, not guaranteed. Processing is active; do not duplicate uploads/dataset creation or start a run before input availability. Continue on next heartbeat.

### Offline CPU recovery version3 submitted

Kaggle confirmed private offline dataset successfully created and attached (IndicTrans2 Pinned Upstream Private Recovery). Updated draft uses verified snapshot files, exact pinned cache layout, offline Hub flags and isolated training venv. Accelerator None visibly verified; Save & Run All dialog again explicitly Run without an accelerator. Submitted version3 named Offline full-parameter CPU recovery. Pending setup/optimizer outcome; do not claim recovery or training success from submission. No credentials used, no GPU enabled. Inspect version3 result next cycle, preserve failure details or checkpoints; never duplicate an active run.

### Kaggle v3 environment bootstrap failure fixed

Version3 id363619409 failed before model load/training: system Python3.13 ensurepip is unavailable during venv creation (22.1s runtime). Offline datasets are attached and ready; no model-access error reached. Changed venv creation to --without-pip --system-site-packages so the isolated interpreter uses available system pip without calling missing ensurepip. Syntax verified; submit corrected CPU-only version4, keep existing versions/evidence intact. This fixes a concrete environment issue; no optimizer success or GPU use claimed.

Corrected version4 submitted with explicit Save & Run All without accelerator; UI Committing. CPU fixture outcome pending. Check this run before making more changes or launching duplicates. Old Opus logs visible in draft are stale outputs, not evidence of this new recovery. No user access action required while the bootstrap alternative is being tested.

### Full-parameter CPU checkpoint recovery succeeds

Kaggle committed version4 id363621478 successful,271.4s total run. Verified saved output:211M trainable parameters,519 modules in train mode; GPU availableFalse/usedFalse. Completed optimizer step1, saved checkpoint, fresh subprocess logs Restored all states from checkpoint and completed step2, exported selected weights. This resolves execution/recovery blocking prerequisite for full parameters on higher-memory free CPU. Two-row fixture losses0.54374170 (step1),0.54516333 (step2) are diagnostic only, not quality improvement or deterministic trajectory proof. Output reports500files because venv/cache are under working: next runs must keep dependencies/cache under /tmp and save only model/results to working, to avoid bloated retained outputs. Evidence docs/evidence/kaggle-cpu-recovery-v4-ui.txt; URL https://www.kaggle.com/code/ravivarmapatturi/inferedge-english-telugu-training?scriptVersionId=363621478 . Next: inspect/retain targeted checkpoints/result metadata, verify offline export, investigate best-checkpoint selection across resume, then bounded real-data adaptation with full412 internal generation gate. No GPU training has started.

### Checkpoint-selection evidence improvement

Recovery succeeded, but current result metadata hardcodes export_is_final_checkpoint=false even when selected and final steps coincide. Correct reporting must record selected checkpoint step, best callback score and explicit validation-best policy, and compare selected vs final steps rather than infer a distinct checkpoint. Add these fields before the next real-data run; no new training or GPU session yet. Keep previous recovery artifact history unchanged.

Trainer now records selected checkpoint global_step, best callback score, validation_best policy and correctly computed selected-step/final-step equality. Compilation passes; this metadata change is not yet exercised in a new training run. Existing local restricted recovery final checkpoint callback state inspected independently; next cycle should inspect successful Kaggle result.json before concluding cross-resume best-checkpoint behavior. Main adaptation remains pending, no production release.

### Real-data CPU adaptation pilot prepared

Defined docs/indictrans2-adaptation-pilot-plan.md before any new results:100full-parameter optimizer steps, batch2, AdamW2e-6 on7673train rows, followed by all412 internal generation examples and existing no-regression gate. Free Kaggle CPU first, GPU-hours0; estimated10–30minutes with explicit1800s train/900s evaluation bounds. Not full epoch, no external test tuning, no deployment/release approval. Built and verified allowlisted adaptation-bundle-v2 containing current metadata-fixed trainer, portable export helper, generation evaluator, strict comparator and raw internal validation; no held-out test or credentials. Summary docs/evidence/indictrans2-adaptation-bundle-v2.json. Next: upload updated private bundle and execute bounded CPU pilot using existing pinned model input; first inspect recovery selected-checkpoint metadata as practical.

### Updated adaptation input submitted; execution cell prepared

Uploaded verified393,594-byte adaptation bundle v2 privately and submitted dataset Create (InferEdge IndicTrans2 Adaptation Bundle v2). No compute active. Prepared scripts/kaggle-indic-adaptation-cell.py: selects updated manifest explicitly, hash-verifies code/data and pinned model, places environment/cache/source under /tmp,100CPU optimizer steps with1800s bound then412internal generation with900s bound. Installs pinned IndicTransToolkit/SacreBLEU for actual generation, no fixture flag, no test tuning. Syntax check passes. Next verify dataset attached, install this draft cell and commit CPU-only pilot; training has not started yet.

### Real-data CPU pilot version5 submitted

Private adaptation bundle v2 created and attached successfully. Draft now contains bounded real-data CPU adaptation100steps,batch2,lr2e-6,full7673train split, followed by all412internal generation. Verified AcceleratorNone and Save & Run All without accelerator. Submitted version5 named IndicTrans2 real-data CPU100 plus validation, UI Committing. No optimizer-start claim until logs confirm. Automatic training/evaluation subprocess bounds1800s/900s; no GPU quota used. Preserve this committed run; do not duplicate workers. Next check package installation and actual optimizer progress, then validation evidence.

### Real-data optimizer phase completed; generation active

Kaggle version5 running, approximately8minutes displayed. Crucially current committed-run progress button says "Optimizer run completed; starting complete internal validation generation". This is current worker progress, separate from stale Opus cell output. Bounded100-step real-data CPU optimizer subprocess therefore returned successfully;412-row internal generation phase active, final scores pending. AcceleratorNone verified. Preserve worker, no duplicate tasks/reruns. Evidence docs/evidence/kaggle-adaptation-v5-running-ui.txt. Next collect committed completion, selected checkpoint/result/metrics/predictions, reproduce retention gate and report actual quality; do not infer superiority from optimizer completion.

### Real-data pilot completes with preliminary validation gain

Kaggle version5 id363628232 successful,708.0s total.211M parameters trained100steps on CPU; val loss1.47858274; selected export generated all412internal examples. Displayed metrics: BLEU22.75452314 vs base21.34070359; chrF++55.07216595 vs base54.16978391, delta0.90238204; zero empty outputs. This is preliminary internal validation, not external competitor superiority; base ran Torch2.6/Python3.12 while Kaggle used Torch2.11/Python3.13, so same-environment control still needed. UI evidence docs/evidence/kaggle-adaptation-v5-completed-ui.txt; extracted displayed report docs/evidence/indic-adaptation-v5-observed-metrics.json. Output lists20savedfiles including checkpoints/export and validation. Next download raw predictions/checkpoint metadata, reproduce strict paired gate, preserve actual artifact hashes, run same-environment baseline before attributing gain solely to adaptation. No GPU used or public release/production replacement.

### Local artifact download blocked; cloud-side verification alternative

Kaggle individual prediction Download opened a new storage tab rather than emitting supported download event; local Downloads had no prediction file. Output actions > Download output navigated to /code/svzip/363628232 and browser visibly blocked it (ERR_BLOCKED_BY_CLIENT, page blocked by ChatGPT). Do not bypass browser restrictions or claim files downloaded. Original committed20-file artifacts remain in Kaggle. Continue via supported Kaggle notebook-output input: attach version5 outputs to a CPU verification run, recompute paired metrics from retained prediction files and run upstream baseline in identical environment; save small verification reports in committed output. No need retrain pilot or request credentials. Preserve version5 checkpoint and prohibit duplicate adaptation runs pending verification.

Prepared scripts/kaggle-indic-controlled-verification-cell.py (syntax verified): no optimizer calls; consumes retained version5 predictions from attached notebook output, runs412-row unadapted baseline in current Kaggle environment, and recomputes strict chrF gate from actual stored predictions.900s generation/120s comparison bounds, CPU-only. Attach version5 output before committing; refuse if absent. This is a supported cloud-side artifact verification path, not a bypass of blocked browser downloads.

### Retained pilot output private dataset processing

Used Kaggle supported Output actions > New dataset for successful version5 (363628232), titled InferEdge IndicTrans2 Adaptation v5 Retained. Visibility Private verified before Create. Kaggle reports dataset being created,5% and platform estimate30minutes (not a guarantee). Contains18 training/checkpoint/export files6.19GB plus2validation files206.12kB. Destination https://www.kaggle.com/datasets/ravivarmapatturi/inferedge-indictrans2-adaptation-v5-retained . No duplicate training or GPU launched. Editor notebook input search returned zero for self-notebook; private dataset supports explicit cloud-side reuse. Next cycle confirm processing completion, attach retained dataset with existing v2 code and pinned upstream inputs, then submit CPU controlled verification cell. Do not restart adaptation.

### Controlled CPU verification version6 submitted

Retained v5 private dataset creation confirmed Success. Attached it to original notebook using exact confirmed dataset URL (title search returned zero; URL lookup found1 result). Existing adaptation-bundle-v2 and pinned upstream inputs retained. Replaced draft cell with scripts/kaggle-indic-controlled-verification-cell.py, no optimizer calls. Save & Run All (Commit), Run without an accelerator explicitly selected; submitted named Controlled CPU baseline and saved pilot verification, UI Committing. Preserves v5 training artifact while generating412-row upstream baseline and independently rescoring saved candidate predictions. Expected GPU-hours0. Next inspect v6 status/logs; no duplicate training. A passing gate is internal validation evidence only and does not establish external competitor superiority.

### Same-environment pilot improvement verified

Kaggle version6 id363634942 completed successfully318.6s CPU, no optimizer. Upstream baseline all412 examples in matching Python3.13.15/Torch2.11.0+cpu/Transformers4.51.3/Toolkit1.1.1/SacreBLEU2.6 produced BLEU21.3407035887,chrF++54.1697839116 (same scores as local). Strict comparator independently recomputed candidate scores from retained v5 predictions, confirmed source/reference membership and data hash; internal gate PASSED, delta chrF++0.9023820391,288/412 predictions unchanged. Adapted candidate55.0721659507chrF++,22.7545231380BLEU. Zero extra empty outputs and relative output length within10%. Evidence docs/evidence/kaggle-controlled-verification-v6-ui.txt and UI-extracted structured report docs/evidence/indic-controlled-verification-v6.json;3raw output files retained in Kaggle. This verifies internal validation improvement, not statistical significance, external superiority or production readiness. Next: freeze this checkpoint and run held-out426 internal test plus IN22 external evaluation with raw paired predictions and uncertainty; native Telugu review and edge memory/runtime gates still outstanding. No further tuning on held-out test.

### Frozen-checkpoint held-out evaluation preparation

Freeze v5 export manifest5235276b82864e619e7868d374bfc4acaa21b204c8cf2f99addbf347c6575515 before test access. Prepare separate held-out inference evaluator and explicit data bundle for426 BPCC test,1503 IN22-Conv and1024 IN22-Gen. No training calls, no hyperparameter changes in response to test results; report each split separately. Verify export bytes against manifest before executing reviewed custom code. Paired upstream/candidate inference uses identical decoding. CPU only, expectedGPU-hours0; external run launch pending bundle attachment.

Prepared scripts/evaluate-frozen-indictrans2.py and allowlisted artifacts/indictrans2-heldout-evaluation-v1.zip; compilation/archive integrity checks pass. Evaluator requires complete known split size, frozen v5 manifest identity and per-file hashes before model loading. No new inference or training submitted this cycle. Next attach held-out bundle and run paired baseline/candidate CPU inference; existing validation evidence remains immutable. Helper CLI paths present; Claude previously limited and AGY prior bounded attempt timed out, neither blocks preparation.

Uploaded302735-byte held-out bundle via Kaggle private New Dataset; Create submitted for InferEdge Frozen IndicTrans2 Heldout Evaluation v1. Confirm creation/attachment before execution. Prepared scripts/kaggle-indic-heldout-cell.py: verifies bundle and frozen export, runs base/adapted on426/1503/1024 rows separately,3600s per-process bounds; no optimization. CPU total estimate1–3hours (estimate only),GPU-hours0. No results claimed.

Browser connection became unavailable when checking dataset completion; no held-out worker was submitted and no active run was interrupted. Resume by reconnecting existing Kaggle editor, confirming dataset success, then installing held-out cell. Do not treat queued heartbeat messages as completed work or training progress.

### Frozen held-out benchmark version7 submitted

Confirmed private held-out dataset available (5files) and attached. Installed scripts/kaggle-indic-heldout-cell.py; Save & Run All Commit without accelerator explicitly verified. UI Committing for Frozen v5 paired held-out benchmarks CPU. Runs baseline/adapted separately on426 BPCC test,1503 IN22-Conv,1024 IN22-Gen; no optimizer. Check current committed version before any rerun. ExpectedGPU-hours0, CPU estimate1–3hours. Dataset/export hash checks precede inference. Submission is not inference completion; next inspect actual progress and save paired raw outputs, then uncertainty and error analysis without test-driven tuning. Existing v5 retained untouched. Editor tab9 marked for continuation.

Version7 current worker confirmed Running (9minutes displayed), progress validated292/426. This proves held-out inference is active, not final completion or a score. Preserved worker/editor tab9; no rerun, training, GPU or interruption. Next heartbeat inspect committed completion or failure before taking further compute action.

00:29Z heartbeat: version7 Running29minutes, current pass584/1503. Count resets across base/adapted/splits, so do not infer regression or total percentage from per-pass counts. Worker retained without duplicate launch. Final per-split scores pending.

### Held-out benchmark completes with mixed generalization

Version7 id363645611 Successful5569.5seconds (1h32m49s),12metrics/prediction outputs retained. All6base/adapted passes complete in same CPU environment; frozen export hash verified before loading. BPCC426test chrF53.6451→54.6040 (+0.9589),BLEU19.9198→21.5296. IN22-Conv1503 chrF44.6710→44.8902 (+0.2192),BLEU13.0600→13.5208. IN22-Gen1024 chrF51.4335→51.3796 (-0.0540),BLEU18.2014→18.2476. Zero empty outputs. Mixed results, no universal superiority or production approval. Evidence docs/frozen-v5-heldout-results.md and docs/evidence/indic-heldout-v7-observed.json, source UI retained. Next independently rescore raw paired predictions and estimate uncertainty; preserve this test evidence without test-driven tuning, then native review/device profiling and manuscript update. No GPU or retraining used.

### Paired uncertainty analysis implemented

Added scripts/analyze-heldout-pairs.py: requires full ordered corpus match, data fingerprint, same decoding/environment/evaluator/base revision and frozen v5 identity; independently recomputes BLEU/chrF signatures and values before paired sentence bootstrap of corpus chrF deltas (1000seeded resamples,95%percentile intervals). Explicit exploratory/no multiplicity adjustment limitation. Synthetic self-pair yields[0,0]; altered BLEU report correctly rejected; compilation passes. These are analysis-code checks, not empirical uncertainty results. Next cloud-side access retained version7 predictions (supported output→private dataset), attach analysis script and run bounded rescore/bootstrap without model inference/retraining. No compute run started this cycle.

### Raw held-out bootstrap analysis submitted

Used committed v7 Output actions > Create notebook (supported Kaggle workflow) to attach original notebook output directly, preserving original v7 and v5 model dataset. New private notebook https://www.kaggle.com/code/ravivarmapatturi/notebookf5fe5882da/edit (tab10). Added independent held-out corpus dataset and installed scripts/kaggle-heldout-analysis-cell.py, containing tested analysis function; no model loading/inference/optimizer. Submitted Save & Run All without accelerator, Frozen v7 raw rescore and paired bootstrap, UI Committing. Each split1000paired corpus chrF bootstrap replicates; raw BLEU/chrF/signature/hash verification precedes analysis. GPU-hours0. Next inspect actual completion and intervals; input may resolve latest output version, assertions require full frozen-v5 pairs and matching corpus rather than trusting attachment label. No confidence intervals claimed yet.

02:09Z heartbeat: paired analysis notebook version1 remains Running; do not duplicate or interrupt. First completed split printed BPCC426 raw-verified chrF delta0.9589347666 with exploratory1000-resample percentile95% interval[0.3809923978,1.6154849731]. Prediction SHA256 baseline2f45874387e8b5d1a0b38f5b6d8c064143ff75bf181222a09e2b94e5cc3e963b; candidate22076b5605e8a9e23f488d0d8079a6eaf6767cec7903914b31e90888053e3a8c. This is interim UI evidence, not full analysis completion; IN22 intervals pending. Active worker and tab10 preserved, GPU off, no new training. Next collect all completed reports and update manuscript after successful full run.

02:19Z heartbeat: analysis version1 Running18minutes. IN22-Conv raw-rescored1503 pairs completed1000 bootstrap replicates: chrF delta0.21915069073804716, exploratory95%percentile interval[0.01731978869401729,0.41139274744700316]. Prediction hashes baseaa185d3937a6cbf23a594dada5bd20b6f1b7fb63d47032f22274596152f1cd82; candidate749a8047bb8635997474b61dfd8775902381ffcad5846944011f8d9a13dc4752. General-domain interval pending; no completed-run or multiplicity-adjusted significance claim. Preserved active CPU worker without duplicate work; next collect all reports on successful completion.

### Full paired rescore and uncertainty complete

02:39Z: analysis run363664956 Successful2241.4seconds CPU; three reports saved in Kaggle and UI-extracted evidence docs/evidence/indic-heldout-uncertainty-v1.json. Independently rescored all2953 paired examples against complete hashed references and metric signatures before bootstrap.1000resamples per split: BPCC delta+0.9589 interval[+0.3810,+1.6155]; IN22Conv+0.2192[+0.0173,+0.4114]; IN22Gen-0.0540[-0.1698,+0.0633]. Exploratory unadjusted intervals, no universal/provider superiority or human-quality claim. Updated docs/frozen-v5-heldout-results.md. No GPU, optimizer or production changes. Next update manuscript/PDF with mixed results and limitations, prepare research model card, and pursue native review/device profiling; preserve opened tests without tuning against them.

### Research release documentation preparation

02:49Z cycle: no active training/bootstrap worker remains after successful analysis. Prepare an explicitly unreleased frozen-v5 model card from saved evidence, preserve upstream attribution and mixed findings; do not publish weights or change production before remaining release gates. AGY/Claude CLI paths available; prior AGY bounded critique timed out and Claude weekly-limited, so neither blocks this documentation work.

Prepared docs/frozen-v5-model-card-draft.md with immutable checkpoint/run identifiers, source/data attribution, actual100-step budget, complete held-out scores/intervals and explicit research/production limitations. Checked three uncertainty records against saved evidence; no fabricated publication or deployment. Remaining next tasks: manuscript/PDF update, final license/allowlist/loading audit for a research release, native Telugu review and target-device export/profile.

02:59Z cycle: update stale manuscript outline from the initial Opus pilot to the verified frozen IndicTrans2 experiment. Preserve the earlier negative pilot as historical evidence; no new training or production change. PDF revision remains a separate render-and-review task.

Rewrote docs/manuscript-outline.md with verified IndicTrans2 methods, complete scores, paired uncertainty, historical negative Opus pilot and unresolved competitor/device/human-review limitations. Removed stale unrecovered-checkpoint assertions and unsupported Sarvam identification. All three reported deltas checked against evidence. Existing PDF explicitly labeled outdated in the outline; next regenerate current PDF and inspect rendered pages, then continue research-release packaging.

03:09Z: applied PDF skill to regenerate current research draft from evidence-backed manuscript via scripts/build-current-preprint.py. Two-column PDF generated and both pages rendered/inspected using system Poppler. Results and uncertainty now included, no acceptance claim; exact hash strings preserved after removing an overbroad spacing transform. Layout still needs editorial polish: reference-only short second page, compact source-text spacing and list paragraphs. Do not present this as final submission-ready paper. Next improve manuscript typography, numbered references and title layout, rerender and inspect before delivering updated PDF. No compute/training/production changes.

03:19Z: revised current PDF builder with full-width title/author block, readable10pt body, separate list/reference paragraphs and protected headings. Regenerated output/pdf/inferedge-english-telugu-arxiv-style.pdf and visually inspected both rendered pages; no clipping/overlap, two pages. Includes real mixed results and exploratory intervals, historical negative pilot, upstream attribution and pending author/human/device gates. This is a review draft, not submission-ready or accepted. Source docs/manuscript-outline.md and scripts/build-current-preprint.py retained. No training/production changes. Next license/package/loading audit and candidate export/device work; manuscript bibliography/editorial review remains before submission.

03:29Z: added scripts/audit-frozen-export.py, a read-only release-preparation integrity auditor. Requires exact frozen manifest/base revision, streaming per-file hashes, exact file membership and no symlinks/directories before reporting byte integrity; explicitly never approves publication. Synthetic valid fixture passes, unmanifested-file and tampered-weight fixtures reject. Actual v5 weights remain in Kaggle and were not audited locally; no false local recovery claim. Keep frozen export unchanged; license/model card/release additions belong in a separate staging package with separate provenance. Next run audit against retained real cloud export through supported access, obtain exact license/notices, verify loading, and prepare explicit upload allowlist. AGY/Claude paths present, prior helper limits/timeouts remain nonblocking; GPU off, no new training or production changes.

03:39Z: verified public Hub metadata at exact base revision2cfd0a20057756d756bf3e53528f492afc52f91a reports MIT and exposes LICENSE. Retrieved exact pinned LICENSE from official checkpoint into docs/release-notices/INDICTRANS2-LICENSE.txt with URL/hash/byte provenance; reread confirms MIT copyright AI4Bharat and required notice preservation. Added ATTRIBUTION-DRAFT.md separating upstream model/code, adaptation/export changes and Daily-component data attribution, explicitly excluding dataset redistribution and preserving frozen bytes. License hash validation passes. This closes exact upstream license-copy preparation, not full release clearance. No private model download bypass, token transmission, GPU, training or publication. Next supported real-export audit/loading and explicit staging allowlist, followed by authorized HF research publication when gates pass; device/human gates still block production.

03:49Z: implemented scripts/stage-research-release.py: validates exact frozen source and pinned license, refuses overwrite/overlapping paths, copies explicit verified files plus four notice/card documents, writes separate release manifest without changing original export or uploading. Syntax and negative-path checks pass; no real weights staged locally. Prepared self-contained scripts/kaggle-frozen-integrity-cell.py (stdlib only, CPU, no model loading) to audit actual retained cloud export and produce a small report via supported Kaggle input workflow. Next attach retained-v5 dataset to a dedicated CPU audit notebook and run this cell; then supported release transfer/loading path. No GPU/training/publication.

04:09Z: resumed completed analysis notebook editor from version1 (previous reports retained), added exact retained-v5 private dataset through supported Add Input URL lookup, installed scripts/kaggle-frozen-integrity-cell.py. Submitted new Save & Run All commit named Frozen v5 byte integrity audit CPU; accelerator explicitly Run without an accelerator, UI Committing. No model execution, optimizer, GPU or credentials. Existing original v7 predictions and uncertainty v1 remain immutable. Editor tab11 retained for next check. Next confirm audit completion/report (or fix input attachment if absent); no byte-integrity outcome claimed yet.

User authorized next-phase work directly after stopping the10-minute automation; do not recreate it. Found audit v2 run363688779 failed28.2s because retained dataset was absent, not a weight digest failure. Corrected attachment, verified retained input in sidebar, submitted CPU-only audit rerun named Frozen v5 integrity with retained input. Preparing larger controlled train/validation-only experiment and recovery controls while audit runs; no GPU quota verified yet and no new training claim.

### Direct next-phase work after user resume

Corrected audit input attachment and verified real frozen export in Kaggle v3 run363811442: Successful42.5seconds,13manifested files,1108559190bytes, exact frozen manifest identity and all file hashes pass. Evidence docs/evidence/frozen-v5-real-integrity.json. Earlier audit v2 run363688779 failed due absent input; not damaged weights.

Added configurable seed and periodic100-step recovery checkpoint callback to trainer, preserving validation-best selection; prior config compatibility defaults recovery interval100 on resume. Compiles. Prepared docs/indictrans2-next-controlled-run.md, train/validation-only17-file bundle artifacts/indictrans2-controlled-1000step-bundle-v3.zip (SHA7abf9333a40ff7dca4c5d67de48888593a5a399a47349927010823566e0b47d0), and scripts/kaggle-indic-controlled-1000step-cell.py. Cell pins bundle manifest, rejects held-out file inputs, checks CUDA, bounds training3600s and validation900s. No training submitted yet: current GPU free quota and changed periodic-recovery resume execution must still be verified. T4x2 offered; accelerator remainsNone/draftsessionoff. No paid compute.

Prepared deterministic complete412-row baseline validation review pack artifacts/validation-review-base-v1 using scripts/prepare-validation-review.py with reference membership/hash checks.0empty,0missing Telugu script,6numeral-form/order flags (triage only; spelled-out numbers may be correct). Human rating fields remain blank. Adapted predictions retained in cloud, so this pack is explicitly baseline-only, not a claimed adapted-model flaw analysis. AGY read-only bounded critique attempted; corrected duration syntax then helper interrupted without usable output. Claude remains previously weekly-limited. Neither blocks direct work.

Next: verify periodic recovery with a bounded fixture, attach v3 bundle to training notebook and recheck free quota; run1000steps only once gates pass. Then independently rescore full internal validation, native review, fresh confirmatory data and named-device export/profile. Do not restart deleted10-minute automation.

User confirms29freeGPUhours and explicitly requests launch. Proceed with T4x2 allocation, LightningoneGPU, expected<=2.5allocatedGPUhours including preparation; no paid compute. Before1000steps run actual2-to4-step periodic checkpoint recovery fixture, fail closed on any error. Changed periodic recovery to fixed latest file (one retained checkpoint) to avoid ten multi-GB recovery files exhausting Kaggle output disk. Reuse verified private v2 train/validation bundle with explicit embedded reviewed trainer override/digest; preserve exact override source in outputs. No held-out inputs in new training notebook.

### Larger GPU experiment submitted directly

Created isolated private notebook https://www.kaggle.com/code/ravivarmapatturi/notebookbad499785d/edit from verified adaptation v2 dataset, attached pinned upstream dataset; no held-out dataset/notebook attached. Submitted Save & Run All: Controlled1000-step GPU with recovery gate, explicitly Run with GPU for this session. UICommitting. Userconfirmed29freeGPUhours; no paid compute. Workflow verifies bundle/snapshot hashes, writes reviewed trainer override source to outputs, checksCUDA, runs2-to4-step full-parameter periodic recovery fixture, then1000-step seed42batch2lr2e-6 fromupstream,100-step rolling recovery, validation-best export and complete412-row generation. Training timeout3600s plus bounded fixture/setup/validation; expected allocation<=2.5GPUhours estimate. Submission evidence docs/evidence/controlled-1000step-submission.json. No completed training or quality result claimed; next inspect committed logs and actualCUDA/recovery progress, preserve outputs. Automation remains deleted.

Live run363813322 confirmed Running with GPU T4x2 allocation; notebook printed CUDA12.8/TeslaT4, Lightning GPUavailableTrue/usedTrue,211Mtrainableparameters,519modulestrain/0eval in recovery fixture. This is observed GPU execution/preflight, not1000-step completion. Pinned local Lightning accepts rolling latest callback configuration. Source/environment dependency resolver emitted unrelated gradio/diffusers conflicts; no terminal failure observed, do not treat warnings as successful training or silently hide them.

Run363813322 recovery gate PASSED in actual GPU environment: logs show Completedsteps2, Restoredallstatesfrom recovery/latest.ckpt, max_steps4reached andCompletedsteps4. At~273seconds notebook printed Starting1000-stepcontrolledGPUadaptation and new211Mtrainable model/GPUusedTrue; main loop is active, not completed. Evidence docs/evidence/controlled-gpu-recovery-live-ui.txt and controlled-gpu-running.png. Safe to continue this existing worker; do not launch duplicates. Automatic committed output includes trainer source, recovery fixture result, run config, rolling latest checkpoint every100steps, validation-selected/final checkpoints and export plus all412validation predictions on success. Next inspect final main globalstep/result and independently recompute validation generation; no external tests or publication until subsequent review. No recurring automation recreated.

###1000-step GPU training completed and research publication authorized

Run363813322 Successful1577.7s (26m18s),1000steps reached, selected checkpoint1000 with teacher-forced validation loss1.296498417854309.23outputfiles8.74GB retained in Kaggle. Complete412validation: chrF++58.3144517646,BLEU27.5137871338,zeroempty. Downloaded actual weights through supported per-file Kaggle Download (whole-zip restriction not bypassed), read exact manifest via browser-rendered JSON; manifest SHA39e33825ad4bcc891ad648ee8acd3aea163d17041e0bb4aea8be165712958249. All13export files verified; matching cached code/tokenizer/config bytes reused only after exact hash checks. Raw412predictions retrieved through rendered JSONL; strict membership/signature/chrF/diagnostic gate passes, independentBLEU reproduced. Delta vsfixed upstream validation+4.1446678530chrF++,vs100step+3.242285814; these are internal selection results, not external superiority. Local offline reload/generation smoke passes.

User explicitly requests all actually trained/fine-tuned models on authorized HFaccount with correct benchmarks. Rechecked CLIidentity ravivarmapatturi. Preparing/publicly uploading three research repositories:1000-stepIndicTrans2 (internal validation only), frozen100-stepIndicTrans2 (full held-out and uncertainty), historical100-stepOPUS (regression explicitly marked). Exclude diagnostic fixture/probe checkpoints. Restored actual100stepweights viaKaggle per-fileDownload and matched frozenmanifest5235276b...; originalOPUSarchiveSHA7fb52a9c... verified and all exported files matched archive. Both offline loading smoke tests pass; OPUSfullIN22BLEU/chrF independently reproduced. Include model/tokenizer/config, licenses/notices, source provenance, metric hashes/signatures and limitations; no training corpora, credentials, optimizer pickles or unrelated project files uploaded. All-file remote content verification pending after uploads.

### All three real research checkpoints published and remotely verified

HF account ravivarmapatturi reauthenticated; public uploads complete for inferedge-indictrans2-en-te-1000steps-v1 (commita2562b9862a5d58fcf14ba313b7fb1a5bb61796b,30files), inferedge-indictrans2-en-te-100steps-v1 (commit3dba3782c79b916690025e36e8351625bc1715d5,32files), inferedge-opus-en-te-100steps-research-v1 (commit6fc353b50bfc5f13be9cdeeedaefc58687a0e6f2,22files). scripts/verify-hub-research-releases.py independently checked public status, complete membership, sizes and every remoteGit/LFScontenthash against local allowlists; all84filesmatch. Weight hashes76eac41a.../4d91e08e.../a098bf15... match actual trained exports. Each repo has README/license/attribution, public release checksum manifest and checkpoint-specific benchmark/evidence scope. v1000published asinternal-validation-only, v5includescompleteheldout+uncertainty, OPUSexplicitlynegative/research-only. No diagnostic fixtures, corpora/references, credentials or optimizer pickle files uploaded. Evidence docs/evidence/huggingface-research-releases-verified.json and index docs/published-research-checkpoints.md.

Publication request fulfilled; no production changes and no10minuteautomation. Next broader mission work: freshconfirmatory/humanreview and actualtarget-deviceexport/profile, then evaluate whether1000stepcheckpointgeneralizes without test-driven tuning. Preserve immutable published revisions; future metric updates must identify exactcheckpoint and testprotocol.

### 2026-11-02 Codex end-to-end product audit

Completed the requested `e2e-audit` branch audit without GPU, model publication or production model replacement. Fixed honest byte-level setup progress; distinct unsupported-browser, memory and download recovery states; safe recording API detection/track cleanup; static-mode loopback console noise; offline app-shell reload; 375px core-flow visibility; accessibility labels/live regions; and unsupported product/company claims. Added regression tests and evidence screenshots. Wrote `docs/translation-model-comparison.md`: retained evidence does not justify swapping deployed browser Opus-MT for either IndicTrans2 checkpoint, and browser export/runtime gates remain open. Verified current commercial Telugu TTS candidates against provider language/terms pages; MMS remains excluded from monetized use. Final web gate:18tests pass and production build succeeds. Headless Chrome passed desktop/mobile overflow, text translation, playback control/recovery, consent naming, unsupported-recording recovery and offline reload with zero severe console errors. Physical microphone/audio, full model download and real target-device model execution remain explicitly untested. Next: perform those hardware/model-download checks and evaluate a browser-compatible IndicTrans2 export before any swap.
