import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage, Sender } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSuggestedTopicClick?: (topic: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onSuggestedTopicClick }) => {
  const { t } = useTranslation();
  const isUser = message.sender === Sender.User;
  const bubbleClasses = isUser
    ? 'bg-purple-600 text-white self-end rounded-l-lg rounded-br-lg'
    : 'bg-gray-600 text-gray-100 self-start rounded-r-lg rounded-bl-lg';
  const layoutClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  const handleTopicClick = (topic: string) => {
    if (onSuggestedTopicClick) {
      onSuggestedTopicClick(topic);
    }
  };

  return (
    <div className={`${layoutClasses} ${message.isInterim ? 'opacity-70' : ''}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 shadow-md ${bubbleClasses}`}>
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatText(message.text) }}></p>
        
        {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-500 border-opacity-50">
            <p className="text-xs text-gray-300 mb-1 font-semibold">{t('chatMessage.sourcesTitle')}</p>
            <ul className="space-y-1">
              {message.groundingChunks.map((chunk, index) => (
                <li key={index} className="text-xs">
                  <a
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 underline hover:no-underline break-all"
                    aria-label={`${t('chatMessage.sourceAriaLabelPrefix')} ${chunk.web.title || chunk.web.uri}`}
                  >
                    {chunk.web.title || chunk.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!isUser && message.suggestedTopics && message.suggestedTopics.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-500 border-opacity-50">
            <p className="text-xs text-gray-300 mb-1">{t('chatMessage.suggestedTopicsTitle')}</p>
            <div className="flex flex-wrap gap-2">
              {message.suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTopicClick(topic)}
                  className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded-md transition-colors"
                  aria-label={`${t('chatMessage.exploreTopicAriaLabelPrefix')} ${topic}`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
         <p className={`text-xs mt-2 ${isUser ? 'text-purple-200 text-right' : 'text-gray-400 text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};