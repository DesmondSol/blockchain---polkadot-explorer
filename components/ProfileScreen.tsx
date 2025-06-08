
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as Constants from '../constants';
import { PolkadotAccount } from '../types';
import { ErrorMessage } from './ErrorMessage'; // For wallet errors

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
};

const defaultIcon = "fas fa-medal text-gray-400";

// Helper to format Polkadot address for display
const formatAddress = (address: string, headChars = 6, tailChars = 4) => {
  if (!address) return '';
  return `${address.substring(0, headChars)}...${address.substring(address.length - tailChars)}`;
};


interface ProfileScreenProps {
  nickname: string;
  onNicknameChange: (newName: string) => void;
  achievements: string[];
  expertise: string;
  onExpertiseChange: (newExpertise: string) => void;
  profilePictureUrl: string | null;
  onProfilePictureChange: (dataUrl: string) => void;
  polkadotAccount: PolkadotAccount | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  walletError: string | null;
  onClearWalletError: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  nickname, onNicknameChange, achievements, expertise, onExpertiseChange,
  profilePictureUrl, onProfilePictureChange,
  polkadotAccount, onConnectWallet, onDisconnectWallet,
  walletError, onClearWalletError
}) => {
  const { t } = useTranslation();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editableNickname, setEditableNickname] = useState(nickname);
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [editableExpertise, setEditableExpertise] = useState(expertise);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditableNickname(nickname);
  }, [nickname]);

  useEffect(() => {
    setEditableExpertise(expertise);
  }, [expertise]);

  const handleNicknameSave = () => {
    onNicknameChange(editableNickname);
    setIsEditingNickname(false);
  };

  const handleExpertiseSave = () => {
    onExpertiseChange(editableExpertise);
    setIsEditingExpertise(false);
  };

  const handleProfilePictureIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onProfilePictureChange(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 md:p-8 h-full text-white bg-black bg-opacity-30 backdrop-blur-sm rounded-lg overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6 text-center">{t('profile.title')}</h2>

        {/* Profile Picture and Nickname Section */}
        <div className="mb-8 p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative group">
            <img
              src={profilePictureUrl || './assets/default-avatar.png'} // Provide a path to a default avatar
              alt={t('profile.userProfilePictureAlt')}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-purple-400 shadow-md"
              onError={(e) => (e.currentTarget.src = './assets/default-avatar.png')} // Fallback if URL is broken
            />
            <button
              onClick={handleProfilePictureIconClick}
              className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label={t('profile.changePictureAriaLabel')}
              title={t('profile.changePictureTooltip')}
            >
              <i className="fas fa-camera"></i>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelected}
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-semibold text-purple-200 mb-1">{t('profile.nicknameTitle')}</h3>
            {isEditingNickname ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editableNickname}
                  onChange={(e) => setEditableNickname(e.target.value)}
                  className="flex-grow p-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  aria-label={t('profile.editNicknameAriaLabel')}
                />
                <button onClick={handleNicknameSave} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm" aria-label={t('profile.saveNicknameButtonAriaLabel')}>
                  <i className="fas fa-save mr-1"></i> {t('common.save')}
                </button>
                <button onClick={() => { setIsEditingNickname(false); setEditableNickname(nickname); }} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm" aria-label={t('profile.cancelEditingNicknameAriaLabel')}>
                  {t('common.cancel')}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start">
                <p className="text-2xl text-gray-100 mr-3">{nickname}</p>
                <button onClick={() => { setEditableNickname(nickname); setIsEditingNickname(true); }} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm" aria-label={t('profile.editNicknameButtonAriaLabel')}>
                  <i className="fas fa-edit mr-1"></i> {t('common.edit')}
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Polkadot Wallet Section */}
        <div className="mb-8 p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">{t('profile.polkadotWalletTitle')}</h3>
          {walletError && <ErrorMessage message={walletError} onClose={onClearWalletError} />}
          {polkadotAccount ? (
            <div>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">{t('profile.walletName')}: </span>
                <span className="text-gray-200">{polkadotAccount.name || t('profile.walletNameUnnamed')}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">{t('profile.walletAddress')}: </span>
                <span className="text-gray-200 break-all">{formatAddress(polkadotAccount.address)}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-gray-300">{t('profile.walletSource')}: </span>
                <span className="text-gray-200 capitalize">{polkadotAccount.source}</span>
              </div>
              <button
                onClick={onDisconnectWallet}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label={t('profile.disconnectWalletButtonAriaLabel')}
              >
                <i className="fas fa-unlink mr-2"></i>{t('profile.disconnectWalletButton')}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 mb-4">{t('profile.connectWalletDescription')}</p>
              <button
                onClick={onConnectWallet}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                aria-label={t('profile.connectWalletButtonAriaLabel')}
              >
                <i className="fas fa-wallet mr-2"></i>{t('profile.connectWalletButton')}
              </button>
            </div>
          )}
        </div>


        {/* Expertise Section */}
        <div className="mb-8 p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">{t('profile.expertiseTitle')}</h3>
           {isEditingExpertise ? (
            <div>
              <textarea
                value={editableExpertise}
                onChange={(e) => setEditableExpertise(e.target.value)}
                className="w-full p-2 mb-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none h-24 custom-scrollbar"
                aria-label={t('profile.editExpertiseAriaLabel')}
                placeholder={t('profile.expertisePlaceholder')}
              />
              <div className="flex items-center space-x-2">
                 <button onClick={handleExpertiseSave} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm" aria-label={t('profile.saveExpertiseButtonAriaLabel')}>
                    <i className="fas fa-save mr-1"></i> {t('profile.saveExpertiseButton')}
                  </button>
                  <button onClick={() => { setIsEditingExpertise(false); setEditableExpertise(expertise); }} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm" aria-label={t('profile.cancelEditingExpertiseAriaLabel')}>
                    {t('common.cancel')}
                  </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-300 italic whitespace-pre-wrap break-words">
                {expertise || t('profile.expertiseNotSpecified')}
              </p>
              <button onClick={() => { setEditableExpertise(expertise); setIsEditingExpertise(true); }} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm ml-2 flex-shrink-0" aria-label={t('profile.editExpertiseButtonAriaLabel')}>
                <i className="fas fa-edit mr-1"></i> {t('common.edit')}
              </button>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">{t('profile.achievementsTitle')}</h3>
          {achievements.length > 0 ? (
            <ul className="space-y-3">
              {achievements.map((achievementKey, index) => (
                <li 
                  key={index} 
                  className="flex items-center p-3 bg-gray-800 bg-opacity-70 rounded-md shadow hover:bg-gray-700 transition-colors"
                >
                  <i className={`${achievementIcons[achievementKey] || defaultIcon} text-2xl mr-3 w-8 text-center`}></i>
                  <span className="text-gray-200">{t(achievementKey)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">{t('profile.noAchievements')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
