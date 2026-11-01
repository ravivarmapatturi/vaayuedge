"""Verify public release file membership and every published Git/LFS content hash."""
import hashlib,json,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
JOBS=[('v1000','inferedge-indictrans2-en-te-1000steps-v1'),('v5','inferedge-indictrans2-en-te-100steps-v1'),('opus','inferedge-opus-en-te-100steps-research-v1')]
results=[]
for label,name in JOBS:
 repo='ravivarmapatturi/'+name
 with urllib.request.urlopen(f'https://huggingface.co/api/models/{repo}?blobs=true',timeout=45) as response:metadata=json.load(response)
 assert metadata['private'] is False
 siblings={x['rfilename']:x for x in metadata['siblings']}
 files=json.loads((ROOT/f'artifacts/release-{label}/upload-allowlist.json').read_text())['files']
 for name,digest in files.items():
  local=ROOT/f'artifacts/release-{label}/hub'/name;remote=siblings[name]
  assert local.stat().st_size==remote['size'],name
  if remote.get('lfs'):
   assert remote['lfs']['sha256']==digest,name
  else:
   raw=local.read_bytes();git_hash=hashlib.sha1(f'blob {len(raw)}\0'.encode()+raw).hexdigest()
   assert remote['blobId']==git_hash,name
 assert set(siblings)-set(files)<={'.gitattributes'}
 result={'repo':repo,'url':'https://huggingface.co/'+repo,'commit':metadata['sha'],'public':True,'verified_file_count':len(files),'all_file_content_hashes_match':True,'weight_sha256':files['model.safetensors'],'production_approved':False};results.append(result)
 print(json.dumps(result),flush=True)
(ROOT/'docs/evidence/huggingface-research-releases-verified.json').write_text(json.dumps(results,indent=2)+'\n')
