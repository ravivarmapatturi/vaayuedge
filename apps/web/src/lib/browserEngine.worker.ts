/// <reference lib="webworker" />
// In-browser VayyuEdge engine: Whisper ASR, Opus-MT en→te and MMS Telugu TTS,
// all running on the user's device via transformers.js (WebGPU when available, else WASM).
import { env, pipeline } from '@huggingface/transformers';

const MODELS = {
  asr: import.meta.env.VITE_ASR_MODEL || 'onnx-community/whisper-base.en',
  mt: import.meta.env.VITE_MT_MODEL || 'ravivarmapatturi/vayyuedge-opus-mt-en-dra-onnx',
  tts: import.meta.env.VITE_TTS_MODEL || 'ravivarmapatturi/vayyuedge-mms-tts-tel-onnx',
};

// Dev builds can serve converted models from /models/<id> before they are published.
const LOCAL_MODELS = import.meta.env.VITE_LOCAL_MODELS === 'true';
env.localModelPath = '/models/';
env.allowLocalModels = false;
env.useBrowserCache = true; // download once, then works offline

type Task = 'asr' | 'mt' | 'tts';
const pipes: Partial<Record<Task, Promise<any>>> = {};

async function device(): Promise<'webgpu' | 'wasm'> {
  try {
    const adapter = await (navigator as any).gpu?.requestAdapter();
    return adapter ? 'webgpu' : 'wasm';
  } catch {
    return 'wasm';
  }
}

function load(task: Task) {
  if (!pipes[task]) {
    const kind = task === 'asr' ? 'automatic-speech-recognition' : task === 'mt' ? 'translation' : 'text-to-audio';
    pipes[task] = device().then((dev) => {
      // Whisper always comes from the Hub; only our converted models may be served locally in dev.
      env.allowLocalModels = LOCAL_MODELS && task !== 'asr';
      return pipeline(kind as any, MODELS[task], {
        // TTS (VITS) is unreliable on WebGPU; keep it on WASM.
        device: task === 'tts' ? 'wasm' : dev,
        dtype: task === 'tts' ? 'fp32' : 'q8', // VITS quality degrades badly under int8
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            self.postMessage({ type: 'progress', task, file: p.file, loaded: p.loaded, total: p.total });
          }
        },
      } as any);
    });
    pipes[task]!.catch(() => delete pipes[task]);
  }
  return pipes[task]!;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, op, payload } = e.data;
  try {
    let result: any;
    if (op === 'init') {
      try {
        for (const t of ['asr', 'mt', 'tts'] as Task[]) await load(t);
      } catch (err) {
        // A corrupted cached file (e.g. an HTML error page) would fail forever; wipe and retry once.
        if (!(err instanceof SyntaxError)) throw err;
        await caches.delete('transformers-cache');
        for (const t of ['asr', 'mt', 'tts'] as Task[]) await load(t);
      }
      result = true;
    } else if (op === 'asr') {
      const asr = await load('asr');
      const out = await asr(payload.audio as Float32Array);
      result = (out.text || '').trim();
    } else if (op === 'mt') {
      const mt = await load('mt');
      // opus-mt-en-dra is multi-target: the >>tel<< token selects Telugu.
      const out = await mt(`>>tel<< ${payload.text}`, { max_new_tokens: 256 });
      result = out[0].translation_text.trim();
    } else if (op === 'tts') {
      const tts = await load('tts');
      const out = await tts(payload.text);
      result = { audio: out.audio, sampling_rate: out.sampling_rate };
    }
    self.postMessage({ id, ok: true, result });
  } catch (err: any) {
    console.error('[vayyuedge engine]', op, err);
    self.postMessage({ id, ok: false, error: err?.message || String(err) });
  }
};
