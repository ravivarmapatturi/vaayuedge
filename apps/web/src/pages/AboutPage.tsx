import { NavTab } from '../components/layout/Navbar';

interface AboutPageProps {
  onSelectTab?: (tab: NavTab) => void;
}

export default function AboutPage({ onSelectTab }: AboutPageProps) {
  return (
    <div className="pb-16">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-4">
        <div className="text-xs font-semibold tracking-wider uppercase text-teal-800 font-mono">
          About VaayuEdge
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal-900">
          On-device intelligence for real devices.
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm sm:text-base text-charcoal-700">
          VaayuEdge is an on-device speech and translation tool developed by InferEdge AI. It starts with English and Telugu, and in on-device mode runs speech recognition, translation and speech generation in your browser.
        </p>
        <p className="mt-2 text-xs sm:text-sm font-mono text-charcoal-500">
          Today English to Telugu is live. Telugu to English is in development.
        </p>
      </section>

      {/* Mission & Premise */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-10" aria-labelledby="mission-heading">
        <h2 id="mission-heading" className="text-xl font-bold text-charcoal-900">
          Why on-device intelligence matters
        </h2>
        <div className="mt-4 space-y-3 text-sm text-charcoal-700 leading-relaxed max-w-3xl">
          <p>
            Many speech and language tools send audio to a server and need a constant connection.
          </p>
          <p>
            InferEdge AI builds intelligence across modalities for devices with limited memory, compute, energy and connectivity. VaayuEdge shows that complete voice-to-voice translation can execute on the hardware you already own — inside a standard web browser on a laptop or phone — without sending audio across the internet.
          </p>
          <p>
            After a one-time model download during setup, all speech recognition, translation and audio synthesis run locally and work offline.
          </p>
        </div>
      </section>

      {/* Language Focus */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="languages-heading">
        <h2 id="languages-heading" className="text-xl font-bold text-charcoal-900">
          Starting with English and Telugu
        </h2>
        <div className="mt-4 space-y-3 text-sm text-charcoal-700 leading-relaxed max-w-3xl">
          <p>
            Telugu is a Dravidian language, and its clause order and polite verb forms differ a lot from English.
          </p>
          <p>
            Our initial focus is making English and Telugu conversational assistance reliable on constrained devices. Today, the live product runs English to Telugu: you speak English, inspect and correct the transcript, and hear the resulting Telugu audio.
          </p>
          <p>
            Telugu speech recognition and Telugu-to-English translation are in active development and will be released once they meet our quality and efficiency benchmarks.
          </p>
        </div>
      </section>

      {/* Engineering and Evidence Discipline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="discipline-heading">
        <h2 id="discipline-heading" className="text-xl font-bold text-charcoal-900">
          Engineering & evidence discipline
        </h2>
        <div className="mt-4 space-y-3 text-sm text-charcoal-700 leading-relaxed max-w-3xl">
          <p>
            We do not publish fabricated results, claim universal superiority, or hide model limitations. Every number in our documentation and interfaces is labelled by what was measured:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong>Real download footprints:</strong> Whisper ASR (77 MB quantized), Opus-MT translation (412 MB quantized), Meta MMS-TTS Telugu voice (114 MB).
            </li>
            <li>
              <strong>Reproducible benchmarks:</strong> Held-out test scores (chrF++ and BLEU) published alongside open competitor evaluations on our public leaderboard.
            </li>
            <li>
              <strong>Transparent limitations:</strong> We document where smaller on-device models lag behind large cloud models and when human review is required.
            </li>
          </ul>
        </div>
      </section>

      {/* Upstream Attribution */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="models-heading">
        <h2 id="models-heading" className="text-xl font-bold text-charcoal-900">
          Upstream models & open research
        </h2>
        <div className="mt-4 space-y-3 text-sm text-charcoal-700 leading-relaxed max-w-3xl">
          <p>
            VaayuEdge builds on foundational open research from the machine learning community:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong>Speech Recognition:</strong> OpenAI Whisper base.en, quantized to 8-bit for efficient WebAssembly and WebGPU execution.
            </li>
            <li>
              <strong>Translation:</strong> Helsinki-NLP Opus-MT (en-dra), quantized for browser execution via transformers.js.
            </li>
            <li>
              <strong>Telugu Speech Synthesis:</strong> Meta MMS-TTS Telugu, running on WebAssembly under a non-commercial CC-BY-NC licence.
            </li>
          </ul>
          <p className="text-xs text-charcoal-500 font-mono mt-2">
            All upstream checkpoints retain their respective open-source and research licences.
          </p>
        </div>
      </section>

      {/* Contact & Links */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-xl font-bold text-charcoal-900">
          Contact & resources
        </h2>
        <p className="mt-3 text-sm text-charcoal-700 leading-relaxed max-w-3xl">
          Have questions about VaayuEdge, on-device edge AI, or our Telugu research benchmarks?
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            href="https://x.com/NeuralMastery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-800 font-semibold underline"
          >
            <span>Contact on X (@NeuralMastery)</span>
            <span aria-hidden="true">↗</span>
          </a>
          <span className="text-charcoal-300">·</span>
          <a href="/leaderboard/" className="text-teal-800 underline">
            Translation leaderboard
          </a>
          <span className="text-charcoal-300">·</span>
          <a href="/research/" className="text-teal-800 underline">
            Research publications
          </a>
          <span className="text-charcoal-300">·</span>
          <a href="/" className="text-teal-800 underline">
            InferEdge AI home
          </a>
        </div>

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
