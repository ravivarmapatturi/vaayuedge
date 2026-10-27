
export default function DocsPage() {
  const GITHUB_REPO = "https://github.com/ravivarmapatturi/vaayuedge/blob/main";

  const docFiles = [
    {
      title: "Local Installation & Operator Guide",
      path: "docs/local-installation.md",
      desc: "Step-by-step instructions for Linux, macOS, and Windows with single-command offline runner."
    },
    {
      title: "On-Device Benchmark Results",
      path: "docs/benchmark-results.md",
      desc: "Real measured latency (1.7s total), peak RAM (1.5GB), and authentic Telugu Unicode accuracy."
    },
    {
      title: "Product Requirements Document (PRD)",
      path: "docs/product-requirements.md",
      desc: "Detailed user journeys, success criteria, MVP scope, and explicit non-blockers."
    },
    {
      title: "Architecture Specification",
      path: "docs/architecture.md",
      desc: "Pluggable adapter protocols for ASR, Translation, and TTS, plus data flow diagrams."
    },
    {
      title: "Model Cards & Licenses",
      path: "docs/model-cards.md",
      desc: "Upstream provenance, parameter sizes, and licensing boundaries for Whisper and Opus-MT."
    },
    {
      title: "Privacy & Threat Model",
      path: "docs/privacy-and-threat-model.md",
      desc: "Threat analysis, zero-telemetry commitments, and the automated air-gap test procedure."
    },
    {
      title: "Benchmark Methodology",
      path: "docs/benchmark-methodology.md",
      desc: "Measurement protocols for WER, semantic accuracy, latency, and peak RAM consumption."
    },
    {
      title: "Deployment & Subdomain Routing",
      path: "docs/deployment.md",
      desc: "Configuration for vaayuedge.neuralmasteryai.com, TLS setup, and CORS headers."
    }
  ];

  const apiEndpoints = [
    { method: "GET", path: "/health", desc: "Service status, uptime seconds, and API version." },
    { method: "GET", path: "/v1/capabilities", desc: "Host CPU cores, available RAM, and active ASR/MT/TTS adapters." },
    { method: "POST", path: "/v1/transcriptions", desc: "Ingests audio file and returns English transcript with timing metadata." },
    { method: "POST", path: "/v1/translations", desc: "Translates English text into meaning-aware Telugu Unicode script." },
    { method: "POST", path: "/v1/speech", desc: "Generates synthesized Telugu speech audio bytes (base64 WAV)." },
    { method: "GET", path: "/v1/sessions", desc: "Lists locally saved user sessions." },
    { method: "DELETE", path: "/v1/sessions/{id}", desc: "Explicitly deletes an individual session record." }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
          Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
          VaayuEdge Developer Docs
        </h1>
        <p className="text-base text-charcoal-600 max-w-2xl leading-relaxed">
          Comprehensive guides, architecture specifications, API contracts, and local development setup instructions.
        </p>
      </div>

      {/* Quickstart */}
      <div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-charcoal-900">Local Application Mode (Single Command)</h2>
        <p className="text-xs text-charcoal-600">
          Build the web UI and launch the on-device inference engine on loopback (<code>127.0.0.1:8000</code>):
        </p>

        <div className="bg-charcoal-950 text-charcoal-100 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
          <p className="text-charcoal-400"># 1. Clone repository</p>
          <p className="text-teal-400">git clone https://github.com/ravivarmapatturi/vaayuedge.git</p>
          <p className="text-teal-400">cd vaayuedge</p>
          <p className="text-charcoal-400 pt-1"># 2. Launch on-device engine &amp; web app</p>
          <p className="text-teal-400">./scripts/start-local.sh</p>
          <p className="text-charcoal-400 pt-1"># 3. Open browser at http://127.0.0.1:8000</p>
          <p className="text-charcoal-400 pt-1"># 4. (Optional) Run air-gap offline verification</p>
          <p className="text-teal-400">python3 scripts/verify-local-mode.py</p>
        </div>
      </div>

      {/* Repository Documentation Files */}
      <div className="space-y-6">
        <div className="border-b border-canvas-300 pb-2">
          <h2 className="text-xl font-bold text-charcoal-900">Specification Documents</h2>
          <p className="text-xs text-charcoal-500">Live markdown documents tracked in the repository.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docFiles.map((doc, idx) => (
            <a
              key={idx}
              href={`${GITHUB_REPO}/${doc.path}`}
              target="_blank"
              rel="noreferrer"
              className="p-5 bg-white border border-canvas-200 hover:border-teal-500 rounded-xl space-y-2 shadow-subtle hover:shadow transition group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-charcoal-900 group-hover:text-teal-800 transition">
                  {doc.title}
                </h3>
                <span className="text-xs text-charcoal-400 group-hover:text-teal-700">↗</span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {doc.desc}
              </p>
              <p className="text-[11px] font-mono text-teal-700 pt-1">
                {doc.path}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Core API Reference */}
      <div className="space-y-6">
        <div className="border-b border-canvas-300 pb-2">
          <h2 className="text-xl font-bold text-charcoal-900">API Contract Reference</h2>
          <p className="text-xs text-charcoal-500">Standard REST interface exposed by the backend daemon on port 8000.</p>
        </div>

        <div className="bg-white border border-canvas-200 rounded-2xl overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas-100 border-b border-canvas-200 text-charcoal-800 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-200 text-charcoal-700 font-mono">
                {apiEndpoints.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-canvas-50/50">
                    <td className="py-3 px-4 font-bold text-teal-800">{ep.method}</td>
                    <td className="py-3 px-4 text-charcoal-900 font-semibold">{ep.path}</td>
                    <td className="py-3 px-4 font-sans text-charcoal-600">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
