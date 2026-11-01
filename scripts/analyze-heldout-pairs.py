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


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    for name in ('baseline', 'candidate', 'data', 'output'):
        p.add_argument('--' + name, type=Path, required=True)
    p.add_argument('--repetitions', type=int, default=1000)
    a = p.parse_args()
    if a.repetitions < 100:
        p.error('At least100 resamples required')
    if a.output.exists():
        p.error('Refusing to overwrite evidence')
    result = analyze(a.baseline, a.candidate, a.data, a.repetitions)
    a.output.parent.mkdir(parents=True, exist_ok=True)
    a.output.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result))
