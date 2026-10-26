# VayyuEdge — Privacy Architecture & Threat Model

## 1. Threat Model & Privacy Commitments

### 1.1 Core Commitments
- **Zero Silent Cloud Exfiltration**: When VayyuEdge operates in local mode, audio data and transcribed texts strictly stay within the host device boundary (`localhost`).
- **No Third-Party Telemetry**: No tracking scripts, analytics trackers (e.g. Google Analytics, Mixpanel), or unannounced external health pings.
- **Ephemeral Processing**: Ingested audio payloads reside in memory or temporary files with restricted file permissions (`0600`) and are scrubbed immediately following inference.

### 1.2 Boundary Classification

| Mode | Processing Boundary | Network Activity | Privacy Guarantee |
| :--- | :--- | :--- | :--- |
| **Local Mode** | Client & Local Daemon (`127.0.0.1`) | Loopback only. No WAN calls. | 100% on-device private speech and text. |
| **Hosted / Remote Mode** | `vayyuedge.neuralmasteryai.com` | HTTPS encrypted transit. | Ephemeral server inference. No logging of audio or transcript text. |

## 2. Threat Analysis

### 2.1 Audio Ingestion & DoS
- **Threat**: Maliciously oversized or corrupted audio files intended to exhaust host RAM or CPU.
- **Mitigation**:
  - Enforce strict size threshold: max 25MB.
  - Enforce strict duration limit: max 180 seconds.
  - Pre-validate audio container headers (RIFF/WAV, ID3/MP3, OGG, EBML/WebM) before passing bytes to speech models.

### 2.2 Model Substitution & Injection
- **Threat**: Untrusted model weights downloaded over insecure channels executing arbitrary code (e.g. malicious pickle files).
- **Mitigation**:
  - Prefer safe formats: GGUF / GGML for Whisper, SafeTensors or CTranslate2 format for translation.
  - Require SHA-256 checksum verification in `scripts/download-models.py`.

### 2.3 Cross-Origin & Local Storage Risks
- **Threat**: Cross-site scripts accessing user transcripts stored in browser storage.
- **Mitigation**:
  - Store history in dedicated client-side IndexedDB with strict same-origin isolation.
  - Provide an explicit "Clear All Sessions" action to purge local records instantly.
  - Configure CSP (Content Security Policy) headers prohibiting untrusted scripts.

## 3. Airplane-Mode Audit Procedure
To empirically verify offline integrity:
1. Disconnect Ethernet, turn off Wi-Fi, or switch to Airplane Mode.
2. Launch VayyuEdge locally (`scripts/setup-dev.sh`).
3. Record a 5-second English phrase and request Telugu translation.
4. Inspect browser DevTools Network tab: verify 100% of network requests target `localhost` / `127.0.0.1`.
5. Verify successful transcription and translation execution without network access.
