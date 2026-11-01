"""CPU-only real-model forward/backward and label-mask probe; no optimizer update."""
import os
os.environ.setdefault('OMP_NUM_THREADS','4')
import json,math,time
from pathlib import Path
import torch
from transformers import AutoModelForSeq2SeqLM,AutoTokenizer
repo='ai4bharat/indictrans2-en-indic-dist-200M';rev='2cfd0a20057756d756bf3e53528f492afc52f91a'
torch.set_num_threads(4)
tok=AutoTokenizer.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True)
model=AutoModelForSeq2SeqLM.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True,use_safetensors=True)
model.train()
rows=[json.loads(x) for x in Path('artifacts/indictrans2-training-prepared/train.jsonl').read_text().splitlines()[:2]]
# Explicit left padding follows the upstream IndicDataCollator convention.
width=max(len(x['input_ids']) for x in rows);target_width=max(len(x['labels']) for x in rows)
ids=torch.tensor([[tok.pad_token_id]*(width-len(r['input_ids']))+r['input_ids'] for r in rows])
mask=(ids!=tok.pad_token_id).long()
labels=torch.tensor([r['labels']+[-100]*(target_width-len(r['labels'])) for r in rows])
assert (labels==-100).any(), 'Fixture must exercise variable-length labels'
start=time.monotonic();result=model(input_ids=ids,attention_mask=mask,labels=labels)
assert torch.isfinite(result.loss)
result.loss.backward()
grads=[p.grad for p in model.parameters() if p.grad is not None]
assert grads and all(torch.isfinite(g).all() for g in grads)
report={'model':repo,'revision':rev,'device':'cpu','batch_rows':len(rows),'training_mode':model.training,'masked_label_positions':int((labels==-100).sum()),'loss':float(result.loss.detach()),'gradient_tensors':len(grads),'all_gradients_finite':True,'seconds':time.monotonic()-start,'optimizer_steps':0,'evidence_class':'real-model CPU training-path probe; no adaptation quality claim'}
Path('docs/evidence/indictrans2-training-probe.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2),flush=True)
