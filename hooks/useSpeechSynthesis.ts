import { useState, useEffect, useCallback } from 'react';

// Make sure window.speechSynthesis and window.SpeechSynthesisUtterance are typed
// This will now refer to global types from lib.dom.d.ts or similar.
declare global {
    interface Window {
        readonly speechSynthesis: SpeechSynthesis;
        SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
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
    if (isSpeaking) { 
      window.speechSynthesis.cancel(); 
    }

    // Clean text for speech: remove markdown like **bold** -> bold
    // Also remove other potential artifacts if necessary.
    // For now, focusing on asterisks used for bolding, as other complex symbols
    // like VISUAL_HINT are already stripped by geminiService.
    const cleanedText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** to bold
        .replace(/[*_#]/g, ''); // Remove loose asterisks, underscores, hashes

    const utterance = new window.SpeechSynthesisUtterance(cleanedText);
    utterance.lang = lang;
    if (voice) {
      utterance.voice = voice;
    } else {
      const defaultVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && v.default); 
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      } else {
        const englishFallback = voices.find(v => v.lang.startsWith('en') && v.default); 
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
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => { 
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