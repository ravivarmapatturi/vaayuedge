"""Compare paired internal validation runs without tuning on external tests."""
import argparse
import hashlib
import json
from pathlib import Path


def compare(baseline, candidate):
    validation_path = Path(__file__).resolve().parents[1] / 'artifacts/kaggle-pilot/data/validation.jsonl'
    validation_bytes = validation_path.read_bytes()
    validation_rows = [json.loads(line) for line in validation_bytes.decode().splitlines()]
    validation_rows.sort(key=lambda row: hashlib.sha256(('indic-validation-v1:' + row['source']).encode()).hexdigest())
    def read(directory):
        metrics = json.loads((directory / 'metrics.json').read_text())
        rows = [json.loads(line) for line in (directory / 'predictions.jsonl').read_text().splitlines()]
        if metrics['split'] != 'internal validation; BPCC-H-Daily':
            raise ValueError('Only internal validation is allowed')
        if metrics['sample_rows'] != len(rows) or not rows:
            raise ValueError('Prediction count mismatch or empty evidence')
        if metrics['validation_file_sha256'] != hashlib.sha256(validation_bytes).hexdigest():
            raise ValueError('Validation fingerprint does not match actual dataset')
        expected = [(row['source'], row['target']) for row in validation_rows[:len(rows)]]
        if [(row['source'], row['target']) for row in rows] != expected:
            raise ValueError('Predictions do not match deterministic actual validation rows')
        return metrics, rows
    base, base_rows = read(baseline)
    trial, trial_rows = read(candidate)
    for key in ('base_revision', 'validation_file_sha256', 'settings',
                'bleu_signature', 'chrf_signature', 'sampling', 'full_validation_rows'):
        if base[key] != trial[key]:
            raise ValueError(f'Incomparable evidence: {key}')
    identities = lambda rows: [(row['source'], row['target']) for row in rows]
    if identities(base_rows) != identities(trial_rows):
        raise ValueError('Ordered validation examples differ')
    if len(set(identities(base_rows))) != len(base_rows):
        raise ValueError('Duplicate validation examples')
    empty = lambda rows: sum(not row['prediction'].strip() for row in rows)
    ratio = lambda rows: sum(len(row['prediction']) for row in rows) / sum(len(row['target']) for row in rows)
    for metrics, rows in ((base, base_rows), (trial, trial_rows)):
        if metrics['empty_outputs'] != empty(rows) or abs(metrics['output_reference_char_ratio'] - ratio(rows)) > 1e-9:
            raise ValueError('Prediction diagnostics do not match metrics')
        from sacrebleu.metrics import CHRF
        metric = CHRF(word_order=2)
        score = metric.corpus_score([row['prediction'] for row in rows], [[row['target'] for row in rows]])
        if str(metric.get_signature()) != metrics['chrf_signature'] or abs(score.score - metrics['chrf_plus_plus']) > 1e-8:
            raise ValueError('chrF evidence does not reproduce from predictions')
    delta = trial['chrf_plus_plus'] - base['chrf_plus_plus']
    checks = {
        'complete_internal_validation': len(trial_rows) == trial['full_validation_rows'] == 412,
        'no_chrf_regression': delta >= 0,
        'no_new_empty_outputs': empty(trial_rows) <= empty(base_rows),
        'length_ratio_within_10_percent_of_baseline': 0.9 <= ratio(trial_rows) / ratio(base_rows) <= 1.1,
    }
    return {'rows': len(trial_rows), 'chrf_plus_plus_delta': delta,
            'identical_predictions': sum(a['prediction'] == b['prediction'] for a, b in zip(base_rows, trial_rows)),
            'checks': checks, 'internal_gate_passed': all(checks.values()),
            'production_approved': False,
            'limitation': 'Internal retention gate only. External quality, native human review and device measurements remain required.'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('baseline', type=Path)
    parser.add_argument('candidate', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    report = compare(args.baseline, args.candidate)
    if args.output.exists():
        parser.error('Refusing to overwrite evidence')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
