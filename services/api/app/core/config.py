import json
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://vayyuedge.neuralmasteryai.com"
    ]

    # Processing Mode: "local" (on-device only) or "remote" (cloud server)
    PROCESSING_MODE: str = "local"

    # Adapter Configuration
    ASR_ADAPTER: str = "mock"  # "mock", "whisper_cpp", "faster_whisper"
    WHISPER_MODEL_SIZE: str = "tiny.en"
    WHISPER_CPP_BINARY_PATH: str = "/usr/local/bin/whisper-cli"
    WHISPER_CPP_MODEL_PATH: str = "./models/ggml-tiny.en.bin"

    TRANSLATION_ADAPTER: str = "mock"  # "mock", "indictrans2"
    INDICTRANS2_MODEL_PATH: str = "./models/indictrans2-en-indic-1B"
    INDICTRANS2_DEVICE: str = "cpu"

    TTS_ADAPTER: str = "mock"  # "mock", "telugu_tts"
    TTS_MODEL_PATH: str = "./models/tts_telugu"

    # Safety limits
    MAX_AUDIO_FILE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    MAX_AUDIO_DURATION_SECONDS: int = 180  # 3 minutes
    TEMP_DIR: str = "/tmp/vayyuedge"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
