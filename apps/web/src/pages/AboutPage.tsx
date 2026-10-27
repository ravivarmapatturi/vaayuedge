
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
          Mission & Background
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
          About VaayuEdge
        </h1>
        <p className="text-base text-charcoal-600 max-w-2xl leading-relaxed">
          Exploring efficient, useful AI that operates on personal devices, preserving both user privacy and linguistic nuance.
        </p>
      </div>

      {/* The Origin & Philosophy */}
      <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed">
        <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-charcoal-900">Why VaayuEdge Was Started</h2>
          <p>
            Most modern speech and translation platforms assume unlimited cloud compute and continuous connectivity. When users need language assistance for private business conversations, healthcare inquiries, or personal matters, they are forced to transmit raw audio recordings to centralized corporate servers.
          </p>
          <p>
            VaayuEdge was conceived with a different premise: <strong>What if speech intelligence ran directly on your own laptop, phone, and edge hardware?</strong>
          </p>
          <p>
            Rather than wrapping existing cloud APIs, we focus on quantised inference, modular model adapters, and transparent device execution.
          </p>
        </div>

        <div className="bg-white border border-canvas-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-subtle">
          <h2 className="text-lg font-bold text-charcoal-900">Why English to Telugu First?</h2>
          <p>
            Telugu is a Dravidian language spoken by over 96 million people worldwide with rich literature, complex agglutinative morphology, and subtle distinctions between formal, informal, and instructional registers.
          </p>
          <p>
            Generic machine translation often treats Telugu as a mechanical transliteration exercise, producing robotic, unnatural phrases. By combining Whisper speech recognition with AI4Bharat IndicTrans2, VaayuEdge aims to preserve context, tone, and intent in natural Telugu script.
          </p>
        </div>
      </div>

      {/* Principles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Guiding Engineering Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-canvas-100 rounded-xl border border-canvas-200 space-y-1.5">
            <h3 className="font-bold text-charcoal-900">1. Truthful Privacy</h3>
            <p className="text-charcoal-600">Never claim an operation ran on-device unless it truly executed locally. We explicitly label local vs remote processing states.</p>
          </div>
          <div className="p-4 bg-canvas-100 rounded-xl border border-canvas-200 space-y-1.5">
            <h3 className="font-bold text-charcoal-900">2. Less Compute, More Intelligence</h3>
            <p className="text-charcoal-600">Prioritize quantisation, CPU execution, and low RAM footprints over brute-force cloud GPU scaling.</p>
          </div>
          <div className="p-4 bg-canvas-100 rounded-xl border border-canvas-200 space-y-1.5">
            <h3 className="font-bold text-charcoal-900">3. Meaning-Aware Transfer</h3>
            <p className="text-charcoal-600">Preserve interrogatives, instructions, and communicative intent rather than verbatim dictionary substitution.</p>
          </div>
          <div className="p-4 bg-canvas-100 rounded-xl border border-canvas-200 space-y-1.5">
            <h3 className="font-bold text-charcoal-900">4. Open & Inspectable</h3>
            <p className="text-charcoal-600">Publish architecture specifications, model provenance, and automated benchmark runners for independent verification.</p>
          </div>
        </div>
      </div>

      {/* Project Status */}
      <div className="p-5 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-start space-x-3">
        <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0"></div>
        <div>
          <span className="font-bold">Contact: </span>
          VaayuEdge is built by InferEdge AI. For questions, partnerships or feedback, reach us on X at{' '}
          <a href="https://x.com/NeuralMastery" target="_blank" rel="noopener" className="underline font-semibold">@NeuralMastery</a>.
        </div>
      </div>
    </div>
  );
}
