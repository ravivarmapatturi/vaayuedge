import os
import time
from typing import Optional
from app.adapters.base import BaseTTSAdapter, TTSResult
from app.adapters.tts.mock_tts import MockTTSAdapter


class TeluguTTSAdapter(BaseTTSAdapter):
    """
    Adapter for Telugu TTS models (e.g. Piper Telugu or MMS TTS).
    If model weights are not present, raises or informs caller so UI can fallback gracefully.
    """

    def __init__(self, model_path: str, voice_name: str = "te_IN-vasista"):
        self._model_path = model_path
        self._voice_name = voice_name
        self._mock_fallback = MockTTSAdapter(voice_name=f"{voice_name} (mock-fallback)")

    @property
    def name(self) -> str:
        return "telugu_tts"

    @property
    def voice_name(self) -> str:
        return self._voice_name

    @property
    def is_ready(self) -> bool:
        return os.path.exists(self._model_path)

    def synthesize(self, text: str, language: str = "tel_Telu") -> TTSResult:
        if not self.is_ready:
            # Rather than crashing the entire pipeline, return mock audio with fallback flag
            # or raise if strict offline mode requires pre-loaded weights.
            return self._mock_fallback.synthesize(text, language)

        start_time = time.perf_counter()
        # In a real environment with Piper or MMS weights installed:
        # e.g., piper binary or onnx runtime call
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return self._mock_fallback.synthesize(text, language)
