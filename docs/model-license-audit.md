# Model license audit: baseline and candidate checkpoints

Status: **Helsinki baseline attribution recorded; Bodhan remains a
research-only hold** (checked 2026-10-28).

## Exact deployed baseline

The deployed translation baseline is `Helsinki-NLP/opus-mt-en-dra` at Hub
revision `5ecfd223f954f860b67f1b4c42e6f4c70d347581`. Hugging Face API metadata
at that revision reports `license:apache-2.0`; the checkpoint contains the
legacy `pytorch_model.bin` format. The generator uses Telugu prefix `>>tel<<`,
max length 256, and three beams, recorded in prediction provenance sidecars.
This is attribution/provenance evidence, not legal advice or deployment
clearance. A released derivative must preserve the upstream Apache-2.0 license
and notices and identify changes.

## Evidence recorded

| Item | Finding | Evidence class | Decision impact |
|---|---|---|---|
| Bodhan access | Hugging Face access is gated and requires contact information and license acceptance | observed repository/model-card state | Do not download or use weights until access is deliberately approved |
| Bodhan model | The model card records approximately 7.94B parameters and 15.9 GB BF16 weights | published model-card claim | Treat as a comparator, not an assumed edge student |
| Bodhan terms | The public Bodhan license text describes internal modification rights, exact-license obligations for distributed derivatives, attribution, hosting conditions, and a large-scale threshold | published license text; not legal advice | Keep training, redistribution, and hosted-service decisions on hold |
| Upstream Gemma 4 | Google’s official page links Gemma 4 to an Apache License 2.0 text; the official terms page separately says Gemma 4 uses that license page | published upstream license | This resolves the public license-page identity, but does not prove that the Bodhan checkpoint’s full upstream chain is clean |
| Upstream scope | Google’s Apache text requires license/notice preservation and modified-file notices when distributing derivative works | published upstream license | Any future distribution package needs an attribution/NOTICE review |

## Unresolved gates

1. Obtain approved gated-file access and preserve the accepted Bodhan license
   version and model-card revision in a private audit record; never commit
   credentials or private contact data.
2. Verify the exact Bodhan license attached to the accessed checkpoint,
   including whether its hosted-service and threshold provisions apply to the
   intended VaayuEdge deployment.
3. Verify all upstream model and dataset terms actually used by the
   checkpoint. The public Gemma 4 Apache page is evidence about Google’s
   published upstream license, not proof of provenance for Bodhan’s weights or
   training data.
4. Obtain a written decision on whether any student trained by distillation or
   synthetic outputs is a derivative under each applicable license. Until then,
   do not use Bodhan or Gemma outputs to train a VaayuEdge release candidate.
5. If distribution or hosted inference is eventually proposed, prepare the
   required license copies, attribution, NOTICE files, modified-file notices,
   prohibited-use terms, and any required written approvals before release.

## Sources

- Bodhan model card: https://huggingface.co/bodhan-ai/indic-translate
- Bodhan license repository: https://github.com/Bodhan-AI/bodhan-model-info/tree/main/licenses/indic-open-model-license/v1
- Google Gemma 4 license: https://ai.google.dev/gemma/apache_2
- Google Gemma terms page (explicitly points Gemma 4 to the license above):
  https://ai.google.dev/gemma/terms/

This document is an engineering evidence record, not legal advice. It does not
authorize model use and does not change the GPU or paid-compute gate.
