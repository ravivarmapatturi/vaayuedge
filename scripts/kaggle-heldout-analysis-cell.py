import subprocess,sys,os
os.environ['CUDA_VISIBLE_DEVICES']=''
subprocess.run([sys.executable,'-m','pip','install','-q','sacrebleu==2.6.0'],check=True,timeout=180)
"""Rescore frozen paired predictions and percentile-bootstrap corpus chrF++ deltas."""
import argparse
import hashlib
import json
import random
from pathlib import Path


def analyze(base_dir, candidate_dir, data, repetitions=1000, seed=20261030):
    from sacrebleu.metrics import BLEU, CHRF
    raw = data.read_bytes()
    expected = [json.loads(line) for line in raw.decode().splitlines()]
    expected.sort(key=lambda row: hashlib.sha256(('indic-validation-v1:' + row['source']).encode()).hexdigest())
    identity = lambda rows: [(r['source'], r['target']) for r in rows]
    reports, predictions = [], []
    for directory in (base_dir, candidate_dir):
        report = json.loads((directory / 'metrics.json').read_text())
        rows = [json.loads(line) for line in (directory / 'predictions.jsonl').read_text().splitlines()]
        if identity(rows) != identity(expected) or report['sample_rows'] != len(expected):
            raise ValueError('Incomplete or mismatched ordered corpus')
        if report['validation_file_sha256'] != hashlib.sha256(raw).hexdigest():
            raise ValueError('Dataset fingerprint mismatch')
        pred = [r['prediction'] for r in rows]
        for metric, key, signature in ((CHRF(word_order=2), 'chrf_plus_plus', 'chrf_signature'), (BLEU(), 'bleu', 'bleu_signature')):
            score = metric.corpus_score(pred, [[r['target'] for r in expected]]).score
            if abs(score - report[key]) > 1e-8 or str(metric.get_signature()) != report[signature]:
                raise ValueError('Saved score or signature disagrees with predictions')
        reports.append(report)
        predictions.append(pred)
    for key in ('split', 'settings', 'environment', 'evaluator_sha256', 'base_revision'):
        if reports[0][key] != reports[1][key]:
            raise ValueError('Incomparable paired runs: ' + key)
    if reports[1].get('export_manifest_sha256') != '5235276b82864e619e7868d374bfc4acaa21b204c8cf2f99addbf347c6575515':
        raise ValueError('Candidate is not frozen v5')
    rng = random.Random(seed)
    refs = [r['target'] for r in expected]
    metric = CHRF(word_order=2)
    deltas = []
    for _ in range(repetitions):
        indexes = rng.choices(range(len(refs)), k=len(refs))
        sampled_refs = [[refs[i] for i in indexes]]
        scores = [metric.corpus_score([pred[i] for i in indexes], sampled_refs).score for pred in predictions]
        deltas.append(scores[1] - scores[0])
    deltas.sort()
    return {'split': reports[0]['split'], 'rows': len(refs), 'repetitions': repetitions, 'seed': seed,
            'chrf_delta': reports[1]['chrf_plus_plus'] - reports[0]['chrf_plus_plus'],
            'percentile_95_interval': [deltas[int(.025 * (repetitions - 1))], deltas[int(.975 * (repetitions - 1))]],
            'method': 'paired sentence resampling; recomputed corpus chrF++; percentile interval',
            'limitations': 'Exploratory intervals per split, no multiplicity adjustment; no claim about human quality or universal superiority',
            'prediction_sha256': [hashlib.sha256((d / 'predictions.jsonl').read_bytes()).hexdigest() for d in (base_dir, candidate_dir)],
            'production_approved': False}



input_root=Path('/kaggle/input')
manifest_path=next(input_root.rglob('HELDOUT_MANIFEST.json'))
manifest=json.loads(manifest_path.read_text())
for name,digest in manifest['files'].items():
    if hashlib.sha256((manifest_path.parent/name).read_bytes()).hexdigest()!=digest:raise ValueError('Corpus bundle hash mismatch')
for split,data in [('bpcc-test','artifacts/kaggle-pilot/data/test.jsonl'),('in22-conv','artifacts/pilot-benchmark-v1/in22-conv.jsonl'),('in22-gen','artifacts/pilot-benchmark-v1/in22-gen.jsonl')]:
    bases=[p.parent for p in input_root.rglob('metrics.json') if p.parent.name==split+'-base']
    candidates=[p.parent for p in input_root.rglob('metrics.json') if p.parent.name==split+'-adapted']
    assert len(bases)==len(candidates)==1,'Require exactly one frozen v7 prediction pair'
    report=analyze(bases[0],candidates[0],manifest_path.parent/data,1000)
    output=Path('/kaggle/working')/(split+'-uncertainty.json')
    assert not output.exists()
    output.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report),flush=True)
