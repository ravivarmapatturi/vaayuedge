import io
import re
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.session_service import session_service

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_sessions():
    session_service.clear_all()
    yield
    session_service.clear_all()


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "0.2.0"
    assert "uptime_seconds" in data
    assert "timestamp" in data


def test_capabilities_endpoint():
    response = client.get("/v1/capabilities")
    assert response.status_code == 200
    data = response.json()
    assert data["processing_mode"] in ["local", "remote"]
    assert "is_offline_capable" in data
    assert "asr" in data
    assert "translation" in data
    assert "tts" in data
    assert "device_info" in data
    assert data["device_info"]["cpu_cores"] >= 1
    assert data["device_info"]["ram_gb_available"] > 0


def test_transcription_valid_audio_structure():
    # 1 second 16kHz 16-bit mono PCM WAV
    sample_rate = 16000
    num_samples = sample_rate
    pcm_data = b"\x00\x00" * num_samples
    data_size = len(pcm_data)
    header = bytearray(b"RIFF")
    header.extend((data_size + 36).to_bytes(4, "little"))
    header.extend(b"WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00")
    header.extend(sample_rate.to_bytes(4, "little"))
    header.extend((sample_rate * 2).to_bytes(4, "little"))
    header.extend((2).to_bytes(2, "little"))
    header.extend((16).to_bytes(2, "little"))
    header.extend(b"data")
    header.extend(data_size.to_bytes(4, "little"))
    wav_bytes = bytes(header) + pcm_data

    files = {"audio": ("sample.wav", io.BytesIO(wav_bytes), "audio/wav")}
    response = client.post("/v1/transcriptions", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert isinstance(data["transcript"], str)
    assert data["language"] == "en"
    assert data["duration_seconds"] > 0
    assert data["inference_time_ms"] > 0


def test_transcription_invalid_extension():
    files = {"audio": ("document.txt", io.BytesIO(b"hello world"), "text/plain")}
    response = client.post("/v1/transcriptions", files=files)
    assert response.status_code == 400
    assert "Unsupported audio format" in response.json()["detail"]


def test_transcription_empty_file():
    files = {"audio": ("empty.wav", io.BytesIO(b""), "audio/wav")}
    response = client.post("/v1/transcriptions", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"]


def test_translation_valid_text():
    payload = {
        "text": "I will call you after I finish the meeting.",
        "source_lang": "eng_Latn",
        "target_lang": "tel_Telu"
    }
    response = client.post("/v1/translations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source_text"] == payload["text"]
    assert data["target_lang"] == "tel_Telu"
    # Verify Telugu script Unicode block (\u0c00 - \u0c7f)
    assert re.search(r"[\u0C00-\u0C7F]", data["translated_text"]) is not None


def test_translation_empty_text():
    payload = {"text": "   "}
    response = client.post("/v1/translations", json=payload)
    assert response.status_code in [400, 422]


def test_translation_unicode_and_numbers():
    payload = {
        "text": "Please bring 3 apples and 2 oranges tomorrow.",
        "source_lang": "eng_Latn",
        "target_lang": "tel_Telu"
    }
    response = client.post("/v1/translations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert re.search(r"[\u0C00-\u0C7F]", data["translated_text"]) is not None


def test_speech_generation():
    payload = {
        "text": "మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.",
        "language": "tel_Telu"
    }
    response = client.post("/v1/speech", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "audio_base64" in data
    assert len(data["audio_base64"]) > 100
    assert data["mime_type"] == "audio/wav"
    assert data["sample_rate"] == 16000


def test_session_lifecycle():
    # 1. Initially empty
    res = client.get("/v1/sessions")
    assert res.status_code == 200
    assert len(res.json()) == 0

    # 2. Add session
    session_data = {
        "id": "sess-test-123",
        "created_at": "2026-10-26T12:00:00Z",
        "audio_duration_seconds": 4.5,
        "transcript": "Hello world",
        "translation": "హలో ప్రపంచం",
        "processing_mode": "local"
    }
    post_res = client.post("/v1/sessions", json=session_data)
    assert post_res.status_code == 200
    assert post_res.json()["id"] == "sess-test-123"

    # 3. Retrieve sessions
    list_res = client.get("/v1/sessions")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # 4. Delete session
    del_res = client.delete("/v1/sessions/sess-test-123")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 5. Delete non-existent
    del_fail = client.delete("/v1/sessions/sess-test-123")
    assert del_fail.status_code == 404
