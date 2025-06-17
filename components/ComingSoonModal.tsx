
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton';

interface ComingSoonModalProps {
  isOpen: boolean;
  resourceName: string; 
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, resourceName, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("Modal root element 'modal-root' not found for ComingSoonModal.");
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm modal-content animate-modalFadeInScale text-white text-center">
        <div className="flex justify-end">
             <IconButton 
                iconClass="fas fa-times" 
                onClick={onClose} 
                className="text-gray-400 hover:text-white p-1 -mt-2 -mr-2" 
                aria-label={t('common.close')} 
                tooltip={t('common.close')}
             />
        </div>
        <i className="fas fa-tools text-4xl sm:text-5xl text-yellow-400 mb-4"></i>
        <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-2">
          {resourceName}
        </h3>
        <p className="text-sm sm:text-base text-gray-300 mb-6">{t('home.resources.comingSoonMessage')}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors text-sm sm:text-base"
          aria-label={t('common.okButton')}
        >
          {t('common.okButton')}
        </button>
      </div>
    </div>,
    modalRoot
  );
};
