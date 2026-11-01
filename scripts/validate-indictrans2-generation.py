"""Deterministic internal-validation generation; never consumes IN22 for selection."""
import argparse,hashlib,json,os,time,platform,importlib.metadata
from pathlib import Path
os.environ.setdefault('OMP_NUM_THREADS','4')
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--export-dir',type=Path);p.add_argument('--output',type=Path,required=True);p.add_argument('--sample-size',type=int,default=32);p.add_argument('--dynamic-int8',action='store_true');p.add_argument('--int8-exclude-lm-head',action='store_true');a=p.parse_args()
if a.int8_exclude_lm_head and not a.dynamic_int8:p.error('--int8-exclude-lm-head requires --dynamic-int8')
if a.sample_size<1:p.error('Sample size must be positive')
if a.output.exists():p.error('Refusing to overwrite validation evidence')
import torch
from transformers import AutoTokenizer,AutoModelForSeq2SeqLM
from IndicTransToolkit.processor import IndicProcessor
from sacrebleu.metrics import BLEU,CHRF
repo='ai4bharat/indictrans2-en-indic-dist-200M';rev='2cfd0a20057756d756bf3e53528f492afc52f91a';torch.set_num_threads(4)
source=Path('artifacts/kaggle-pilot/data/validation.jsonl');rows=[json.loads(x) for x in source.read_text().splitlines()]
rows.sort(key=lambda r:hashlib.sha256(('indic-validation-v1:'+r['source']).encode()).hexdigest());rows=rows[:a.sample_size]
model_source=str(a.export_dir) if a.export_dir else repo
kwargs={'trust_remote_code':True,'local_files_only':True}
if not a.export_dir:kwargs['revision']=rev
model=AutoModelForSeq2SeqLM.from_pretrained(model_source,use_safetensors=True,low_cpu_mem_usage=False,**kwargs).eval();tok=AutoTokenizer.from_pretrained(model_source,**kwargs)
if any(parameter.is_meta for parameter in model.parameters()):
 raise RuntimeError('Export reload has unmaterialized meta parameters; refusing generation')
quantized_layers=0
if a.dynamic_int8:
 specification={torch.nn.Linear}
 if a.int8_exclude_lm_head:
  specification={name:torch.ao.quantization.default_dynamic_qconfig for name,layer in model.named_modules() if isinstance(layer,torch.nn.Linear) and name!='lm_head'}
 model=torch.ao.quantization.quantize_dynamic(model,specification,dtype=torch.qint8,inplace=False)
 quantized_layers=sum(isinstance(layer,torch.ao.nn.quantized.dynamic.Linear) for layer in model.modules())
 if not quantized_layers:raise RuntimeError('No linear layers quantized')
pred=[];start=time.monotonic()
with torch.inference_mode():
 for i in range(0,len(rows),4):
  batch=rows[i:i+4];ip=IndicProcessor(inference=True)
  texts=ip.preprocess_batch([r['source'] for r in batch],src_lang='eng_Latn',tgt_lang='tel_Telu')
  x=tok(texts,return_tensors='pt',padding=True,truncation=True,max_length=256)
  ids=model.generate(**x,max_length=256,num_beams=3,early_stopping=True)
  y=ip.postprocess_batch(tok.batch_decode(ids,skip_special_tokens=True,clean_up_tokenization_spaces=True),lang='tel_Telu');pred.extend(y);print('validated',len(pred),'/',len(rows),flush=True)
refs=[r['target'] for r in rows];bleu=BLEU();chrf=CHRF(word_order=2)
report={'model_source':model_source,'base_revision':rev,'split':'internal validation; BPCC-H-Daily','full_validation_rows':412,'sample_rows':len(rows),'sampling':'smallest sha256(indic-validation-v1: + raw source)','validation_file_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'bleu':bleu.corpus_score(pred,[refs]).score,'chrf_plus_plus':chrf.corpus_score(pred,[refs]).score,'bleu_signature':str(bleu.get_signature()),'chrf_signature':str(chrf.get_signature()),'seconds':time.monotonic()-start,'output_reference_char_ratio':sum(map(len,pred))/sum(map(len,refs)),'empty_outputs':sum(not x.strip() for x in pred),'settings':{'beams':3,'max_length':256,'batch_size':4},'limitation':'Small internal validation subset, not external benchmark or unbiased final-test evidence'}
report['limitation']='Internal validation used for selection; not external benchmark or unbiased final-test evidence'
report['environment']={'python':platform.python_version(),'platform':platform.platform(),'torch':torch.__version__,'cpu_threads':torch.get_num_threads(),'device':'cpu','packages':{name:importlib.metadata.version(name) for name in ('transformers','IndicTransToolkit','sacrebleu','safetensors')}}
report['evaluator_sha256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
report['inference_transformation']={'method':'pytorch dynamic INT8 linear' if a.dynamic_int8 else 'none','quantized_linear_layers':quantized_layers,'scope':'CPU feasibility only; not a trained model or phone/browser export'}
report['inference_transformation']['lm_head_excluded']=a.int8_exclude_lm_head
if a.export_dir:
 manifest_path=a.export_dir/'export-manifest.json'
 if not manifest_path.exists():raise RuntimeError('Local export lacks packaging manifest')
 report['export_manifest_sha256']=hashlib.sha256(manifest_path.read_bytes()).hexdigest()
a.output.mkdir(parents=True)
(a.output/'predictions.jsonl').write_text(''.join(json.dumps(dict(r,prediction=s),ensure_ascii=False)+'\n' for r,s in zip(rows,pred)))
(a.output/'metrics.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
