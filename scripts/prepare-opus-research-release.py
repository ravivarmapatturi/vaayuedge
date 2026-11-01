from pathlib import Path
from zipfile import ZipFile
import os,json,hashlib,urllib.request,shutil
root=Path('/home/ravivarma/Documents/DREAM_PROJECT/vaayuedge');base=root/'artifacts/pilot-benchmark-v1';dest=root/'artifacts/release-opus/hub';dest.mkdir(parents=True,exist_ok=True)
archive=Path.home()/'Downloads/results.zip';verification=json.loads((base/'verification.json').read_text())
assert hashlib.file_digest(archive.open('rb'),'sha256').hexdigest()==verification['archive_sha256']
with ZipFile(archive) as z:
 for i in z.infolist():
  prefix='inferedge-pilot-100steps/export/'
  if i.filename.startswith(prefix) and not i.is_dir():
   name=i.filename[len(prefix):];assert Path(name).name==name
   source=base/'inferedge-pilot-100steps/export'/name
   assert hashlib.sha256(source.read_bytes()).hexdigest()==hashlib.sha256(z.read(i.filename)).hexdigest()
   if not (dest/name).exists():os.link(source,dest/name)
 for item in verification['files']:
  source=base/'inferedge-pilot-100steps'/item['path'];assert hashlib.file_digest(source.open('rb'),'sha256').hexdigest()==item['sha256']
bench=dest/'benchmarks';bench.mkdir(exist_ok=True)
for n in ['in22-conv.metrics.json','in22-gen.metrics.json','verification.json']:
 shutil.copyfile(base/n,bench/n)
shutil.copyfile(base/'inferedge-pilot-100steps/run-manifest.json',dest/'training-run.json')
shutil.copyfile(root/'docs/release-notices/OPUS-APACHE-2.0.txt',dest/'LICENSE')
shutil.copyfile(root/'docs/release-notices/opus-license-provenance.json',dest/'upstream-license-provenance.json')
with urllib.request.urlopen('https://huggingface.co/Helsinki-NLP/opus-mt-en-dra/resolve/5ecfd223f954f860b67f1b4c42e6f4c70d347581/README.md',timeout=30) as r:(dest/'UPSTREAM_MODEL_CARD.md').write_bytes(r.read())
(dest/'NOTICE').write_text('Derived from Helsinki-NLP/opus-mt-en-dra, revision5ecfd223f954f860b67f1b4c42e6f4c70d347581. Original model, architecture and training contributions belong to Helsinki-NLP/OPUS-MT and credited upstream contributors. InferEdge AI/VaayuEdge modified model weights by100-step English-to-Telugu adaptation. Preserve LICENSE and UPSTREAM_MODEL_CARD.md. This release reports a negative adaptation result; it is not production approved.\n')
(dest/'README.md').write_text('''---
language:
- en
- te
license: apache-2.0
library_name: transformers
pipeline_tag: translation
base_model: Helsinki-NLP/opus-mt-en-dra
tags:
- research
- negative-result
- fine-tuned
---
# InferEdge OPUS-MT English-Telugu 100-step pilot

**Historical research checkpoint with measured regression. Not recommended for production.** Released for transparency and reproducibility, not as a competitive improvement.

Fine-tuned by InferEdge AI/VaayuEdge from `Helsinki-NLP/opus-mt-en-dra` revision `5ecfd223f954f860b67f1b4c42e6f4c70d347581`. Approximately76.9M parameters. Upstream architecture and pretrained weights are credited to Helsinki-NLP/OPUS-MT. Preserve Apache2 license and upstream model card; weights are modified by conversational adaptation.

## Training

Kaggle run363252210:100 GPU optimizer steps,batch4,AdamW2e-5,seed42,max training length128. Approximately400 examples processed from7673 training rows, less than one epoch.8511 cleaned AI4Bharat BPCC-H-Daily Telugu pairs,412validation/426test. Daily-component source identified CC-BY-4.0, source revision5bde309374f21c39e7c3d505f28ae11f58f2a220. Preserve attribution; permissions for unrelated BPCC components are not inferred. Corpus/reference data is not redistributed here. Exact run hashes and archive integrity report are included.

## Held-out results

Complete IN22 evaluation, three beams,max256tokens, required Telugu prefix, CPU inference; SacreBLEU2.6.0. Upstream training exposure is unknown. These are historical comparisons, not current commercial API tests.

| Dataset | N | Upstream BLEU | Adapted BLEU | Upstream chrF++ | Adapted chrF++ |
|---|---:|---:|---:|---:|---:|
| IN22 conversation |1503|3.852|3.879|28.367|27.150|
| IN22 general |1024|3.675|2.013|26.863|19.986|

The tiny conversation BLEU increase does not establish improvement; chrF++ declines on both splits. No uncertainty intervals or human preference result are claimed. Metrics, signatures and complete-coverage checks are in benchmarks/. This pilot is distinct from the stronger IndicTrans2 releases; do not mix their results.

Training logs warned about modules initially in eval mode. The later IndicTrans2 recipe explicitly enforces train mode; this historical checkpoint is retained without claiming that its warning was retroactively fixed. Domain over-adaptation is a hypothesis, not a proven diagnosis.

## Usage

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
repo="ravivarmapatturi/inferedge-opus-en-te-100steps-research-v1"
tok=AutoTokenizer.from_pretrained(repo)
model=AutoModelForSeq2SeqLM.from_pretrained(repo).eval()
inputs=tok(">>tel<< Please turn off the lights.",return_tensors="pt")
print(tok.batch_decode(model.generate(**inputs,num_beams=3,max_length=256),skip_special_tokens=True))
```

Pin a model commit for reproducibility. No phone/browser memory, latency, energy or full ASR/TTS evidence is supplied. No SOTA, novelty, provider-superiority or arXiv-acceptance claim.

References: https://huggingface.co/Helsinki-NLP/opus-mt-en-dra ; https://github.com/AI4Bharat/IndicTrans2 ; https://arxiv.org/abs/2305.16307 ; https://aclanthology.org/W18-6319/ .
''')
(dest/'requirements.txt').write_text('transformers==4.51.3\nsentencepiece\nsafetensors\ntorch==2.6.0\n')
manifest={str(p.relative_to(dest)):hashlib.file_digest(p.open('rb'),'sha256').hexdigest() for p in dest.rglob('*') if p.is_file()};(dest.parent/'upload-allowlist.json').write_text(json.dumps(manifest,indent=2)+'\n');print('OPUS actual weights and all export files verified against original archive.')
