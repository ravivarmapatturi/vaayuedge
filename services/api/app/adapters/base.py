from abc import ABC, abstractmethod
from typing import Optional, NamedTuple


class ASRResult(NamedTuple):
    transcript: str
    language: str
    confidence: float
    duration_seconds: float
    inference_time_ms: float
    is_mock: bool = False


class TranslationResult(NamedTuple):
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    inference_time_ms: float
    is_mock: bool = False


class TTSResult(NamedTuple):
    audio_bytes: bytes
    mime_type: str
    sample_rate: int
    duration_seconds: float
    inference_time_ms: float
    is_mock: bool = False


class BaseASRAdapter(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the ASR adapter."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Name or size of the underlying model."""
        pass

    @property
    @abstractmethod
    def is_ready(self) -> bool:
        """Check if adapter is loaded and operational."""
        pass

    @abstractmethod
    def transcribe(self, audio_bytes: bytes, audio_format: str = "wav") -> ASRResult:
        """Transcribe speech audio into text."""
        pass


class BaseTranslationAdapter(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the Translation adapter."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Name of the underlying translation model."""
        pass

    @property
    @abstractmethod
    def is_ready(self) -> bool:
        """Check if adapter is loaded and operational."""
        pass

    @abstractmethod
    def translate(
        self,
        source_text: str,
        source_lang: str = "eng_Latn",
        target_lang: str = "tel_Telu"
    ) -> TranslationResult:
        """Translate source text to target language preserving semantic meaning."""
        pass


class BaseTTSAdapter(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the TTS adapter."""
        pass

    @property
    @abstractmethod
    def voice_name(self) -> str:
        """Name of the voice used for synthesis."""
        pass

    @property
    @abstractmethod
    def is_ready(self) -> bool:
        """Check if adapter is loaded and operational."""
        pass

    @abstractmethod
    def synthesize(self, text: str, language: str = "tel_Telu") -> TTSResult:
        """Synthesize text into speech audio bytes."""
        pass
