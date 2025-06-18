import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { LearningMode } from '../types';
import * as Constants from '../constants';
import { IconButton } from './IconButton';

interface LearningModeModalProps {
  isOpen: boolean;
  onSelectMode: (mode: LearningMode) => void;
  onClose: () => void;
}

export const LearningModeModal: React.FC<LearningModeModalProps> = ({ isOpen, onSelectMode, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("Modal root element 'modal-root' not found for LearningModeModal.");
    return null;
  }

  const modes = [
    { 
        mode: 'chat' as LearningMode, 
        titleKey: Constants.LEARNING_MODE_CHAT_BUTTON_KEY, 
        descriptionKey: Constants.LEARNING_MODE_CHAT_DESCRIPTION_KEY,
        icon: 'fas fa-comments' 
    },
    { 
        mode: 'story' as LearningMode, 
        titleKey: Constants.LEARNING_MODE_STORY_BUTTON_KEY,
        descriptionKey: Constants.LEARNING_MODE_STORY_DESCRIPTION_KEY,
        icon: 'fas fa-book-open'
    },
    { 
        mode: 'quiz' as LearningMode, 
        titleKey: Constants.LEARNING_MODE_QUIZ_BUTTON_KEY,
        descriptionKey: Constants.LEARNING_MODE_QUIZ_DESCRIPTION_KEY,
        icon: 'fas fa-question-circle'
    },
  ];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg lg:max-w-xl modal-content animate-modalFadeInScale text-white">
        <div className={`flex justify-between items-center mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-xl md:text-2xl font-semibold text-purple-300">
            {t(Constants.LEARNING_MODE_MODAL_TITLE_KEY)}
          </h2>
          <IconButton
            iconClass="fas fa-times"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label={t('common.close')}
            tooltip={t('common.close')}
          />
        </div>

        <div className="space-y-4">
          {modes.map(({ mode, titleKey, descriptionKey, icon }) => (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)}
              className={`w-full p-4 rounded-lg transition-all duration-200 border-2 flex items-center space-x-4 hover:shadow-lg
                            bg-gray-700 hover:bg-purple-600 border-gray-600 hover:border-purple-500 text-gray-200 hover:text-white
                            focus:outline-none focus:ring-2 focus:ring-purple-400 ${isRtl ? 'flex-row-reverse space-x-reverse text-right' : 'text-left'}`}
            >
              <i className={`${icon} text-3xl text-purple-400 group-hover:text-white transition-colors w-10 text-center`}></i>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{t(titleKey)}</h3>
                <p className="text-sm text-gray-300">{t(descriptionKey)}</p>
              </div>
               <i className={`fas ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'} text-xl text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto`}></i>
            </button>
          ))}
        </div>
      </div>
    </div>,
    modalRoot
  );
};
