import InteractiveDemo from '../components/demo/InteractiveDemo';

export default function ProductPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
          Product Specification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
          Purpose-Built Edge Speech Intelligence
        </h1>
        <p className="text-base text-charcoal-600 max-w-2xl leading-relaxed">
          VayyuEdge solves a specific, acute problem: providing private, natural English-to-Telugu speech conversion that runs efficiently on personal devices.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-charcoal-900">The Problem with Cloud Translation</h2>
          <ul className="text-xs text-charcoal-600 space-y-2.5 leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Privacy Exposure:</strong> Private corporate, healthcare, or personal conversations are transmitted to third-party cloud data centers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Mechanical Translation:</strong> Literal word-for-word transliteration fails to capture Telugu verb conjugations and polite interrogatives.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Compute Inefficiency:</strong> Monolithic cloud models demand excessive memory, preventing local edge execution.</span>
            </li>
          </ul>
        </div>

        <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-teal-950">The VayyuEdge Approach</h2>
          <ul className="text-xs text-teal-900 space-y-2.5 leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="text-teal-700 font-bold">✓</span>
              <span><strong>On-Device Boundary:</strong> Audio and intermediate representations remain strictly on the host device in local mode.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-teal-700 font-bold">✓</span>
              <span><strong>Semantic Meaning Transfer:</strong> AI4Bharat IndicTrans2 retains grammatical context, sentence clauses, and natural Telugu tone.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-teal-700 font-bold">✓</span>
              <span><strong>Quantised Efficiency:</strong> Runs smoothly on modern multi-core laptop CPUs with less than 1.5GB RAM watermark.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Live Workspace Console */}
      <div className="space-y-4">
        <div className="border-b border-canvas-300 pb-2">
          <h2 className="text-xl font-bold text-charcoal-900">Interactive Workspace</h2>
          <p className="text-xs text-charcoal-500">Test microphone recording, file upload, or sample evaluation directly.</p>
        </div>
        <InteractiveDemo id="product-demo" isStandalonePage />
      </div>

      {/* Inputs, Outputs & Formats */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-charcoal-900">Supported Formats & Boundaries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-canvas-200 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-charcoal-900">Audio Ingestion</h3>
            <p className="text-charcoal-600">Microphone stream or files: WAV (PCM 16-bit), MP3, WebM, OGG.</p>
            <p className="text-charcoal-500 font-mono">Max size: 25 MB · Max duration: 180s</p>
          </div>
          <div className="bg-white border border-canvas-200 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-charcoal-900">Linguistic Pair</h3>
            <p className="text-charcoal-600">English (`eng_Latn`) to Telugu (`tel_Telu`) Unicode script rendering.</p>
            <p className="text-charcoal-500 font-mono">Tokenizer: SentencePiece / IndicTrans</p>
          </div>
          <div className="bg-white border border-canvas-200 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-charcoal-900">Export & Deletion</h3>
            <p className="text-charcoal-600">Bilingual plain-text export (.txt), copy-to-clipboard, zero telemetry retention.</p>
            <p className="text-charcoal-500 font-mono">Storage: Client-side IndexedDB</p>
          </div>
        </div>
      </div>

      {/* Known Limitations */}
      <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-700">Known Limitations (v0.1 Prototype)</h2>
        <ul className="text-xs text-charcoal-600 list-disc list-inside space-y-1.5 leading-relaxed">
          <li>Heavy ambient background noise or rapid cross-talk can increase English transcription Word Error Rate (WER).</li>
          <li>Colloquial code-mixed slang (e.g. rapid switching between English and Telugu within a single sentence) may require manual transcript correction.</li>
          <li>Telugu speech output currently defaults to lightweight browser speech synthesis or mock confirmation tones unless local neural voice weights (e.g. Piper Telugu) are downloaded.</li>
        </ul>
      </div>
    </div>
  );
}
