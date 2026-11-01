# Published research checkpoints

Published to the authorized `ravivarmapatturi` Hugging Face account. All published file content hashes independently match verified local release files (Git blob hashes for ordinary files; SHA256 for LFS files). Public research releases; no production replacement.

| Checkpoint | Public repository | Verified commit | Evidence scope |
|---|---|---|---|
| inferedge-indictrans2-en-te-1000steps-v1 | [ravivarmapatturi/inferedge-indictrans2-en-te-1000steps-v1](https://huggingface.co/ravivarmapatturi/inferedge-indictrans2-en-te-1000steps-v1) | `a2562b9862a5d58fcf14ba313b7fb1a5bb61796b` | 1000-step IndicTrans2; independently rescored412-row internal validation only |
| inferedge-indictrans2-en-te-100steps-v1 | [ravivarmapatturi/inferedge-indictrans2-en-te-100steps-v1](https://huggingface.co/ravivarmapatturi/inferedge-indictrans2-en-te-100steps-v1) | `3dba3782c79b916690025e36e8351625bc1715d5` | 100-step IndicTrans2; internal validation,2953 held-out pairs and exploratory uncertainty |
| inferedge-opus-en-te-100steps-research-v1 | [ravivarmapatturi/inferedge-opus-en-te-100steps-research-v1](https://huggingface.co/ravivarmapatturi/inferedge-opus-en-te-100steps-research-v1) | `6fc353b50bfc5f13be9cdeeedaefc58687a0e6f2` | 100-step OPUS pilot; historical negative result,2527 held-out pairs independently rescored |

Each repo includes real SafeTensors weights, tokenizer/configuration, exact upstream license/attribution, checkpoint-specific benchmark JSON and limitations, training provenance and a public RELEASE_MANIFEST.json. Corpus/reference data, credentials and optimizer/pickle checkpoints were excluded. Diagnostic fixtures/probes are not separate model releases.

Latest internal validation: chrF++58.3144517646/BLEU27.5137871338,zeroempty; strict internal retention gate passes. This does not transfer100-step external results to the1000-step model. General-domain improvement is unproven for v5, and OPUS adaptation regressed. Native-speaker review, fresh confirmatory tests and named-device export/memory/latency/energy remain pending.
