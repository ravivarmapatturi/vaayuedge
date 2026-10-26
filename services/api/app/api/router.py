import base64
from datetime import datetime, timezone
import time
import uuid
from typing import List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.core.config import settings
from app.adapters.asr.mock_asr import MockASRAdapter
from app.adapters.asr.whisper_adapter import WhisperCppAdapter
from app.adapters.translation.mock_translation import MockTranslationAdapter
from app.adapters.translation.indictrans_adapter import IndicTrans2Adapter
from app.adapters.tts.mock_tts import MockTTSAdapter
from app.adapters.tts.telugu_tts import TeluguTTSAdapter
from app.adapters.runtime.device import RuntimeDeviceManager
from app.schemas.contracts import (
    CapabilitiesResponse,
    HealthResponse,
    SessionDeleteResponse,
    SessionRecord,
    SpeechRequest,
    SpeechResponse,
    TranscriptionResponse,
    TranslationRequest,
    TranslationResponse,
)
from app.services.session_service import session_service

api_router = APIRouter()
START_TIME = time.time()

# Initialize Adapters
def get_asr_adapter():
    if settings.ASR_ADAPTER == "whisper_cpp":
        return WhisperCppAdapter(
            binary_path=settings.WHISPER_CPP_BINARY_PATH,
            model_path=settings.WHISPER_CPP_MODEL_PATH,
            model_size=settings.WHISPER_MODEL_SIZE,
        )
    return MockASRAdapter()

def get_translation_adapter():
    if settings.TRANSLATION_ADAPTER == "indictrans2":
        return IndicTrans2Adapter(
            model_path=settings.INDICTRANS2_MODEL_PATH,
            device=settings.INDICTRANS2_DEVICE,
        )
    return MockTranslationAdapter()

def get_tts_adapter():
    if settings.TTS_ADAPTER == "telugu_tts":
        return TeluguTTSAdapter(model_path=settings.TTS_MODEL_PATH)
    return MockTTSAdapter()

asr_adapter = get_asr_adapter()
translation_adapter = get_translation_adapter()
tts_adapter = get_tts_adapter()


@api_router.get("/health", response_model=HealthResponse)
def get_health():
    """Health check endpoint reporting uptime and service status."""
    uptime = time.time() - START_TIME
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        uptime_seconds=round(uptime, 2),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@api_router.get("/v1/capabilities", response_model=CapabilitiesResponse)
def get_capabilities():
    """Reports supported features, device metrics, and active model adapters."""
    device_info = RuntimeDeviceManager.get_device_info()
    is_offline = RuntimeDeviceManager.is_offline_mode(settings.PROCESSING_MODE)

    return CapabilitiesResponse(
        processing_mode=settings.PROCESSING_MODE,
        is_offline_capable=is_offline,
        supported_source_languages=["en", "eng_Latn"],
        supported_target_languages=["te", "tel_Telu"],
        asr={
            "adapter": asr_adapter.name,
            "model_name": asr_adapter.model_name,
            "is_ready": asr_adapter.is_ready,
        },
        translation={
            "adapter": translation_adapter.name,
            "model_name": translation_adapter.model_name,
            "is_ready": translation_adapter.is_ready,
        },
        tts={
            "adapter": tts_adapter.name,
            "voice_name": tts_adapter.voice_name,
            "is_ready": tts_adapter.is_ready,
        },
        device_info=device_info,
    )


@api_router.post("/v1/transcriptions", response_model=TranscriptionResponse)
async def create_transcription(
    audio: UploadFile = File(..., description="Audio file (WAV, MP3, WebM, OGG)"),
    language: Optional[str] = Form("en"),
):
    """
    Ingest speech audio and transcribe it into English text.
    Validates file format and limits before executing inference.
    """
    # Validate mime type / extension
    allowed_extensions = (".wav", ".mp3", ".webm", ".ogg", ".m4a")
    filename = audio.filename or "audio.wav"
    if not any(filename.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio format. Allowed: {', '.join(allowed_extensions)}",
        )

    # Read audio bytes safely
    audio_bytes = await audio.read()
    if len(audio_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty.",
        )

    if len(audio_bytes) > settings.MAX_AUDIO_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file exceeds maximum size limit of {settings.MAX_AUDIO_FILE_SIZE_BYTES // (1024*1024)} MB.",
        )

    audio_format = filename.split(".")[-1].lower() if "." in filename else "wav"

    try:
        asr_result = asr_adapter.transcribe(audio_bytes, audio_format=audio_format)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ASR transcription failed: {str(e)}",
        )

    transcription_id = str(uuid.uuid4())

    return TranscriptionResponse(
        id=transcription_id,
        transcript=asr_result.transcript,
        language=asr_result.language,
        confidence=asr_result.confidence,
        duration_seconds=asr_result.duration_seconds,
        inference_time_ms=asr_result.inference_time_ms,
        processing_mode=settings.PROCESSING_MODE,
    )


@api_router.post("/v1/translations", response_model=TranslationResponse)
def create_translation(request: TranslationRequest):
    """
    Translate English text into Telugu, preserving semantic intent and context.
    """
    clean_text = request.text.strip()
    if not clean_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source text cannot be empty.",
        )

    try:
        result = translation_adapter.translate(
            source_text=clean_text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}",
        )

    translation_id = str(uuid.uuid4())

    return TranslationResponse(
        id=translation_id,
        source_text=result.source_text,
        translated_text=result.translated_text,
        source_lang=result.source_lang,
        target_lang=result.target_lang,
        inference_time_ms=result.inference_time_ms,
        processing_mode=settings.PROCESSING_MODE,
    )


@api_router.post("/v1/speech", response_model=SpeechResponse)
def create_speech(request: SpeechRequest):
    """
    Synthesize Telugu text into audio bytes (WAV/PCM base64 encoded).
    """
    clean_text = request.text.strip()
    if not clean_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text for speech synthesis cannot be empty.",
        )

    try:
        result = tts_adapter.synthesize(clean_text, language=request.language)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"TTS synthesis failed: {str(e)}",
        )

    speech_id = str(uuid.uuid4())
    audio_b64 = base64.b64encode(result.audio_bytes).decode("ascii")

    return SpeechResponse(
        id=speech_id,
        audio_base64=audio_b64,
        mime_type=result.mime_type,
        sample_rate=result.sample_rate,
        duration_seconds=result.duration_seconds,
        inference_time_ms=result.inference_time_ms,
    )


@api_router.get("/v1/sessions", response_model=List[SessionRecord])
def list_sessions():
    """Retrieve list of saved sessions."""
    return session_service.list_sessions()


@api_router.post("/v1/sessions", response_model=SessionRecord)
def save_session(session: SessionRecord):
    """Persist a completed session record locally."""
    return session_service.add_session(session)


@api_router.delete("/v1/sessions/{session_id}", response_model=SessionDeleteResponse)
def delete_session(session_id: str):
    """Explicitly delete a stored session record."""
    success = session_service.delete_session(session_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found.",
        )
    return SessionDeleteResponse(success=True, id=session_id)
