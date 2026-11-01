# Frozen-v5 research release attribution draft

This candidate adapts AI4Bharat's IndicTrans2 English-to-Indic distilled model, `ai4bharat/indictrans2-en-indic-dist-200M`, revision `2cfd0a20057756d756bf3e53528f492afc52f91a`. AI4Bharat provides the pretrained weights, architecture and original custom model/tokenizer code. The exact pinned upstream MIT license is retained in INDICTRANS2-LICENSE.txt; preserve it when distributing applicable upstream material.

InferEdge AI / VaayuEdge changes: 100-step English-to-Telugu conversational full-parameter adaptation; portable local export configuration; reviewed custom-code bundling; preservation of tied output/decoder weights for reload; reproducible training and evaluation tooling. The underlying architecture is not claimed as an InferEdge invention. See the research model card for measured results and limitations.

Training data: BPCC-H-Daily Telugu, attributed to AI4Bharat and the IndicTrans2 authors. The recorded upstream Daily-component README specifies CC-BY-4.0. Cleaning, deterministic splitting and adaptation are project modifications. A release must preserve the exact dataset source revision and applicable attribution evidence; permissions for unrelated BPCC components must not be inferred. Dataset redistribution is not part of the model upload allowlist.

Evaluation: BPCC held-out internal test and IN22-Conv/IN22-Gen, attributed to AI4Bharat/IndicTrans2. Public benchmark exposure during upstream pretraining is unknown. Published evaluation scores do not transfer ownership of datasets or confer broader data permissions.

This is staging documentation, not a published release or legal clearance. Keep these notices outside the immutable frozen export; identify the final release package using a separate manifest.
