from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "0.2.0"
    uptime_seconds: float
    timestamp: str


class AdapterStatus(BaseModel):
    adapter: str
    model_name: str
    is_ready: bool


class DeviceInfo(BaseModel):
    os: str
    cpu_cores: int
    ram_gb_available: float


class CapabilitiesResponse(BaseModel):
    processing_mode: str  # "local" or "remote"
    is_offline_capable: bool
    supported_source_languages: List[str]
    supported_target_languages: List[str]
    asr: dict
    translation: dict
    tts: dict
    device_info: DeviceInfo


class TranscriptionResponse(BaseModel):
    id: str
    transcript: str
    language: str = "en"
    confidence: float
    duration_seconds: float
    inference_time_ms: float
    processing_mode: str


class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="English text to translate")
    source_lang: str = "eng_Latn"
    target_lang: str = "tel_Telu"


class TranslationResponse(BaseModel):
    id: str
    source_text: str
    translated_text: str
    source_lang: str = "eng_Latn"
    target_lang: str = "tel_Telu"
    inference_time_ms: float
    processing_mode: str


class SpeechRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Telugu text for speech synthesis")
    language: str = "tel_Telu"
    voice: Optional[str] = "default"


class SpeechResponse(BaseModel):
    id: str
    audio_base64: str
    mime_type: str = "audio/wav"
    sample_rate: int = 16000
    duration_seconds: float
    inference_time_ms: float


class SessionRecord(BaseModel):
    id: str
    created_at: str
    audio_duration_seconds: float
    transcript: str
    translation: str
    processing_mode: str
    audio_url: Optional[str] = None


class SessionDeleteResponse(BaseModel):
    success: bool
    id: str
