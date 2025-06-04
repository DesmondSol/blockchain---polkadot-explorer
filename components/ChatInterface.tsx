import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Sender } from '../types';
import { ChatMessageItem } from './ChatMessageItem';
import { IconButton } from './IconButton';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  micNotSupported: boolean;
  currentPath: 'blockchainBasics' | 'polkadotAdvanced' | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  error,
  onClearError,
  transcript,
  interimTranscript,
  isListening,
  micNotSupported,
  currentPath
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update input field based on speech recognition state
  useEffect(() => {
    if (isListening) {
      // While listening, combine final transcript segments with the current interim segment
      const displayText = transcript + (interimTranscript ? (transcript ? ' ' : '') + interimTranscript : '');
      setInputValue(displayText);
    } else {
      // When not listening, the input should reflect the complete transcript of the last session,
      // or be empty if the user cleared it or sent a message.
      // If transcript has a value, it means speech recognition finalized.
      // If user clears input, this shouldn't fight.
      // handleSubmit clears inputValue, so this primarily sets final transcript post-listening.
       if (transcript) { // Only set if transcript has content from last session
           setInputValue(transcript);
       }
    }
  }, [isListening, transcript, interimTranscript]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue(''); // Clear input after sending
       // If speech recognition was used, its transcript should also be effectively "cleared" 
      // from the input by this action, as `transcript` in useSpeechRecognition hook
      // is reset on next `startListening`.
    }
  };
  
  const handleSuggestedTopicClick = (topic: string) => {
    onSendMessage(topic);
    setInputValue(''); // Clear input in case it had something
  };

  const pathTitle = currentPath === 'blockchainBasics' ? "Blockchain Basics" : "Polkadot Advanced";

  return (
    <div className="flex flex-col h-full p-2 md:p-4 bg-transparent">
      <div className="mb-2 text-center">
          <h2 className="text-lg font-semibold text-purple-300 bg-gray-800 bg-opacity-70 backdrop-blur-sm py-2 px-4 rounded-md inline-block">
            {pathTitle} Path
          </h2>
      </div>
      <div className="flex-grow overflow-y-auto mb-3 pr-1 md:pr-2 space-y-4 custom-scrollbar bg-black bg-opacity-30 backdrop-blur-sm p-3 rounded-lg">
        {messages.map((msg) => (
          <ChatMessageItem 
            key={msg.id} 
            message={msg} 
            onSuggestedTopicClick={msg.sender === Sender.AI ? handleSuggestedTopicClick : undefined}
          />
        ))}
        {/* Display interim transcript as a temporary user message if actively listening and only interim results are available */}
        {isListening && interimTranscript && !transcript && messages.every(m => m.id !== "interim-live") && (
           <ChatMessageItem key="interim-live" message={{id: "interim-live", text: interimTranscript, sender: Sender.User, timestamp: Date.now(), isInterim: true }} />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {isLoading && (
        <div className="py-1">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="py-1">
          <ErrorMessage message={error} onClose={onClearError} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-3 border-t border-gray-700 border-opacity-50">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? "Listening..." : (micNotSupported ? "Type your message..." : "Type or use mic...")}
          className="flex-grow p-3 bg-gray-700 bg-opacity-80 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 disabled:opacity-70"
          disabled={isLoading} // Only disable for loading, not for listening state here
          aria-label="Chat input"
        />
        <IconButton
            iconClass="fas fa-paper-plane"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            tooltip="Send Message"
            className={`p-3 rounded-lg text-white transition-colors ${isLoading || !inputValue.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
            aria-label="Send message"
        />
      </form>
      {micNotSupported && !isListening && <p className="text-xs text-yellow-400 mt-1 text-center">Your browser does not support speech recognition.</p>}
    </div>
  );
};