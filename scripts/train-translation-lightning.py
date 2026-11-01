#!/usr/bin/env python3
"""Bounded pretrained English→Telugu fine-tuning with PyTorch Lightning.

Requires separately audited data/model rights. Default execution is CPU.
Use pinned model revisions; validation data must be separate from training.
"""
import argparse
import hashlib
import json
import shutil
from pathlib import Path


def validate_resume_manifest(previous_manifest, current_manifest):
    """Validate the immutable resume contract and an increasing step budget."""
    immutable_previous = {k: v for k, v in previous_manifest.items() if k != 'max_steps'}
    immutable_current = {k: v for k, v in current_manifest.items() if k != 'max_steps'}
    if immutable_previous != immutable_current:
        raise ValueError('Resume requires identical model, data, and training configuration')
    if current_manifest['max_steps'] <= previous_manifest.get('max_steps', 0):
        raise ValueError('Resume requires a larger --max-steps than the previous run')


def validate_output_storage(output, minimum_free_bytes):
    """Fail before model loading if the output volume is too close to full."""
    free_bytes = shutil.disk_usage(output.parent).free
    if free_bytes < minimum_free_bytes:
        raise OSError(
            f'Insufficient free space for checkpoint/export run: '
            f'{free_bytes} bytes available, {minimum_free_bytes} required'
        )
    return free_bytes


def build_artifact_manifest(output):
    """Record the files needed to identify a completed checkpoint/export."""
    required = [
        output / 'run-manifest.json',
        output / 'checkpoints' / 'final.ckpt',
        output / 'export' / 'config.json',
        output / 'export' / 'model.safetensors',
        output / 'export' / 'tokenizer_config.json',
    ]
    missing = [str(path.relative_to(output)) for path in required if not path.is_file()]
    if missing:
        raise FileNotFoundError(f'Incomplete trainer artifact; missing: {", ".join(missing)}')
    files = []
    for path in required:
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        files.append({'path': str(path.relative_to(output)), 'bytes': path.stat().st_size,
                      'sha256': digest})
    return {'schema_version': 1, 'files': files}


