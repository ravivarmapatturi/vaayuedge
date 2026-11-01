import os

# Unit tests exercise the API contract, not the neural models: force the
# lightweight mock adapters so CI doesn't need torch/transformers or weights.
# Tests exercise the API contract, so force lightweight adapters even when a
# developer shell exports production adapter settings.  ``setdefault`` is not
# sufficient here: importing the router constructs adapters immediately.
os.environ["ASR_ADAPTER"] = "mock"
os.environ["TRANSLATION_ADAPTER"] = "mock"
os.environ["TTS_ADAPTER"] = "mock"
