#!/usr/bin/env python3
"""Focused tests for the real Lightning trainer's resume manifest contract."""
import importlib.util
import json
import tempfile
from pathlib import Path
from unittest.mock import patch


SCRIPT = Path(__file__).with_name('train-translation-lightning.py')
SPEC = importlib.util.spec_from_file_location('train_translation_lightning', SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def manifest(max_steps=1):
    return {
        'model': 'model', 'revision': 'revision', 'seed': 42,
        'max_steps': max_steps, 'train_rows': 2, 'validation_rows': 1,
        'train_sha256': 'a', 'validation_sha256': 'b', 'accelerator': 'cpu',
        'max_length': 8, 'batch_size': 1, 'learning_rate': 2e-5,
    }


def expect_value_error(previous, current, message):
    try:
        MODULE.validate_resume_manifest(previous, current)
    except ValueError:
        return
    raise AssertionError(message)


def expect_storage_error(path, minimum, message):
    with patch.object(MODULE.shutil, 'disk_usage', return_value=type('Usage', (), {'free': minimum - 1})()):
        try:
            MODULE.validate_output_storage(path, minimum)
        except OSError:
            return
    raise AssertionError(message)


def expect_incomplete_artifact(path):
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / 'checkpoints').mkdir()
        (root / 'export').mkdir()
        for relative in ('run-manifest.json', 'checkpoints/final.ckpt', 'export/config.json',
                         'export/model.safetensors', 'export/tokenizer_config.json'):
            target = root / relative
            target.write_text('{}', encoding='utf-8')
        manifest = MODULE.build_artifact_manifest(root)
        assert manifest['schema_version'] == 1
        assert len(manifest['files']) == 5
        assert all(len(item['sha256']) == 64 for item in manifest['files'])
        (root / 'export/config.json').unlink()
        try:
            MODULE.build_artifact_manifest(root)
        except FileNotFoundError:
            return
    raise AssertionError('incomplete artifact must be rejected')


def expect_tampered_artifact_rejected():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / 'checkpoints').mkdir()
        (root / 'export').mkdir()
        for relative in ('run-manifest.json', 'checkpoints/final.ckpt', 'export/config.json',
                         'export/model.safetensors', 'export/tokenizer_config.json'):
            target = root / relative
            target.write_text('{}', encoding='utf-8')
        artifact_manifest = MODULE.build_artifact_manifest(root)
        assert MODULE.verify_artifact_manifest(root, artifact_manifest)
        (root / 'export/model.safetensors').write_text('{tampered}', encoding='utf-8')
        try:
            MODULE.verify_artifact_manifest(root, artifact_manifest)
        except ValueError:
            return
    raise AssertionError('tampered artifact must be rejected')


def main():
    MODULE.validate_resume_manifest(manifest(1), manifest(2))
    expect_value_error(manifest(2), manifest(2), 'equal max_steps must be rejected')
    expect_value_error(manifest(2), manifest(1), 'decreased max_steps must be rejected')
    changed = manifest(2)
    changed['batch_size'] = 2
    expect_value_error(manifest(1), changed, 'changed immutable settings must be rejected')
    expect_storage_error(Path('/tmp/inferedge-output'), 100, 'low disk space must be rejected')
    expect_incomplete_artifact(Path('/tmp/inferedge-output'))
    expect_tampered_artifact_rejected()
    print('train-translation-lightning resume manifest tests passed')


if __name__ == '__main__':
    main()
