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

heldout_source=next(pathlib.Path('/kaggle/input').rglob('HELDOUT_MANIFEST.json')).parent
heldout_manifest=json.loads((heldout_source/'HELDOUT_MANIFEST.json').read_text())
for name,digest in heldout_manifest['files'].items():
    path=heldout_source/name
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,'Held-out input hash mismatch'
    target=root/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(path,target)
exports=list(pathlib.Path('/kaggle/input').rglob('export-manifest.json'))
exports=[p for p in exports if hashlib.sha256(p.read_bytes()).hexdigest()==heldout_manifest['frozen_export_manifest_sha256']]
assert len(exports)==1,'Require exactly one frozen v5 export'
export=exports[0].parent
splits=[('bpcc-test','artifacts/kaggle-pilot/data/test.jsonl',426),('in22-conv','artifacts/pilot-benchmark-v1/in22-conv.jsonl',1503),('in22-gen','artifacts/pilot-benchmark-v1/in22-gen.jsonl',1024)]
for split,data,count in splits:
    for label in ('base','adapted'):
        command=[runtime,'-u',str(root/'scripts/evaluate-frozen-indictrans2.py'),'--data',str(root/data),'--split',split,'--sample-size',str(count),'--output','/kaggle/working/'+split+'-'+label]
        if label=='adapted':command+=['--export-dir',str(export)]
        print('Starting held-out inference',split,label,flush=True)
        subprocess.run(command,cwd=root,check=True,timeout=3600)
print('All frozen held-out inference completed; no training or production approval',flush=True)
