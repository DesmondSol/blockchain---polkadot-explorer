
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton';

interface BountiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const polkadotMagenta = '#E6007A';

export const BountiesModal: React.FC<BountiesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-900 text-white w-full h-full flex flex-col animate-modalFadeInScale">
        <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-3 md:p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg md:text-xl font-bold" style={{ color: polkadotMagenta }}>
            {t('bountiesModal.title')}
          </h2>
          <IconButton
            iconClass="fas fa-times text-xl md:text-2xl"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label={t('common.close')}
          />
        </header>
        <main className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-purple-300 mb-4">{t('bountiesModal.subtitle')}</h1>
                    <p className="text-lg text-gray-400">{t('bountiesModal.description')}</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                     <a
                        href="https://www.polkadot.africa/hackathons?tab=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4 group transform hover:-translate-y-1 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <i className="fas fa-trophy text-4xl text-yellow-400 w-12 text-center"></i>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                                {t('bountiesModal.cardTitle')}
                            </h3>
                            <p className="text-gray-400 text-sm">
                                {t('bountiesModal.cardDescription')}
                            </p>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-500 group-hover:text-purple-300 transition-colors"></i>
                    </a>
                    {/* Placeholder for more links in the future */}
                </div>
            </div>
        </main>
      </div>
    </div>,
    modalRoot
  );
};
