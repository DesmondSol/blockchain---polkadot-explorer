import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ResourceCardItem } from '../types';
import { IconButton } from './IconButton';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: ResourceCardItem[];
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ isOpen, onClose, title, items }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-900 text-white w-full h-full flex flex-col animate-modalFadeInScale">
        
        {/* Top Bar with Title and Close Button */}
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg md:text-xl font-bold text-purple-300">
            {title}
          </h2>
          <IconButton
            iconClass="fas fa-times text-xl md:text-2xl"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label={t('common.close')}
          />
        </header>
        
        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {items.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col text-left group transform hover:-translate-y-1 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <div className="flex items-start space-x-4">
                                    <i className={`${item.iconClass} text-4xl text-purple-400 mt-1 w-10 text-center`}></i>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                            {t(item.titleKey)}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {t(item.descriptionKey)}
                                        </p>
                                    </div>
                                    <i className="fas fa-external-link-alt text-gray-500 group-hover:text-purple-300 transition-colors mt-1"></i>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <i className="fas fa-box-open text-4xl mb-4"></i>
                        <p>No items to display for this resource yet.</p>
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>,
    modalRoot
  );
};
