import io
import time
import torch
import scipy.io.wavfile
from app.adapters.base import BaseTTSAdapter, TTSResult


class MMSTeluguTTSAdapter(BaseTTSAdapter):
    """
    On-device Neural Text-to-Speech adapter for Telugu using Meta AI's MMS TTS (facebook/mms-tts-tel).
    Synthesizes authentic spoken Telugu audio waveforms into WAV bytes on CPU.
    """

    MODEL_ID = "facebook/mms-tts-tel"

    def __init__(self, device: str = "cpu"):
        self._device = device
        self._model = None
        self._tokenizer = None

    @property
    def name(self) -> str:
        return "mms_telugu_tts"

    @property
    def voice_name(self) -> str:
        return "facebook/mms-tts-tel"

    @property
    def is_ready(self) -> bool:
        return True

    def load_model(self):
        if self._model is None or self._tokenizer is None:
            from transformers import VitsModel, AutoTokenizer
            try:
                self._tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID, local_files_only=True)
                self._model = VitsModel.from_pretrained(self.MODEL_ID, local_files_only=True).to(self._device)
            except Exception:
                self._tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID)
                self._model = VitsModel.from_pretrained(self.MODEL_ID).to(self._device)

    def synthesize(self, text: str, language: str = "tel_Telu") -> TTSResult:
        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Input text for TTS cannot be empty.")

        self.load_model()
        start_time = time.perf_counter()

        inputs = self._tokenizer(clean_text, return_tensors="pt").to(self._device)
        with torch.no_grad():
            output = self._model(**inputs).waveform

        waveform = output.squeeze().cpu().numpy()
        sample_rate = self._model.config.sampling_rate

        # Write to WAV buffer
        buf = io.BytesIO()
        scipy.io.wavfile.write(buf, sample_rate, waveform)
        audio_bytes = buf.getvalue()

        duration_seconds = round(len(waveform) / sample_rate, 2)
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return TTSResult(
            audio_bytes=audio_bytes,
            mime_type="audio/wav",
            sample_rate=sample_rate,
            duration_seconds=duration_seconds,
            inference_time_ms=inference_time_ms,
            is_mock=False
        )
