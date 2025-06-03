
import { useState, useEffect, useCallback } from 'react';

// --- START of Web Speech API Type Definitions ---
// These types are normally part of lib.dom.d.ts. Adding them here for robustness
// in environments where they might not be readily available or correctly configured.

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string; // More specific: 'no-speech', 'aborted', 'audio-capture', 'network', 'not-allowed', 'service-not-allowed', 'bad-grammar', 'language-not-supported'
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
  readonly emma?: Document | null; // XML Emma document
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
  serviceURI?: string; // Optional, not in all specs

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
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; // Some specs use SpeechRecognitionNoMatchEvent
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

// Constructor type for SpeechRecognition
interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

// --- END of Web Speech API Type Definitions ---


// Extend Window interface for webkitSpeechRecognition
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


export const useSpeechRecognition = (): SpeechRecognitionHook => {
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
    // Cast to SpeechRecognitionStatic to satisfy 'new' call
    const recognition = new (SpeechRecognitionAPI as SpeechRecognitionStatic)(); 
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US'; 

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
      // Append only the new final segment to the overall transcript
      if (finalTranscriptSegment) {
        setTranscript(prev => prev + finalTranscriptSegment);
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      setError(`Speech recognition error: ${event.error} - ${event.message}`);
      setIsListening(false); // Stop listening on error
    };
    
    recognition.onend = () => {
      // This onend can be triggered by stop() or by the service itself.
      // We only set isListening to false if it was not a deliberate stopListening() call
      // or if it's an unexpected end.
      // However, managing this state precisely here is complex.
      // The stopListening function will set isListening to false.
      // If recognition ends unexpectedly (e.g. no speech), we might want to reflect that.
      // For now, let stopListening explicitly manage this.
      // setIsListening(false); // This could cause issues if stopListening is called.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserSupportsSpeechRecognition]); 


  const startListening = useCallback(() => {
    if (recognitionInstance && !isListening) {
      setTranscript(''); 
      setInterimTranscript(''); 
      try {
        recognitionInstance.start();
        setIsListening(true);
        setError(null);
      } catch (e: any) {
        console.error("Error starting recognition:", e);
        setError(`Could not start voice recognition: ${e.message || "Unknown error"}. It might be already active or an internal error occurred.`);
        setIsListening(false);
      }
    }
  }, [recognitionInstance, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionInstance && isListening) {
      recognitionInstance.stop();
      setIsListening(false);
      // Final transcript processing should happen in onresult.
      // Interim transcript will clear on next start or naturally.
    }
  }, [recognitionInstance, isListening]);

  return { isListening, transcript, interimTranscript, startListening, stopListening, error, browserSupportsSpeechRecognition };
};
