# VayyuEdge — Privacy Architecture & Threat Model

## 1. Threat Model & Privacy Commitments

### 1.1 Core Commitments
- **Zero Silent Cloud Exfiltration**: When VayyuEdge operates in local mode, audio data and transcribed texts strictly stay within the host device loopback boundary (`127.0.0.1`).
- **No Third-Party Telemetry**: Zero tracking scripts, analytics trackers (e.g. Google Analytics, Mixpanel), or hidden external health pings.
- **Ephemeral Processing**: Ingested audio payloads reside in memory or temporary files with restricted file permissions (`0600`) and are scrubbed immediately following inference.
- **Transparent Mode Disclosure**: The hosted GitHub Pages preview explicitly identifies itself as a static prototype and will never pretend to run on-device inference without a reachable local daemon.

### 1.2 Boundary Classification

| Mode | Processing Boundary | Network Activity | Privacy Guarantee |
| :--- | :--- | :--- | :--- |
| **Local Application Mode** | Host Laptop (`127.0.0.1:8000`) | Strict loopback only. Zero WAN calls. | 100% on-device private speech and text. |
| **Static Browser Preview** | Client Browser (`gh-pages`) | Fetches static HTML/CSS/JS assets from GitHub Pages. | Zero audio upload; sample presets executed locally in browser storage. |
| **Future Hosted Inference** | `vayyuedge.neuralmasteryai.com` | HTTPS encrypted transit with explicit opt-in consent. | Ephemeral server inference. Zero logging of user audio or transcript text. |

---

## 2. Threat Analysis & Mitigations

### 2.1 Audio Ingestion & DoS
- **Threat**: Maliciously oversized or corrupted audio files intended to exhaust host RAM or CPU.
- **Mitigation**:
  - Enforce strict size threshold: max 25MB (`MAX_AUDIO_FILE_SIZE_BYTES = 26214400`).
  - Pre-validate audio container extensions (`.wav`, `.mp3`, `.webm`, `.ogg`, `.m4a`) before loading.
  - Reject empty files with HTTP 400 Bad Request.

### 2.2 Model Weight Integrity & Pickle Injection
- **Threat**: Untrusted model weights downloaded over insecure channels executing arbitrary code via Python `pickle`.
- **Mitigation**:
  - For translation: Enforce `use_safetensors=True` for `Helsinki-NLP/opus-mt-en-dra` to eliminate `torch.load` arbitrary execution vulnerabilities.
  - Enforce `local_files_only=True` during runtime inference to prevent automatic phoning home to remote registries.
  - For Whisper: Rely on official PyTorch weight structures or whisper.cpp GGML/GGUF quantised formats.

### 2.3 Network Isolation & Air-Gap Verification
- **Threat**: Undisclosed telemetry or library dependencies establishing outbound TCP connections during inference.
- **Mitigation**:
  - The default bind address is strictly `127.0.0.1` (loopback only).
  - VayyuEdge includes an automated air-gap verification test (`scripts/verify-local-mode.py`) that wraps Python's low-level `socket.socket.connect` during ASR and MT inference.
  - Any attempted outbound connection to external IP addresses raises an immediate `[AIR-GAP VIOLATION]` exception.

### 2.4 Browser Storage & Session Privacy
- **Threat**: Cross-site scripts accessing user transcripts stored in browser storage.
- **Mitigation**:
  - Session history is stored with explicit user control in `localStorage` / `IndexedDB`.
  - Provide an explicit "Clear All History" action to purge local records instantly.
  - History is never synchronized to cloud servers in v0.2.

---

## 3. Airplane-Mode Audit Procedure

To empirically verify offline integrity on your laptop:
1. Disconnect Ethernet, turn off Wi-Fi, or switch to Airplane Mode.
2. Launch VayyuEdge locally:
   ```bash
   ./scripts/start-local.sh
   ```
3. Open `http://127.0.0.1:8000` in your browser.
4. Record an English phrase or type custom text and click **Translate**.
5. Inspect browser DevTools (Network tab): verify 100% of network requests target `127.0.0.1:8000`.
6. Run the automated air-gap test:
   ```bash
   python3 scripts/verify-local-mode.py
   ```
   Verify `Network Isolation: 0 Outbound Packets (Guaranteed Offline)`.
