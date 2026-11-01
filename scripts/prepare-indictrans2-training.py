"""Validate pinned IndicTrans2 language/script preprocessing on licensed splits."""
import json,hashlib
from pathlib import Path
from transformers import AutoTokenizer
from IndicTransToolkit.processor import IndicProcessor
repo='ai4bharat/indictrans2-en-indic-dist-200M';rev='2cfd0a20057756d756bf3e53528f492afc52f91a'
tok=AutoTokenizer.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True)
out=Path('artifacts/indictrans2-training-prepared');out.mkdir(exist_ok=True,parents=True)
manifest={'model':repo,'revision':rev,'source_language':'eng_Latn','target_language':'tel_Telu','processor_inference':False,'training_started':False,'splits':{}}
for split in ['train','validation','test']:
 src=Path('artifacts/kaggle-pilot/data')/(split+'.jsonl');rows=[json.loads(x) for x in src.read_text().splitlines()];encoded=[]
 for i in range(0,len(rows),64):
  batch=rows[i:i+64];processor=IndicProcessor(inference=False)
  source=processor.preprocess_batch([r['source'] for r in batch],src_lang='eng_Latn',tgt_lang='tel_Telu')
  target=processor.preprocess_batch([r['target'] for r in batch],src_lang='tel_Telu',tgt_lang='eng_Latn',is_target=True)
  inputs=tok(source,truncation=False)['input_ids'];labels=tok(text_target=target,truncation=False)['input_ids']
  for x,y in zip(inputs,labels):
   if not x or not y:raise ValueError('Empty encoding')
   encoded.append({'input_ids':x,'labels':y})
 path=out/(split+'.jsonl');path.write_text(''.join(json.dumps(x)+'\n' for x in encoded))
 manifest['splits'][split]={'rows':len(rows),'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'encoding_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'source_over_256':sum(len(r['input_ids'])>256 for r in encoded),'target_over_256':sum(len(r['labels'])>256 for r in encoded)}
 print(split,manifest['splits'][split],flush=True)
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
