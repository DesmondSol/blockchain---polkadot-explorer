
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { PolkadotAccount } from '../types';
import { IconButton } from './IconButton';

interface PolkadotAccountSelectorModalProps {
  isOpen: boolean;
  accounts: PolkadotAccount[];
  onSelectAccount: (account: PolkadotAccount) => void;
  onClose: () => void;
}

// Helper to format Polkadot address for display
const formatAddress = (address: string, headChars = 8, tailChars = 8) => {
  if (!address) return '';
  return `${address.substring(0, headChars)}...${address.substring(address.length - tailChars)}`;
};

export const PolkadotAccountSelectorModal: React.FC<PolkadotAccountSelectorModalProps> = ({
  isOpen,
  accounts,
  onSelectAccount,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("Modal root element not found");
    return null; // Or handle this error more gracefully
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md modal-content animate-modalFadeInScale">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-300">{t('profile.selectAccountTitle')}</h2>
          <IconButton
            iconClass="fas fa-times"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label={t('common.cancel')}
          />
        </div>
        {accounts.length === 0 ? (
          <p className="text-gray-300">{t('profile.noAccountsFoundInExtension')}</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {accounts.map((account) => (
              <li key={account.address}>
                <button
                  onClick={() => onSelectAccount(account)}
                  className="w-full text-left p-3 rounded-md bg-gray-700 hover:bg-purple-600 transition-colors group"
                >
                  <div className="font-semibold text-purple-200 group-hover:text-white">
                    {account.name || t('profile.walletNameUnnamed')}
                  </div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-200">
                    {formatAddress(account.address)}
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-300 capitalize">
                    {t('profile.walletSourceLabel')}: {account.source}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 text-center">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
            >
                {t('common.cancel')}
            </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};
