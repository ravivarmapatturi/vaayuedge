"""Make a local IndicTrans2 export portable using reviewed pinned custom code."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path


def package(export, root):
    review = json.loads((root / 'docs/evidence/indictrans2-code-review.json').read_text())
    source = root / 'artifacts/indictrans2-code-review'
    # Verify every source before changing the export.
    for name, digest in review['files'].items():
        if hashlib.sha256((source / name).read_bytes()).hexdigest() != digest:
            raise ValueError(f'Reviewed source hash mismatch: {name}')
    for name in review['files']:
        shutil.copyfile(source / name, export / name)
    # Upstream ties decoder embeddings FROM lm_head. HF safe serialization
    # drops lm_head, which leaves the decoder on meta during reload. Preserve
    # both equal tensors so custom tie_weights has a materialized source.
    from safetensors.torch import load_file, save_file
    weights = export / 'model.safetensors'
    state = load_file(str(weights))
    decoder_key = 'model.decoder.embed_tokens.weight'
    if 'lm_head.weight' not in state:
        state['lm_head.weight'] = state[decoder_key].clone()
        temporary = export / 'portable-weights.safetensors'
        save_file(state, str(temporary), metadata={'format': 'pt'})
        temporary.replace(weights)
    del state
    for name in ('config.json', 'tokenizer_config.json'):
        path = export / name
        data = json.loads(path.read_text())
        def local(value):
            if isinstance(value, str):
                return value.split('--')[-1]
            if isinstance(value, list):
                return [local(item) for item in value]
            return value
        data['auto_map'] = {key: local(value) for key, value in data.get('auto_map', {}).items()}
        if name == 'tokenizer_config.json':
            for key in ('src_vocab_file', 'tgt_vocab_file', 'src_vocab_fp', 'tgt_vocab_fp', 'src_spm_fp', 'tgt_spm_fp'):
                data.pop(key, None)
        path.write_text(json.dumps(data, indent=2) + '\n')
    shutil.copyfile(source / 'README.md', export / 'UPSTREAM_MODEL_CARD.md')
    manifest = {'base_model': review['model'], 'base_revision': review['revision'],
                'custom_code_sha256': review['files'],
                'limitation': 'Packaging verification only; not a quality or release approval',
                'files': {p.name: hashlib.sha256(p.read_bytes()).hexdigest()
                          for p in sorted(export.iterdir()) if p.is_file() and p.name != 'export-manifest.json'}}
    (export / 'export-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('export', type=Path)
    args = parser.parse_args()
    package(args.export, Path(__file__).resolve().parents[1])
