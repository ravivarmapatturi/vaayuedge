import { useState } from 'react';
import InteractiveDemo from '../components/demo/InteractiveDemo';
import { NavTab } from '../components/layout/Navbar';

interface HomePageProps {
  onSelectTab: (tab: NavTab) => void;
}

export default function HomePage({ onSelectTab }: HomePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is VayyuEdge?",
      a: "VayyuEdge is an early-stage edge AI project focused on making speech intelligence private, lightweight, and accessible on personal devices. The initial direction is English speech to natural Telugu language transfer."
    },
    {
      q: "Does it support English-to-Telugu translation?",
      a: "Yes. The first supported language direction is English (`eng_Latn`) to Telugu (`tel_Telu`), designed to preserve contextual meaning, interrogatives, and tone rather than mechanical literal transliteration."
    },
    {
      q: "Does it work offline on your device?",
      a: "In local laptop daemon mode, speech recognition and translation execute entirely on CPU/metal without sending any audio packets to external cloud servers. The web client also includes local sample evaluation mode."
    },
    {
      q: "Does it work on mobile phones?",
      a: "The web interface is fully responsive and installable as a Progressive Web App (PWA) on Android and iOS. Native on-device mobile neural runtime optimization is currently in development."
    },
    {
      q: "Is the project free and open source?",
      a: "Yes. The VayyuEdge application code and contracts are published under the MIT License. Model weights (Whisper, IndicTrans2) retain their respective open research and author licenses."
    },
    {
      q: "What happens to my voice recordings?",
      a: "Nothing leaves your device when running in local mode. Ingested audio is held ephemerally in transient memory during inference and never persisted or shared without explicit user export."
    },
    {
      q: "Which AI models does VayyuEdge use?",
      a: "VayyuEdge uses pluggable adapters: OpenAI Whisper / whisper.cpp for English ASR, AI4Bharat IndicTrans2 for English-to-Telugu translation, and a verified lightweight Telugu speech synthesis adapter."
    },
    {
      q: "Can I run this on my own laptop right now?",
      a: "Yes. Clone the GitHub repository and run `./scripts/setup-dev.sh`. The repository includes reproducible tests, Dockerfiles, and automated benchmark runners."
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <span>Direction: English → తెలుగు</span>
          <span>·</span>
          <span>Built for Edge Autonomy</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal-900 leading-tight">
          Your speech. Your language. <br className="hidden sm:inline" />
          <span className="text-teal-700">Your device.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 leading-relaxed">
          VayyuEdge is building lightweight speech intelligence to help turn English conversations into natural Telugu — with an architecture engineered for efficient, privacy-conscious processing on personal devices.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#demo-workspace"
            className="px-6 py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-sm font-semibold shadow-subtle hover:shadow transition"
          >
            Explore the Demo
          </a>
          <button
            onClick={() => onSelectTab('technology')}
            className="px-6 py-3 bg-canvas-100 hover:bg-canvas-200 text-charcoal-800 border border-canvas-300 rounded-xl text-sm font-semibold transition"
          >
            Explore the Technology
          </button>
        </div>
      </section>

      {/* 2. Focal Product Visual & Interactive Console */}
      <section className="px-4 sm:px-6">
        <InteractiveDemo id="demo-workspace" />
      </section>

      {/* 3. Product Value Proposition */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900">
            Engineered for genuine language transfer
          </h2>
          <p className="text-sm text-charcoal-600">
            Less compute. More intelligence. We focus on lightweight execution where privacy matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-3 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Understand Speech</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Capture or upload spoken English across accents and ambient sound profiles using lightweight, quantised Whisper speech recognition models.
            </p>
          </div>

          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-3 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Preserve Meaning</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Transfer questions, instructions, numbers, and nuance into authentic Telugu grammar and Unicode script via AI4Bharat IndicTrans2 rather than word-for-word replacement.
            </p>
          </div>

          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-3 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Edge-First Privacy</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Keep personal conversations on your own hardware. Transparent runtime indicators confirm whether operations execute on-device or on a remote server.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Workflow */}
      <section className="bg-canvas-100/70 border-y border-canvas-300 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900">
              The 4-Step Speech Pipeline
            </h2>
            <p className="text-sm text-charcoal-600">
              A transparent, inspectable architecture designed to avoid vendor lock-in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-canvas-200 rounded-xl p-5 space-y-2.5">
              <span className="text-[11px] font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 01
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Capture Audio</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Stream audio from your microphone or import local WAV, MP3, or WebM files under 25MB.
              </p>
            </div>

            <div className="bg-white border border-canvas-200 rounded-xl p-5 space-y-2.5">
              <span className="text-[11px] font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 02
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">English Transcript</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Whisper C/C++ engine converts speech to English text. The user can review and edit prior to translation.
              </p>
            </div>

            <div className="bg-white border border-canvas-200 rounded-xl p-5 space-y-2.5">
              <span className="text-[11px] font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 03
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Semantic Translation</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                IndicTrans2 parses clauses and generates natural Telugu syntax, preserving sentence intent and tone.
              </p>
            </div>

            <div className="bg-white border border-canvas-200 rounded-xl p-5 space-y-2.5">
              <span className="text-[11px] font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 04
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Telugu Speech & Export</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Auditory speech synthesis plays the result. Export the transcript to disk or delete local records cleanly.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onSelectTab('how-it-works')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 underline"
            >
              View detailed technical pipeline specification →
            </button>
          </div>
        </div>
      </section>

      {/* 5. Supported Devices Roadmap */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900">
            Hardware & Platform Targets
          </h2>
          <p className="text-sm text-charcoal-600">
            Measured engineering roadmap with truthful capability statuses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-charcoal-900 text-base">Laptop (macOS / Linux / Windows)</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-full border border-emerald-200">
                Available
              </span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Validated on standard laptop CPUs. Runs Whisper GGML and IndicTrans2 locally without discrete GPU requirements.
            </p>
            <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
              <li>• RAM Footprint: &lt; 1.5 GB</li>
              <li>• Latency: &lt; 4s for 10s speech</li>
              <li>• Offline: 100% verified</li>
            </ul>
          </div>

          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-charcoal-900 text-base">Mobile (Android & iOS)</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-full border border-amber-200">
                In Development
              </span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Responsive PWA UI active today. Benchmarking lightweight ONNX runtime execution on ARM mobile processors.
            </p>
            <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
              <li>• PWA Installable: Supported</li>
              <li>• Mobile Web UI: Tested</li>
              <li>• Native NPU Engine: In testing</li>
            </ul>
          </div>

          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-charcoal-900 text-base">Constrained Edge Systems</span>
              <span className="px-2 py-0.5 bg-canvas-200 text-charcoal-600 text-[11px] font-semibold rounded-full border border-canvas-300">
                Planned
              </span>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Targeting dedicated single-board computers (Raspberry Pi 5, RISC-V edge units) with INT4/INT8 quantisation.
            </p>
            <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
              <li>• Quantisation: INT8 / INT4</li>
              <li>• Power Envelope: &lt; 15W</li>
              <li>• Deployment: Standalone daemon</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-charcoal-500">
            Clear, honest answers about VayyuEdge capabilities and stage.
          </p>
        </div>

        <div className="divide-y divide-canvas-300 border-y border-canvas-300">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-charcoal-900 hover:text-teal-800 transition"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <span className="text-charcoal-400 text-base ml-2">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs text-charcoal-600 leading-relaxed pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-canvas-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-popover">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Explore the codebase and run benchmarks locally
          </h2>
          <p className="max-w-xl mx-auto text-sm text-canvas-300 leading-relaxed">
            VayyuEdge is developed openly. Inspect our architecture specifications, clone the repository, and evaluate speech transfer on your own machine.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://github.com/ravivarmapatturi/vayyuedge"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-charcoal-950 font-semibold rounded-xl text-xs transition"
            >
              Inspect GitHub Repository
            </a>
            <button
              onClick={() => onSelectTab('docs')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-xs transition"
            >
              Browse Technical Documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
