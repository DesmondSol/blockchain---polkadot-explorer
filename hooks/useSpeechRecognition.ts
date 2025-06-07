
import { useState, useEffect, useCallback } from 'react';

// --- START of Web Speech API Type Definitions ---
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly emma?: Document | null;
  readonly interpretation?: any;
}
interface SpeechGrammar {
  src: string;
  weight: number;
}
interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
}
interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}
interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}
// --- END of Web Speech API Type Definitions ---

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  browserSupportsSpeechRecognition: boolean;
}


export const useSpeechRecognition = (lang: string = 'en-US'): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);

  const browserSupportsSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition not supported by this browser.');
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new (SpeechRecognitionAPI as SpeechRecognitionStatic)(); 
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = lang; // Use the passed language

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscriptSegment = '';
      let currentInterim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptSegment += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }
      if (finalTranscriptSegment) {
        setTranscript(prev => prev + finalTranscriptSegment);
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      setError(`Speech recognition error: ${event.error} - ${event.message}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      // Handled by explicit stopListening or error
    };
    
    setRecognitionInstance(recognition);

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      }
    };
  }, [browserSupportsSpeechRecognition, lang]); // Add lang to dependencies


  const startListening = useCallback(() => {
    if (recognitionInstance && !isListening) {
      setTranscript(''); 
      setInterimTranscript(''); 
      try {
        recognitionInstance.lang = lang; // Ensure lang is current on start
        recognitionInstance.start();
        setIsListening(true);
        setError(null);
      } catch (e: any) {
        console.error("Error starting recognition:", e);
        setError(`Could not start voice recognition: ${e.message || "Unknown error"}. It might be already active or an internal error occurred.`);
        setIsListening(false);
      }
    }
  }, [recognitionInstance, isListening, lang]);

  const stopListening = useCallback(() => {
    if (recognitionInstance && isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    }
  }, [recognitionInstance, isListening]);

  return { isListening, transcript, interimTranscript, startListening, stopListening, error, browserSupportsSpeechRecognition };
};