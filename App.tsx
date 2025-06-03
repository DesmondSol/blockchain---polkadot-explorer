
import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Sender } from './types';
import { ChatInterface } from './components/ChatInterface';
import { VisualBackground } from './components/VisualBackground';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { sendMessageToGemini } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { IconButton } from './components/IconButton';

const App: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentVisualKeyword, setCurrentVisualKeyword] = useState<string>('blockchain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(true);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak, cancelSpeaking, isSpeaking, browserSupportsSpeechSynthesis } = useSpeechSynthesis();

  useEffect(() => {
    // Initial greeting message
    setChatMessages([
      { 
        id: 'initial-greeting', 
        text: "Hello! I'm here to help you learn about Blockchain and Polkadot. Ask me anything or use the mic!", 
        sender: Sender.AI, 
        timestamp: Date.now() 
      }
    ]);
  }, []);

  useEffect(() => {
    if (speechError) {
      setError(`Speech recognition error: ${speechError}`);
    }
  }, [speechError]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: messageText,
      sender: Sender.User,
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const { text: aiResponseText, visualHint } = await sendMessageToGemini(messageText, chatMessages);
      
      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText,
        sender: Sender.AI,
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, newAiMessage]);

      if (visualHint) {
        setCurrentVisualKeyword(visualHint);
      }
      
      if (isAutoSpeakEnabled && browserSupportsSpeechSynthesis) {
        speak(aiResponseText);
      }

    } catch (err) {
      console.error('Error sending message to Gemini:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred with the AI service.';
      setError(errorMessage);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        text: `Error: ${errorMessage}`,
        sender: Sender.AI,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatMessages, speak, isAutoSpeakEnabled, browserSupportsSpeechSynthesis]);

  const toggleAutoSpeak = () => {
    setIsAutoSpeakEnabled(prev => !prev);
    if (isSpeaking) {
      cancelSpeaking();
    }
  };
  
  return (
    <div className="relative min-h-screen font-sans">
      <VisualBackground keyword={currentVisualKeyword} />
      <div className="relative z-10 flex flex-col h-screen p-4 md:p-6 bg-black bg-opacity-50 backdrop-blur-sm">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-300 drop-shadow-md">
            Blockchain & Polkadot Explorer
          </h1>
          <div className="flex items-center space-x-2">
            {browserSupportsSpeechSynthesis && (
               <IconButton
                iconClass={isAutoSpeakEnabled ? "fas fa-volume-up" : "fas fa-volume-mute"}
                onClick={toggleAutoSpeak}
                tooltip={isAutoSpeakEnabled ? "Disable AI Speech" : "Enable AI Speech"}
                className={`p-2 rounded-full transition-colors ${isAutoSpeakEnabled ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
              />
            )}
            {browserSupportsSpeechRecognition && (
              <IconButton
                iconClass={isListening ? "fas fa-microphone-slash" : "fas fa-microphone"}
                onClick={isListening ? stopListening : startListening}
                tooltip={isListening ? "Stop Listening" : "Start Listening"}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              />
            )}
          </div>
        </header>
        
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        
        <ChatInterface
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          transcript={transcript}
          interimTranscript={interimTranscript}
          isListening={isListening}
          micNotSupported={!browserSupportsSpeechRecognition}
        />
        
        {isLoading && !error && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
