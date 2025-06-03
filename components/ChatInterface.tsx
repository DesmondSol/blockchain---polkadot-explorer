
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Sender } from '../types';
import { ChatMessageItem } from './ChatMessageItem';
import { IconButton } from './IconButton';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  micNotSupported: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  transcript,
  interimTranscript,
  isListening,
  micNotSupported
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);
  
  useEffect(() => {
    if (isListening && interimTranscript) {
       // If there's a final transcript, don't append interim to it,
       // as interim is part of the current speech recognition session.
       // This logic assumes transcript is only set upon finalization of a speech segment.
       if (transcript && inputValue === transcript) {
         setInputValue(transcript + interimTranscript);
       } else if (!transcript) {
         setInputValue(interimTranscript);
       } else {
         // If transcript exists but inputValue was modified by user, 
         // user typing takes precedence over interim.
         // Or, if we want to show interim alongside user typing:
         // This part needs careful consideration based on desired UX.
         // For now, if transcript is there and input differs, interim might be less relevant or added to existing input.
         // The original logic was: setInputValue(prev => transcript ? transcript : prev + interimTranscript);
         // Let's refine it to handle ongoing speech vs. finalized transcript.
         // If listening, and transcript is from a *previous* utterance, clear input for new speech.
         // If transcript is the current finalized part, append interim.
         setInputValue(transcript + interimTranscript); // Simpler: always build on current transcript + interim if listening
       }
    }
  }, [interimTranscript, isListening, transcript, inputValue]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full overflow-hidden backdrop-filter backdrop-blur-md bg-gray-800 bg-opacity-70 rounded-lg shadow-2xl p-4">
      <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        {isListening && interimTranscript && (
           <ChatMessageItem key="interim" message={{id: "interim", text: interimTranscript, sender: Sender.User, timestamp: Date.now(), isInterim: true }} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 border-t border-gray-700 pt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? "Listening..." : (micNotSupported ? "Type your message..." : "Type or use mic...")}
          className="flex-grow p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400"
          disabled={isLoading || (isListening && !interimTranscript && !transcript)} // Allow typing if listening but no speech yet
        />
        <IconButton
            iconClass="fas fa-paper-plane"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            tooltip="Send Message"
            className={`p-3 rounded-lg text-white transition-colors ${isLoading || !inputValue.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
        />
      </form>
      {micNotSupported && <p className="text-xs text-yellow-400 mt-1 text-center">Your browser does not support speech recognition.</p>}
    </div>
  );
};

// Basic custom scrollbar styling (Tailwind doesn't directly support scrollbar styling, this is a common workaround or CSS could be added in index.html)
// For a more robust solution, a dedicated scrollbar library or CSS in JS might be used, but sticking to Tailwind for now.
// Add this to your global styles if needed, or accept default browser scrollbars.
// For demonstration, let's ensure this component has a functional scrollbar using Tailwind overflow classes.
// .custom-scrollbar::-webkit-scrollbar { width: 8px; }
// .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(167, 139, 250, 0.5); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(167, 139, 250, 0.8); }
