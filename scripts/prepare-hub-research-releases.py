"""Stage verified IndicTrans2 research releases; never upload or include credentials."""
import hashlib,importlib.util,json,os,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('audit',ROOT/'scripts/audit-frozen-export.py');audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)

def stage(label,manifest_hash,steps,validation_chrf,validation_bleu):
 base=ROOT/'artifacts'/('release-'+label);frozen=base/'frozen-export';audit_report=audit.audit(frozen,manifest_hash)
 dest=base/'hub';dest.mkdir(exist_ok=True)
 for source in frozen.iterdir():
  target=dest/source.name
  if not target.exists():os.link(source,target)
  assert hashlib.sha256(target.read_bytes()).hexdigest()==hashlib.sha256(source.read_bytes()).hexdigest()
 shutil.copyfile(ROOT/'docs/release-notices/INDICTRANS2-LICENSE.txt',dest/'LICENSE')
 attribution=(ROOT/'docs/release-notices/ATTRIBUTION-DRAFT.md').read_text().replace('100-step English-to-Telugu',f'{steps}-step English-to-Telugu').replace('This is staging documentation, not a published release or legal clearance.','This research release is not production approved or a legal clearance.');(dest/'ATTRIBUTION.md').write_text(attribution)
 bench=dest/'benchmarks';bench.mkdir(exist_ok=True)
 if steps==1000:
  evidence=['controlled-1000step-validation-observed.json','controlled-1000step-independent-validation-gate.json','controlled-1000step-offline-smoke.json']
  external='No held-out or external benchmark has yet been run for these 1000-step weights. Scores for the 100-step model must not be attributed to this checkpoint.'
  extra=''
 else:
  evidence=['indic-heldout-v7-observed.json','indic-heldout-uncertainty-v1.json','frozen-v5-real-integrity.json','indic-controlled-verification-v6.json']
  external='Frozen-checkpoint held-out evaluation (same CPU environment and decoding):'
  extra='''\n| Corpus | N | Base chrF++ | This model chrF++ | Base BLEU | This model BLEU |\n|---|---:|---:|---:|---:|---:|\n| BPCC internal test |426|53.6451|54.6040|19.9198|21.5296|\n| IN22 conversation |1503|44.6710|44.8902|13.0600|13.5208|\n| IN22 general |1024|51.4335|51.3796|18.2014|18.2476|\n\nExploratory paired1000-resample chrF++ delta95% percentile intervals: BPCC[+0.3810,+1.6155], conversation[+0.0173,+0.4114], general[-0.1698,+0.0633]. No multiple-comparison adjustment or training-seed uncertainty. General-domain improvement is unproven. Full reports are in benchmarks/.\n'''
 for name in evidence:shutil.copyfile(ROOT/'docs/evidence'/name,bench/name)
 card=f'''---
language:
- en
- te
license: mit
library_name: transformers
pipeline_tag: translation
base_model: ai4bharat/indictrans2-en-indic-dist-200M
tags:
- indictrans2
- english-to-telugu
- research
- fine-tuned
model-index:
- name: InferEdge IndicTrans2 English-Telugu {steps} steps
  results:
  - task:
      type: translation
    dataset:
      name: BPCC-H-Daily Telugu internal validation (412 rows; used for selection)
      type: ai4bharat/BPCC
    metrics:
    - type: bleu
      name: SacreBLEU 2.6.0 BLEU
      value: {validation_bleu}
    - type: chrf
      name: chrF++ (word order 2)
      value: {validation_chrf}
---
# InferEdge English-to-Telugu adaptation: {steps} steps

Research checkpoint fine-tuned by InferEdge AI / VaayuEdge from AI4Bharat IndicTrans2. **Not a new architecture, from-scratch model, production-approved system, or proof of commercial-provider superiority.**

## Checkpoint identity

Upstream: `ai4bharat/indictrans2-en-indic-dist-200M`, revision `2cfd0a20057756d756bf3e53528f492afc52f91a`,211,776,512 parameters. Frozen export-manifest SHA256: `{manifest_hash}`. All13 export files verified against this manifest. Files from the frozen export remain unchanged; research documentation is added separately. Preserve AI4Bharat MIT license and notices (LICENSE and ATTRIBUTION.md).

## Training and data

{steps} full-parameter optimizer steps, AdamW learning rate2e-6, batch2, accumulation1, seed42, PyTorch Lightning2.6.6. Approximately{steps*2} examples processed, below one epoch over7673 training rows. Training data: AI4Bharat BPCC-H-Daily Telugu, source revision `5bde309374f21c39e7c3d505f28ae11f58f2a220`, file `daily/tel_Telu.tsv`. The Daily-component upstream README specifies CC-BY-4.0; this must not be generalized to unrelated BPCC components.8511 cleaned pairs split into7673train/412validation/426test by normalized-source hash. Exact normalized-source decontamination against IN22 found no overlap; near duplicates and upstream pretraining exposure remain unresolved. Training corpus/reference data is not redistributed here.

Validation loss selects the exported checkpoint; generation-based internal validation is a separate screen. The1000-step run used TeslaT4 and verified full-state periodic save/resume before its main loop. The100-step run used CPU. No held-out-driven tuning of this release is claimed.

## Measured results

All412 internal validation examples: **chrF++ {validation_chrf:.4f}, BLEU {validation_bleu:.4f}**, zero empty outputs. Upstream validation baseline: chrF++54.1698, BLEU21.3407. Validation is used for selection and is not an unbiased final test. Metrics: SacreBLEU2.6.0, case-sensitive13a BLEU and chrF++ character order6/word order2; three beams,max256tokens,batch4,CPU4threads. Exact signatures, corpus hashes and environment are in benchmarks/.

{external}
{extra}

## Loading

Reviewed custom code is required. Pin a Hub commit when downloading; inspect the included code and verify frozen file hashes before enabling `trust_remote_code`. Tested with Transformers4.51.3, IndicTransToolkit1.1.1, PyTorch2.6.0 for offline reload. Upstream model and tokenizer must receive the required IndicProcessor preprocessing/postprocessing:

```python
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from IndicTransToolkit.processor import IndicProcessor
repo = "ravivarmapatturi/inferedge-indictrans2-en-te-{steps}steps-v1"
tokenizer = AutoTokenizer.from_pretrained(repo, trust_remote_code=True)
model = AutoModelForSeq2SeqLM.from_pretrained(repo, trust_remote_code=True).eval()
processor = IndicProcessor(inference=True)
texts = processor.preprocess_batch(["Please turn off the lights."], src_lang="eng_Latn", tgt_lang="tel_Telu")
inputs = tokenizer(texts, padding=True, return_tensors="pt")
with torch.inference_mode():
    outputs = model.generate(**inputs, num_beams=3, max_length=256)
print(processor.postprocess_batch(tokenizer.batch_decode(outputs, skip_special_tokens=True), lang="tel_Telu"))
```

## Limits and provenance

Native Telugu human review, repeat-seed experiments, fresh confirmatory evaluation, phone/browser export parity and named-device RAM/latency/energy measurements remain pending. This is text translation, not a complete ASR/TTS conversation system. No edge-readiness, SOTA, arXiv acceptance or universal superiority claim. Training/evaluation source and manifests are included in reproducibility/. Raw checkpoints and complete original outputs remain retained in the author's Kaggle account; benchmark reports here preserve the actual scope of each run.

AI4Bharat: https://github.com/AI4Bharat/IndicTrans2 ; paper https://arxiv.org/abs/2305.16307 . SacreBLEU reporting: https://aclanthology.org/W18-6319/ .
'''
 (dest/'README.md').write_text(card)
 repro=dest/'reproducibility';repro.mkdir(exist_ok=True)
 for name in ['train-indictrans2-lightning.py','indictrans2_export.py','validate-indictrans2-generation.py','compare-internal-validation.py']:
  shutil.copyfile(ROOT/'scripts'/name,repro/name)
 shutil.copyfile(ROOT/'artifacts/indictrans2-training-prepared/manifest.json',repro/'data-manifest.json')
 (repro/'README.md').write_text('Scripts are preserved for audit and adaptation, not a self-contained training dataset. Recreate the original project paths and supply licensed data plus the pinned authorized upstream cache. The data manifest describes splits; only train/validation were bundled for training. See source run links in benchmarks/.\n')
 (dest/'requirements.txt').write_text('transformers==4.51.3\nIndicTransToolkit==1.1.1\nsentencepiece\nsafetensors==0.8.0\ntorch==2.6.0\n')
 report={'audit':audit_report,'files':{str(p.relative_to(dest)):hashlib.file_digest(p.open('rb'),'sha256').hexdigest() for p in dest.rglob('*') if p.is_file()},'production_approved':False}
 (base/'upload-allowlist.json').write_text(json.dumps(report,indent=2)+'\n')
 print(dest)

if __name__=='__main__':stage('v1000','39e33825ad4bcc891ad648ee8acd3aea163d17041e0bb4aea8be165712958249',1000,58.31445176462468,27.51378713384213)
