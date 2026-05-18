'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseVoiceInputResult {
  supported: boolean;
  listening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  error: string | null;
}

// Minimal types for SpeechRecognition (not in lib.dom.d.ts everywhere)
type SRConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>; resultIndex: number }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

export function useVoiceInput(lang = 'fr-FR'): UseVoiceInputResult {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
    };
    rec.onerror = (e) => {
      setError(e.error || 'unknown');
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.onstart = () => {
      setError(null);
      setListening(true);
    };
    recRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
      recRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    setTranscript('');
    try {
      recRef.current.start();
    } catch (err) {
      // Already started — ignore
    }
  }, []);

  const stop = useCallback(() => {
    if (!recRef.current) return;
    try {
      recRef.current.stop();
    } catch {}
  }, []);

  return { supported, listening, transcript, start, stop, error };
}
