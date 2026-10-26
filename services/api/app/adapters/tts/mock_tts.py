import io
import math
import struct
import time
import wave
from app.adapters.base import BaseTTSAdapter, TTSResult


class MockTTSAdapter(BaseTTSAdapter):
    """
    Deterministic Mock TTS adapter that produces valid WAV audio bytes
    (synthesizing a gentle auditory confirmation tone) for testing UI playback.
    """

    def __init__(self, voice_name: str = "mock-telugu-voice"):
        self._voice_name = voice_name

    @property
    def name(self) -> str:
        return "mock"

    @property
    def voice_name(self) -> str:
        return self._voice_name

    @property
    def is_ready(self) -> bool:
        return True

    def synthesize(self, text: str, language: str = "tel_Telu") -> TTSResult:
        start_time = time.perf_counter()

        # Generate a short pleasant tone in pure Python using wave
        sample_rate = 16000
        duration_seconds = 1.2
        num_samples = int(sample_rate * duration_seconds)

        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(sample_rate)

            # 440Hz tone with smooth fade in/out
            frames = bytearray()
            for i in range(num_samples):
                t = i / sample_rate
                # Envelope
                envelope = math.sin(math.pi * i / num_samples)
                val = int(32767.0 * 0.25 * envelope * math.sin(2 * math.pi * 440.0 * t))
                frames.extend(struct.pack("<h", max(-32768, min(32767, val))))

            wav_file.writeframes(frames)

        audio_bytes = buffer.getvalue()
        inference_time_ms = round((time.perf_counter() - start_time) * 1000 + 20.0, 2)

        return TTSResult(
            audio_bytes=audio_bytes,
            mime_type="audio/wav",
            sample_rate=sample_rate,
            duration_seconds=duration_seconds,
            inference_time_ms=inference_time_ms,
            is_mock=True
        )
