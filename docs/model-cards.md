# VaayuEdge — Model Cards & Licenses

Model weights are strictly decoupled from the VaayuEdge application repository. Each model component is subject to its original author's license and usage terms.

---

## 1. Speech Recognition (ASR): OpenAI Whisper

- **Origin / Author**: OpenAI (`openai/whisper`) / Georgi Gerganov (`whisper.cpp`)
- **Default Variant in v0.2**: `whisper` Python package with `base.en` (~142 MB) or `tiny.en` (~75 MB) running in-process via PyTorch on CPU.
- **Alternative Variant**: `whisper.cpp` quantised `ggml-base.en.bin` (~142 MB) for low-overhead C++ inference.
- **License**: MIT License (Whisper code and weights are MIT-licensed).
- **Intended Use**: On-device English speech recognition from microphone capture or uploaded audio files (WAV, MP3, WebM, OGG).
- **CPU Performance**: ~856 ms execution time for 3.0s audio clip on a standard laptop CPU (Real-Time Factor ~0.28).
- **Limitations**: Heavy background noise or heavily accented technical jargon may cause transcription errors; users can review and edit the transcript directly before translation.

---

## 2. Translation: Helsinki-NLP OPUS-MT & AI4Bharat IndicTrans2

### Primary Default: `Helsinki-NLP/opus-mt-en-dra`
- **Origin / Author**: Language Technology Research Group at the University of Helsinki (Tatoeba Challenge)
- **Supported Language Pair**: English (`eng_Latn`) → Dravidian languages including Telugu (`tel_Telu`) using prefix token `>>tel<<`.
- **Model Architecture**: MarianMT transformer seq2seq architecture with SafeTensors weights (~308 MB).
- **Access & License**: **Ungated**, fully open-source Apache 2.0 / CC-BY-4.0. No Hugging Face authentication token or gated access approvals required.
- **CPU Performance**: ~500–650 ms execution time per sentence on a standard laptop CPU.
- **Local Isolation**: Explicitly supports `local_files_only=True` to guarantee zero outbound network telemetry after download.

### Optional Advanced: `AI4Bharat IndicTrans2`
- **Origin / Author**: AI4Bharat, IIT Madras (`ai4bharat/indictrans2-en-indic-1B` or `indictrans2-indic-en-dist-200M`)
- **Supported Language Pair**: English (`eng_Latn`) → Telugu (`tel_Telu`)
- **License**: CC-BY-NC 4.0 (Academic/Research). Requires Hugging Face login and accepted terms to download weights.
- **Intended Use**: High-accuracy meaning-aware translation of complex English structures into natural Telugu.

---

## 3. Speech Synthesis (TTS): Telugu Voice Engine

- **Candidate 1**: Piper Telugu Voice (`te_IN`) — Lightweight neural text-to-speech engine optimized for CPU and edge devices (MIT / Apache 2.0).
- **Candidate 2**: MMS (Massively Multilingual Speech) Telugu TTS by Meta AI (CC-BY-NC 4.0).
- **Browser Synthesis**: Web Speech API (`SpeechSynthesisUtterance` with `te-IN` locale) provides instant client-side playback without extra model downloads.
- **Auditory Feedback**: Deterministic lightweight audio generator for test confirmation.
- **Limitations**: Synthetic voice prosody is kept as an optional enhancement; the primary deliverable is clear Telugu Unicode text.
