import { NavTab } from '../components/layout/Navbar';

interface HowItWorksPageProps {
  onSelectTab?: (tab: NavTab) => void;
}

const STEPS = [
  {
    num: '01',
    name: 'Audio capture',
    tech: '16 kHz mono PCM',
    model: 'MediaStream API',
    size: 'In-memory',
    detail: 'Your microphone captures speech at 16 kHz. In on-device mode, audio is processed in browser memory.',
  },
  {
    num: '02',
    name: 'Listen: Speech recognition',
    tech: 'WebAssembly / WebGPU',
    model: 'Whisper base.en',
    size: '77 MB',
    detail: 'Quantized Whisper model transcribes English speech to text locally in a background Web Worker without freezing the interface.',
  },
  {
    num: '03',
    name: 'Review: English transcript',
    tech: 'Client state',
    model: 'User-in-the-loop review',
    size: 'Local',
    detail: 'You can edit the English transcript before translation. Correcting names, numbers or technical terms prevents errors in the Telugu output.',
  },
  {
    num: '04',
    name: 'Translate: English to Telugu',
    tech: 'WebAssembly / WebGPU',
    model: 'Opus-MT en-dra',
    size: '412 MB',
    detail: 'Quantized seq2seq translation model converts the reviewed English sentence into Telugu text on your device.',
  },
  {
    num: '05',
    name: 'Speak: Telugu voice synthesis',
    tech: 'WebAssembly (fp32)',
    model: 'Meta MMS-TTS tel',
    size: '114 MB',
    detail: 'VITS neural text-to-speech synthesizes Telugu characters into speech audio, played through the browser Web Audio API.',
  },
  {
    num: '06',
    name: 'Storage & offline cache',
    tech: 'Browser sandbox',
    model: 'Cache API & IndexedDB',
    size: 'Client-side only',
    detail: 'Models stay in browser cache after first download, allowing full offline operation. Transcripts and sessions stay in IndexedDB and can be cleared in one click.',
  },
];

