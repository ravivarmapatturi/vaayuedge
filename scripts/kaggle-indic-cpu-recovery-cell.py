"""Kaggle cell: bounded full-parameter CPU recovery, never GPU training."""
import hashlib,json,os,pathlib,shutil,subprocess,sys
os.environ['CUDA_VISIBLE_DEVICES']=''
venv=pathlib.Path('/kaggle/working/indic-recovery-env')
subprocess.run([sys.executable,'-m','venv','--without-pip','--system-site-packages',str(venv)],check=True,timeout=120)
runtime=str(venv/'bin/python')
subprocess.run([runtime,'-m','pip','install','-q','transformers==4.51.3','lightning==2.6.6','torchdata==0.11.0','sentencepiece','safetensors==0.8.0'],check=True,timeout=600)
source=next(pathlib.Path('/kaggle/input').rglob('BUNDLE_MANIFEST.json')).parent
manifest=json.loads((source/'BUNDLE_MANIFEST.json').read_text())
root=pathlib.Path('/kaggle/working/indic-cpu-recovery-source')
root.mkdir(exist_ok=True)
for name,digest in manifest['files'].items():
    path=source/name
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,'Input hash mismatch'
    target=root/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(path,target)
# Verify and cache private upstream input; no online Hub access or token needed.
snapshot_source=next(pathlib.Path('/kaggle/input').rglob('PINNED_SNAPSHOT.json')).parent
snapshot=json.loads((snapshot_source/'PINNED_SNAPSHOT.json').read_text())
assert snapshot['revision']=='2cfd0a20057756d756bf3e53528f492afc52f91a'
os.environ['HF_HUB_CACHE']='/kaggle/working/indic-hf-cache'
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
cache=pathlib.Path(os.environ['HF_HUB_CACHE'])/'models--ai4bharat--indictrans2-en-indic-dist-200M'/'snapshots'/snapshot['revision']
cache.mkdir(parents=True,exist_ok=True)
for name,digest in snapshot['files'].items():
    path=snapshot_source/name
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,'Pinned snapshot hash mismatch'
    shutil.copyfile(path,cache/name)
out=pathlib.Path('/kaggle/working/indic-full-parameter-recovery')
base=[runtime,'-u',str(root/'scripts/train-indictrans2-lightning.py'),'--output',str(out),'--fixture-rows','2','--batch-size','1','--accelerator','cpu']
subprocess.run(base+['--max-steps','1'],cwd=root,check=True,timeout=900)
subprocess.run(base+['--max-steps','2','--resume',str(out/'checkpoints/final.ckpt')],cwd=root,check=True,timeout=900)
print('CPU recovery completed; this two-row fixture is not model-quality evidence',flush=True)
