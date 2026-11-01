# Frozen v5 held-out results

Measured in one matching Kaggle CPU environment; checkpoint frozen before test execution. Scores below are extracted from committed run363645611. Raw predictions were independently rescored successfully in committed analysis run363664956.

| Split | Rows | Base chrF++ | Adapted chrF++ | Delta | Base BLEU | Adapted BLEU |
|---|---:|---:|---:|---:|---:|---:|
| bpcc-test | 426 | 53.6451 | 54.6040 | +0.9589 | 19.9198 | 21.5296 |
| in22-conv | 1503 | 44.6710 | 44.8902 | +0.2192 | 13.0600 | 13.5208 |
| in22-gen | 1024 | 51.4335 | 51.3796 | -0.0540 | 18.2014 | 18.2476 |

BPCC test and IN22 conversation point estimates improve. IN22 general chrF++ declines slightly despite slightly higher BLEU. Therefore no universal improvement or superiority claim is justified. Zero empty outputs in all six passes. Single-run timings do not demonstrate latency superiority. Native Telugu review and target-device measurements remain required. No production release approved.

Evidence: `docs/evidence/kaggle-heldout-v7-ui.txt`, `docs/evidence/indic-heldout-v7-observed.json`. Twelve raw metrics/prediction files remain in committed Kaggle output.

## Paired uncertainty analysis

Measured exploratory percentile intervals from1000 paired sentence bootstrap samples per split, seed20261030; corpus chrF++ recomputed for each sample. Full source/reference identities, dataset hashes, metric scores/signatures, matched environment/decoding and frozen checkpoint identity passed verification before resampling.

| Split | chrF++ delta | Exploratory95% interval |
|---|---:|---:|
| bpcc-test | +0.9589 | [+0.3810, +1.6155] |
| in22-conv | +0.2192 | [+0.0173, +0.4114] |
| in22-gen | -0.0540 | [-0.1698, +0.0633] |

BPCC and conversation intervals exclude zero under this resampling method; the general-domain interval includes zero. These intervals are unadjusted for multiple comparisons, assume sentence-level resampling is appropriate, and do not establish human translation quality or superiority over other providers. No repeated-seed training uncertainty is measured.

Analysis run363664956 completed successfully in2241.4seconds CPU with three report files. Evidence: `docs/evidence/indic-heldout-uncertainty-v1.json` and `docs/evidence/kaggle-uncertainty-v1-ui.txt`. Raw predictions remain in the original committed Kaggle output.
