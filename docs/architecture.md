# VaayuEdge — Architecture Specification

## 1. System Overview

VaayuEdge is structured as a modular monorepo consisting of:
- **`apps/web`**: Lightweight React 18 + TypeScript + Vite + Tailwind CSS Single Page Application (and installable PWA).
- **`services/api`**: FastAPI application enforcing domain contracts, input validation, execution orchestration, and adapter management.
- **`packages/contracts`**: Language-agnostic API interface schemas and models.
- **`services/api/app/adapters`**: Replaceable ML adapters isolating concrete runtime engines (e.g., whisper.cpp, IndicTrans2, piper/eSpeak/coqui TTS) behind uniform Python protocols.

```
┌────────────────────────────────────────────────────────┐
│             VaayuEdge Web Client (PWA)                 │
│  React · TypeScript · Tailwind CSS · IndexedDB Storage │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (HTTP)
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Application                   │
│  - Endpoint Routing & Validation                       │
│  - Session & Job Coordination                          │
│  - Capability & Device Discovery                       │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
│ ASR Adapter │      │ Translation │      │ TTS Adapter │
│ (whisper)   │      │ (IndicTrans)│      │ (Telugu)    │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 2. Pluggable Adapter Interfaces

### 2.1 ASR Adapter (`BaseASRAdapter`)
- Method: `transcribe(audio_bytes: bytes, audio_format: str) -> ASRResult`
- Output: `text: str`, `language: str`, `confidence: float`, `duration_seconds: float`, `inference_time_ms: float`
- Implementations:
  - `WhisperCppAdapter`: High-efficiency C/C++ CPU/metal runtime using quantised GGML/GGUF models.
  - `FasterWhisperAdapter`: CTranslate2-based implementation with INT8 quantization.
  - `MockASRAdapter`: Deterministic testing adapter with realistic speech samples.

### 2.2 Translation Adapter (`BaseTranslationAdapter`)
- Method: `translate(source_text: str, source_lang: str, target_lang: str) -> TranslationResult`
- Default Language Pair: `eng_Latn` -> `tel_Telu`
- Implementations:
  - `IndicTrans2Adapter`: AI4Bharat IndicTrans2 engine with sentence-aware chunking and token preservation.
  - `MockTranslationAdapter`: Deterministic testing adapter providing natural Telugu translations.

### 2.3 TTS Adapter (`BaseTTSAdapter`)
- Method: `synthesize(telugu_text: str) -> TTSResult`
- Output: `audio_bytes: bytes`, `mime_type: str`, `sample_rate: int`, `duration_seconds: float`
- Implementations:
  - `TeluguTTSAdapter`: Verified Telugu voice model (e.g. Piper Telugu or edge TTS fallback).
  - `MockTTSAdapter`: Generates valid PCM audio for pipeline verification.

### 2.4 Runtime Manager (`RuntimeManager`)
- Inspects host hardware (CPU cores, RAM, AVX support, GPU/Vulkan if available).
- Reports capability flags to the frontend via `/v1/capabilities`.
- Ensures mode truthfulness (`local` vs `remote`).

## 3. Data Flow
1. **Audio Ingestion**: Client captures 16kHz audio or reads uploaded file. Checks max size (25MB) and max length (180s).
2. **ASR Ingestion**: Audio payload is sent to `POST /v1/transcriptions`. In local mode, the backend processes it via the active ASR adapter and returns transcript and timing metrics.
3. **Review & Edit**: User reviews and modifies English transcript in UI.
4. **Translation**: Edited text is sent to `POST /v1/translations`. The translation adapter parses sentences, performs inference, and returns Telugu Unicode text.
5. **Speech Synthesis (Optional)**: If user triggers audio playback or auto-read, `POST /v1/speech` generates Telugu audio bytes.
6. **Local Persistence**: Client stores session metadata, transcript, and translation in browser IndexedDB.
