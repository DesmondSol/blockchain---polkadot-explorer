import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingModalProps {
  onSubmit: (expertise: string) => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onSubmit, onSkip }) => {
  const { t } = useTranslation();
  const [expertise, setExpertise] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(expertise);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-lg modal-content transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalFadeInScale">
        <h2 className="text-2xl font-bold text-purple-300 mb-4">{t('onboarding.title')}</h2>
        <p className="text-gray-300 mb-1">
          {t('onboarding.description1')}
        </p>
        <p className="text-gray-400 text-sm mb-6">
          {t('onboarding.description2')}
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder={t('onboarding.textAreaPlaceholder')}
            className="w-full p-3 mb-6 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none h-28 custom-scrollbar"
            aria-label={t('onboarding.textAreaAriaLabel')}
          />
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onSkip}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors w-full sm:w-auto"
              aria-label={t('onboarding.skipButtonAriaLabel')}
            >
              {t('onboarding.skipButton')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors w-full sm:w-auto"
              aria-label={t('onboarding.submitButtonAriaLabel')}
            >
              {t('onboarding.submitButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};