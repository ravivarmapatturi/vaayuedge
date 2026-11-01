"""Kaggle cell: bounded real-data CPU adaptation, never GPU training."""
import hashlib,json,os,pathlib,shutil,subprocess,sys
os.environ['CUDA_VISIBLE_DEVICES']=''
venv=pathlib.Path('/tmp/indic-adaptation-env')
subprocess.run([sys.executable,'-m','venv','--without-pip','--system-site-packages',str(venv)],check=True,timeout=120)
runtime=str(venv/'bin/python')
subprocess.run([runtime,'-m','pip','install','-q','transformers==4.51.3','lightning==2.6.6','torchdata==0.11.0','sentencepiece','safetensors==0.8.0','IndicTransToolkit==1.1.1','sacrebleu==2.6.0'],check=True,timeout=600)
source=next(p.parent for p in pathlib.Path('/kaggle/input').rglob('BUNDLE_MANIFEST.json') if 'docs/indictrans2-adaptation-pilot-plan.md' in json.loads(p.read_text())['files'])
manifest=json.loads((source/'BUNDLE_MANIFEST.json').read_text())
root=pathlib.Path('/tmp/indic-adaptation-source')
root.mkdir(exist_ok=True)
for name,digest in manifest['files'].items():
    path=source/name
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,'Input hash mismatch'
    target=root/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(path,target)
# Verify and cache private upstream input; no online Hub access or token needed.
snapshot_source=next(pathlib.Path('/kaggle/input').rglob('PINNED_SNAPSHOT.json')).parent
snapshot=json.loads((snapshot_source/'PINNED_SNAPSHOT.json').read_text())
assert snapshot['revision']=='2cfd0a20057756d756bf3e53528f492afc52f91a'
os.environ['HF_HUB_CACHE']='/tmp/indic-hf-cache'
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
cache=pathlib.Path(os.environ['HF_HUB_CACHE'])/'models--ai4bharat--indictrans2-en-indic-dist-200M'/'snapshots'/snapshot['revision']
cache.mkdir(parents=True,exist_ok=True)
for name,digest in snapshot['files'].items():
    path=snapshot_source/name
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,'Pinned snapshot hash mismatch'
    shutil.copyfile(path,cache/name)
out=pathlib.Path('/kaggle/working/indic-adaptation-100steps')
print('Starting real-data CPU adaptation:100steps,batch2,7673train rows; no GPU',flush=True)
base=[runtime,'-u',str(root/'scripts/train-indictrans2-lightning.py'),'--output',str(out),'--batch-size','2','--accelerator','cpu','--max-steps','100','--learning-rate','2e-6']
subprocess.run(base,cwd=root,check=True,timeout=1800)
print('Optimizer run completed; starting complete internal validation generation',flush=True)
subprocess.run([runtime,'-u',str(root/'scripts/validate-indictrans2-generation.py'),'--export-dir',str(out/'export'),'--sample-size','412','--output','/kaggle/working/indic-adaptation-validation'],cwd=root,check=True,timeout=900)
print('Pilot and internal generation completed; no production or public release approval',flush=True)
