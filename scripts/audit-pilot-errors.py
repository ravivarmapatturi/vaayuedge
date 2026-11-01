import json,re,statistics
from pathlib import Path
from sacrebleu.metrics import CHRF
from transformers import AutoTokenizer
root=Path('artifacts/pilot-benchmark-v1');out=Path('docs/evidence/pilot-error-audit');out.mkdir(parents=True,exist_ok=True)
tok=AutoTokenizer.from_pretrained(root/'inferedge-pilot-100steps/export',local_files_only=True)
train=[json.loads(x) for x in Path('artifacts/kaggle-pilot/data/train.jsonl').read_text().splitlines()]
lengths=tok(text_target=[x['target'] for x in train],truncation=False)['input_ids']
report={'train_rows':len(train),'training_target_tokens_over_128':sum(len(x)>128 for x in lengths),'median_target_tokens':statistics.median(map(len,lengths)),'benchmarks':{}}
for b in ['in22-conv','in22-gen']:
 refs=[json.loads(x) for x in (root/(b+'.jsonl')).read_text().splitlines()]
 pilot=[json.loads(x) for x in (root/(b+'.predictions.jsonl')).read_text().splitlines()]
 base=[json.loads(x) for x in Path(f'docs/evidence/{b}-2026-10-28/{b}.predictions.jsonl').read_text().splitlines()]
 metric=CHRF(word_order=2);cases=[]
 for r,p,a in zip(refs,pilot,base):
  assert r['source']==p['source']==a['source']
  delta=metric.sentence_score(p['prediction'],[r['target']]).score-metric.sentence_score(a['prediction'],[r['target']]).score
  cases.append({'source':r['source'],'reference':r['target'],'baseline':a['prediction'],'pilot':p['prediction'],'sentence_chrf_delta':delta})
 cases.sort(key=lambda x:x['sentence_chrf_delta'])
 (out/(b+'.review.jsonl')).write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in cases[:30]+cases[-10:]))
 report['benchmarks'][b]={'rows':len(cases),'sentence_chrf_worse':sum(x['sentence_chrf_delta']<0 for x in cases),'sentence_chrf_better':sum(x['sentence_chrf_delta']>0 for x in cases),'unchanged_outputs':sum(p['prediction']==a['prediction'] for p,a in zip(pilot,base)),'pilot_ascii_digits_missing_from_source_count':sum(bool(re.search(r'\d',r['source'])) and not bool(re.search(r'\d',p['prediction'])) for r,p in zip(refs,pilot)),'digit_check_caveat':'Surface diagnostic only; Telugu digits or verbalization may be valid'}
(out/'summary.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
