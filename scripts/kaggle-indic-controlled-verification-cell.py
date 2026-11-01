"""Kaggle cell: same-environment CPU baseline and saved-pilot verification, never GPU training."""
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
candidate=next(p.parent for p in pathlib.Path('/kaggle/input').rglob('metrics.json') if p.parent.name=='indic-adaptation-validation')
assert (candidate/'predictions.jsonl').is_file(),'Attach saved version5 notebook output'
base_output=pathlib.Path('/kaggle/working/base-validation-controlled')
subprocess.run([runtime,'-u',str(root/'scripts/validate-indictrans2-generation.py'),'--sample-size','412','--output',str(base_output)],cwd=root,check=True,timeout=900)
subprocess.run([runtime,str(root/'scripts/compare-internal-validation.py'),str(base_output),str(candidate),'--output','/kaggle/working/retention-gate.json'],cwd=root,check=True,timeout=120)
print('Controlled baseline and saved-prediction gate completed; no new training',flush=True)
