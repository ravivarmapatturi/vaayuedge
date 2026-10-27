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
import { browserEngine } from '../../lib/browserEngine';
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
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [showInstallConfirm, setShowInstallConfirm] = useState(false);
  const [engineState, setEngineState] = useState<'off' | 'loading' | 'ready' | 'error'>(
    browserEngine.isReady() ? 'ready' : 'off'
  );
  const [enginePct, setEnginePct] = useState(0);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStepText, setSetupStepText] = useState('');
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [copied, setCopied] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const recordedSpeechRef = useRef<string>('');
  const recognitionDoneRef = useRef<Promise<void>>(Promise.resolve());
  const setupPollRef = useRef<number | null>(null);

  const startBrowserEngine = () => {
    setEngineState('loading');
    setErrorMessage(null);
    browserEngine
      .enable()
      .then(() => {
        setEngineState('ready');
        setEnginePct(100);
        setStatusMessage('✅ On-device AI is ready. Speech, translation and Telugu voice now run on this device.');
      })
      .catch((e) => {
        setEngineState('error');
        setErrorMessage(`Could not load the on-device AI models: ${e.message}. Check your connection and try again.`);
      });
  };

  useEffect(() => {
    const off = browserEngine.onProgress((pct) => setEnginePct(pct));
    // Returning visitors: models are already cached, load them silently.
    if (browserEngine.isEnabled() && !browserEngine.isReady()) startBrowserEngine();
    return () => {
      off();
    };
  }, []);

  useEffect(() => {
    fetchCapabilities().then(setCapabilities);
    setSessions(storage.getSessions());
  }, []);

  // Poll for background engine auto-activation
  useEffect(() => {
    let interval: number;
    if (!capabilities?.isConnected) {
      interval = window.setInterval(() => {
        fetchCapabilities().then((cap) => {
          if (cap.isConnected) {
            setCapabilities(cap);
          }
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [capabilities?.isConnected]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    setStatusMessage('Listening... Speak clearly in English, then press Stop.');
    setIsDemonstrationSample(false);
    setTranscript('');
    setTranslation('');
    recordedSpeechRef.current = '';

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: any) {
      setStatusMessage(null);
      setErrorMessage(`Microphone access denied: ${err?.message || 'allow microphone permission in your browser and try again.'}`);
      return;
    }

    audioChunksRef.current = [];
    // Record in a container the browser actually supports (Chrome/Firefox: webm, Safari: mp4).
    const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
      .find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(t)) || '';
    const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop());
      const type = mediaRecorder.mimeType || mimeType || 'audio/webm';
      const blob = new Blob(audioChunksRef.current, { type });
      setAudioUrl(URL.createObjectURL(blob));
      // Browser speech recognition delivers its final result *after* stop(); wait for it.
      await recognitionDoneRef.current;
      handleTranscribe(blob);
    };

    // In-browser speech recognition (Chrome/Edge/Safari) gives text even without the local engine.
    recognitionDoneRef.current = Promise.resolve();
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          let currentSpeech = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSpeech += event.results[i][0].transcript;
          }
          if (currentSpeech) {
            recordedSpeechRef.current = currentSpeech.trim();
            setTranscript(currentSpeech.trim());
          }
        };
        recognitionDoneRef.current = new Promise<void>((resolve) => {
          recognition.onend = () => resolve();
          recognition.onerror = () => resolve();
          // Never block transcription on a recognizer that doesn't report back.
          setTimeout(resolve, 4000);
        });
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.debug('SpeechRecognition unavailable, relying on local engine', e);
        recognitionDoneRef.current = Promise.resolve();
      }
    }

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingSeconds(0);
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
    setStatusMessage('Converting audio to text...');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
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
    setStatusMessage('Converting audio to text...');
    try {
      const res = await transcribeAudio(blob);
      const text = (res.transcript || '').trim() || recordedSpeechRef.current.trim();
      if (text) {
        setTranscript(text);
        setStatusMessage('Audio converted to text! Review it, then click "Translate →".');
      } else {
        setStatusMessage(null);
        const hasBrowserASR = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
        setErrorMessage(
          capabilities?.isConnected
            ? 'No speech was detected in the recording. Please speak closer to the microphone and try again.'
            : hasBrowserASR
              ? 'No speech was detected. Speak clearly for a few seconds and try again, or install the local engine for offline Whisper transcription.'
              : 'This browser has no built-in speech recognition (e.g. Firefox). Use Chrome/Edge, type the text, or install the local engine for Whisper transcription.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Transcription failed.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTranslate = async (sourceText: string) => {
    const textToTranslate = sourceText.trim();
    if (!textToTranslate) return;

    setIsTranslating(true);
    setStatusMessage('Translating into Telugu...');
    try {
      const res = await translateText(textToTranslate);
      setTranslation(res.translated_text);
      setStatusMessage(`Translated in ${res.inference_time_ms}ms`);

      const session: SessionItem = {
        id: 'sess-' + Date.now(),
        created_at: new Date().toISOString(),
        audio_duration_seconds: recordingSeconds || 3.5,
        transcript: textToTranslate,
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
    setErrorMessage(null);
    setIsPlayingAudio(true);
    setStatusMessage('Synthesizing spoken Telugu...');

    let audioSrc = '';
    try {
      audioSrc = await synthesizeSpeech(translation);
    } catch (err) {
      console.warn('Neural TTS failed, trying browser voice:', err);
    }
    if (!audioSrc) {
      await fallbackWebSpeech(translation);
      return;
    }
    try {
      if (!audioElementRef.current) audioElementRef.current = new Audio();
      const el = audioElementRef.current;
      el.pause();
      el.src = audioSrc;
      el.onended = () => {
        setIsPlayingAudio(false);
        setStatusMessage(null);
      };
      el.onerror = () => {
        fallbackWebSpeech(translation);
      };
      await el.play();
      setStatusMessage('Playing Telugu speech');
    } catch (err) {
      console.warn('Audio element playback failed, trying browser voice:', err);
      await fallbackWebSpeech(translation);
    }
  };

  const loadVoices = (): Promise<SpeechSynthesisVoice[]> =>
    new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) return resolve(voices);
      const done = () => resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
      setTimeout(done, 1500);
    });

  const fallbackWebSpeech = async (text: string) => {
    const stop = (error?: string) => {
      setIsPlayingAudio(false);
      setStatusMessage(null);
      if (error) setErrorMessage(error);
    };
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return stop('This browser cannot synthesize speech. Install the local engine for Meta MMS Telugu voice.');
    }
    const voices = await loadVoices();
    const teVoice = voices.find((v) => v.lang.toLowerCase().startsWith('te') || /telugu/i.test(v.name));
    if (!teVoice) {
      return stop(
        'No Telugu voice is installed in this browser, so it cannot speak this sentence. ' +
        'Click "Install & Setup Locally" to get the on-device Meta MMS Telugu voice (preset samples play without it).'
      );
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = teVoice.lang;
      utterance.voice = teVoice;
      utterance.onend = () => stop();
      utterance.onerror = () => stop('Browser voice engine failed to play the Telugu speech.');
      window.speechSynthesis.speak(utterance);
      setStatusMessage(`Playing via browser voice (${teVoice.name})`);
    } catch {
      stop('Browser voice engine failed to play the Telugu speech.');
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
    const text = `VaayuEdge Bilingual Export
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
    link.download = `vaayuedge-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isWindows = typeof navigator !== 'undefined' && /windows/i.test(navigator.userAgent);
  const installFilename = isWindows ? 'install-vaayuedge.bat' : 'install-vaayuedge.sh';
  const installCommand = isWindows
    ? `%USERPROFILE%\\Downloads\\${installFilename}`
    : `bash ~/Downloads/${installFilename}`;

  const buildInstallScript = () => {
    if (!isWindows) {
      return `#!/usr/bin/env bash
# VaayuEdge on-device engine installer: clones the repo, installs models, starts 127.0.0.1:8000
set -e
command -v git >/dev/null || { echo "Please install git first."; exit 1; }
command -v python3 >/dev/null || { echo "Please install Python 3.10+ first."; exit 1; }
DIR="$HOME/vaayuedge"
if [ -d "$DIR/.git" ]; then git -C "$DIR" pull --ff-only || true; else git clone https://github.com/ravivarmapatturi/vaayuedge.git "$DIR"; fi
cd "$DIR"
exec bash ./scripts/start-local.sh
`;
    }
    return `@echo off
REM VaayuEdge on-device engine installer (requires Git for Windows, which provides bash)
where git >nul 2>nul || (echo Please install Git for Windows first: https://git-scm.com & pause & exit /b 1)
set DIR=%USERPROFILE%\\vaayuedge
if exist "%DIR%\\.git" (git -C "%DIR%" pull --ff-only) else (git clone https://github.com/ravivarmapatturi/vaayuedge.git "%DIR%")
cd /d "%DIR%"
bash ./scripts/start-local.sh
pause
`;
  };

  // Step 1: explain what will happen and ask for consent.
  const handleInstallSetupLocally = () => {
    setErrorMessage(null);
    setShowInstallConfirm(true);
  };

  const agreeAndEnable = () => {
    setShowInstallConfirm(false);
    startBrowserEngine();
  };

  // Step 2: on OK, download the script and watch for the engine to come up for real.
  const confirmInstall = () => {
    setShowInstallConfirm(false);
    const blob = new Blob([buildInstallScript()], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = installFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setIsSettingUp(true);
    setSetupProgress(0);
    setSetupStepText('Script downloaded. Run it to start the engine — waiting for 127.0.0.1:8000...');

    if (setupPollRef.current) clearInterval(setupPollRef.current);
    const startedAt = Date.now();
    setupPollRef.current = window.setInterval(async () => {
      const cap = await fetchCapabilities();
      if (cap.isConnected) {
        if (setupPollRef.current) clearInterval(setupPollRef.current);
        setSetupProgress(100);
        setSetupStepText('On-device engine connected!');
        setStatusMessage('✅ On-device engine connected. Whisper, Opus-MT and MMS-TTS now run on your machine.');
        setCapabilities(cap);
        setTimeout(() => setIsSettingUp(false), 1500);
      } else if (Date.now() - startedAt > 30 * 60 * 1000) {
        if (setupPollRef.current) clearInterval(setupPollRef.current);
      }
    }, 2000);
  };

  return (
    <section id={id} className={`w-full ${isStandalonePage ? 'py-8' : 'py-12'} transition-all`}>
      <div className="max-w-5xl mx-auto">
        {/* Main Product Interactive Box */}
        <div className="bg-canvas-100 border border-canvas-300 rounded-2xl shadow-card overflow-hidden">
          {/* Top Panel Bar */}
          <div className="border-b border-canvas-300 bg-canvas-50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${capabilities?.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                Speech & Translation Console
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {capabilities?.isConnected ? (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center space-x-1.5 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>On-Device Engine Active</span>
                </span>
              ) : engineState === 'ready' ? (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>On-Device AI Ready</span>
                </span>
              ) : engineState === 'loading' ? (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                  <span>Setting up: {enginePct}%</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallSetupLocally}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-subtle hover:shadow transition flex items-center space-x-1.5"
                >
                  <span>⚡</span>
                  <span>Enable On-Device AI</span>
                </button>
              )}
              <button
                onClick={() => setShowInspector(!showInspector)}
                className="px-2.5 py-1.5 rounded-lg border border-canvas-300 bg-canvas-100 hover:bg-canvas-200 text-charcoal-700 font-medium transition"
              >
                Runtime Info
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-2.5 py-1.5 rounded-lg border border-canvas-300 bg-canvas-100 hover:bg-canvas-200 text-charcoal-700 font-medium transition"
              >
                History ({sessions.length})
              </button>
            </div>
          </div>

          {/* Install consent popup */}
          {showInstallConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
              <div className="bg-canvas-50 rounded-2xl shadow-card max-w-md w-full p-6 space-y-4 text-sm text-charcoal-800">
                <h3 className="text-base font-bold text-charcoal-900">Enable on-device AI?</h3>
                <p>
                  VaayuEdge will download its speech, translation and Telugu voice models (about 300&nbsp;MB, one time) and
                  store them in your browser. After that, everything runs on this device — your voice is never uploaded,
                  and it keeps working offline.
                </p>
                <p className="text-xs text-charcoal-600">Nothing is installed on your computer. You can remove the models anytime by clearing site data.</p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button onClick={confirmInstall} className="text-xs text-charcoal-500 underline hover:text-charcoal-800">Advanced: native engine</button>
                  <div className="flex gap-2">
                    <button onClick={() => setShowInstallConfirm(false)} className="px-3.5 py-1.5 rounded-lg border border-canvas-300 hover:bg-canvas-200">Cancel</button>
                    <button onClick={agreeAndEnable} className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold">Agree &amp; enable</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {engineState === 'loading' && (
            <div className="bg-amber-50/95 border-b border-amber-200 px-5 py-3 space-y-2 text-xs text-amber-950">
              <div className="flex items-center justify-between">
                <span className="font-bold">Setting up on-device AI: {enginePct}%</span>
                <span className="text-amber-800">One-time download · cached for next visit</span>
              </div>
              <div className="w-full bg-amber-200/70 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 via-teal-600 to-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${enginePct}%` }}></div>
              </div>
            </div>
          )}

          {/* Setup status strip: reflects the real engine state only */}
          {isSettingUp && (
            <div className="bg-amber-50/95 border-b border-amber-200 px-5 py-3 space-y-2 text-xs text-amber-950">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{setupProgress === 100 ? '✅ Connected' : 'Waiting for local engine'}</span>
                <span className="text-amber-800 flex-1">{setupStepText}</span>
                <button onClick={() => { setIsSettingUp(false); if (setupPollRef.current) clearInterval(setupPollRef.current); }} className="text-amber-600 hover:text-amber-900 text-sm font-bold px-1" title="Dismiss">×</button>
              </div>
              {setupProgress < 100 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span>Run in a terminal:</span>
                  <code className="bg-charcoal-900 text-emerald-200 rounded px-2 py-1 font-mono">{installCommand}</code>
                  <button onClick={() => navigator.clipboard?.writeText(installCommand)} className="px-2 py-1 rounded border border-amber-300 hover:bg-amber-100">Copy</button>
                </div>
              )}
            </div>
          )}
          {capabilities?.isConnected && (
            <div className="bg-emerald-50/80 border-b border-emerald-200 px-5 py-2 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold">On-Device Engine Connected</span>
                <span className="text-emerald-700 hidden sm:inline">— Zero network packets. Whisper ASR + Opus-MT + Meta MMS running on local CPU.</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700">Loopback Active</span>
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
                  {capabilities?.isConnected ? '100% On-Device (127.0.0.1:8000)' : 'Browser mode (local engine not running)'}
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
