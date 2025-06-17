
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage, Sender } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSuggestedTopicClick?: (topic: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onSuggestedTopicClick }) => {
  const { t, i18n } = useTranslation();
  const isUser = message.sender === Sender.User;
  const isRtl = i18n.language === 'ar';

  let bubbleClasses = '';
  if (isUser) {
    bubbleClasses = `bg-purple-600 text-white self-end ${isRtl ? 'rounded-r-lg rounded-bl-lg' : 'rounded-l-lg rounded-br-lg'}`;
  } else {
    bubbleClasses = `bg-gray-600 text-gray-100 self-start ${isRtl ? 'rounded-l-lg rounded-br-lg' : 'rounded-r-lg rounded-bl-lg'}`;
  }
  
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
        <p className={`text-sm ${isRtl ? 'text-right' : 'text-left'}`} dangerouslySetInnerHTML={{ __html: formatText(message.text) }}></p>
        
        {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-500 border-opacity-50">
            <p className={`text-xs text-gray-300 mb-1 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('chatMessage.sourcesTitle')}</p>
            <ul className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
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
            <p className={`text-xs text-gray-300 mb-1 ${isRtl ? 'text-right' : 'text-left'}`}>{t('chatMessage.suggestedTopicsTitle')}</p>
            <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
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
         <p className={`text-xs mt-2 ${isUser ? (isRtl ? 'text-purple-200 text-left' : 'text-purple-200 text-right') : (isRtl ? 'text-gray-400 text-right' : 'text-gray-400 text-left')}`}>
          {new Date(message.timestamp).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
