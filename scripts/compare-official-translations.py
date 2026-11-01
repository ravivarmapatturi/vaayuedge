"""Rescore pinned official third-party translations only with exact aligned references."""
import hashlib,json,tarfile
from pathlib import Path
from huggingface_hub import hf_hub_download
from sacrebleu.metrics import BLEU,CHRF
revision='5bde309374f21c39e7c3d505f28ae11f58f2a220'
archive=Path(hf_hub_download('ai4bharat/BPCC','additional/translation_outputs.tar.gz',repo_type='dataset',revision=revision))
out=Path('artifacts/competitor-comparison');out.mkdir(parents=True,exist_ok=True)
results=[]
with tarfile.open(archive) as t:
 names=set(t.getnames())
 for b in ['in22-conv','in22-gen']:
  prefix=f'translation_outputs/{b}/eng_Latn-tel_Telu/'
  if prefix+'test.eng_Latn' not in names:
   print('Missing benchmark',b,flush=True);continue
  read=lambda name:t.extractfile(prefix+name).read().decode('utf-8').splitlines()
  sources,targets=read('test.eng_Latn'),read('test.tel_Telu')
  refs=[json.loads(x) for x in (Path('artifacts/pilot-benchmark-v1')/(b+'.jsonl')).read_text().splitlines()]
  assert sources==[r['source'] for r in refs],f'{b}: source mismatch'
  assert targets==[r['target'] for r in refs],f'{b}: target mismatch'
  for member in sorted(names):
   if not member.startswith(prefix+'test.tel_Telu.pred.'):continue
   label=member.split('.pred.')[-1];raw=t.extractfile(member).read();pred=raw.decode('utf-8').splitlines()
   assert len(pred)==len(refs),(member,len(pred),len(refs))
   bleu,chrf=BLEU(),CHRF(word_order=2)
   row={'benchmark':b,'model_label':label,'evidence_class':'locally rescored official third-party predictions; inference not reproduced','rows':len(pred),'bleu':bleu.corpus_score(pred,[targets]).score,'chrf_plus_plus':chrf.corpus_score(pred,[targets]).score,'bleu_signature':str(bleu.get_signature()),'chrf_signature':str(chrf.get_signature()),'source_target_exact_match':True,'archive_member':member,'prediction_sha256':hashlib.sha256(raw).hexdigest(),'upstream_release':'2023-era official outputs; exact model/service revision not established'}
   results.append(row);(out/(b+'.'+label+'.jsonl')).write_text(''.join(json.dumps({'source':s,'prediction':p},ensure_ascii=False)+'\n' for s,p in zip(sources,pred)))
   print(b,label,round(row['bleu'],3),round(row['chrf_plus_plus'],3),flush=True)
report={'repo':'ai4bharat/BPCC','revision':revision,'archive_sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'results':results,'limitations':['Official released outputs, not local inference or current API performance','Exact inference revisions/settings may be unspecified','No latency, memory, energy or current market rank established','Sarvam not included; requires separate inference']}
(out/'official-rescored.json').write_text(json.dumps(report,indent=2)+'\n')
