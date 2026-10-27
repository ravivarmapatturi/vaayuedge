# VaayuEdge — Product Requirements Document (PRD)

**Product Identity**: VaayuEdge  
**Tagline**: *Less compute. More intelligence.*  
**Domain**: `vaayuedge.neuralmasteryai.com` (under `neuralmasteryai.com`)  
**Target**: Private, lightweight, English-to-Telugu speech intelligence running on user devices.

---

## 1. Problem Statement
Most speech-to-text and translation systems rely on monolithic cloud architectures, transmitting personal audio and conversations to third-party data centers. Users requiring linguistic transfer from spoken English to conversational Telugu—in confidential business, legal, healthcare, or everyday contexts—are forced to compromise their privacy. Furthermore, high compute demands prevent these solutions from running locally on consumer laptops and edge hardware.

## 2. Product Objectives
1. **Offline-First & Transparent**: Deliver a pipeline capable of converting spoken English to natural Telugu completely on-device. Accurately report whether processing is local or remote; never make false claims of on-device inference.
2. **Low Compute Footprint**: Optimize memory and CPU utilization so inference runs on typical laptops (e.g. 8GB-16GB RAM, quad-core CPU) without requiring high-end discrete GPUs.
3. **Meaning-Preserving Translation**: Retain semantic meaning, tone, interrogatives, and instructional intent rather than producing literal, mechanical word-for-word transliteration.
4. **Usable Cross-Platform Experience**: Provide a responsive PWA and desktop interface with recording, editing, synthesis playback, copy, and export tools.

## 3. MVP Scope

### In Scope (v0.1)
- **Audio Capture**: In-browser microphone recording with duration/size guardrails, plus file upload support (WAV, MP3, WebM, OGG).
- **English ASR**: On-device transcription into editable English text.
- **Transcript Editing**: Manual correction of speech recognition output prior to translation.
- **English-to-Telugu Translation**: Context-aware linguistic transfer into Telugu Unicode text (`eng_Latn` -> `tel_Telu`).
- **Telugu Speech Synthesis**: Audio synthesis of generated Telugu text using a verified lightweight TTS engine, with graceful degraded playback if voice weights are absent.
- **Local History & Data Management**: Session persistence in client-side IndexedDB, one-click copy, structured text export, and explicit session deletion.
- **Runtime Transparency**: UI badge showing current execution mode (`Local Device` vs `Remote Hosted`) and model load state.

### Explicitly Out of Scope (Non-Blockers for v0.1)
- Real-time continuous simultaneous translation / streaming audio.
- Multi-speaker diarization and meeting summaries.
- Cloud user account creation, billing, or cross-device cloud synchronization.
- Broad multilingual support (strictly English -> Telugu for MVP).

## 4. User Journey
```
[User speaks / Uploads audio]
          │
          ▼
[ASR: English Transcription] ──► [User edits / confirms English text]
                                           │
                                           ▼
                             [Translation: Meaning-aware Telugu]
                                           │
                                           ▼
                             [Telugu Text & Speech Playback]
                                           │
                                           ▼
                             [Copy / Export / Delete Session]
```

## 5. Success Metrics
- **Functional Completeness**: End-to-end flow executes without crash across 50 benchmark audio samples.
- **Latency Target**: Under 5s for a 10s audio segment on a modern standard laptop CPU.
- **Privacy Verification**: 0 external network requests during local inference execution.
- **Graceful Degradation**: 100% test pass rate when optional components (e.g. TTS) are disabled.
