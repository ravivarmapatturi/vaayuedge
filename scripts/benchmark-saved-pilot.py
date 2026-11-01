"""Recover the user-authorized Kaggle archive and run matched CPU evaluation."""
import hashlib, json, os, shutil, subprocess, sys, time, zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=root/'artifacts/pilot-benchmark-v1'
out.mkdir(parents=True,exist_ok=True)
downloads=Path('/home/ravivarma/Downloads')
partial=downloads/'Unconfirmed 149438.crdownload'
started=partial.stat().st_mtime if partial.exists() else time.time()-600
archive=None
for _ in range(120):
    candidates=[p for p in downloads.iterdir() if p.is_file() and p.suffix.lower()=='.zip' and p.stat().st_mtime>=started-60]
    for p in sorted(candidates,key=lambda p:p.stat().st_mtime,reverse=True):
        if zipfile.is_zipfile(p):
            with zipfile.ZipFile(p) as z:
                if any(n.endswith('/artifact-manifest.json') for n in z.namelist()):
                    archive=p; break
    if archive: break
    time.sleep(10)
if archive is None: raise SystemExit('Download did not complete within 20 minutes')
local=out/'kaggle-output.zip'
shutil.copy2(archive,local)
with zipfile.ZipFile(local) as z:
    for member in z.infolist():
        dest=(out/member.filename).resolve()
        if not dest.is_relative_to(out.resolve()): raise ValueError('Unsafe archive path')
    z.extractall(out)
manifest_path=next(out.rglob('artifact-manifest.json'))
model_root=manifest_path.parent
manifest=json.loads(manifest_path.read_text())
for item in manifest['files']:
    p=(model_root/item['path']).resolve()
    if not p.is_relative_to(model_root.resolve()): raise ValueError('Unsafe manifest path')
    if p.stat().st_size!=item['bytes'] or hashlib.sha256(p.read_bytes()).hexdigest()!=item['sha256']:
        raise ValueError('Artifact integrity failure: '+item['path'])
(out/'verification.json').write_text(json.dumps({'verified':True,'kaggle_version':363252210,'archive_sha256':hashlib.sha256(local.read_bytes()).hexdigest(),'files':manifest['files']},indent=2))
print('Artifact integrity verified',flush=True)
env=dict(os.environ,OMP_NUM_THREADS='4',MKL_NUM_THREADS='4',TOKENIZERS_PARALLELISM='false')
python='/tmp/inferedge-model-env/bin/python'
for benchmark in ['in22-conv','in22-gen']:
    reference=Path('/tmp/inferedge-in22-r1tbY5/export')/(benchmark+'.jsonl')
    shutil.copy2(reference,out/reference.name)
    predictions=out/(benchmark+'.predictions.jsonl')
    subprocess.run([python,str(root/'scripts/generate-baseline-predictions.py'),'--references',str(out/reference.name),'--predictions',str(predictions),'--export-dir',str(model_root/'export'),'--batch-size','8'],check=True,env=env)
    subprocess.run([python,str(root/'scripts/evaluate-translation.py'),'--references',str(out/reference.name),'--predictions',str(predictions),'--model-name','InferEdge Opus-MT BPCC Daily 100-step pilot','--model-revision','kaggle-363252210','--pipeline-source','local CPU; pinned Kaggle export; matched decoding','--allow-duplicate-sources','--output',str(out/(benchmark+'.metrics.json'))],check=True,env=env)
print('Both complete benchmark reports saved',flush=True)
