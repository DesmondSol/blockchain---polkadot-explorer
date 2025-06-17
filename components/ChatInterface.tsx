
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  browserSupportsSpeechRecognition: boolean;
  currentPath: 'blockchainBasics' | 'polkadotAdvanced' | null;
  onSuggestedTopicClick: (topicText: string) => void;
  startListening: () => void;
  stopListening: () => void;
  cancelSpeaking: () => void;
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
  browserSupportsSpeechRecognition,
  currentPath,
  onSuggestedTopicClick,
  startListening,
  stopListening,
  cancelSpeaking,
}) => {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isHoldingToTalk, setIsHoldingToTalk] = useState(false);
  const [sendTranscriptOnStop, setSendTranscriptOnStop] = useState(false);
  const componentIsMounted = useRef(true);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    componentIsMounted.current = true;
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

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


  const handleHoldToTalkMouseDown = useCallback(() => {
    if (!browserSupportsSpeechRecognition || isLoading || !currentPath) return;

    cancelSpeaking();
    startListening(); 
    if (componentIsMounted.current) setIsHoldingToTalk(true);
  }, [browserSupportsSpeechRecognition, isLoading, currentPath, cancelSpeaking, startListening]);

  const handleHoldToTalkMouseUp = useCallback(() => {
    if (!isHoldingToTalk || !componentIsMounted.current) return;

    stopListening();
    setIsHoldingToTalk(false);
    setSendTranscriptOnStop(true); 
  }, [isHoldingToTalk, stopListening]);


  useEffect(() => {
    if (sendTranscriptOnStop && !isListening && transcript.trim() && componentIsMounted.current) {
      onSendMessage(transcript);
      setInputValue(''); 
      setSendTranscriptOnStop(false);
    } else if (sendTranscriptOnStop && !isListening && !transcript.trim() && componentIsMounted.current) {
      setSendTranscriptOnStop(false); 
    }
  }, [isListening, transcript, sendTranscriptOnStop, onSendMessage]);


  const getPlaceholderText = () => {
    if (isHoldingToTalk) return t('chat.inputPlaceholderListening');
    if (isListening) return t('chat.inputPlaceholderListening'); // Reflects SR active state from hook
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
      <div className={`flex-grow overflow-y-auto mb-3 space-y-4 custom-scrollbar bg-black bg-opacity-30 backdrop-blur-sm p-3 rounded-lg ${isRtl ? 'pr-1 md:pr-2' : 'pl-1 md:pl-2'}`}>
        {messages.map((msg) => (
          <ChatMessageItem 
            key={msg.id} 
            message={msg} 
            onSuggestedTopicClick={msg.sender === Sender.AI ? handleDirectSuggestedTopicClick : undefined}
          />
        ))}
        {isListening && interimTranscript && !transcript && messages.every(m => m.id !== "interim-live") && !isHoldingToTalk && (
           // Only show live interim results if NOT holding to talk, to avoid UI clutter during hold.
           // This case is less likely now continuous listening is removed.
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

      <form onSubmit={handleSubmit} className={`flex items-center space-x-2 pt-3 border-t border-gray-700 border-opacity-50 ${isRtl ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={getPlaceholderText()}
          className={`flex-grow p-3 bg-gray-700 bg-opacity-80 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 disabled:opacity-70 ${isRtl ? 'text-right' : 'text-left'}`}
          disabled={inputDisabled}
          aria-label={t('chat.inputAriaLabel')}
        />
        {browserSupportsSpeechRecognition && (
            <IconButton
                iconClass="fas fa-microphone"
                onMouseDown={handleHoldToTalkMouseDown}
                onMouseUp={handleHoldToTalkMouseUp}
                onTouchStart={handleHoldToTalkMouseDown}
                onTouchEnd={handleHoldToTalkMouseUp}
                onMouseLeave={isHoldingToTalk ? handleHoldToTalkMouseUp : undefined} // Stop if mouse leaves while holding
                disabled={inputDisabled || !browserSupportsSpeechRecognition}
                tooltip={t('tooltips.holdToTalk')}
                className={`p-3 rounded-lg text-white transition-all duration-150 transform focus:outline-none ${
                    isHoldingToTalk 
                        ? 'bg-red-500 hover:bg-red-600 scale-110' 
                        : (inputDisabled || !browserSupportsSpeechRecognition 
                            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                            : 'bg-blue-500 hover:bg-blue-600 active:bg-red-500 active:scale-110')
                }`}
                aria-label={t('tooltips.holdToTalk')}
                type="button" 
            />
        )}
        <IconButton
            iconClass="fas fa-paper-plane"
            type="submit"
            disabled={inputDisabled || !inputValue.trim()}
            tooltip={t('tooltips.sendMessage')}
            className={`p-3 rounded-lg text-white transition-colors ${inputDisabled || !inputValue.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
            aria-label={t('tooltips.sendMessage')}
        />
      </form>
      {micNotSupported && <p className="text-xs text-yellow-400 mt-1 text-center">{t('chat.micNotSupported')}</p>}
      {!currentPath && <p className="text-xs text-yellow-500 mt-1 text-center">{t('chat.selectPathPrompt')}</p>}
    </div>
  );
};
