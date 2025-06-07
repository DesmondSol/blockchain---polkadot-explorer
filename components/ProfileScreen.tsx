import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Constants from '../constants'; // To access ACHIEVEMENT_KEYS

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
};

const defaultIcon = "fas fa-medal text-gray-400";

interface ProfileScreenProps {
  nickname: string;
  onNicknameChange: (newName: string) => void;
  achievements: string[]; // Stores achievement keys
  expertise: string;
  onExpertiseChange: (newExpertise: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ nickname, onNicknameChange, achievements, expertise, onExpertiseChange }) => {
  const { t } = useTranslation();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editableNickname, setEditableNickname] = useState(nickname);
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [editableExpertise, setEditableExpertise] = useState(expertise);

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


  return (
    <div className="p-4 md:p-8 h-full text-white bg-black bg-opacity-30 backdrop-blur-sm rounded-lg overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6 text-center">{t('profile.title')}</h2>

        {/* Nickname Section */}
        <div className="mb-8 p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">{t('profile.nicknameTitle')}</h3>
          {isEditingNickname ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editableNickname}
                onChange={(e) => setEditableNickname(e.target.value)}
                className="flex-grow p-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                aria-label={t('profile.editNicknameAriaLabel')}
              />
              <button
                onClick={handleNicknameSave}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                aria-label={t('profile.saveNicknameButtonAriaLabel')}
              >
                <i className="fas fa-save mr-1"></i> {t('common.save')}
              </button>
              <button
                onClick={() => {
                  setIsEditingNickname(false);
                  setEditableNickname(nickname);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                aria-label={t('profile.cancelEditingNicknameAriaLabel')}
              >
                {t('common.cancel')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-200">{nickname}</p>
              <button
                onClick={() => {
                  setEditableNickname(nickname);
                  setIsEditingNickname(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
                aria-label={t('profile.editNicknameButtonAriaLabel')}
              >
                <i className="fas fa-edit mr-1"></i> {t('common.edit')}
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
                 <button
                    onClick={handleExpertiseSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                    aria-label={t('profile.saveExpertiseButtonAriaLabel')}
                  >
                    <i className="fas fa-save mr-1"></i> {t('profile.saveExpertiseButton')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingExpertise(false);
                      setEditableExpertise(expertise);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                    aria-label={t('profile.cancelEditingExpertiseAriaLabel')}
                  >
                    {t('common.cancel')}
                  </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-300 italic whitespace-pre-wrap break-words">
                {expertise || t('profile.expertiseNotSpecified')}
              </p>
              <button
                onClick={() => {
                  setEditableExpertise(expertise);
                  setIsEditingExpertise(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm ml-2 flex-shrink-0"
                aria-label={t('profile.editExpertiseButtonAriaLabel')}
              >
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
                  <span className="text-gray-200">{t(achievementKey)}</span> {/* Translate achievement name */}
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