def verify_artifact_manifest(output, artifact_manifest):
    """Verify persisted artifact paths, sizes, and SHA-256 digests."""
    if artifact_manifest.get('schema_version') != 1:
        raise ValueError('Unsupported artifact manifest schema')
    files = artifact_manifest.get('files')
    if not isinstance(files, list) or not files:
        raise ValueError('Artifact manifest must contain files')
    for item in files:
        relative = item.get('path')
        if not isinstance(relative, str) or Path(relative).is_absolute():
            raise ValueError('Artifact manifest contains an invalid path')
        path = output / relative
        if not path.is_file():
            raise FileNotFoundError(f'Missing artifact: {relative}')
        if path.stat().st_size != item.get('bytes'):
            raise ValueError(f'Artifact size mismatch: {relative}')
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != item.get('sha256'):
            raise ValueError(f'Artifact digest mismatch: {relative}')
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--train', type=Path, required=True)
    parser.add_argument('--validation', type=Path, required=True)
    parser.add_argument('--model', default='Helsinki-NLP/opus-mt-en-dra')
    parser.add_argument('--revision', required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--resume', type=Path)
    parser.add_argument('--max-steps', type=int, default=100)
    parser.add_argument('--batch-size', type=int, default=4)
    parser.add_argument('--max-length', type=int, default=128)
    parser.add_argument('--learning-rate', type=float, default=2e-5)
    parser.add_argument('--accelerator', choices=['cpu', 'gpu'], default='cpu')
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--accumulate-grad-batches', type=int, default=1)
    parser.add_argument('--warmup-steps', type=int, default=0)
    parser.add_argument('--validation-every-batches', type=int, default=100)
    parser.add_argument('--min-free-bytes', type=int, default=1_500_000_000,
                        help='minimum free bytes required before loading the model')
    args = parser.parse_args()
    if min(args.max_steps, args.batch_size, args.max_length) < 1:
        parser.error('step, batch and length bounds must be positive')
    if args.accumulate_grad_batches < 1 or args.validation_every_batches < 1:
        parser.error('accumulation and validation intervals must be positive')
    if not 0 <= args.warmup_steps < args.max_steps:
        parser.error('warmup steps must be nonnegative and below max steps')
    if args.min_free_bytes < 1:
        parser.error('--min-free-bytes must be positive')
    if args.output.exists() and not args.resume:
        parser.error('output exists: use a new directory or explicit --resume')
    validate_output_storage(args.output, args.min_free_bytes)
    import torch
    import lightning.pytorch as pl
    from lightning.pytorch.callbacks import ModelCheckpoint
    from torch.utils.data import DataLoader
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

    def read(path):
        rows = [json.loads(line) for line in path.read_text(encoding='utf-8').splitlines()]
        if not rows or any(not isinstance(r.get(k), str) or not r[k].strip()
                           for r in rows for k in ('source', 'target')):
            raise ValueError(f'Expected nonempty source/target rows: {path}')
        return rows

    train, validation = read(args.train), read(args.validation)
    import unicodedata
    normalize = lambda s: ' '.join(unicodedata.normalize('NFKC', s).casefold().split())
    if {normalize(r['source']) for r in train} & {normalize(r['source']) for r in validation}:
        raise ValueError('Training and validation source overlap')
    pl.seed_everything(args.seed, workers=True)
    tokenizer = AutoTokenizer.from_pretrained(args.model, revision=args.revision)
    model = AutoModelForSeq2SeqLM.from_pretrained(args.model, revision=args.revision)
    prefix = '>>tel<< ' if args.model == 'Helsinki-NLP/opus-mt-en-dra' else ''

    def collate(rows):
        inputs = tokenizer([prefix + r['source'] for r in rows], padding=True,
                           truncation=True, max_length=args.max_length, return_tensors='pt')
        targets = tokenizer(text_target=[r['target'] for r in rows], padding=True,
                            truncation=True, max_length=args.max_length, return_tensors='pt')
        labels = targets['input_ids']
        labels[targets['attention_mask'] == 0] = -100
        return dict(inputs, labels=labels)

    class Translator(pl.LightningModule):
        def __init__(self):
            super().__init__()
            self.model = model
            self.model.train()
            self.save_hyperparameters({'model': args.model, 'revision': args.revision,
                                       'learning_rate': args.learning_rate})

        def on_train_epoch_start(self):
            self.model.train()

        def training_step(self, batch, batch_idx):
            if not self.model.training:
                raise RuntimeError('Translation model must be in training mode during optimization')
            loss = self.model(**batch).loss
            self.log('train_loss', loss, on_step=True, batch_size=len(batch['labels']))
            return loss

        def validation_step(self, batch, batch_idx):
            loss = self.model(**batch).loss
            self.log('val_loss', loss, on_epoch=True, batch_size=len(batch['labels']))

        def configure_optimizers(self):
            optimizer = torch.optim.AdamW(self.parameters(), lr=args.learning_rate)
            def schedule(step):
                if args.warmup_steps and step < args.warmup_steps:
                    return (step + 1) / args.warmup_steps
                return max(0.0, (args.max_steps - step) / max(1, args.max_steps - args.warmup_steps))
            scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, schedule)
            return {'optimizer': optimizer, 'lr_scheduler': {'scheduler': scheduler, 'interval': 'step'}}

    args.output.mkdir(parents=True, exist_ok=True)
    manifest = {'model': args.model, 'revision': args.revision,
                'seed': args.seed, 'max_steps': args.max_steps,
                'train_rows': len(train), 'validation_rows': len(validation),
                'train_sha256': hashlib.sha256(args.train.read_bytes()).hexdigest(),
                'validation_sha256': hashlib.sha256(args.validation.read_bytes()).hexdigest(),
                'accelerator': args.accelerator, 'max_length': args.max_length,
                'batch_size': args.batch_size, 'learning_rate': args.learning_rate,
                'accumulate_grad_batches': args.accumulate_grad_batches,
                'warmup_steps': args.warmup_steps,
                'validation_every_batches': args.validation_every_batches,
                'scheduler': 'linear-warmup-decay-v1', 'explicit_train_mode': True}
    manifest_path = args.output / 'run-manifest.json'
    if args.resume:
        previous_manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
        # A resumed run may extend its step budget, but must keep the model,
        # data, preprocessing, seed, and optimizer configuration identical.
        # Persist the new budget so a later resume has the current contract.
        validate_resume_manifest(previous_manifest, manifest)
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    checkpoint = ModelCheckpoint(dirpath=args.output / 'checkpoints', save_last=True,
                                 every_n_train_steps=min(25, args.max_steps), save_top_k=0)
    trainer = pl.Trainer(accelerator=args.accelerator, devices=1, max_steps=args.max_steps,
                         callbacks=[checkpoint], default_root_dir=args.output,
                         deterministic=True, logger=False, log_every_n_steps=1,
                         accumulate_grad_batches=args.accumulate_grad_batches,
                         val_check_interval=args.validation_every_batches,
                         check_val_every_n_epoch=None,
                         gradient_clip_val=1.0, num_sanity_val_steps=1)
    module = Translator()
    trainer.fit(module,
                DataLoader(train, batch_size=args.batch_size, shuffle=True, collate_fn=collate),
                DataLoader(validation, batch_size=args.batch_size, collate_fn=collate),
                ckpt_path=str(args.resume) if args.resume else None)
    trainer.validate(module, DataLoader(validation, batch_size=args.batch_size, collate_fn=collate))
    trainer.save_checkpoint(args.output / 'checkpoints' / 'final.ckpt')
    module.model.save_pretrained(args.output / 'export')
    tokenizer.save_pretrained(args.output / 'export')
    artifact_manifest = build_artifact_manifest(args.output)
    (args.output / 'artifact-manifest.json').write_text(
        json.dumps(artifact_manifest, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'completed_optimizer_steps': trainer.global_step,
                      'export': str(args.output / 'export'),
                      'artifact_manifest': str(args.output / 'artifact-manifest.json')}))


if __name__ == '__main__':
    main()
