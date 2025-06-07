import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  onSuggestedTopicClick: (topicText: string) => void;
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
  currentPath,
  onSuggestedTopicClick
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isListening) {
      const displayText = transcript + (interimTranscript ? (transcript ? ' ' : '') + interimTranscript : '');
      setInputValue(displayText);
    } else {
       if (transcript) {
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
    if (inputValue.trim() && !isLoading && currentPath) {
      onSendMessage(inputValue);
      setInputValue(''); 
    } else if (!currentPath) {
        console.warn("No learning path selected. Cannot send message.");
    }
  };
  
  const handleDirectSuggestedTopicClick = (topic: string) => {
    if (currentPath) {
        onSuggestedTopicClick(topic);
        setInputValue(''); 
    }
  };

  const pathTitleKey = currentPath === 'blockchainBasics' ? "chat.pathTitleBasics" : "chat.pathTitlePolkadot";
  const inputDisabled = isLoading || !currentPath;

  const getPlaceholderText = () => {
    if (isListening) return t('chat.inputPlaceholderListening');
    if (micNotSupported) return t('chat.inputPlaceholderTypeMessage');
    if (!currentPath) return t('chat.inputPlaceholderSelectPath');
    return t('chat.inputPlaceholderTypeOrMic');
  };

  return (
    <div className="flex flex-col h-full p-2 md:p-4 bg-transparent">
      <div className="mb-2 text-center">
          <h2 className="text-lg font-semibold text-purple-300 bg-gray-800 bg-opacity-70 backdrop-blur-sm py-2 px-4 rounded-md inline-block">
            {t(pathTitleKey)}
          </h2>
      </div>
      <div className="flex-grow overflow-y-auto mb-3 pr-1 md:pr-2 space-y-4 custom-scrollbar bg-black bg-opacity-30 backdrop-blur-sm p-3 rounded-lg">
        {messages.map((msg) => (
          <ChatMessageItem 
            key={msg.id} 
            message={msg} 
            onSuggestedTopicClick={msg.sender === Sender.AI ? handleDirectSuggestedTopicClick : undefined}
          />
        ))}
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
          placeholder={getPlaceholderText()}
          className="flex-grow p-3 bg-gray-700 bg-opacity-80 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 disabled:opacity-70"
          disabled={inputDisabled}
          aria-label={t('chat.inputAriaLabel')}
        />
        <IconButton
            iconClass="fas fa-paper-plane"
            type="submit"
            disabled={inputDisabled || !inputValue.trim()}
            tooltip={t('tooltips.sendMessage')}
            className={`p-3 rounded-lg text-white transition-colors ${inputDisabled || !inputValue.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
            aria-label={t('tooltips.sendMessage')}
        />
      </form>
      {micNotSupported && !isListening && <p className="text-xs text-yellow-400 mt-1 text-center">{t('chat.micNotSupported')}</p>}
      {!currentPath && <p className="text-xs text-yellow-500 mt-1 text-center">{t('chat.selectPathPrompt')}</p>}
    </div>
  );
};