
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { PolkadotAccount, ClaimedBadgeDetail } from '../types';
import { IconButton } from './IconButton';
import * as Constants from '../constants';

// Helper to format Polkadot address for display
const formatAddressShort = (address: string, headChars = 6, tailChars = 4) => {
  if (!address) return '';
  return `${address.substring(0, headChars)}...${address.substring(address.length - tailChars)}`;
};

const achievementIcons: { [key: string]: string } = {
  [Constants.ACHIEVEMENT_KEYS.INITIATED_LEARNER]: "fas fa-seedling text-green-400",
  [Constants.ACHIEVEMENT_KEYS.BLOCKCHAIN_BASICS_STARTED]: "fas fa-cubes text-blue-400",
  [Constants.ACHIEVEMENT_KEYS.POLKADOT_ADVANCED_STARTED]: "fas fa-project-diagram text-indigo-400",
  [Constants.ACHIEVEMENT_KEYS.CURIOUS_CHATTERBOX]: "fas fa-comments text-yellow-400",
  [Constants.ACHIEVEMENT_KEYS.EXPLORER_GUIDE]: "fas fa-compass text-teal-400",
  [Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER]: "fas fa-user-check text-pink-400",
  [Constants.ACHIEVEMENT_KEYS.SOURCE_SEEKER]: "fas fa-search-location text-orange-400",
  [Constants.ACHIEVEMENT_KEYS.FIRST_TOPIC_CONQUERED]: "fas fa-award text-yellow-500",
  [Constants.ACHIEVEMENT_KEYS.PATH_MASTER]: "fas fa-crown text-purple-500",
  [Constants.ACHIEVEMENT_KEYS.WALLET_CONNECTOR]: "fas fa-wallet text-blue-500",
  [Constants.ACHIEVEMENT_KEYS.PHOTO_FANATIC]: "fas fa-camera-retro text-red-400",
  [Constants.ACHIEVEMENT_KEYS.BADGE_PIONEER]: "fas fa-rocket text-orange-500",
};
const defaultIcon = "fas fa-medal text-gray-400";


interface ClaimBadgeModalProps {
  isOpen: boolean;
  achievementKey: string;
  polkadotAccount: PolkadotAccount | null;
  claimedBadgeDetail?: ClaimedBadgeDetail; // Provided if viewing an already claimed badge
  onClose: () => void;
  onConfirmClaim: (achievementKey: string) => void;
}

export const ClaimBadgeModal: React.FC<ClaimBadgeModalProps> = ({
  isOpen,
  achievementKey,
  polkadotAccount,
  claimedBadgeDetail,
  onClose,
  onConfirmClaim,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("Modal root element 'modal-root' not found for ClaimBadgeModal.");
    return null;
  }

  const isViewingClaimed = !!claimedBadgeDetail;
  const achievementName = t(achievementKey);
  const achievementDescriptionKey = achievementKey.replace('.name', '.description');
  const achievementDescription = t(achievementDescriptionKey, {defaultValue: ''});


  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg modal-content animate-modalFadeInScale text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-300">
            {isViewingClaimed ? t(Constants.CLAIM_MODAL_TITLE_VIEW_KEY) : t(Constants.CLAIM_MODAL_TITLE_CLAIM_KEY)}
          </h2>
          <IconButton
            iconClass="fas fa-times"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label={t('common.close')}
          />
        </div>

        <div className="text-center mb-4">
            <i className={`${achievementIcons[achievementKey] || defaultIcon} text-6xl mb-3`}></i>
            <h3 className="text-2xl font-bold text-purple-200">{achievementName}</h3>
            {achievementDescription && <p className="text-sm text-gray-300 mt-1">{achievementDescription}</p>}
        </div>

        <div className="bg-gray-700 bg-opacity-50 p-4 rounded-md mb-4">
            {isViewingClaimed && claimedBadgeDetail ? (
                <>
                    <p className="text-sm mb-1"><span className="font-semibold text-gray-300">{t(Constants.CLAIM_MODAL_CLAIMED_WITH_WALLET_KEY)}</span></p>
                    <p className="text-xs mb-1"><span className="font-semibold text-gray-400">{t(Constants.CLAIM_MODAL_WALLET_ADDRESS_KEY)} </span> <span className="text-purple-300 break-all">{claimedBadgeDetail.address}</span></p>
                    <p className="text-xs mb-2"><span className="font-semibold text-gray-400">{t(Constants.CLAIM_MODAL_WALLET_SOURCE_KEY)} </span> <span className="text-gray-200 capitalize">{claimedBadgeDetail.source}</span></p>
                    <p className="text-xs"><span className="font-semibold text-gray-400">{t(Constants.CLAIM_MODAL_CLAIM_DATE_KEY)} </span> <span className="text-gray-200">{new Date(claimedBadgeDetail.claimedAt).toLocaleString()}</span></p>
                </>
            ) : polkadotAccount ? (
                <>
                    <p className="text-sm mb-1"><span className="font-semibold text-gray-300">{t(Constants.CLAIM_MODAL_ASSOCIATED_WALLET_KEY)}</span></p>
                    <p className="text-xs mb-1"><span className="font-semibold text-gray-400">{t('profile.walletName')}: </span> <span className="text-gray-200">{polkadotAccount.name || t('profile.walletNameUnnamed')}</span></p>
                    <p className="text-xs mb-1"><span className="font-semibold text-gray-400">{t(Constants.CLAIM_MODAL_WALLET_ADDRESS_KEY)} </span> <span className="text-purple-300 break-all">{formatAddressShort(polkadotAccount.address)}</span></p>
                    <p className="text-xs"><span className="font-semibold text-gray-400">{t(Constants.CLAIM_MODAL_WALLET_SOURCE_KEY)} </span> <span className="text-gray-200 capitalize">{polkadotAccount.source}</span></p>
                </>
            ) : (
                 <p className="text-yellow-400 text-sm">{t(Constants.BADGES_CONNECT_WALLET_PROMPT_KEY)}</p>
            )}
        </div>
        
        {!isViewingClaimed && (
            <p className="text-xs text-gray-400 italic mb-6 text-center">{t(Constants.CLAIM_MODAL_DISCLAIMER_KEY)}</p>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
          >
            {isViewingClaimed ? t(Constants.CLAIM_MODAL_CLOSE_BUTTON_KEY) : t('common.cancel')}
          </button>
          {!isViewingClaimed && polkadotAccount && (
            <button
              onClick={() => onConfirmClaim(achievementKey)}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors"
            >
              <i className="fas fa-award mr-2"></i>{t(Constants.CLAIM_MODAL_CONFIRM_BUTTON_KEY)}
            </button>
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
};
