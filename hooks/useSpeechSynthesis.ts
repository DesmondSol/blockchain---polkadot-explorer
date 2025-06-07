
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
      // Try to find a voice that exactly matches the lang (e.g., 'en-US') and is default
      let selectedVoice = voices.find(v => v.lang === lang && v.default);
      
      // If not found, try to find any voice for the lang (e.g., 'en-US')
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === lang);
      }

      // If still not found, try to find a voice for the primary language (e.g., 'en') and is default
      if (!selectedVoice) {
        const primaryLang = lang.split('-')[0];
        selectedVoice = voices.find(v => v.lang.startsWith(primaryLang) && v.default);
      }

      // If still not found, try any voice for the primary language
      if (!selectedVoice) {
        const primaryLang = lang.split('-')[0];
        selectedVoice = voices.find(v => v.lang.startsWith(primaryLang));
      }
      
      // Fallback to any English default voice if the target language voice is not found
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en') && v.default);
      }

      // Finally, if still no voice, assign the first available voice as a last resort
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0]; 
      }
        
      if (selectedVoice) {
        utterance.voice = selectedVoice;
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
      console.error('Speech synthesis event error:', event.error);
      // "interrupted" is often a result of cancelling speech, not a true error.
      if (event.error === 'interrupted') {
        console.warn('Speech synthesis was interrupted (likely intended).');
      } else {
        setError(`Speech synthesis error: ${event.error}`);
      }
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
