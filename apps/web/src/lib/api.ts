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

import { translateClientSide } from './clientTranslator';
import { VERIFIED_SAMPLES } from './sampleData';

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
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Local daemon not reachable
  }

  // If local daemon not reachable, return empty transcript to preserve client speech recognition
  return {
    id: 'preview-asr-' + Date.now(),
    transcript: '',
    duration_seconds: 0,
    inference_time_ms: 50,
    processing_mode: 'local',
  };
}

export async function translateText(text: string): Promise<{
  id: string;
  source_text: string;
  translated_text: string;
  inference_time_ms: number;
  processing_mode: 'local' | 'remote';
}> {
  const clean = text.trim();
  if (!clean) {
    return {
      id: 'tx-empty',
      source_text: '',
      translated_text: '',
      inference_time_ms: 0,
      processing_mode: 'local',
    };
  }

  // 1. Check exact match in verified sample library
  const matchedSample = VERIFIED_SAMPLES.find(
    (s) => s.english.trim().toLowerCase() === clean.toLowerCase()
  );
  if (matchedSample) {
    return {
      id: 'sample-' + matchedSample.id,
      source_text: clean,
      translated_text: matchedSample.telugu,
      inference_time_ms: 15,
      processing_mode: 'local',
    };
  }

  // 2. Try on-device background neural daemon (Opus-MT)
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/v1/translations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clean,
        source_lang: 'eng_Latn',
        target_lang: 'tel_Telu',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        processing_mode: 'local',
      };
    }
  } catch {
    // Local daemon not active or blocked by browser mixed-content
  }

  // 3. Seamless in-browser translation engine
  const clientResult = translateClientSide(clean);
  return {
    id: 'browser-tx-' + Date.now(),
    source_text: clean,
    translated_text: clientResult.translated_text,
    inference_time_ms: clientResult.inference_time_ms,
    processing_mode: 'local',
  };
}

export async function synthesizeSpeech(teluguText: string): Promise<string> {
  const clean = teluguText.trim();
  if (!clean) return '';

  // 1. Check if it matches any verified sample with authentic Meta MMS WAV pre-rendered
  const sample = VERIFIED_SAMPLES.find(
    (s) => s.telugu.trim() === clean || clean.includes(s.telugu.trim())
  );
  if (sample && sample.audioUrl) {
    return sample.audioUrl;
  }

  // 2. Try on-device background neural TTS daemon (Meta MMS)
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/v1/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clean,
        language: 'tel_Telu',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.audio_base64) {
        return `data:${data.mime_type || 'audio/wav'};base64,${data.audio_base64}`;
      }
    }
  } catch {
    // Fall through to browser speech synthesis
  }

  // 3. Fallback to Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'te-IN';
      const voices = window.speechSynthesis.getVoices();
      const teVoice = voices.find((v) => v.lang.startsWith('te') || v.lang.includes('Telugu'));
      if (teVoice) utterance.voice = teVoice;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }
  return '';
}
