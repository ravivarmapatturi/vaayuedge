# English-to-Telugu benchmark comparison

Measured 2026-10-29. Same exact IN22 English sources/Telugu references and sacreBLEU metric configuration. External systems use official 2023-era released predictions rescored locally; their inference was not reproduced, and this does not establish current service performance. Local baseline is native Opus-MT, not the browser q8 end-to-end pipeline.

## in22-conv

| Order by chrF++ | System | BLEU | chrF++ |
|---:|---|---:|---:|
| 1 | IndicTrans2 (official release) | 13.568 | 45.049 |
| 2 | Azure (historical released outputs) | 13.513 | 44.547 |
| 3 | Google (historical released outputs) | 12.985 | 44.218 |
| 4 | IndicTrans1 (official release) | 11.660 | 42.066 |
| 5 | NLLB-MoE (official release) | 10.245 | 40.134 |
| 6 | NLLB (official release) | 9.662 | 39.634 |
| 7 | Opus-MT baseline | 3.852 | 28.367 |
| 8 | InferEdge 100-step pilot | 3.879 | 27.150 |
| 9 | mBART50 (official release) | 2.824 | 23.866 |

## in22-gen

| Order by chrF++ | System | BLEU | chrF++ |
|---:|---|---:|---:|
| 1 | IndicTrans2 (official release) | 18.394 | 51.583 |
| 2 | Google (historical released outputs) | 16.982 | 50.070 |
| 3 | Azure (historical released outputs) | 17.068 | 49.891 |
| 4 | NLLB-MoE (official release) | 16.473 | 48.879 |
| 5 | NLLB (official release) | 14.556 | 47.417 |
| 6 | IndicTrans1 (official release) | 14.662 | 45.737 |
| 7 | Opus-MT baseline | 3.675 | 26.863 |
| 8 | mBART50 (official release) | 2.805 | 20.623 |
| 9 | InferEdge 100-step pilot | 2.013 | 19.986 |

## Assessment

The pilot ranks 8/9 on conversational chrF++ and 9/9 on general chrF++ in this restricted comparison set. This is not a current market ranking. It is below its own native baseline on chrF++ in both domains and is not a release candidate. The conversational BLEU increase is only 0.027; no statistical advantage is established.

The official IndicTrans2 output exceeds the pilot by 17.899 conversational chrF++ and 31.596 general chrF++ points. These outputs may use different decoding settings; exact inference revisions are not established. We verified identical evaluation inputs and scoring, not identical generation protocols.

Sarvam-Translate is identified as a relevant competitor (official checkpoint sarvamai/sarvam-translate), but no matched Sarvam predictions were obtained. No Sarvam score, current Google/Azure comparison, independent device memory/latency/energy result, native human review, or superiority claim is established.

Next: investigate train/eval-mode warning and shortened outputs; validate language prefix and tokenizer behavior; benchmark an actual compact IndicTrans2 checkpoint before selecting architecture. Run proper paired uncertainty tests before making significance claims. Do not replace production or publish this checkpoint as a competitive model.

## Sources and reproducibility

Official release: https://github.com/AI4Bharat/IndicTrans2 (translation outputs link). Pinned BPCC revision: 5bde309374f21c39e7c3d505f28ae11f58f2a220. Archive SHA-256: 303d30f4869971ecc49d06c9c11e148dff380f930dfad251c6f073a87b7884bd. Full per-model prediction hashes, metric signatures, coverage and labels: artifacts/competitor-comparison/official-rescored.json.

Sarvam official model card: https://huggingface.co/sarvamai/sarvam-translate .
