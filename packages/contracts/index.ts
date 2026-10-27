/**
 * VaayuEdge Shared Contracts and Type Definitions
 */

export type ProcessingMode = 'local' | 'remote';

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime_seconds: number;
  timestamp: string;
}

export interface CapabilitiesResponse {
  processing_mode: ProcessingMode;
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
}

export interface TranscriptionRequest {
  audio_format?: string;
  language?: string;
}

export interface TranscriptionResponse {
  id: string;
  transcript: string;
  language: string;
  confidence: number;
  duration_seconds: number;
  inference_time_ms: number;
  processing_mode: ProcessingMode;
}

export interface TranslationRequest {
  text: string;
  source_lang?: string; // default "eng_Latn"
  target_lang?: string; // default "tel_Telu"
}

export interface TranslationResponse {
  id: string;
  source_text: string;
  translated_text: string;
  source_lang: string;
  target_lang: string;
  inference_time_ms: number;
  processing_mode: ProcessingMode;
}

export interface SpeechRequest {
  text: string;
  language?: string; // default "tel_Telu"
  voice?: string;
}

export interface SpeechResponse {
  id: string;
  audio_base64: string;
  mime_type: string;
  sample_rate: number;
  duration_seconds: number;
  inference_time_ms: number;
}

export interface SessionRecord {
  id: string;
  created_at: string;
  audio_duration_seconds: number;
  transcript: string;
  translation: string;
  processing_mode: ProcessingMode;
  audio_url?: string;
}

export interface SessionDeleteResponse {
  success: boolean;
  id: string;
}
