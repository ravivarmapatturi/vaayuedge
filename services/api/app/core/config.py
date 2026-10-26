import json
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    HOST: str = "127.0.0.1"  # Strict loopback by default for privacy
    PORT: int = 8000
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: List[str] = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://ravivarmapatturi.github.io",
        "https://vayyuedge.neuralmasteryai.com"
    ]

    # Processing Mode: "local" (on-device only) or "remote" (cloud server)
    PROCESSING_MODE: str = "local"

    # Adapter Configuration
    # ASR: "whisper_local" (PyTorch CPU), "whisper_cpp", "mock"
    ASR_ADAPTER: str = "whisper_local"
    WHISPER_MODEL_SIZE: str = "base.en"
    WHISPER_CPP_BINARY_PATH: str = "/usr/local/bin/whisper-cli"
    WHISPER_CPP_MODEL_PATH: str = "./models/ggml-tiny.en.bin"

    # Translation: "opus_mt" (Helsinki-NLP en-dra), "indictrans2", "mock"
    TRANSLATION_ADAPTER: str = "opus_mt"
    INDICTRANS2_MODEL_PATH: str = "./models/indictrans2-en-indic-1B"
    INDICTRANS2_DEVICE: str = "cpu"

    TTS_ADAPTER: str = "mms_telugu_tts"  # "mms_telugu_tts", "telugu_tts", "mock"
    TTS_MODEL_PATH: str = "./models/tts_telugu"

    # Safety limits
    MAX_AUDIO_FILE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    MAX_AUDIO_DURATION_SECONDS: int = 180  # 3 minutes
    TEMP_DIR: str = "/tmp/vayyuedge"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
