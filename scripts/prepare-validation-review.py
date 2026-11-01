"""Create a deterministic validation-only triage pack; no automatic human ratings."""
import argparse
import hashlib
import json
import re
from pathlib import Path


def prepare(predictions, validation, output):
    from sacrebleu.metrics import CHRF
    rows = [json.loads(x) for x in predictions.read_text().splitlines()]
    refs = [json.loads(x) for x in validation.read_text().splitlines()]
    identity = lambda rs: sorted((r['source'], r['target']) for r in rs)
    if len(refs) != 412 or identity(rows) != identity(refs):
        raise ValueError('Require complete internal validation membership')
    if output.exists(): raise FileExistsError('Refuse to overwrite review evidence')
    metric = CHRF(word_order=2)
    reviewed = []
    for row in rows:
        pred = row['prediction']
        source_numbers = re.findall(r'\d+(?:[.,]\d+)*', row['source'])
        predicted_numbers = re.findall(r'\d+(?:[.,]\d+)*', pred)
        flags = []
        if not pred.strip(): flags.append('empty')
        if not re.search(r'[\u0c00-\u0c7f]', pred): flags.append('no_telugu_script')
        if source_numbers != predicted_numbers: flags.append('numeral_form_or_order_difference')
        score = metric.sentence_score(pred, [row['target']]).score
        reviewed.append({'id':hashlib.sha256(row['source'].encode()).hexdigest(),
                         'source':row['source'],'reference':row['target'],'prediction':pred,
                         'sentence_chrf_plus_plus':score,'triage_flags':flags,
                         'human_adequacy':None,'human_fluency':None,'reviewer_notes':None})
    reviewed.sort(key=lambda r:(r['sentence_chrf_plus_plus'],r['id']))
    output.mkdir(parents=True)
    (output/'review.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in reviewed))
    report={'rows':len(rows),'predictions_sha256':hashlib.sha256(predictions.read_bytes()).hexdigest(),
            'validation_sha256':hashlib.sha256(validation.read_bytes()).hexdigest(),
            'flags':{f:sum(f in r['triage_flags'] for r in reviewed) for f in ('empty','no_telugu_script','numeral_form_or_order_difference')},
            'scope':'Upstream baseline validation triage only; no adapted-model error attribution or human ratings. Numerals may legitimately be spelled out; flags are not proven errors.'}
    (output/'summary.json').write_text(json.dumps(report,indent=2)+'\n')
    return report

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--predictions',type=Path,required=True);p.add_argument('--validation',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    a=p.parse_args();print(json.dumps(prepare(a.predictions,a.validation,a.output),indent=2))
