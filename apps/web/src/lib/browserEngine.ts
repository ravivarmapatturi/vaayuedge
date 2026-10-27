// Main-thread client for the in-browser engine (runs in a Web Worker so the UI never freezes).

const ENABLED_KEY = 'vaayuedge.browserEngine.enabled';

type Progress = { task: string; file: string; loaded: number; total: number };
type ProgressListener = (overallPct: number, detail: Progress) => void;

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();
const fileProgress = new Map<string, { loaded: number; total: number }>();
const listeners = new Set<ProgressListener>();
let readyPromise: Promise<void> | null = null;
let ready = false;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./browserEngine.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        fileProgress.set(`${msg.task}/${msg.file}`, { loaded: msg.loaded, total: msg.total });
        let loaded = 0;
        let total = 0;
        fileProgress.forEach((f) => {
          loaded += f.loaded;
          total += f.total;
        });
        const pct = total ? Math.min(99, Math.floor((loaded / total) * 100)) : 0;
        listeners.forEach((l) => l(pct, msg));
        return;
      }
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      msg.ok ? p.resolve(msg.result) : p.reject(new Error(msg.error));
    };
  }
  return worker;
}

function call<T>(op: string, payload?: any, transfer: Transferable[] = []): Promise<T> {
  const id = ++seq;
  return new Promise<T>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, op, payload }, transfer);
  });
}

export const browserEngine = {
  isSupported(): boolean {
    return typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
  },
  isEnabled(): boolean {
    try {
      return localStorage.getItem(ENABLED_KEY) === 'true';
    } catch {
      return false;
    }
  },
  isReady(): boolean {
    return ready;
  },
  onProgress(l: ProgressListener): () => void {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  /** Downloads (first time) or loads from browser cache all three models. */
  enable(): Promise<void> {
    if (!readyPromise) {
      readyPromise = call<boolean>('init')
        .then(() => {
          ready = true;
          try {
            localStorage.setItem(ENABLED_KEY, 'true');
          } catch {}
        })
        .catch((e) => {
          readyPromise = null;
          throw e;
        });
    }
    return readyPromise;
  },

  async transcribe(blob: Blob): Promise<string> {
    const audio = await decodeTo16kMono(blob);
    return call<string>('asr', { audio }, [audio.buffer]);
  },
  translate(text: string): Promise<string> {
    return call<string>('mt', { text });
  },
  async speak(text: string): Promise<string> {
    const { audio, sampling_rate } = await call<{ audio: Float32Array; sampling_rate: number }>('tts', { text });
    return URL.createObjectURL(encodeWav(audio, sampling_rate));
  },
};

async function decodeTo16kMono(blob: Blob): Promise<Float32Array> {
  const buf = await blob.arrayBuffer();
  const ctx = new AudioContext({ sampleRate: 16000 });
  try {
    const decoded = await ctx.decodeAudioData(buf);
    if (decoded.numberOfChannels === 1) return decoded.getChannelData(0).slice();
    const a = decoded.getChannelData(0);
    const b = decoded.getChannelData(1);
    const mono = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) mono[i] = (a[i] + b[i]) / 2;
    return mono;
  } finally {
    ctx.close();
  }
}

/** 16-bit PCM WAV, playable in every browser. */
export function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const out = new DataView(new ArrayBuffer(44 + samples.length * 2));
  const str = (o: number, s: string) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  out.setUint32(4, 36 + samples.length * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true);
  out.setUint16(22, 1, true);
  out.setUint32(24, sampleRate, true);
  out.setUint32(28, sampleRate * 2, true);
  out.setUint16(32, 2, true);
  out.setUint16(34, 16, true);
  str(36, 'data');
  out.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    out.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([out.buffer], { type: 'audio/wav' });
}
