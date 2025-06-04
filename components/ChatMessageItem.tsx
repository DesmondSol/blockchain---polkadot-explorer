import React from 'react';
import { ChatMessage, Sender } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSuggestedTopicClick?: (topic: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onSuggestedTopicClick }) => {
  const isUser = message.sender === Sender.User;
  const bubbleClasses = isUser
    ? 'bg-purple-600 text-white self-end rounded-l-lg rounded-br-lg'
    : 'bg-gray-600 text-gray-100 self-start rounded-r-lg rounded-bl-lg';
  const layoutClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  // Simple markdown-like formatting for bold text (**text**) and newlines (\n)
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\n/g, '<br />'); // Newlines
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
        <p className={`text-xs mt-1 ${isUser ? 'text-purple-200 text-right' : 'text-gray-400 text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        {!isUser && message.suggestedTopics && message.suggestedTopics.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-500 border-opacity-50">
            <p className="text-xs text-gray-300 mb-1">Next, you could explore:</p>
            <div className="flex flex-wrap gap-2">
              {message.suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTopicClick(topic)}
                  className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded-md transition-colors"
                  aria-label={`Explore topic: ${topic}`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};