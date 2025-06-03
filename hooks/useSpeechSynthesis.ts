
import { useState, useEffect, useCallback } from 'react';

// --- START of Web Speech Synthesis API Type Definitions ---
// These types are normally part of lib.dom.d.ts. Adding them here for robustness.

interface SpeechSynthesisVoice {
  readonly default: boolean;
  readonly lang: string;
  readonly localService: boolean;
  readonly name: string;
  readonly voiceURI: string;
}

interface SpeechSynthesisErrorEvent extends Event { // Note: This is SpeechSynthesisErrorEvent, different from SpeechRecognitionErrorEvent
  readonly charIndex: number;
  readonly elapsedTime: number;
  readonly error: string; // e.g., "canceled", "interrupted", "audio-busy", "audio-hardware", "network", "synthesis-unavailable", "synthesis-failed", "language-unavailable", "voice-unavailable", "text-too-long", "invalid-argument"
  readonly name: string; // utterance name if set
}

interface SpeechSynthesisUtteranceEventMap {
  "boundary": Event; // SpeechSynthesisEvent in some specs
  "end": Event; // SpeechSynthesisEvent
  "error": SpeechSynthesisErrorEvent;
  "mark": Event; // SpeechSynthesisEvent
  "pause": Event; // SpeechSynthesisEvent
  "resume": Event; // SpeechSynthesisEvent
  "start": Event; // SpeechSynthesisEvent
}

interface SpeechSynthesisUtterance extends EventTarget {
  lang: string;
  pitch: number;
  rate: number;
  text: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;

  onboundary: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null; // SpeechSynthesisEvent
  onend: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null; // SpeechSynthesisEvent
  onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => any) | null;
  onmark: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null; // SpeechSynthesisEvent
  onpause: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null; // SpeechSynthesisEvent
  onresume: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null; // SpeechSynthesisEvent
  onstart: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null; // SpeechSynthesisEvent

  addEventListener<K extends keyof SpeechSynthesisUtteranceEventMap>(type: K, listener: (this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof SpeechSynthesisUtteranceEventMap>(type: K, listener: (this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface SpeechSynthesis extends EventTarget {
  readonly paused: boolean;
  readonly pending: boolean;
  readonly speaking: boolean;

  cancel(): void;
  getVoices(): SpeechSynthesisVoice[];
  pause(): void;
  resume(): void;
  speak(utterance: SpeechSynthesisUtterance): void;

  onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => any) | null;
}

// Constructor for SpeechSynthesisUtterance
interface SpeechSynthesisUtteranceStatic {
    new(text?: string): SpeechSynthesisUtterance;
    prototype: SpeechSynthesisUtterance;
}

// --- END of Web Speech Synthesis API Type Definitions ---

// Make sure window.speechSynthesis and window.SpeechSynthesisUtterance are typed
declare global {
    interface Window {
        speechSynthesis: SpeechSynthesis;
        SpeechSynthesisUtterance: SpeechSynthesisUtteranceStatic;
    }
}


interface SpeechSynthesisHook {
  speak: (text: string, lang?: string, voice?: SpeechSynthesisVoice) => void;
  cancelSpeaking: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  browserSupportsSpeechSynthesis: boolean;
  error: string | null;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const browserSupportsSpeechSynthesis = 'speechSynthesis' in window && window.speechSynthesis !== null && window.speechSynthesis !== undefined;

  const populateVoiceList = useCallback(() => {
    if (browserSupportsSpeechSynthesis) {
      const newVoices = window.speechSynthesis.getVoices();
      setVoices(newVoices);
    }
  }, [browserSupportsSpeechSynthesis]);

  useEffect(() => {
    if (browserSupportsSpeechSynthesis) {
      populateVoiceList(); // Initial population
      // onvoiceschanged event is fired when the list of voices has changed
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
      }
    } else {
      setError("Speech synthesis not supported by this browser.");
    }
    // Cleanup function to remove the event listener
    return () => {
        if (browserSupportsSpeechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = null;
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserSupportsSpeechSynthesis]); // populateVoiceList is memoized

  const speak = useCallback((text: string, lang: string = 'en-US', voice?: SpeechSynthesisVoice) => {
    if (!browserSupportsSpeechSynthesis || !window.SpeechSynthesisUtterance) {
        setError("Speech synthesis utterance not supported.");
        return;
    }
    if (isSpeaking) { // If already speaking, cancel current and start new, or queue? For now, let's avoid overlapping.
      window.speechSynthesis.cancel(); // Cancel current speech first
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (voice) {
      utterance.voice = voice;
    } else {
      const defaultVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && v.default); // Try to match language prefix and default
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      } else {
        const englishFallback = voices.find(v => v.lang.startsWith('en') && v.default); // Fallback to default English voice
        if (englishFallback) utterance.voice = englishFallback;
      }
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => { // Use the defined SpeechSynthesisErrorEvent
      console.error('Speech synthesis error:', event.error);
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [browserSupportsSpeechSynthesis, isSpeaking, voices]);

  const cancelSpeaking = useCallback(() => {
    if (browserSupportsSpeechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [browserSupportsSpeechSynthesis]);

  return { speak, cancelSpeaking, isSpeaking, voices, browserSupportsSpeechSynthesis, error };
};
