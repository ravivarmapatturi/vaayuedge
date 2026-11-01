"""Stage a verified research export without changing its frozen source or uploading."""
import argparse
import hashlib
import importlib.util
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('frozen_audit', ROOT / 'scripts/audit-frozen-export.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def stage(source, destination):
    source = source.resolve(strict=True)
    destination = destination.resolve()
    if destination == source or source in destination.parents or destination in source.parents:
        raise ValueError('Source and staging directories must be separate')
    if destination.exists():
        raise FileExistsError('Refuse to overwrite staging directory')
    audit = module.audit(source)
    notice = ROOT / 'docs/release-notices'
    license_provenance = json.loads((notice / 'upstream-license-provenance.json').read_text())
    license_bytes = (notice / 'INDICTRANS2-LICENSE.txt').read_bytes()
    if hashlib.sha256(license_bytes).hexdigest() != license_provenance['sha256']:
        raise ValueError('Upstream license copy mismatch')
    additions = {'README.md': ROOT / 'docs/frozen-v5-model-card-draft.md',
                 'LICENSE': notice / 'INDICTRANS2-LICENSE.txt',
                 'ATTRIBUTION.md': notice / 'ATTRIBUTION-DRAFT.md',
                 'upstream-license-provenance.json': notice / 'upstream-license-provenance.json'}
    if set(additions) & {p.name for p in source.iterdir()}:
        raise ValueError('Release additions collide with frozen files')
    # All inputs checked before creating destination; no recursive directory copy.
    for path in additions.values():
        if path.is_symlink() or not path.is_file():
            raise ValueError('Missing or linked release document')
    destination.mkdir(parents=True)
    for path in source.iterdir():
        shutil.copyfile(path, destination / path.name)
    for name, path in additions.items():
        shutil.copyfile(path, destination / name)
    files = {}
    for path in sorted(destination.iterdir()):
        h = hashlib.sha256()
        with path.open('rb') as stream:
            for block in iter(lambda: stream.read(1024 * 1024), b''):
                h.update(block)
        files[path.name] = {'sha256': h.hexdigest(), 'bytes': path.stat().st_size}
    report = {'frozen_source_audit': audit, 'files': files,
              'upload_approved': False, 'production_approved': False,
              'purpose': 'Local staging only; final loading, notices and upload allowlist review remain required'}
    (destination / 'release-manifest.json').write_text(json.dumps(report, indent=2) + '\n')
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    args = parser.parse_args()
    report = stage(args.source, args.destination)
    print(json.dumps({'staged_files': len(report['files']), 'uploaded': False}))
