import React, { useState, useEffect, useRef } from 'react';
import {
  fetchCapabilities,
  transcribeAudio,
  translateText,
  synthesizeSpeech,
  Capabilities,
  SessionItem,
} from './lib/api';
import { storage } from './lib/storage';

export default function App() {
  // App state
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Pipeline states
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);

  // Session & UI
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedTelugu, setCopiedTelugu] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Load capabilities & history on mount
  useEffect(() => {
    fetchCapabilities().then(setCapabilities);
    setSessions(storage.getSessions());
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Audio Recording Handlers
  const startRecording = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSampleData(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());

        // Automatically transcribe recorded speech
        handleTranscribe(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(`Microphone access error: ${err.message || 'Permission denied'}`);
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
      setErrorMessage('Audio file exceeds 25 MB limit.');
      return;
    }

    setErrorMessage(null);
    setStatusMessage(`Uploaded: ${file.name}`);
    setIsSampleData(false);

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    handleTranscribe(file);
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    setStatusMessage('Transcribing English speech on local device...');
    try {
      const res = await transcribeAudio(blob);
      setTranscript(res.transcript);
      setStatusMessage(`Transcribed in ${res.inference_time_ms}ms`);
      // Auto-translate
      handleTranslate(res.transcript);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to transcribe audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTranslate = async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;

    setIsTranslating(true);
    setStatusMessage('Translating meaning into Telugu...');
    try {
      const res = await translateText(textToTranslate);
      setTranslation(res.translated_text);
      setStatusMessage(`Translated in ${res.inference_time_ms}ms`);

      // Save to session history
      const newSession: SessionItem = {
        id: 'sess-' + Date.now(),
        created_at: new Date().toISOString(),
        audio_duration_seconds: recordingSeconds || 4,
        transcript: textToTranslate,
        translation: res.translated_text,
        processing_mode: capabilities?.processing_mode || 'local',
        is_sample: isSampleData,
      };
      storage.saveSession(newSession);
      setSessions(storage.getSessions());
    } catch (err: any) {
      setErrorMessage(err.message || 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSynthesizeAndPlay = async () => {
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
    } catch (err) {
      setIsPlayingAudio(false);
    }
  };

  const loadSampleData = () => {
    setIsSampleData(true);
    setTranscript('I will call you after I finish the meeting.');
    setTranslation('మీటింగ్ పూర్తయ్యాక నేను మీకు ఫోన్ చేస్తాను.');
    setStatusMessage('Sample dataset loaded (Demonstration mode)');
    setErrorMessage(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTelugu(true);
      setTimeout(() => setCopiedTelugu(false), 2000);
    } catch {
      // Fallback
    }
  };

  const exportSession = () => {
    const content = `VayyuEdge Session Export
Date: ${new Date().toLocaleString()}
Mode: ${capabilities?.processing_mode || 'local'}

[English Transcript]
${transcript}

[Telugu Translation]
${translation}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vayyuedge-session-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-20 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-900/30">
              V
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">VayyuEdge</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-teal-950 text-teal-400 border border-teal-800/80 px-2 py-0.5 rounded-full">
                  v0.1 Edge MVP
                </span>
              </div>
              <p className="text-xs text-slate-400">Less compute. More intelligence.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mode Indicator */}
            <div
              className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border ${
                capabilities?.processing_mode === 'local'
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/70 border-amber-800 text-amber-300'
              }`}
              title="Verified processing boundary"
            >
              <span className={`w-2 h-2 rounded-full ${capabilities?.processing_mode === 'local' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="font-medium">
                {capabilities?.processing_mode === 'local' ? 'On-Device (Local)' : 'Remote Server'}
              </span>
            </div>

            {/* History Toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition"
            >
              History ({sessions.length})
            </button>

            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              title="Device Capabilities & Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col space-y-6">
        {/* Alerts / Status Banner */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 px-4 py-2.5 rounded-xl text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white font-bold ml-2">×</button>
          </div>
        )}

        {statusMessage && (
          <div className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
              <span>{statusMessage}</span>
            </span>
            <button onClick={() => setStatusMessage(null)} className="text-slate-500 hover:text-slate-300">×</button>
          </div>
        )}

        {/* Prototype Sample Banner */}
        {isSampleData && (
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-amber-200">
            <span><strong>[PROTOTYPE DEMO]</strong> Displaying verified sample pair for UI evaluation.</span>
            <button onClick={() => setIsSampleData(false)} className="underline hover:text-white">Clear</button>
          </div>
        )}

        {/* Hero & Language Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Speech, understood.</h1>
            <p className="text-sm text-slate-400 mt-1">
              Private, edge-optimized English-to-Telugu translation pipeline.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-lg bg-teal-950 text-teal-300 font-semibold text-xs border border-teal-800">
              English (eng_Latn)
            </span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="px-3 py-1 rounded-lg bg-teal-950 text-teal-300 font-semibold text-xs border border-teal-800">
              తెలుగు (tel_Telu)
            </span>
          </div>
        </div>

        {/* Action Controls: Record & Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Record Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center space-x-3 px-5 py-4 rounded-2xl font-medium transition shadow-lg ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-teal-600 hover:bg-teal-500 text-white'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-white' : 'bg-rose-400'}`}></span>
            <span className="font-semibold">
              {isRecording ? `Stop Recording (${recordingSeconds}s)` : 'Record Speech'}
            </span>
          </button>

          {/* Upload Button */}
          <label className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl font-medium border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer transition">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload Audio File</span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Load Sample Demo */}
          <button
            onClick={loadSampleData}
            className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl font-medium border border-dashed border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition text-sm"
          >
            <span>Load Sample Data</span>
          </button>
        </div>

        {/* Audio Player (if recorded/uploaded) */}
        {audioUrl && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>Captured Audio Ready</span>
            </span>
            <audio controls src={audioUrl} className="h-8 max-w-xs" />
          </div>
        )}

        {/* Two-Column Grid: Transcript & Translation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: English Transcript */}
          <div className="flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">English Transcript</span>
                {isTranscribing ? (
                  <span className="text-[10px] text-amber-300 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded animate-pulse">
                    Transcribing...
                  </span>
                ) : (
                  <span className="text-[10px] text-teal-400 bg-teal-950/80 border border-teal-800 px-1.5 py-0.5 rounded">
                    Editable
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {transcript ? `${transcript.split(/\s+/).filter(Boolean).length} words` : 'Empty'}
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Record speech or upload audio to see English transcription here, or type directly..."
              className="flex-1 w-full min-h-[160px] bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition resize-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => handleTranslate(transcript)}
                disabled={!transcript.trim() || isTranslating}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                {isTranslating ? (
                  <span>Translating...</span>
                ) : (
                  <>
                    <span>Translate into Telugu</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <button
                onClick={() => setTranscript('')}
                disabled={!transcript}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Column: Telugu Translation */}
          <div className="flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Telugu Translation</span>
                <span className="text-[10px] text-teal-400 bg-teal-950/80 border border-teal-800 px-1.5 py-0.5 rounded">
                  తెలుగు
                </span>
              </div>

              {translation && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(translation)}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    title="Copy Telugu text"
                  >
                    <span>{copiedTelugu ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={exportSession}
                    className="text-xs text-slate-400 hover:text-white"
                    title="Export session"
                  >
                    Export
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 w-full min-h-[160px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-base md:text-lg leading-relaxed text-teal-100 font-telugu select-text flex items-center">
              {translation ? (
                <span>{translation}</span>
              ) : (
                <span className="text-slate-600 text-sm font-sans">
                  Telugu translation will appear here after speech recognition or translation trigger.
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleSynthesizeAndPlay}
                disabled={!translation || isPlayingAudio}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition"
              >
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>{isPlayingAudio ? 'Playing...' : 'Play Telugu Audio'}</span>
              </button>

              <span className="text-[11px] text-slate-500">
                {capabilities?.tts.is_ready ? 'Voice ready' : 'Web speech fallback'}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy & Guarantee Notice */}
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 text-xs text-slate-400 flex items-start space-x-3">
          <svg className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <span className="font-semibold text-slate-200">On-Device Privacy Commitment: </span>
            When running in local mode, VayyuEdge executes speech recognition and Telugu translation completely on your machine.
            Your audio and conversations never leave your device.
          </div>
        </div>
      </main>

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full p-6 border-l border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold">Local Session History</h2>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-slate-500">No saved sessions yet.</p>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(s.created_at).toLocaleTimeString()}</span>
                      <button
                        onClick={() => {
                          storage.deleteSession(s.id);
                          setSessions(storage.getSessions());
                        }}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">"{s.transcript}"</p>
                    <p className="text-xs text-teal-300 font-telugu">"{s.translation}"</p>
                    <button
                      onClick={() => {
                        setTranscript(s.transcript);
                        setTranslation(s.translation);
                        setShowHistory(false);
                      }}
                      className="text-[11px] text-teal-400 hover:underline pt-1 block"
                    >
                      Load into editor →
                    </button>
                  </div>
                ))
              )}
            </div>

            {sessions.length > 0 && (
              <button
                onClick={() => {
                  storage.clearAll();
                  setSessions([]);
                }}
                className="w-full py-2 bg-rose-950 text-rose-300 border border-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-900 transition"
              >
                Clear All Sessions
              </button>
            )}
          </div>
        </div>
      )}

      {/* Settings & Capabilities Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold">Runtime & Device Inspector</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 uppercase font-semibold text-[10px]">Host Architecture</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating System:</span>
                  <span className="text-slate-200 font-medium">{capabilities?.device_info.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU Cores:</span>
                  <span className="text-slate-200 font-medium">{capabilities?.device_info.cpu_cores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available RAM:</span>
                  <span className="text-slate-200 font-medium">{capabilities?.device_info.ram_gb_available} GB</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 uppercase font-semibold text-[10px]">Active Model Adapters</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ASR Adapter:</span>
                  <span className="text-teal-400 font-mono">{capabilities?.asr.adapter} ({capabilities?.asr.model_name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Translation Adapter:</span>
                  <span className="text-teal-400 font-mono">{capabilities?.translation.adapter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TTS Adapter:</span>
                  <span className="text-teal-400 font-mono">{capabilities?.tts.adapter}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VayyuEdge · Built for edge autonomy on <a href="https://neuralmasteryai.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:underline">neuralmasteryai.com</a></span>
          <span>Target URL: vayyuedge.neuralmasteryai.com</span>
        </div>
      </footer>
    </div>
  );
}
