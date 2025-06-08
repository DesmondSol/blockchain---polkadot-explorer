
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PolkadotAccount, ClaimedBadgeDetail } from '../types';
import * as Constants from '../constants';

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

interface NftBadgesScreenProps {
  achievements: string[]; // Keys of earned achievements
  claimedBadges: { [achievementKey: string]: ClaimedBadgeDetail };
  polkadotAccount: PolkadotAccount | null;
  onClaimBadgeClick: (achievementKey: string) => void;
  onConnectWalletClick: () => void;
}

export const NftBadgesScreen: React.FC<NftBadgesScreenProps> = ({
  achievements,
  claimedBadges,
  polkadotAccount,
  onClaimBadgeClick,
  onConnectWalletClick
}) => {
  const { t } = useTranslation();

  const getAchievementDescription = (key: string): string => {
    // Attempt to get specific description, fallback to name if description isn't found directly under the key
    const descriptionKey = key.replace('.name', '.description');
    const specificDescription = t(descriptionKey);
    // If specific description is same as key (meaning not found), fallback to name.
    if (specificDescription === descriptionKey) {
        return t(key); // Fallback to name if description isn't there
    }
    return specificDescription;
  };


  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-white text-center">
        <i className="fas fa-ghost text-5xl text-gray-500 mb-4"></i>
        <h2 className="text-2xl font-semibold mb-2">{t(Constants.BADGES_NO_ACHIEVEMENTS_KEY)}</h2>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full text-white bg-black bg-opacity-30 backdrop-blur-sm rounded-lg overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6 text-center">{t(Constants.BADGES_SCREEN_TITLE_KEY)}</h2>

        {!polkadotAccount && (
          <div className="mb-6 p-4 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-lg text-center">
            <p className="mb-2">{t(Constants.BADGES_CONNECT_WALLET_PROMPT_KEY)}</p>
            <button
              onClick={onConnectWalletClick}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              {t('profile.connectWalletButton')}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {achievements.map((achievementKey) => {
            const isClaimed = !!claimedBadges[achievementKey];
            const achievementName = t(achievementKey); // e.g., t('achievements.initiatedLearner.name')
            const achievementDescription = getAchievementDescription(achievementKey);

            return (
              <div
                key={achievementKey}
                className={`p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition-all duration-300
                            ${isClaimed ? 'bg-green-700 bg-opacity-30 border border-green-500' : 'bg-gray-700 bg-opacity-50 hover:shadow-purple-400/30'}`}
              >
                <i className={`${achievementIcons[achievementKey] || defaultIcon} text-5xl mb-3`}></i>
                <h3 className="text-lg font-semibold text-purple-200 mb-1">{achievementName}</h3>
                <p className="text-xs text-gray-300 mb-3 h-10 overflow-hidden">
                  {achievementDescription !== achievementName ? achievementDescription : t(achievementKey.replace('.name', '.description'), {defaultValue: ''})}
                </p>

                {polkadotAccount && (
                  isClaimed ? (
                    <button
                      onClick={() => onClaimBadgeClick(achievementKey)}
                      className="mt-auto w-full bg-green-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors cursor-default opacity-80 flex items-center justify-center"
                      disabled // Or make it a view button
                    >
                       <i className="fas fa-check-circle mr-2"></i> {t(Constants.BADGE_CLAIMED_STATUS_KEY)}
                    </button>
                  ) : (
                    <button
                      onClick={() => onClaimBadgeClick(achievementKey)}
                      className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                    >
                      <i className="fas fa-award mr-2"></i> {t(Constants.BADGE_CLAIM_BUTTON_KEY)}
                    </button>
                  )
                )}
                {!polkadotAccount && (
                     <p className="mt-auto text-xs text-yellow-400 py-2">{t('badgesScreen.connectWalletPrompt').split(' ')[0]} {t('badgesScreen.connectWalletPrompt').split(' ')[1]} {t('badgesScreen.connectWalletPrompt').split(' ')[2]} ... </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
