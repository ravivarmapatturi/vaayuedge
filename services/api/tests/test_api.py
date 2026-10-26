import io
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
    assert data["version"] == "0.1.0"
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


def test_transcription_valid_audio():
    dummy_wav = io.BytesIO(b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00")
    files = {"audio": ("sample.wav", dummy_wav, "audio/wav")}
    response = client.post("/v1/transcriptions", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert len(data["transcript"]) > 0
    assert data["language"] == "en"
    assert data["confidence"] > 0.0
    assert data["duration_seconds"] > 0


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
    assert "మీటింగ్ పూర్తయ్యాక" in data["translated_text"]
    assert data["target_lang"] == "tel_Telu"


def test_translation_empty_text():
    payload = {"text": "   "}
    response = client.post("/v1/translations", json=payload)
    assert response.status_code == 422 or response.status_code == 400


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
