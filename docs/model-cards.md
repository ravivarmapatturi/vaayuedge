# VayyuEdge — Model Cards & Licenses

Model weights are decoupled from the VayyuEdge application repository. Each model component is subject to its original author's license and usage terms.

---

## 1. Speech Recognition (ASR): OpenAI Whisper / whisper.cpp

- **Origin / Author**: OpenAI (`openai/whisper`) / Georgi Gerganov (`whisper.cpp`)
- **Recommended Model Variant**:
  - `whisper.cpp` quantised `ggml-tiny.en.bin` (~75 MB) or `ggml-base.en.bin` (~142 MB) for resource-constrained laptops.
  - `whisper-small.en` (~466 MB) for high-accuracy desktop environments.
- **License**: MIT License (Whisper code and weights are MIT-licensed).
- **Intended Use**: English speech recognition from microphone capture or uploaded audio files.
- **Limitations**: Accented speech, high ambient acoustic noise, specialized domain jargon (e.g., highly specialized medical/legal acronyms) may exhibit higher Word Error Rates (WER).

---

## 2. Translation: AI4Bharat IndicTrans2

- **Origin / Author**: AI4Bharat, IIT Madras (`ai4bharat/indictrans2-en-indic-1B` or `indictrans2-indic-en-dist-200M`)
- **Supported Language Pair**: English (`eng_Latn`) → Telugu (`tel_Telu`)
- **License**: CC-BY-NC 4.0 / Open-Source Academic & Research License. Check AI4Bharat release terms for specific commercial use terms.
- **Intended Use**: Meaning-aware translation of English sentences into natural Telugu script.
- **Limitations**: Idiomatic slang, extreme colloquialisms, and code-mixed inputs may require post-editing by the user.

---

## 3. Speech Synthesis (TTS): Telugu Voice Engine

- **Candidate 1**: Piper Telugu Voice (`te_IN`) — Lightweight neural text-to-speech engine optimized for Raspberry Pi and laptops. MIT / Apache 2.0.
- **Candidate 2**: MMS (Massively Multilingual Speech) Telugu TTS by Meta AI (CC-BY-NC 4.0).
- **Graceful Fallback**: Web Speech API (`SpeechSynthesisUtterance` with Telugu `te-IN` locale voice if available in user's browser) or silent text display if offline weights are not downloaded.
- **Limitations**: Synthetic voice may sound slightly robotic without high-parameter neural vocoders; kept as an optional post-translation enhancement.
