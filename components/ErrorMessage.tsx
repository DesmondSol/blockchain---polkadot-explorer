
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500 text-white p-3 rounded-md shadow-lg mb-4 flex justify-between items-center">
      <span><i className="fas fa-exclamation-triangle mr-2"></i>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-red-100 hover:text-white">
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};
