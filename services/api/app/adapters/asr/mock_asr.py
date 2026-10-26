import time
from app.adapters.base import BaseASRAdapter, ASRResult


class MockASRAdapter(BaseASRAdapter):
    """
    Deterministic ASR adapter providing realistic English speech transcription
    for UI testing, CI checks, and lightweight validation without requiring large model weights.
    """

    SAMPLE_TRANSCRIPTS = [
        "I will call you after I finish the meeting.",
        "Could you please share the project documentation and requirements?",
        "Please turn off the lights and lock the front door before leaving.",
        "The doctors advised drinking plenty of water during the summer.",
        "We are testing private speech intelligence on our edge devices."
    ]

    def __init__(self, model_name: str = "mock-whisper-tiny"):
        self._model_name = model_name
        self._index = 0

    @property
    def name(self) -> str:
        return "mock"

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def is_ready(self) -> bool:
        return True

    def transcribe(self, audio_bytes: bytes, audio_format: str = "wav") -> ASRResult:
        start_time = time.perf_counter()
        # Estimate duration roughly from byte count (assuming ~16kHz 16-bit mono PCM ~32000 bytes/sec)
        byte_len = len(audio_bytes)
        duration = max(1.0, round(byte_len / 32000.0, 2)) if byte_len > 0 else 3.0

        # Cycle through samples
        transcript = self.SAMPLE_TRANSCRIPTS[self._index % len(self.SAMPLE_TRANSCRIPTS)]
        self._index += 1

        elapsed_ms = round((time.perf_counter() - start_time) * 1000 + 45.0, 2)

        return ASRResult(
            transcript=transcript,
            language="en",
            confidence=0.96,
            duration_seconds=duration,
            inference_time_ms=elapsed_ms,
            is_mock=True
        )
