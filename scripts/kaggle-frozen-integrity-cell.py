"""Read-only integrity audit; never execute model code or authorize publication."""
import argparse
import hashlib
import json
from pathlib import Path

FROZEN = '5235276b82864e619e7868d374bfc4acaa21b204c8cf2f99addbf347c6575515'
REVISION = '2cfd0a20057756d756bf3e53528f492afc52f91a'


def audit(directory, expected_manifest=FROZEN):
    directory = directory.resolve(strict=True)
    manifest_path = directory / 'export-manifest.json'
    if manifest_path.is_symlink():
        raise ValueError('Symlink manifest rejected')
    raw = manifest_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected_manifest:
        raise ValueError('Frozen manifest mismatch')
    manifest = json.loads(raw)
    if manifest.get('base_revision') != REVISION:
        raise ValueError('Base revision mismatch')
    files = manifest['files']
    if not isinstance(files, dict) or not files:
        raise ValueError('Empty or invalid file manifest')
    actual = set()
    for entry in directory.iterdir():
        if entry.is_symlink() or not entry.is_file():
            raise ValueError('Reject symlinks, directories and special files')
        actual.add(entry.name)
    if actual != set(files) | {'export-manifest.json'}:
        raise ValueError('Unmanifested or missing files')
    total = 0
    for name, digest in files.items():
        if Path(name).name != name or name in ('.', '..'):
            raise ValueError('Unsafe manifest filename')
        hasher = hashlib.sha256()
        with (directory / name).open('rb') as stream:
            for block in iter(lambda: stream.read(1024 * 1024), b''):
                total += len(block)
                hasher.update(block)
        if hasher.hexdigest() != digest:
            raise ValueError('Export file digest mismatch: ' + name)
    return {'integrity_verified': True, 'manifest_sha256': expected_manifest,
            'base_revision': REVISION, 'file_count': len(files),
            'manifested_bytes': total, 'publication_approved': False,
            'remaining_gates': ['Exact upstream license and notices',
                                'Training data attribution',
                                'Research model card and tested loading example',
                                'Authorized destination and final upload allowlist review'],
            'scope': 'Byte integrity only; no model execution, credential scan, license clearance or device validation'}



# Kaggle CPU-only integrity inspection; no model imports or optimizer.
import os
os.environ['CUDA_VISIBLE_DEVICES'] = ''
root = Path('/kaggle/input')
candidates = list(root.rglob('export-manifest.json'))
matching = [p for p in candidates if not p.is_symlink() and hashlib.sha256(p.read_bytes()).hexdigest() == FROZEN]
if len(matching) != 1:
    raise ValueError('Attach exactly one retained frozen v5 export')
report = audit(matching[0].parent)
output = Path('/kaggle/working/frozen-v5-integrity.json')
if output.exists():
    raise FileExistsError('Refuse report overwrite')
output.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report), flush=True)
