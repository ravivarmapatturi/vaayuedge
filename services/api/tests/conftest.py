import os

# Unit tests exercise the API contract, not the neural models: force the
# lightweight mock adapters so CI doesn't need torch/transformers or weights.
os.environ.setdefault("ASR_ADAPTER", "mock")
os.environ.setdefault("TRANSLATION_ADAPTER", "mock")
os.environ.setdefault("TTS_ADAPTER", "mock")
