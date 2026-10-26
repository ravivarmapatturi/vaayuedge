import React, { useState, useEffect, useRef } from 'react';
import {
  fetchCapabilities,
  transcribeAudio,
  translateText,
  synthesizeSpeech,
  Capabilities,
  SessionItem,
} from '../../lib/api';
import { storage } from '../../lib/storage';
import { VERIFIED_SAMPLES, SampleItem } from '../../lib/sampleData';

interface InteractiveDemoProps {
  id?: string;
  isStandalonePage?: boolean;
}

export default function InteractiveDemo({ id = "demo-workspace", isStandalonePage = false }: InteractiveDemoProps) {
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Core pipeline state
  const [transcript, setTranscript] = useState(VERIFIED_SAMPLES[0].english);
  const [translation, setTranslation] = useState(VERIFIED_SAMPLES[0].telugu);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(VERIFIED_SAMPLES[0].id);

  // Processing indicators
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemonstrationSample, setIsDemonstrationSample] = useState(true);

  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [copied, setCopied] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchCapabilities().then(setCapabilities);
    setSessions(storage.getSessions());
  }, []);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsDemonstrationSample(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
        handleTranscribe(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(`Microphone access denied: ${err.message || 'Permission required to record.'}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('Audio file exceeds maximum 25MB limit.');
      return;
    }

    setErrorMessage(null);
    setStatusMessage(`Uploaded: ${file.name}`);
    setIsDemonstrationSample(false);

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    handleTranscribe(file);
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    setStatusMessage('Transcribing English speech...');
    try {
      const res = await transcribeAudio(blob);
      setTranscript(res.transcript);
      setStatusMessage(`Transcribed in ${res.inference_time_ms}ms`);
      handleTranslate(res.transcript);
    } catch (err: any) {
      setErrorMessage(err.message || 'Transcription failed.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTranslate = async (sourceText: string) => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setStatusMessage('Translating semantic meaning into Telugu...');
    try {
      const res = await translateText(sourceText);
      setTranslation(res.translated_text);
      setStatusMessage(`Translated in ${res.inference_time_ms}ms`);

      const session: SessionItem = {
        id: 'sess-' + Date.now(),
        created_at: new Date().toISOString(),
        audio_duration_seconds: recordingSeconds || 3.5,
        transcript: sourceText,
        translation: res.translated_text,
        processing_mode: capabilities?.processing_mode || 'local',
        is_sample: isDemonstrationSample,
      };
      storage.saveSession(session);
      setSessions(storage.getSessions());
    } catch (err: any) {
      setErrorMessage(err.message || 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSelectSample = (sample: SampleItem) => {
    setSelectedSampleId(sample.id);
    setTranscript(sample.english);
    setTranslation(sample.telugu);
    setIsDemonstrationSample(true);
    setStatusMessage(`Loaded verified sample: "${sample.category}"`);
  };

  const handleAudioPlayback = async () => {
    if (!translation) return;

    setIsPlayingAudio(true);
    try {
      const audioSrc = await synthesizeSpeech(translation);
      if (audioSrc) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio(audioSrc);
        } else {
          audioElementRef.current.src = audioSrc;
        }
        audioElementRef.current.onended = () => setIsPlayingAudio(false);
        await audioElementRef.current.play();
      } else {
        setIsPlayingAudio(false);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const copyTelugu = async () => {
    if (!translation) return;
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const exportBilingualText = () => {
    const text = `VayyuEdge Bilingual Export
Timestamp: ${new Date().toLocaleString()}
Mode: ${capabilities?.processing_mode || 'local'}

[English Transcript]
${transcript}

[Telugu Translation]
${translation}
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vayyuedge-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id={id} className={`w-full ${isStandalonePage ? 'py-8' : 'py-12'} transition-all`}>
      <div className="max-w-5xl mx-auto">
        {/* Main Product Interactive Box */}
        <div className="bg-canvas-100 border border-canvas-300 rounded-2xl shadow-card overflow-hidden">
          {/* Top Panel Bar */}
          <div className="border-b border-canvas-300 bg-canvas-50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${capabilities?.isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                Speech & Translation Console
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                capabilities?.isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {capabilities?.isConnected ? 'Local Engine Connected' : 'Static Prototype Mode'}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                isDemonstrationSample
                  ? 'bg-canvas-200 text-charcoal-700 border-canvas-300'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}>
                {isDemonstrationSample ? 'Verified Preset' : 'Custom Input'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setShowInspector(!showInspector)}
                className="px-2.5 py-1 rounded border border-canvas-300 bg-canvas-100 hover:bg-canvas-200 text-charcoal-700 transition"
              >
                Runtime Info
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-2.5 py-1 rounded border border-canvas-300 bg-canvas-100 hover:bg-canvas-200 text-charcoal-700 transition"
              >
                History ({sessions.length})
              </button>
            </div>
          </div>

          {/* Engine Status Callout when Disconnected */}
          {capabilities && !capabilities.isConnected && (
            <div className="bg-amber-50/80 border-b border-amber-200/80 px-5 py-2.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-start sm:items-center space-x-2">
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-200 text-amber-900 shrink-0">
                  Notice
                </span>
                <span>
                  Local Python AI daemon is not detected at <code>127.0.0.1:8000</code>. Custom audio recording requires running the local backend. You can test the verified bilingual presets below.
                </span>
              </div>
              <a
                href="#docs"
                className="text-amber-800 font-semibold underline hover:text-amber-950 shrink-0"
              >
                Setup Local Engine →
              </a>
            </div>
          )}

          {/* Sample Presets Ribbon */}
          <div className="bg-canvas-50/60 border-b border-canvas-200 px-5 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-charcoal-500 text-[11px] font-medium whitespace-nowrap">
              Presets:
            </span>
            {VERIFIED_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs transition ${
                  selectedSampleId === sample.id && isDemonstrationSample
                    ? 'bg-teal-700 text-white font-medium shadow-sm'
                    : 'bg-canvas-200 text-charcoal-700 hover:bg-canvas-300/80'
                }`}
              >
                {sample.category}
              </button>
            ))}
          </div>

          {/* Messages & Banners */}
          {errorMessage && (
            <div className="m-4 mb-0 bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="font-bold ml-2">×</button>
            </div>
          )}

          {statusMessage && (
            <div className="m-4 mb-0 bg-canvas-200/80 border border-canvas-300 text-charcoal-700 text-xs px-4 py-2 rounded-lg flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping"></span>
                <span>{statusMessage}</span>
              </span>
              <button onClick={() => setStatusMessage(null)}>×</button>
            </div>
          )}

          {/* Dual Panel Grid */}
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: English Source & Capture */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                    English Input
                  </span>
                  <span className="text-[10px] text-charcoal-500 bg-canvas-200 px-1.5 py-0.5 rounded font-mono">
                    eng_Latn
                  </span>
                </div>
                {isTranscribing ? (
                  <span className="text-xs text-amber-700 font-medium animate-pulse">Transcribing...</span>
                ) : (
                  <span className="text-xs text-charcoal-500">
                    {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : 'Empty'}
                  </span>
                )}
              </div>

              {/* Source Textarea */}
              <textarea
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  setIsDemonstrationSample(false);
                }}
                rows={5}
                placeholder="Type English text here or record via microphone..."
                className="w-full bg-white border border-canvas-300 rounded-xl p-3.5 text-sm text-charcoal-900 placeholder-charcoal-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition resize-none leading-relaxed shadow-sm"
              />

              {/* Input Action Controls */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-canvas-200 hover:bg-canvas-300 text-charcoal-900 border border-canvas-300'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-white' : 'bg-rose-500'}`}></span>
                  <span>{isRecording ? `Stop (${recordingSeconds}s)` : 'Record Mic'}</span>
                </button>

                <label className="px-3.5 py-2 rounded-lg text-xs font-medium bg-canvas-200 hover:bg-canvas-300 text-charcoal-800 border border-canvas-300 cursor-pointer flex items-center space-x-1.5 transition">
                  <svg className="w-3.5 h-3.5 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Audio</span>
                  <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => handleTranslate(transcript)}
                  disabled={!transcript.trim() || isTranslating}
                  className="ml-auto px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1 shadow-subtle"
                >
                  <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
                  <span>→</span>
                </button>
              </div>

              {audioUrl && (
                <div className="pt-2">
                  <audio controls src={audioUrl} className="w-full h-8" />
                </div>
              )}
            </div>

            {/* Right: Telugu Translation & Audio */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                    Telugu Translation
                  </span>
                  <span className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded font-mono font-medium">
                    tel_Telu
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={copyTelugu}
                    disabled={!translation}
                    className="text-charcoal-600 hover:text-charcoal-900 font-medium"
                    title="Copy Telugu Text"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <span>·</span>
                  <button
                    onClick={exportBilingualText}
                    disabled={!translation}
                    className="text-charcoal-600 hover:text-charcoal-900 font-medium"
                    title="Export as Text file"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Translation Display Window */}
              <div className="w-full min-h-[140px] bg-white border border-canvas-300 rounded-xl p-4 flex items-center shadow-sm select-text">
                {translation ? (
                  <p className="text-base sm:text-lg text-charcoal-950 font-telugu leading-relaxed">
                    {translation}
                  </p>
                ) : (
                  <p className="text-xs text-charcoal-400">
                    Telugu translation will appear here.
                  </p>
                )}
              </div>

              {/* Output Audio Control */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleAudioPlayback}
                  disabled={!translation || isPlayingAudio}
                  className="px-4 py-2 bg-canvas-200 hover:bg-canvas-300 disabled:opacity-50 text-charcoal-800 border border-canvas-300 rounded-lg text-xs font-semibold flex items-center space-x-2 transition"
                >
                  <svg className="w-3.5 h-3.5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span>{isPlayingAudio ? 'Synthesizing...' : 'Play Telugu Speech'}</span>
                </button>

                <span className="text-[11px] text-charcoal-500 font-mono">
                  {capabilities?.tts.is_ready ? 'Voice: Ready' : 'Voice: Web Engine'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Runtime Inspector Drawer */}
        {showInspector && (
          <div className="mt-4 p-5 bg-canvas-100 border border-canvas-300 rounded-xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-canvas-200 pb-2">
              <span className="font-bold text-charcoal-900">Runtime & Device Capabilities</span>
              <button onClick={() => setShowInspector(false)} className="text-charcoal-500 hover:text-charcoal-800">Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-charcoal-500 text-[11px]">Device Hardware:</p>
                <p className="font-semibold text-charcoal-800">{capabilities?.device_info.os || 'Browser Host'}</p>
                <p className="text-charcoal-600">{capabilities?.device_info.cpu_cores || 4} CPU Cores · {capabilities?.device_info.ram_gb_available || 8} GB RAM</p>
              </div>
              <div>
                <p className="text-charcoal-500 text-[11px]">Speech & MT Adapters:</p>
                <p className="font-semibold text-charcoal-800">ASR: {capabilities?.asr.model_name || 'whisper_local (base.en)'}</p>
                <p className="text-charcoal-600">Translation: {capabilities?.translation.model_name || 'opus_mt (en-dra)'}</p>
              </div>
              <div>
                <p className="text-charcoal-500 text-[11px]">Inference Boundary:</p>
                <p className={`font-semibold ${capabilities?.isConnected ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {capabilities?.isConnected ? '100% On-Device (127.0.0.1:8000)' : 'Browser Prototype (Daemon Offline)'}
                </p>
                <p className="text-charcoal-600">
                  {capabilities?.isConnected
                    ? 'Strict loopback binding; zero outbound audio transfer.'
                    : 'Static client mode; run ./scripts/start-local.sh for live ASR.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="mt-4 p-5 bg-canvas-100 border border-canvas-300 rounded-xl text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-canvas-200 pb-2">
              <span className="font-bold text-charcoal-900">Local Browser Session History</span>
              <button onClick={() => setShowHistory(false)} className="text-charcoal-500 hover:text-charcoal-800">Close</button>
            </div>
            {sessions.length === 0 ? (
              <p className="text-charcoal-500 py-3">No sessions saved yet.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {sessions.map((s) => (
                  <div key={s.id} className="p-3 bg-white border border-canvas-200 rounded-lg flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-charcoal-900">"{s.transcript}"</p>
                      <p className="text-teal-800 font-telugu text-sm">"{s.translation}"</p>
                      <p className="text-[10px] text-charcoal-400">{new Date(s.created_at).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 shrink-0">
                      <button
                        onClick={() => {
                          setTranscript(s.transcript);
                          setTranslation(s.translation);
                        }}
                        className="text-teal-700 hover:underline text-[11px]"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          storage.deleteSession(s.id);
                          setSessions(storage.getSessions());
                        }}
                        className="text-red-600 hover:underline text-[11px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {sessions.length > 0 && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    storage.clearAll();
                    setSessions([]);
                  }}
                  className="text-red-700 hover:underline text-xs"
                >
                  Clear All History
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
