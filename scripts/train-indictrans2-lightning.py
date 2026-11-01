"""Pinned IndicTrans2 adaptation over preprocessed splits; CPU by default."""
import argparse,hashlib,json,os
from pathlib import Path
os.environ.setdefault('OMP_NUM_THREADS','4')

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--data',type=Path,default=Path('artifacts/indictrans2-training-prepared'))
 p.add_argument('--output',type=Path,required=True)
 p.add_argument('--max-steps',type=int,default=100)
 p.add_argument('--batch-size',type=int,default=2)
 p.add_argument('--accumulation',type=int,default=1)
 p.add_argument('--learning-rate',type=float,default=2e-6)
 p.add_argument('--accelerator',choices=['cpu','gpu'],default='cpu')
 p.add_argument('--seed',type=int,default=42)
 p.add_argument('--recovery-every-steps',type=int,default=100)
 p.add_argument('--resume',type=Path)
 p.add_argument('--fixture-rows',type=int,default=0)
 p.add_argument('--probe-last-layer-only',action='store_true',help='CPU recovery diagnostic only; freeze all but final decoder layer')
 a=p.parse_args()
 if min(a.max_steps,a.batch_size,a.accumulation,a.recovery_every_steps)<1 or a.learning_rate<=0:p.error('Invalid training budget')
 if a.output.exists() and not a.resume:p.error('Output exists; explicit resume required')
 import torch,lightning.pytorch as pl
 from lightning.pytorch.callbacks import ModelCheckpoint
 from torchdata.stateful_dataloader import StatefulDataLoader as DataLoader
 from transformers import AutoModelForSeq2SeqLM,AutoTokenizer
 torch.set_num_threads(4);pl.seed_everything(a.seed,workers=True)
 manifest=json.loads((a.data/'manifest.json').read_text());repo=manifest['model'];rev=manifest['revision']
 if repo!='ai4bharat/indictrans2-en-indic-dist-200M' or rev!='2cfd0a20057756d756bf3e53528f492afc52f91a':raise ValueError('Unexpected model/code revision')
 def read(split):
  path=a.data/(split+'.jsonl')
  if hashlib.sha256(path.read_bytes()).hexdigest()!=manifest['splits'][split]['encoding_sha256']:raise ValueError('Encoding fingerprint mismatch')
  rows=[json.loads(x) for x in path.read_text().splitlines()]
  if a.fixture_rows:rows=rows[:a.fixture_rows]
  if not rows:raise ValueError('Empty split')
  return rows
 train,val=read('train'),read('validation')
 tok=AutoTokenizer.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True)
 model=AutoModelForSeq2SeqLM.from_pretrained(repo,revision=rev,trust_remote_code=True,local_files_only=True,use_safetensors=True)
 if a.probe_last_layer_only:
  for parameter in model.parameters():parameter.requires_grad_(False)
  for parameter in model.get_decoder().layers[-1].parameters():parameter.requires_grad_(True)
 def collate(rows):
  n=max(len(r['input_ids']) for r in rows);m=max(len(r['labels']) for r in rows)
  ids=torch.tensor([[tok.pad_token_id]*(n-len(r['input_ids']))+r['input_ids'] for r in rows])
  return {'input_ids':ids,'attention_mask':(ids!=tok.pad_token_id).long(),'labels':torch.tensor([r['labels']+[-100]*(m-len(r['labels'])) for r in rows])}
 class Translation(pl.LightningModule):
  def __init__(self):super().__init__();self.model=model;self.model.train()
  def on_train_epoch_start(self):self.model.train()
  def training_step(self,batch,index):
   if not self.model.training:raise RuntimeError('Unexpected eval mode')
   loss=self.model(**batch).loss;self.log('train_loss',loss,batch_size=len(batch['labels']));return loss
  def validation_step(self,batch,index):self.log('val_loss',self.model(**batch).loss,on_epoch=True,batch_size=len(batch['labels']))
  def configure_optimizers(self):return torch.optim.AdamW(self.parameters(),lr=a.learning_rate)
 config={'model':repo,'revision':rev,'data_manifest_sha256':hashlib.sha256((a.data/'manifest.json').read_bytes()).hexdigest(),'batch_size':a.batch_size,'accumulation':a.accumulation,'learning_rate':a.learning_rate,'fixture_rows':a.fixture_rows,'seed':a.seed,'recovery_every_steps':a.recovery_every_steps,'max_steps':a.max_steps,'accelerator':a.accelerator,'validation_interval_batches':1 if a.fixture_rows else 100,'probe_last_layer_only':a.probe_last_layer_only,'dataloader':'torchdata-stateful-0.11.0'}
 if a.resume:
  prior=json.loads((a.output/'run.json').read_text())
  prior.setdefault('recovery_every_steps',100)
  if {k:v for k,v in prior.items() if k!='max_steps'}!={k:v for k,v in config.items() if k!='max_steps'} or a.max_steps<=prior['max_steps']:raise ValueError('Immutable resume settings changed or budget not increased')
 a.output.mkdir(parents=True,exist_ok=True);(a.output/'run.json').write_text(json.dumps(config,indent=2)+'\n')
 checkpoint=ModelCheckpoint(dirpath=a.output/'checkpoints',monitor='val_loss',mode='min',save_top_k=1,save_last='link')
 recovery=ModelCheckpoint(dirpath=a.output/'recovery',filename='latest',save_top_k=1,enable_version_counter=False,every_n_train_steps=a.recovery_every_steps,save_on_train_epoch_end=False)
 module=Translation()
 trainer=pl.Trainer(accelerator=a.accelerator,devices=1,max_steps=a.max_steps,accumulate_grad_batches=a.accumulation,callbacks=[checkpoint,recovery],logger=False,default_root_dir=a.output,gradient_clip_val=1.0,deterministic=True,log_every_n_steps=1,num_sanity_val_steps=1,val_check_interval=1 if a.fixture_rows else 100,check_val_every_n_epoch=None)
 trainer.fit(module,DataLoader(train,batch_size=a.batch_size,shuffle=True,collate_fn=collate),DataLoader(val,batch_size=a.batch_size,collate_fn=collate),ckpt_path=str(a.resume) if a.resume else None)
 results=trainer.validate(module,DataLoader(val,batch_size=a.batch_size,collate_fn=collate))
 trainer.save_checkpoint(a.output/'checkpoints/final.ckpt')
 if not checkpoint.best_model_path:
  raise RuntimeError('No validation-selected checkpoint; refusing unselected export')
 # Checkpoints are generated by this run, never arbitrary downloaded pickle files.
 selected=torch.load(checkpoint.best_model_path,map_location='cpu',weights_only=False,mmap=True)
 selected_step=int(selected['global_step'])
 selected_score=float(checkpoint.best_model_score)
 module.load_state_dict(selected['state_dict']);del selected
 module.eval()
 selected_results=trainer.validate(module,DataLoader(val,batch_size=a.batch_size,collate_fn=collate))
 module.model.save_pretrained(a.output/'export');tok.save_pretrained(a.output/'export')
 from indictrans2_export import package
 package(a.output/'export',Path(__file__).resolve().parents[1])
 (a.output/'result.json').write_text(json.dumps({'steps':trainer.global_step,'final_validation':results,'selected_validation':selected_results,'selected_checkpoint_step':selected_step,'selection_policy':'validation_best','best_callback_score':selected_score,'export_is_final_checkpoint':selected_step==trainer.global_step,'selection_metric':'val_loss','best_validation_checkpoint':checkpoint.best_model_path,'limitation':'Loss-selected checkpoints require separate generation-based validation; no external test tuning'},indent=2)+'\n')
 print('Completed steps',trainer.global_step,flush=True)
if __name__=='__main__':main()
