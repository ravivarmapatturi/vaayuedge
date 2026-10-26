export interface Capabilities {
  processing_mode: 'local' | 'remote';
  is_offline_capable: boolean;
  supported_source_languages: string[];
  supported_target_languages: string[];
  asr: {
    adapter: string;
    model_name: string;
    is_ready: boolean;
  };
  translation: {
    adapter: string;
    model_name: string;
    is_ready: boolean;
  };
  tts: {
    adapter: string;
    voice_name: string;
    is_ready: boolean;
  };
  device_info: {
    os: string;
    cpu_cores: number;
    ram_gb_available: number;
  };
  isConnected?: boolean;
}

export interface SessionItem {
  id: string;
  created_at: string;
  audio_duration_seconds: number;
  transcript: string;
  translation: string;
  processing_mode: 'local' | 'remote';
  is_sample?: boolean;
}

export function getApiBase(): string {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      if (port === '8000' || port === '5173') return '';
      return 'http://127.0.0.1:8000';
    }
  }
  return 'http://127.0.0.1:8000';
}

export async function fetchCapabilities(): Promise<Capabilities> {
  const apiBase = getApiBase();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`${apiBase}/v1/capabilities`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      ...data,
      isConnected: true,
    };
  } catch {
    clearTimeout(timeoutId);
    return {
      processing_mode: 'local',
      is_offline_capable: false,
      supported_source_languages: ['en', 'eng_Latn'],
      supported_target_languages: ['te', 'tel_Telu'],
      asr: { adapter: 'not_connected', model_name: 'Whisper CPU (Local Daemon)', is_ready: false },
      translation: { adapter: 'not_connected', model_name: 'Helsinki-NLP Opus-MT (Local Daemon)', is_ready: false },
      tts: { adapter: 'browser_web_speech', voice_name: 'Web Speech API (te-IN)', is_ready: true },
      device_info: {
        os: 'Static Browser Host',
        cpu_cores: (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4,
        ram_gb_available: 8,
      },
      isConnected: false,
    };
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<{
  id: string;
  transcript: string;
  duration_seconds: number;
  inference_time_ms: number;
  processing_mode: 'local' | 'remote';
}> {
  const apiBase = getApiBase();
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');

  try {
    const res = await fetch(`${apiBase}/v1/transcriptions`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Transcription failed' }));
      throw new Error(err.detail || 'Transcription failed');
    }
    return await res.json();
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      throw new Error(
        'Browser Security Restriction: You are on the hosted GitHub Pages site (HTTPS). ' +
        'Web browsers block HTTPS pages from connecting to local HTTP loopback addresses (Mixed Content). ' +
        'To transcribe audio on your laptop CPU, open http://127.0.0.1:8000 directly in your browser.'
      );
    }
    throw new Error(
      'Local inference engine not detected at 127.0.0.1:8000. ' +
      'To transcribe live speech privately on your CPU, start the local backend with ./scripts/start-local.sh. ' +
      'Meanwhile, you can explore the verified bilingual presets above.'
    );
  }
}

export async function translateText(text: string): Promise<{
  id: string;
  source_text: string;
  translated_text: string;
  inference_time_ms: number;
  processing_mode: 'local' | 'remote';
}> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/v1/translations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_lang: 'eng_Latn',
        target_lang: 'tel_Telu',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Translation failed' }));
      throw new Error(err.detail || 'Translation failed');
    }
    return await res.json();
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      throw new Error(
        'Browser Security Restriction: You are on the hosted GitHub Pages site (HTTPS). ' +
        'Web browsers block HTTPS pages from connecting to local HTTP loopback addresses (Mixed Content). ' +
        'To translate custom text on your laptop CPU, open http://127.0.0.1:8000 directly in your browser.'
      );
    }
    throw new Error(
      'Local translation engine not detected at 127.0.0.1:8000. ' +
      'To translate custom text privately with neural Opus-MT, start the local backend with ./scripts/start-local.sh. ' +
      'You can still explore verified presets in this preview.'
    );
  }
}

export async function synthesizeSpeech(teluguText: string): Promise<string> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/v1/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: teluguText,
        language: 'tel_Telu',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return `data:${data.mime_type};base64,${data.audio_base64}`;
    }
  } catch {
    // Graceful fallback to browser speech synthesis
  }

  // Web Speech API fallback in browser
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(teluguText);
    utterance.lang = 'te-IN';
    window.speechSynthesis.speak(utterance);
  }
  return '';
}
