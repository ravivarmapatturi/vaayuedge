"""Allowlisted code/data bundle for CPU full-parameter recovery validation."""
import hashlib
import argparse
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
names = [
    'scripts/train-indictrans2-lightning.py', 'scripts/indictrans2_export.py',
    'scripts/validate-indictrans2-generation.py', 'scripts/compare-internal-validation.py',
    'artifacts/kaggle-pilot/data/validation.jsonl',
    'docs/indictrans2-adaptation-pilot-plan.md',
    'docs/evidence/indictrans2-code-review.json', 'docs/model-license-audit.md',
    'artifacts/indictrans2-training-prepared/manifest.json',
    'artifacts/indictrans2-training-prepared/train.jsonl',
    'artifacts/indictrans2-training-prepared/validation.jsonl',
]
names += ['artifacts/indictrans2-code-review/' + name for name in
          ('configuration_indictrans.py', 'modeling_indictrans.py', 'tokenization_indictrans.py', 'README.md')]
instructions = '''# CPU recovery validation bundle

This is preparation, not a competitive trained model. Keep accelerator CPU.
Use a free higher-memory environment; no paid compute is authorized.
Dependencies used locally: Python3.12, torch2.6.0, transformers4.51.3,
lightning2.6.6, torchdata0.11.0, safetensors0.8.0 and sentencepiece.
Install dependencies in an isolated environment. Download the gated upstream
model using your existing authorized Hugging Face access (never embed tokens).
Pinned model: ai4bharat/indictrans2-en-indic-dist-200M
Revision: 2cfd0a20057756d756bf3e53528f492afc52f91a
Review included source hashes before allowing trust_remote_code.

Run from the extracted root after caching that pinned snapshot:
python scripts/train-indictrans2-lightning.py --output recovery --max-steps 1 --fixture-rows 2 --batch-size 1 --accelerator cpu
python scripts/train-indictrans2-lightning.py --output recovery --max-steps 2 --fixture-rows 2 --batch-size 1 --accelerator cpu --resume recovery/checkpoints/final.ckpt

Do NOT set --probe-last-layer-only: this check must cover all parameters.
Inspect finite loss, restored optimizer/global step, selected checkpoint,
portable export and offline reload. Preserve logs and hashes. These two rows
are a recovery fixture, not training quality evidence. The held-out test split
is deliberately excluded. GPU training remains gated on recovery/evaluation.
'''
contents = {name: (root / name).read_bytes() for name in names}
contents['RECOVERY.md'] = instructions.encode()
manifest = {'purpose': 'CPU full-parameter recovery; no GPU or paid compute',
            'files': {name: hashlib.sha256(data).hexdigest() for name, data in contents.items()}}
contents['BUNDLE_MANIFEST.json'] = (json.dumps(manifest, indent=2) + '\n').encode()
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=root / 'artifacts/indictrans2-cpu-recovery-bundle.zip')
out = parser.parse_args().output
if out.exists():
    raise FileExistsError('Refusing to overwrite bundle evidence')
with ZipFile(out, 'w', ZIP_DEFLATED) as archive:
    for name, data in contents.items():
        archive.writestr(name, data)
with ZipFile(out) as archive:
    assert archive.testzip() is None
    assert all(hashlib.sha256(archive.read(name)).hexdigest() == digest for name, digest in manifest['files'].items())
print(json.dumps({'path': str(out), 'bytes': out.stat().st_size, 'files': len(contents),
                  'sha256': hashlib.sha256(out.read_bytes()).hexdigest()}, indent=2))
