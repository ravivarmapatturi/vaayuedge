type LinkItem = { title: string; kind: string; summary: string; href: string };

const papers: LinkItem[] = [
  { title: 'SmoothQuant', kind: 'Quantization · 2023', summary: 'A training-free method for moving activation outliers into weights, enabling accurate W8A8 inference for large language models.', href: 'https://arxiv.org/abs/2211.10438' },
  { title: 'GPTQ', kind: 'Post-training quantization · 2022', summary: 'One-shot weight quantization that makes large models practical on a single GPU or memory-constrained workstation.', href: 'https://arxiv.org/abs/2210.17323' },
  { title: 'AWQ', kind: 'Weight-only quantization · 2023', summary: 'Protects salient weights during low-bit quantization and is a useful baseline for 4-bit laptop and mobile inference.', href: 'https://arxiv.org/abs/2306.00978' },
  { title: 'MobileLLM', kind: 'Mobile architecture · 2024', summary: 'Explores sub-billion-parameter language models designed specifically for on-device use cases and API calling.', href: 'https://arxiv.org/abs/2402.14905' },
  { title: 'TinyLLM', kind: 'Edge systems · 2024', summary: 'A framework for training and deploying smaller language models on edge computers, with the goal of reducing cloud dependence.', href: 'https://arxiv.org/abs/2412.15304' },
  { title: 'DistilBERT', kind: 'Knowledge distillation · 2019', summary: 'The classic compact-transformer reference: transfer a teacher model’s behavior into a smaller, faster student.', href: 'https://arxiv.org/abs/1910.01108' },
];

const runtimes: LinkItem[] = [
  { title: 'llama.cpp / GGUF', kind: 'Laptop · CPU · GPU', summary: 'Portable C/C++ inference, quantization tools, and a local server for GGUF models across macOS, Linux and Windows.', href: 'https://github.com/ggml-org/llama.cpp' },
  { title: 'ExecuTorch', kind: 'Android · iOS · embedded', summary: 'PyTorch’s edge runtime with export, quantization, C++ APIs, and Android/iOS deployment paths for LLMs.', href: 'https://docs.pytorch.org/executorch/stable/llm/getting-started.html' },
  { title: 'MLC LLM / WebLLM', kind: 'Compiler · WebGPU · mobile', summary: 'Compiles models for native platforms and the browser, with JavaScript, iOS, Android and REST interfaces.', href: 'https://llm.mlc.ai/' },
  { title: 'ONNX Runtime GenAI', kind: 'Windows · CPU · NPU', summary: 'A generative-AI runtime and model-builder path for optimized local inference on supported hardware.', href: 'https://github.com/microsoft/onnxruntime-genai' },
];

function ResourceCard({ item }: { item: LinkItem }) {
  return <a href={item.href} target="_blank" rel="noopener noreferrer" className="group bg-white border border-canvas-200 rounded-2xl p-5 space-y-2 shadow-subtle hover:border-teal-300 hover:shadow transition-all">
    <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-sm text-charcoal-900 group-hover:text-teal-800">{item.title}</h3><span className="text-charcoal-400 group-hover:text-teal-700">↗</span></div>
    <p className="text-[10px] font-mono uppercase tracking-wide text-teal-700">{item.kind}</p>
    <p className="text-xs text-charcoal-600 leading-relaxed">{item.summary}</p>
  </a>;
}

export default function ResearchPage() {
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">
    <div className="space-y-4"><span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">Living research tracker</span><h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">Running intelligence at the edge</h1><p className="text-base text-charcoal-600 max-w-3xl leading-relaxed">A practical reading list for making LLMs and speech models fit on laptops, phones, browsers, and embedded devices with limited memory, power, and connectivity.</p></div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-5"><p className="text-xs font-bold text-charcoal-900">1 · Shrink the model</p><p className="text-xs text-charcoal-600 mt-2 leading-relaxed">Distillation, pruning, low-rank adaptation, and smaller architectures reduce parameter and KV-cache pressure.</p></div><div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-5"><p className="text-xs font-bold text-charcoal-900">2 · Compile the path</p><p className="text-xs text-charcoal-600 mt-2 leading-relaxed">Quantization, operator fusion, memory planning, and hardware backends turn weights into fast local execution.</p></div><div className="bg-canvas-100 border border-canvas-300 rounded-2xl p-5"><p className="text-xs font-bold text-charcoal-900">3 · Measure the trade-off</p><p className="text-xs text-charcoal-600 mt-2 leading-relaxed">Track quality, peak RAM, tokens/sec, first-token latency, battery, thermals, and offline reliability together.</p></div></div>

    <section className="space-y-5"><div className="border-b border-canvas-300 pb-3"><h2 className="text-xl font-bold text-charcoal-900">Papers to keep close</h2><p className="text-xs text-charcoal-500 mt-1">Start here for the core techniques behind compact on-device models.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{papers.map((item) => <ResourceCard key={item.title} item={item} />)}</div></section>
    <section className="space-y-5"><div className="border-b border-canvas-300 pb-3"><h2 className="text-xl font-bold text-charcoal-900">Runtimes and implementation work</h2><p className="text-xs text-charcoal-500 mt-1">The projects that turn research into something you can run locally.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{runtimes.map((item) => <ResourceCard key={item.title} item={item} />)}</div></section>
    <section className="bg-teal-50/70 border border-teal-200 rounded-2xl p-6 sm:p-8 space-y-3"><h2 className="text-base font-bold text-teal-950">VaayuEdge tracking checklist</h2><ul className="text-xs text-teal-900 space-y-2 leading-relaxed list-disc list-inside"><li>Benchmark the same model at FP16, INT8, and INT4 across CPU, GPU, and NPU where available.</li><li>Record peak resident memory separately from model-file size; include KV cache and tokenizer overhead.</li><li>Keep a device matrix for laptop, Android, iOS, browser/WebGPU, and Raspberry Pi-class hardware.</li><li>Report quality alongside speed: WER, translation adequacy, task success, first-token latency, and sustained tokens/sec.</li></ul></section>
  </div>;
}
