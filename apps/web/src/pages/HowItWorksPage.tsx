
export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Audio Capture & Ingestion",
      tech: "HTML5 MediaRecorder / PCM 16kHz",
      desc: "Microphone audio is captured at 16kHz mono. Audio chunks are validated for MIME type, byte integrity, and duration limits (max 180s, 25MB) before processing.",
      code: "POST /v1/transcriptions (multipart/form-data)"
    },
    {
      num: "02",
      title: "Speech Recognition (ASR)",
      tech: "OpenAI Whisper / whisper.cpp (GGML)",
      desc: "Quantised Whisper models (tiny.en or base.en) process the acoustic frames on the host CPU/Metal without GPU acceleration, producing accurate English text with timing metadata.",
      code: "BaseASRAdapter.transcribe(audio_bytes) -> ASRResult"
    },
    {
      num: "03",
      title: "Review & Correction Window",
      tech: "Editable React State / IndexedDB",
      desc: "Users have full visibility and editing control over the English transcript. Any misrecognized proper nouns, acronyms, or numbers can be corrected before running the translation model.",
      code: "User-in-the-loop review interface"
    },
    {
      num: "04",
      title: "Semantic Telugu Translation",
      tech: "AI4Bharat IndicTrans2 (eng_Latn -> tel_Telu)",
      desc: "The English text is tokenized with SentencePiece and passed to the IndicTrans2 seq2seq transformer. The model preserves clause structure, formal/informal tone, and generates natural Telugu Unicode text.",
      code: "POST /v1/translations { text, source_lang: 'eng_Latn', target_lang: 'tel_Telu' }"
    },
    {
      num: "05",
      title: "Telugu Speech Output (TTS)",
      tech: "Replaceable Telugu TTS Adapter",
      desc: "Telugu Unicode text is synthesized into WAV audio bytes. If local neural voice weights are present, they synthesize native speech; otherwise, the client falls back to Web Speech API smoothly.",
      code: "POST /v1/speech -> { audio_base64, mime_type: 'audio/wav' }"
    },
    {
      num: "06",
      title: "Local-Only Session Persistence",
      tech: "IndexedDB / Browser Sandbox",
      desc: "Session transcripts, translations, and timing metrics are stored purely in client-side storage. One-click export (.txt) and explicit deletion guarantee zero residual data on servers.",
      code: "storage.saveSession() / storage.clearAll()"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Page Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
          Architecture & Flow
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
          How VaayuEdge Works
        </h1>
        <p className="text-base text-charcoal-600 max-w-2xl leading-relaxed">
          An inspectable, modular pipeline connecting audio capture, quantised speech recognition, contextual Telugu translation, and local data persistence.
        </p>
      </div>

      {/* Visual Pipeline Diagram */}
      <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-charcoal-900">End-to-End Pipeline Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-white border border-canvas-200 rounded-xl p-4 shadow-subtle flex flex-col justify-between">
            <span className="text-[10px] font-mono text-charcoal-400">INPUT</span>
            <p className="font-bold text-charcoal-900 my-2">Spoken English Audio</p>
            <span className="text-[10px] text-teal-700 bg-teal-50 py-0.5 rounded">16kHz Mic/File</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-charcoal-400">→</div>

          <div className="bg-white border border-canvas-200 rounded-xl p-4 shadow-subtle flex flex-col justify-between">
            <span className="text-[10px] font-mono text-charcoal-400">ASR ENGINE</span>
            <p className="font-bold text-charcoal-900 my-2">Whisper GGML</p>
            <span className="text-[10px] text-teal-700 bg-teal-50 py-0.5 rounded">CPU Quantised</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-charcoal-400">→</div>

          <div className="bg-white border border-canvas-200 rounded-xl p-4 shadow-subtle flex flex-col justify-between">
            <span className="text-[10px] font-mono text-charcoal-400">TRANSLATION</span>
            <p className="font-bold text-charcoal-900 my-2">IndicTrans2</p>
            <span className="text-[10px] text-teal-700 bg-teal-50 py-0.5 rounded">eng_Latn → tel_Telu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs pt-2">
          <div className="bg-white border border-canvas-200 rounded-xl p-3 shadow-subtle">
            <span className="text-[10px] text-charcoal-400 font-mono">STEP 4</span>
            <p className="font-bold text-charcoal-800">Telugu Text Output</p>
            <p className="text-[11px] text-charcoal-500 font-telugu">సహజ తెలుగు లిపి</p>
          </div>
          <div className="bg-white border border-canvas-200 rounded-xl p-3 shadow-subtle">
            <span className="text-[10px] text-charcoal-400 font-mono">STEP 5</span>
            <p className="font-bold text-charcoal-800">Speech Synthesis</p>
            <p className="text-[11px] text-charcoal-500">Auditory Playback</p>
          </div>
          <div className="bg-white border border-canvas-200 rounded-xl p-3 shadow-subtle">
            <span className="text-[10px] text-charcoal-400 font-mono">STEP 6</span>
            <p className="font-bold text-charcoal-800">Local Persistence</p>
            <p className="text-[11px] text-charcoal-500">IndexedDB & Export</p>
          </div>
        </div>
      </div>

      {/* Detailed Pipeline Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-charcoal-900">Step-by-Step Technical Details</h2>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.num} className="bg-white border border-canvas-200 rounded-2xl p-6 space-y-2 shadow-subtle">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {s.num}
                  </span>
                  <h3 className="font-bold text-sm text-charcoal-900">{s.title}</h3>
                </div>
                <span className="text-xs font-mono text-charcoal-500">{s.tech}</span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
                {s.desc}
              </p>
              <div className="pt-2">
                <code className="text-[11px] font-mono bg-canvas-100 text-charcoal-800 px-2.5 py-1 rounded border border-canvas-200 block overflow-x-auto">
                  {s.code}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Information */}
      <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-800">For Developers & Researchers</h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Every model runtime is decoupled behind uniform abstract base classes defined in <code>services/api/app/adapters/base.py</code>.
          This ensures you can swap inference engines (e.g. replacing Whisper GGML with Faster-Whisper, or fine-tuning an IndicTrans2 distilled checkpoint) without altering the frontend or REST API contracts.
        </p>
      </div>
    </div>
  );
}
