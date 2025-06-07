
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MustLearnTopic } from '../types';
import { IconButton } from './IconButton';

interface SidePanelProps {
  isOpen: boolean;
  topics: MustLearnTopic[];
  completedTopics: { [topicId: string]: boolean };
  onSelectTopic: (topic: MustLearnTopic) => void;
  onClose: () => void;
  learningPath: 'blockchainBasics' | 'polkadotAdvanced';
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  topics,
  completedTopics,
  onSelectTopic,
  onClose,
  learningPath
}) => {
  const { t } = useTranslation();
  const pathTitleKey = learningPath === 'blockchainBasics' 
    ? "sidePanel.titleBlockchainBasics" 
    : "sidePanel.titlePolkadotAdvanced";

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-xl z-40 transition-transform duration-300 ease-in-out
                  w-64 md:w-72 flex flex-col
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-purple-300">{t(pathTitleKey)}</h3>
        <IconButton
          iconClass="fas fa-times"
          onClick={onClose}
          tooltip={t('tooltips.closeTopicsPanel')}
          className="text-gray-300 hover:text-white p-1"
        />
      </div>

      {topics.length === 0 ? (
         <div className="p-4 text-center text-gray-400">
            <p>{t('sidePanel.noTopics')}</p>
         </div>
      ) : (
        <ul className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {topics.map((topic) => {
            const isCompleted = completedTopics[topic.id] === true;
            const displayTitle = t(topic.titleKey);
            const displayDescription = topic.descriptionKey ? t(topic.descriptionKey) : undefined;
            return (
              <li key={topic.id}>
                <button
                  onClick={() => onSelectTopic(topic)}
                  className={`w-full text-left p-3 rounded-md transition-all duration-200 ease-in-out flex items-center justify-between group
                              ${isCompleted 
                                ? 'bg-green-700 hover:bg-green-600 text-green-100 line-through opacity-80' 
                                : 'bg-gray-700 hover:bg-purple-600 text-gray-200 hover:text-white focus:bg-purple-600 focus:text-white'
                              }
                              focus:outline-none focus:ring-2 focus:ring-purple-400`}
                  aria-label={`${isCompleted ? t('sidePanel.completedAriaPrefix') : ''}${displayTitle}. ${t('sidePanel.clickToLearnMoreAriaSuffix')}`}
                >
                  <span className="flex-grow">{displayTitle}</span>
                  {isCompleted && <i className="fas fa-check-circle text-green-300 ml-2 flex-shrink-0"></i>}
                  {!isCompleted && <i className="fas fa-arrow-right text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                                    style={{ transitionDelay: '50ms' }}></i>}
                </button>
                {displayDescription && (
                   <p className={`text-xs mt-1 px-3 ${isCompleted ? 'text-green-300' : 'text-gray-400'}`}>
                     {displayDescription}
                   </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div className="p-3 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">{t('sidePanel.footerHint')}</p>
      </div>
    </div>
  );
};