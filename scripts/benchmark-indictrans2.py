"""Pinned compact IndicTrans2 CPU benchmark with resumable predictions."""
import os
os.environ.setdefault('OMP_NUM_THREADS','4')
os.environ.setdefault('TOKENIZERS_PARALLELISM','false')
import json,time,hashlib,threading,statistics,subprocess
from pathlib import Path
import torch,psutil
from transformers import AutoModelForSeq2SeqLM,AutoTokenizer
from IndicTransToolkit.processor import IndicProcessor
repo='ai4bharat/indictrans2-en-indic-dist-200M';rev='2cfd0a20057756d756bf3e53528f492afc52f91a'
root=Path(__file__).resolve().parents[1];out=root/'artifacts/indictrans2-benchmark';out.mkdir(exist_ok=True,parents=True)
peak=[0];stop=threading.Event();proc=psutil.Process()
def monitor():
 while not stop.wait(.1):peak[0]=max(peak[0],proc.memory_info().rss)
threading.Thread(target=monitor,daemon=True).start();torch.set_num_threads(4)
start=time.monotonic()
tok=AutoTokenizer.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True)
model=AutoModelForSeq2SeqLM.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True,use_safetensors=True).eval()
load=time.monotonic()-start
ip=IndicProcessor(inference=True)
print('Loaded pinned model',sum(p.numel() for p in model.parameters()),flush=True)
for benchmark in ['in22-conv','in22-gen']:
 ref=root/'artifacts/pilot-benchmark-v1'/f'{benchmark}.jsonl';rows=[json.loads(x) for x in ref.read_text().splitlines()]
 pred=out/f'{benchmark}.predictions.jsonl';completed=[json.loads(x) for x in pred.read_text().splitlines()] if pred.exists() else []
 assert [x['source'] for x in completed]==[x['source'] for x in rows[:len(completed)]]
 times=[]
 with pred.open('a') as f,torch.inference_mode():
  for i in range(len(completed),len(rows),4):
   batch=rows[i:i+4];t=time.monotonic()
   text=ip.preprocess_batch([r['source'] for r in batch],src_lang='eng_Latn',tgt_lang='tel_Telu')
   inputs=tok(text,truncation=True,max_length=256,padding='longest',return_tensors='pt')
   ids=model.generate(**inputs,max_length=256,num_beams=3,early_stopping=True,use_cache=True)
   decoded=tok.batch_decode(ids,skip_special_tokens=True,clean_up_tokenization_spaces=True)
   translations=ip.postprocess_batch(decoded,lang='tel_Telu');times.append(time.monotonic()-t)
   assert len(translations)==len(batch)
   for row,translation in zip(batch,translations): f.write(json.dumps({'source':row['source'],'prediction':translation,'category':benchmark},ensure_ascii=False)+'\n')
   f.flush();os.fsync(f.fileno());print(benchmark,min(i+4,len(rows)),'/',len(rows),flush=True)
 meta={'model':repo,'revision':rev,'benchmark':benchmark,'reference_sha256':hashlib.sha256(ref.read_bytes()).hexdigest(),'prediction_sha256':hashlib.sha256(pred.read_bytes()).hexdigest(),'rows':len(rows),'settings':{'source':'eng_Latn','target':'tel_Telu','max_length':256,'num_beams':3,'batch_size':4,'device':'cpu','threads':4},'sampled_peak_process_rss_bytes':peak[0],'load_seconds':load,'batch_latencies_seconds':times,'note':'Process RSS on this host; batch latency is not single-request latency; resumed run timings cover only new batches'}
 (out/f'{benchmark}.provenance.json').write_text(json.dumps(meta,indent=2)+'\n')
 subprocess.run(['/tmp/inferedge-model-env/bin/python',str(root/'scripts/evaluate-translation.py'),'--references',str(ref),'--predictions',str(pred),'--model-name',repo,'--model-revision',rev,'--pipeline-source','local CPU IndicTransToolkit; three-beam matched comparison','--allow-duplicate-sources','--output',str(out/f'{benchmark}.metrics.json')],check=True)
stop.set()