export default function HowItWorksPage({ onSelectTab }: HowItWorksPageProps) {
  return (
    <div className="pb-16">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-4">
        <div className="text-xs font-semibold tracking-wider uppercase text-teal-800 font-mono">
          01 / Pipeline
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal-900">
          How on-device speech and translation works.
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm sm:text-base text-charcoal-700">
          VaayuEdge runs the entire conversation flow directly inside your device&apos;s browser worker or local engine. In on-device mode, audio, transcripts and translations are processed on your device.
        </p>
        <p className="mt-2 text-xs sm:text-sm font-mono text-charcoal-500">
          Today English to Telugu is live. Telugu to English is in development.
        </p>
      </section>

      {/* SVG Pipeline Diagram */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-8" aria-labelledby="pipeline-diagram-heading">
        <h2 id="pipeline-diagram-heading" className="sr-only">On-device processing pipeline diagram</h2>
        <div className="hidden sm:block p-4 sm:p-6 bg-canvas-100 border border-canvas-300 rounded-lg">
          <div className="flex items-center justify-between pb-3 border-b border-canvas-300 mb-4 text-xs font-mono text-charcoal-600">
            <span className="font-semibold text-charcoal-900">Device execution boundary</span>
            <span className="text-teal-800">On-device mode</span>
          </div>

          <svg
            viewBox="0 0 900 150"
            className="w-full h-auto max-h-[160px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Diagram of the on-device pipeline: Mic audio to Whisper ASR, then Review, then Opus-MT Translation, then MMS-TTS Telugu speech"
          >
            {/* Box 1: Mic */}
            <rect x="10" y="25" width="130" height="90" rx="4" fill="#ffffff" stroke="#d6d5cc" strokeWidth="1.5" />
            <text x="75" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily="Manrope, sans-serif" fontWeight="700">1. Mic Audio</text>
            <text x="75" y="75" textAnchor="middle" fill="#5d6864" fontSize="11" fontFamily="DM Sans, sans-serif">16 kHz mono</text>
            <text x="75" y="93" textAnchor="middle" fill="#075f54" fontSize="10" fontFamily="JetBrains Mono, monospace">In-memory</text>

            {/* Arrow 1 */}
            <path d="M140 70 L170 70" stroke="#5d6864" strokeWidth="1.5" strokeDasharray="3 3" />
            <polygon points="172,70 166,66 166,74" fill="#5d6864" />

            {/* Box 2: Whisper */}
            <rect x="175" y="25" width="150" height="90" rx="4" fill="#ffffff" stroke="#d6d5cc" strokeWidth="1.5" />
            <text x="250" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily="Manrope, sans-serif" fontWeight="700">2. Listen (ASR)</text>
            <text x="250" y="75" textAnchor="middle" fill="#5d6864" fontSize="11" fontFamily="DM Sans, sans-serif">Whisper base.en</text>
            <text x="250" y="93" textAnchor="middle" fill="#075f54" fontSize="10" fontFamily="JetBrains Mono, monospace">77 MB quantized</text>

            {/* Arrow 2 */}
            <path d="M325 70 L355 70" stroke="#5d6864" strokeWidth="1.5" />
            <polygon points="357,70 351,66 351,74" fill="#5d6864" />

            {/* Box 3: Review */}
            <rect x="360" y="25" width="140" height="90" rx="4" fill="#ffffff" stroke="#d6d5cc" strokeWidth="1.5" />
            <text x="430" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily="Manrope, sans-serif" fontWeight="700">3. Review</text>
            <text x="430" y="75" textAnchor="middle" fill="#5d6864" fontSize="11" fontFamily="DM Sans, sans-serif">Editable text</text>
            <text x="430" y="93" textAnchor="middle" fill="#075f54" fontSize="10" fontFamily="JetBrains Mono, monospace">User review</text>

            {/* Arrow 3 */}
            <path d="M500 70 L530 70" stroke="#5d6864" strokeWidth="1.5" />
            <polygon points="532,70 526,66 526,74" fill="#5d6864" />

            {/* Box 4: Translate */}
            <rect x="535" y="25" width="160" height="90" rx="4" fill="#ffffff" stroke="#d6d5cc" strokeWidth="1.5" />
            <text x="615" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily="Manrope, sans-serif" fontWeight="700">4. Translate (MT)</text>
            <text x="615" y="75" textAnchor="middle" fill="#5d6864" fontSize="11" fontFamily="DM Sans, sans-serif">Opus-MT en-dra</text>
            <text x="615" y="93" textAnchor="middle" fill="#075f54" fontSize="10" fontFamily="JetBrains Mono, monospace">412 MB quantized</text>

            {/* Arrow 4 */}
            <path d="M695 70 L725 70" stroke="#5d6864" strokeWidth="1.5" />
            <polygon points="727,70 721,66 721,74" fill="#5d6864" />

            {/* Box 5: Speak */}
            <rect x="730" y="25" width="160" height="90" rx="4" fill="#ffffff" stroke="#d6d5cc" strokeWidth="1.5" />
            <text x="810" y="55" textAnchor="middle" fill="#0f172a" fontSize="13" fontFamily="Manrope, sans-serif" fontWeight="700">5. Speak (TTS)</text>
            <text x="810" y="75" textAnchor="middle" fill="#5d6864" fontSize="11" fontFamily="DM Sans, sans-serif">MMS-TTS Telugu</text>
            <text x="810" y="93" textAnchor="middle" fill="#075f54" fontSize="10" fontFamily="JetBrains Mono, monospace">114 MB voice</text>
          </svg>
        </div>
      </section>

      {/* Real Translation Sample */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12" aria-labelledby="sample-heading">
        <h2 id="sample-heading" className="text-xl font-bold text-charcoal-900">
          Real translation sample
        </h2>
        <div className="mt-4 border border-canvas-300 bg-white rounded-lg p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-canvas-300 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-500">You speak in English</span>
            <p className="text-base text-charcoal-900 font-medium">
              I will call you after I finish the meeting.
            </p>
            <span className="text-xs text-charcoal-500 font-mono">Recognized by Whisper (77 MB)</span>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-800">VaayuEdge translates to Telugu</span>
            <p className="text-xl font-telugu text-charcoal-900 leading-relaxed" lang="te">
              మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.
            </p>
            <span className="text-xs text-charcoal-500 font-mono">Translated by Opus-MT (412 MB) · Spoken via MMS-TTS</span>
          </div>
        </div>
      </section>

      {/* Step by step technical breakdown */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-xl font-bold text-charcoal-900">
          Step-by-step pipeline details
        </h2>
        <ol className="mt-4 border-t border-canvas-300">
          {STEPS.map((step) => (
            <li
              key={step.num}
              className="grid grid-cols-1 sm:grid-cols-[3rem_1fr_auto] gap-2 sm:gap-4 py-4 border-b border-canvas-300 items-baseline"
            >
              <span className="font-mono text-sm text-charcoal-500">{step.num}</span>
              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <strong className="text-charcoal-900 text-sm sm:text-base">{step.name}</strong>
                  <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {step.model}
                  </span>
                </div>
                <p className="text-sm text-charcoal-700 leading-relaxed">{step.detail}</p>
                <div className="text-xs font-mono text-charcoal-500">{step.tech}</div>
              </div>
              <span className="font-mono text-xs sm:text-sm text-charcoal-700 whitespace-nowrap self-start sm:self-center">
                {step.size}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Execution Modes */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="modes-heading">
        <h2 id="modes-heading" className="text-xl font-bold text-charcoal-900">
          Execution environments
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-canvas-300 bg-white p-5 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-charcoal-900 text-base">In-Browser Mode</h3>
              <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Default
              </span>
            </div>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              Zero installation. Quantized ONNX weights load into a background Web Worker via transformers.js using WebAssembly or WebGPU. Once downloaded, files stay cached in your browser and work offline.
            </p>
          </div>

          <div className="border border-canvas-300 bg-white p-5 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-charcoal-900 text-base">Native Engine</h3>
              <span className="text-xs font-mono text-charcoal-600 bg-canvas-200 px-2 py-0.5 rounded border border-canvas-300">
                Advanced
              </span>
            </div>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              For developers profiling inference or running local Python services. The web interface automatically detects an active engine at <code className="font-mono text-xs text-charcoal-800">127.0.0.1:8000</code> over local loopback.
            </p>
          </div>
        </div>
      </section>

      {/* Current limits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-xl font-bold text-charcoal-900">
          Current limits & honesty in engineering
        </h2>
        <ul className="mt-3 space-y-2 list-disc pl-5 text-sm text-charcoal-700">
          <li>
            <strong>Telugu to English:</strong> In active development. Speech recognition for Telugu audio and translation back to English are not yet available.
          </li>
          <li>
            <strong>Initial download:</strong> Setup requires downloading about 600 MB of quantized models. Best done over a stable Wi-Fi connection.
          </li>
          <li>
            <strong>Translation accuracy:</strong> Compact on-device models do not match the broad coverage of multi-billion parameter cloud services. Always verify critical medical, legal or official matters with a native Telugu speaker.
          </li>
          <li>
            <strong>Voice licensing:</strong> The current Telugu voice model (Meta MMS-TTS) uses a non-commercial CC-BY-NC licence, and will be replaced before any commercial tier.
          </li>
        </ul>
        <p className="mt-5 text-sm text-charcoal-700">
          <a href="/leaderboard/" className="text-teal-800 underline">
            Compare model sizes and chrF++ scores on the leaderboard
          </a>
          {' · '}
          <a href="/research/" className="text-teal-800 underline">
            Read research notes and evaluation protocols
          </a>
        </p>

        {onSelectTab && (
          <div className="mt-8 pt-6 border-t border-canvas-300">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded text-sm font-semibold transition"
            >
              Open translator demo →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
