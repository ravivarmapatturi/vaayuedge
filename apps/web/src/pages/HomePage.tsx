import { useState } from 'react';
import InteractiveDemo from '../components/demo/InteractiveDemo';
import { NavTab } from '../components/layout/Navbar';

interface HomePageProps {
  onSelectTab: (tab: NavTab) => void;
}

export default function HomePage({ onSelectTab }: HomePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeExperienceTab, setActiveExperienceTab] = useState<'capture' | 'editing' | 'translation' | 'playback'>('capture');
  const [activeComparisonIndex, setActiveComparisonIndex] = useState(0);

  const comparisons = [
    {
      english: "I will call you after I finish the meeting.",
      literal: "నేను ఉంటాను కాల్ మీరు తర్వాత నేను పూర్తి సమావేశం.",
      literalNotes: "Broken English word order, literal translation of auxiliary verb 'will' and 'call'.",
      vaayu: "మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.",
      vaayuNotes: "Natural Telugu conjunctive participle ('పూర్తయ్యాక'), correct future tense verb agreement ('చేస్తాను')."
    },
    {
      english: "Could you please turn off the projector before leaving?",
      literal: "మీరు దయచేసి తిరగడం ఆఫ్ ప్రొజెక్టర్ ముందు వదిలివేయడం చేయగలరా?",
      literalNotes: "Literal interpretation of phrasal verb 'turn off' as turning physically.",
      vaayu: "బయలుదేరే ముందు దయచేసి ప్రొజెక్టర్‌ను ఆపివేయగలరా?",
      vaayuNotes: "Accurate postposition ('ముందు'), polite interrogative register, and appropriate Telugu verb 'ఆపివేయగలరా'."
    },
    {
      english: "The doctors advised drinking plenty of water during the summer.",
      literal: "వైద్యులు సలహా ఇచ్చారు త్రాగడం పుష్కలంగా నీరు సమయంలో వేసవి.",
      literalNotes: "Awkward preposition translation and clumsy noun-adjective alignment.",
      vaayu: "వేసవిలో సమృద్ధిగా నీరు తాగాలని వైద్యులు సలహా ఇచ్చారు.",
      vaayuNotes: "Authentic reported speech structure ('తాగాలని'), locative case inflection ('వేసవిలో')."
    }
  ];

  const faqs = [
    {
      q: "What is VaayuEdge?",
      a: "VaayuEdge is an early-stage edge AI product project focused on making speech intelligence private, lightweight, and accessible on personal devices. The initial direction is English speech recognition and contextual Telugu translation."
    },
    {
      q: "Does it support English-to-Telugu translation?",
      a: "Yes. The first supported language direction is English (eng_Latn) to Telugu (tel_Telu), specifically engineered to preserve communicative intent, tone, polite registers, and questions rather than robotic literal transliteration."
    },
    {
      q: "Does it work offline on your device?",
      a: "In local laptop daemon mode, speech recognition and translation execute entirely on CPU/Metal without sending audio or transcripts to external cloud servers. The web client also includes local sample evaluation mode."
    },
    {
      q: "Does it work on mobile phones?",
      a: "The web client is fully responsive and installable as a Progressive Web App (PWA) on Android and iOS. Native on-device mobile neural runtime optimization using quantised ARM inference is currently in active development."
    },
    {
      q: "Is the project free and open source?",
      a: "Yes. The VaayuEdge application code, contracts, and test harnesses are published under the MIT License on GitHub. Model weights (Whisper, IndicTrans2) retain their respective open research and author licenses."
    },
    {
      q: "What happens to my voice recordings?",
      a: "In local mode, nothing leaves your device. Ingested audio is held in transient memory only for the duration of inference and immediately unlinked. It is never logged, stored in databases, or used for model training."
    },
    {
      q: "Which AI models does VaayuEdge use?",
      a: "VaayuEdge uses modular adapters: OpenAI Whisper / whisper.cpp for English speech recognition, AI4Bharat IndicTrans2 for English-to-Telugu translation, and a verified lightweight Telugu speech synthesis adapter."
    },
    {
      q: "Can I run this on my own laptop right now?",
      a: "Yes. Clone the GitHub repository (https://github.com/ravivarmapatturi/vaayuedge) and run ./scripts/setup-dev.sh. The repository includes reproducible unit tests, Dockerfiles, and benchmark runners."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-subtle">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>English → తెలుగు</span>
          <span>·</span>
          <span>Private by design</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal-900 leading-tight">
          Your speech. Your language. <br className="hidden sm:inline" />
          <span className="text-teal-700">Your device.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal">
          VaayuEdge is building lightweight speech intelligence to help turn English conversations into natural Telugu — with a focus on efficient, privacy-conscious processing on personal devices.
        </p>

        {/* Action Buttons */}
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

        {/* Credibility Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal-500">
          <div className="flex items-center space-x-1.5">
            <span className="text-teal-700 font-bold">✓</span>
            <span>Zero Cloud Audio Storage</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-teal-700 font-bold">✓</span>
            <span>Context-Aware Telugu Syntax</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-teal-700 font-bold">✓</span>
            <span>Runs on Standard Laptop CPUs</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Product Visual & Interactive Console (Focal Centerpiece) */}
      <section className="px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="text-center sm:text-left flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-500">
              Try It Now
            </h2>
            <span className="text-xs text-charcoal-400 font-mono">
              English → Telugu
            </span>
          </div>
          <InteractiveDemo id="demo-workspace" />
        </div>
      </section>

      {/* 3. Product Value Proposition (3 Core Pillars) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
            Engineered for genuine linguistic transfer
          </h2>
          <p className="text-sm text-charcoal-600">
            Less compute. More intelligence. We prioritize lightweight execution where accuracy and privacy matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 sm:p-7 space-y-4 shadow-subtle hover:border-canvas-300 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Understand Speech</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Capture or upload spoken English across diverse accents and ambient sound profiles using quantised Whisper speech recognition models optimized for CPU inference without discrete GPUs.
            </p>
          </div>

          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 sm:p-7 space-y-4 shadow-subtle hover:border-canvas-300 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Preserve Meaning</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Transfer questions, imperative instructions, numbers, and cultural nuance into authentic Telugu grammar via AI4Bharat IndicTrans2 rather than crude word-for-word replacement.
            </p>
          </div>

          <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 sm:p-7 space-y-4 shadow-subtle hover:border-canvas-300 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Edge-First Privacy</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Keep personal and commercial conversations on your own device. Transparent runtime indicators confirm whether speech processing is executing on-device or on a remote server.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Linguistic Comparison: Literal vs VaayuEdge */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-canvas-300 rounded-3xl p-6 sm:p-10 space-y-8 shadow-card">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              Linguistic Fidelity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
              Why Word-for-Word Translation Fails in Telugu
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              Telugu is an agglutinative Dravidian language with flexible SOV (Subject-Object-Verb) word order. Generic translation tools often swap English words literally, resulting in broken, robotic phrasing.
            </p>
          </div>

          {/* Comparison Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-canvas-200 pb-3">
            {comparisons.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveComparisonIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeComparisonIndex === idx
                    ? 'bg-charcoal-900 text-white shadow-subtle'
                    : 'bg-canvas-100 hover:bg-canvas-200 text-charcoal-700'
                }`}
              >
                Example {idx + 1}
              </button>
            ))}
          </div>

          {/* Active Comparison Box */}
          <div className="space-y-5">
            <div className="bg-canvas-50 border border-canvas-200 rounded-xl p-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-charcoal-500">
                Spoken English Source
              </span>
              <p className="text-base sm:text-lg font-medium text-charcoal-900 mt-1">
                "{comparisons[activeComparisonIndex].english}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Literal Clunky Output */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Literal Word-for-Word Machine Output
                  </span>
                </div>
                <p className="text-base text-rose-950 font-telugu leading-relaxed pt-1">
                  "{comparisons[activeComparisonIndex].literal}"
                </p>
                <p className="text-xs text-rose-800/80 leading-relaxed pt-1">
                  <strong>Flaw:</strong> {comparisons[activeComparisonIndex].literalNotes}
                </p>
              </div>

              {/* VaayuEdge Natural Output */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                    VaayuEdge Meaning-Aware Telugu
                  </span>
                </div>
                <p className="text-base sm:text-lg text-teal-950 font-telugu font-medium leading-relaxed pt-1">
                  "{comparisons[activeComparisonIndex].vaayu}"
                </p>
                <p className="text-xs text-teal-900/90 leading-relaxed pt-1">
                  <strong>Preservation:</strong> {comparisons[activeComparisonIndex].vaayuNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (4 Clear Steps) */}
      <section className="bg-canvas-100/70 border-y border-canvas-300 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
              The 4-Step Speech Pipeline
            </h2>
            <p className="text-sm text-charcoal-600">
              A transparent, inspectable workflow built with decoupled model adapters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-canvas-200 rounded-2xl p-5 space-y-2.5 shadow-subtle">
              <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 01
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Capture Audio</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Stream 16kHz speech from your device microphone or upload audio files (WAV, MP3, WebM) under 25MB and 180 seconds.
              </p>
            </div>

            <div className="bg-white border border-canvas-200 rounded-2xl p-5 space-y-2.5 shadow-subtle">
              <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 02
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Generate Transcript</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Quantised Whisper C/C++ engine converts acoustic frames into an editable English transcript with duration and timing metrics.
              </p>
            </div>

            <div className="bg-white border border-canvas-200 rounded-2xl p-5 space-y-2.5 shadow-subtle">
              <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 03
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Translate to Telugu</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                AI4Bharat IndicTrans2 processes sentence clauses, preserving interrogative structure, polite registers, and domain terms.
              </p>
            </div>

            <div className="bg-white border border-canvas-200 rounded-2xl p-5 space-y-2.5 shadow-subtle">
              <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                STEP 04
              </span>
              <h4 className="font-bold text-sm text-charcoal-900">Review & Export</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Listen to synthesized Telugu speech, copy text, export bilingual transcripts, or purge local session history with one click.
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

      {/* 6. Product Experience Walkthrough (Section G) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
            Interface Deep Dive
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
            The Product Experience
          </h2>
          <p className="text-sm text-charcoal-600">
            Engineered with clear user-in-the-loop controls at every stage of the pipeline.
          </p>
        </div>

        <div className="bg-canvas-100 border border-canvas-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-subtle">
          {/* Experience Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-canvas-300 pb-3">
            {[
              { id: 'capture', label: '1. Recording State' },
              { id: 'editing', label: '2. Transcript Editing' },
              { id: 'translation', label: '3. Telugu Output' },
              { id: 'playback', label: '4. Speech & Data Control' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveExperienceTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeExperienceTab === tab.id
                    ? 'bg-charcoal-900 text-white shadow-subtle'
                    : 'bg-canvas-200 hover:bg-canvas-300/80 text-charcoal-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          {activeExperienceTab === 'capture' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-charcoal-900">Live Microphone & File Ingestion</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Stream audio in real time using the browser MediaRecorder API or import pre-recorded audio files. The engine accepts WAV (PCM 16-bit mono), MP3, and WebM containers up to 25MB.
                </p>
                <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
                  <li>• Sampling Rate: 16 kHz recommended</li>
                  <li>• Safeguards: 180s hard duration threshold</li>
                  <li>• Privacy: Zero disk write until requested</li>
                </ul>
              </div>
              <div className="bg-white border border-canvas-300 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs text-charcoal-500">
                  <span>Microphone Stream</span>
                  <span className="text-rose-600 font-semibold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>Recording Active (4.2s)</span>
                  </span>
                </div>
                <div className="h-10 bg-canvas-100 rounded-lg flex items-center justify-center space-x-1 px-4">
                  {[20, 45, 60, 30, 80, 95, 40, 25, 65, 85, 30, 15, 70, 90, 50, 35].map((h, i) => (
                    <div key={i} className="flex-1 bg-teal-600 rounded-full" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="text-[11px] text-charcoal-400 text-center">
                  Live acoustic frames buffered in ephemeral memory
                </div>
              </div>
            </div>
          )}

          {activeExperienceTab === 'editing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-charcoal-900">User-in-the-Loop Transcript Review</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Speech recognition is never 100% infallible on rare proper nouns or technical jargon. VaayuEdge presents the raw English transcript in an editable review window, letting you correct mistakes before sending text to the translation engine.
                </p>
                <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
                  <li>• Word count & character metrics</li>
                  <li>• Edit without re-recording</li>
                  <li>• Trigger translation when satisfied</li>
                </ul>
              </div>
              <div className="bg-white border border-canvas-300 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex justify-between text-xs text-charcoal-500">
                  <span className="font-semibold text-charcoal-700">English Transcript (Editable)</span>
                  <span>9 words</span>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value="I will call you after I finish the meeting."
                  className="w-full bg-canvas-50 border border-canvas-200 rounded-lg p-3 text-xs text-charcoal-900 font-sans resize-none"
                />
                <div className="flex justify-end">
                  <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Ready for translation →
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeExperienceTab === 'translation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-charcoal-900">High-Fidelity Telugu Output</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  IndicTrans2 tokenizes the English sentence, predicts sentence clause structure, and outputs grammatically sound Telugu Unicode script. The text is formatted with high typographic contrast and custom Dravidian font fallbacks.
                </p>
                <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
                  <li>• Language Pair: eng_Latn → tel_Telu</li>
                  <li>• Tokenizer: SentencePiece</li>
                  <li>• One-click clipboard copy</li>
                </ul>
              </div>
              <div className="bg-white border border-canvas-300 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex justify-between text-xs text-charcoal-500">
                  <span className="font-semibold text-teal-900">Telugu Script Output</span>
                  <span className="text-teal-700 font-medium">Verified Translation</span>
                </div>
                <div className="bg-canvas-50 border border-canvas-200 rounded-xl p-4 text-base font-telugu text-charcoal-900">
                  "మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను."
                </div>
                <div className="text-[11px] text-charcoal-500 pt-1">
                  Grammatically natural clause connection: "పూర్తయ్యాక" (after finishing)
                </div>
              </div>
            </div>
          )}

          {activeExperienceTab === 'playback' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-charcoal-900">Auditory Synthesis & Instant Deletion</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Synthesize the translated Telugu text into spoken speech with auditory playback. All sessions are saved locally in browser IndexedDB with complete export options (.txt) and an instant "Clear All History" button that guarantees zero trace remains.
                </p>
                <ul className="text-xs text-charcoal-700 space-y-1 font-mono">
                  <li>• Speech Output: Telugu WAV / Web Speech</li>
                  <li>• Persistence: IndexedDB (Client side)</li>
                  <li>• Data Purge: Instant local eradication</li>
                </ul>
              </div>
              <div className="bg-white border border-canvas-300 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal-800">Session Controls</span>
                  <span className="text-emerald-700 font-medium">IndexedDB Active</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-canvas-200 text-charcoal-800 rounded-lg text-xs font-semibold">
                    Play Telugu Voice 🔊
                  </button>
                  <button className="flex-1 py-2 bg-canvas-200 text-charcoal-800 rounded-lg text-xs font-semibold">
                    Export .TXT 💾
                  </button>
                </div>
                <button className="w-full py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
                  Clear All Local Sessions ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. Why VaayuEdge Philosophy (Section H) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
            Engineering Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
            Why VaayuEdge?
          </h2>
          <p className="text-sm text-charcoal-600">
            A deliberate philosophy prioritizing device autonomy and linguistic respect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-canvas-100 border border-canvas-300 rounded-2xl space-y-2.5">
            <h3 className="font-bold text-sm text-charcoal-900">1. Efficient Inference</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We focus on quantisation (INT8 / INT4) and CPU vectorization so models run directly on commodity laptop chips without requiring $2,000+ discrete GPUs.
            </p>
          </div>

          <div className="p-6 bg-canvas-100 border border-canvas-300 rounded-2xl space-y-2.5">
            <h3 className="font-bold text-sm text-charcoal-900">2. Privacy by Architecture</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Rather than trusting privacy policies or vague data promises, VaayuEdge isolates processing to localhost sockets with an airplane-mode audit procedure.
            </p>
          </div>

          <div className="p-6 bg-canvas-100 border border-canvas-300 rounded-2xl space-y-2.5">
            <h3 className="font-bold text-sm text-charcoal-900">3. Device-First Design</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Eliminate recurring cloud API fees and token metering for continuous speech. Once installed on your device, inference is genuinely free and unconstrained.
            </p>
          </div>

          <div className="p-6 bg-canvas-100 border border-canvas-300 rounded-2xl space-y-2.5">
            <h3 className="font-bold text-sm text-charcoal-900">4. Meaning-Focused Transfer</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Language translation must convey intent, questions, and polite registers. We test with native Telugu speakers against natural conversational scenarios.
            </p>
          </div>

          <div className="p-6 bg-canvas-100 border border-canvas-300 rounded-2xl space-y-2.5">
            <h3 className="font-bold text-sm text-charcoal-900">5. Measured Performance</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We never fabricate benchmark numbers or claim state-of-the-art without proof. Automated benchmark scripts (scripts/benchmark.py) report actual latency and RAM watermark.
            </p>
          </div>

          <div className="p-6 bg-canvas-100 border border-canvas-300 rounded-2xl space-y-2.5">
            <h3 className="font-bold text-sm text-charcoal-900">6. Decoupled Adapters</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Every model engine is replaceable behind uniform abstract Python protocols. Upgrade from Whisper tiny to base or plug in new TTS voices without altering API contracts.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Technology Overview (Section I) */}
      <section className="bg-canvas-100/70 border-y border-canvas-300 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
              Modular ML Architecture
            </h2>
            <p className="text-sm text-charcoal-600">
              Each stage of the speech and language pipeline operates behind an isolated interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-canvas-200 rounded-2xl p-6 space-y-3 shadow-subtle">
              <span className="text-[10px] font-mono font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                ASR ADAPTER
              </span>
              <h3 className="font-bold text-base text-charcoal-900">Whisper / whisper.cpp</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                OpenAI Whisper quantised via whisper.cpp. Evaluates 75MB (tiny.en) and 142MB (base.en) GGML weights directly on CPU vector instructions.
              </p>
              <div className="text-[11px] font-mono text-charcoal-500 pt-1">
                License: MIT (Open Source)
              </div>
            </div>

            <div className="bg-white border border-canvas-200 rounded-2xl p-6 space-y-3 shadow-subtle">
              <span className="text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                TRANSLATION ADAPTER
              </span>
              <h3 className="font-bold text-base text-charcoal-900">AI4Bharat IndicTrans2</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Specialized transformer developed by AI4Bharat IIT Madras. Handles English source (eng_Latn) and Telugu target (tel_Telu) with sentence clause awareness.
              </p>
              <div className="text-[11px] font-mono text-charcoal-500 pt-1">
                License: Research / Academic
              </div>
            </div>

            <div className="bg-white border border-canvas-200 rounded-2xl p-6 space-y-3 shadow-subtle">
              <span className="text-[10px] font-mono font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                TTS ADAPTER
              </span>
              <h3 className="font-bold text-base text-charcoal-900">Telugu Voice Engine</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Replaceable audio synthesis interface. Integrates Piper ONNX Telugu neural voice with automatic Web Speech API fallback when offline voice weights are missing.
              </p>
              <div className="text-[11px] font-mono text-charcoal-500 pt-1">
                Graceful Degraded Audio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Privacy & Transparency Matrix (Section K) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-canvas-900 text-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-card">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-400">
              Zero-Compromise Security Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Privacy and Transparency Model
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-canvas-800/80 border border-canvas-700 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-teal-300">1. Local Device Mode</h4>
              <p className="text-canvas-300 leading-relaxed">
                When configured in local mode, audio is processed on loopback socket (127.0.0.1). Zero network packets leave the device.
              </p>
            </div>

            <div className="bg-canvas-800/80 border border-canvas-700 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-teal-300">2. Ephemeral Audio</h4>
              <p className="text-canvas-300 leading-relaxed">
                Ingested voice recordings are held only in RAM during model inference. No raw audio files are persisted by default.
              </p>
            </div>

            <div className="bg-canvas-800/80 border border-canvas-700 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-teal-300">3. Browser Sandbox Storage</h4>
              <p className="text-canvas-300 leading-relaxed">
                Recent sessions are saved in client-side IndexedDB. No accounts, cookies, or cloud database sync exist in the MVP.
              </p>
            </div>

            <div className="bg-canvas-800/80 border border-canvas-700 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-teal-300">4. User-Controlled Purge</h4>
              <p className="text-canvas-300 leading-relaxed">
                One-click local deletion completely wipes all stored session records from the browser sandbox instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ Section (Section M) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
            Answers & Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-charcoal-500">
            Clear, honest answers about VaayuEdge capabilities, models, and licensing.
          </p>
        </div>

        <div className="divide-y divide-canvas-300 border-y border-canvas-300">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-charcoal-900 hover:text-teal-800 transition py-1"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <span className="text-charcoal-400 text-base ml-2 font-mono">{openFaq === idx ? '−' : '+'}</span>
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

      {/* 13. Final Call to Action (Section N) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-canvas-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-popover">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Explore the codebase and evaluate benchmarks locally
          </h2>
          <p className="max-w-xl mx-auto text-sm text-canvas-300 leading-relaxed font-normal">
            VaayuEdge is developed openly. Inspect our architecture specifications, clone the repository, and evaluate speech transfer on your own machine.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://github.com/ravivarmapatturi/vaayuedge"
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
