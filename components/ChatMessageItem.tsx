
import React from 'react';
import { ChatMessage, Sender } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
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

  return (
    <div className={`${layoutClasses} ${message.isInterim ? 'opacity-70' : ''}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 shadow-md ${bubbleClasses}`}>
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatText(message.text) }}></p>
        <p className={`text-xs mt-1 ${isUser ? 'text-purple-200 text-right' : 'text-gray-400 text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
