
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton'; // Re-import if used for close button, not used currently

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const supportedLanguagesForOnboarding: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

interface OnboardingFlowProps {
  currentStep: number;
  onNextStep: () => void;
  onSkipIntro: () => void;
  onPersonalizationSubmit: (expertise: string) => void;
  onPersonalizationSkip: () => void;
  initialUserExpertise: string;
  browserSupportsSpeechRecognition: boolean;
}

const OnboardingStepIndicator: React.FC<{ stepCount: number; currentStep: number }> = ({ stepCount, currentStep }) => {
  return (
    <div className="flex justify-center space-x-2 my-4">
      {Array.from({ length: stepCount }).map((_, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            index + 1 === currentStep ? 'bg-purple-500 scale-125' : 'bg-gray-500'
          }`}
        ></div>
      ))}
    </div>
  );
};


export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  currentStep,
  onNextStep,
  onSkipIntro,
  onPersonalizationSubmit,
  onPersonalizationSkip,
  initialUserExpertise,
  browserSupportsSpeechRecognition,
}) => {
  const { t, i18n } = useTranslation();
  const [expertise, setExpertise] = useState(initialUserExpertise);

  const handlePersonalizationFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPersonalizationSubmit(expertise);
  };

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Welcome
        return (
          <div className="text-center">
            <i className="fas fa-chalkboard-teacher text-6xl text-purple-400 mb-6"></i>
            <h2 className="text-3xl font-bold text-purple-300 mb-3">{t('onboarding.welcome.title')}</h2>
            <p className="text-lg text-gray-300 mb-8">{t('onboarding.welcome.subtitle', { appName: t('appTitle') })}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onSkipIntro}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-lg"
              >
                {t('onboarding.skipIntroButton')}
              </button>
              <button
                onClick={onNextStep}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                {t('onboarding.nextButton')} <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        );
      case 2: // Interactive Learning
        return (
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <i className="fas fa-comments text-6xl text-blue-400"></i>
              <i className="fas fa-plus text-3xl text-gray-500"></i>
              <i className="fas fa-lightbulb text-6xl text-yellow-400"></i>
            </div>
            <h2 className="text-3xl font-bold text-purple-300 mb-3">{t('onboarding.interactive.title')}</h2>
            <p className="text-lg text-gray-300 mb-2">{t('onboarding.interactive.line1')}</p>
            <p className="text-lg text-gray-300 mb-8">{t('onboarding.interactive.line2')}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onSkipIntro}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-lg"
              >
                {t('onboarding.skipIntroButton')}
              </button>
              <button
                onClick={onNextStep}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                {t('onboarding.nextButton')} <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        );
      case 3: // AI Features
        return (
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <i className="fas fa-robot text-6xl text-teal-400"></i>
              {browserSupportsSpeechRecognition && (
                <>
                  <i className="fas fa-plus text-3xl text-gray-500"></i>
                  <i className="fas fa-microphone-alt text-6xl text-red-400"></i>
                </>
              )}
            </div>
            <h2 className="text-3xl font-bold text-purple-300 mb-3">{t('onboarding.aiFeatures.title')}</h2>
            <p className="text-lg text-gray-300 mb-2">{t('onboarding.aiFeatures.line1')}</p>
            {browserSupportsSpeechRecognition && <p className="text-lg text-gray-300 mb-2">{t('onboarding.aiFeatures.line2')}</p>}
            {!browserSupportsSpeechRecognition && <p className="text-sm text-yellow-400 mb-2">{t('onboarding.aiFeatures.voiceNoteNoSupport')}</p>}
             <p className="text-gray-400 text-sm mb-8">{t('onboarding.aiFeatures.note')}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onSkipIntro}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-lg"
              >
                {t('onboarding.skipIntroButton')}
              </button>
              <button
                onClick={onNextStep}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                {t('onboarding.nextButton')} <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        );
      case 4: // Language Selection
        return (
          <div className="text-center">
            <i className="fas fa-globe-americas text-6xl text-green-400 mb-6"></i>
            <h2 className="text-3xl font-bold text-purple-300 mb-6">{t('onboarding.language.title')}</h2>
            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2 mb-8 max-w-md mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supportedLanguagesForOnboarding.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-4 py-3 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2
                      ${i18n.language === lang.code ? 'bg-purple-600 text-white ring-2 ring-purple-300' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onNextStep}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {t('onboarding.getStartedButton')} <i className="fas fa-check ml-2"></i>
            </button>
          </div>
        );
      case 5: // Personalize Learning (Old OnboardingModal content)
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-4">{t('onboarding.personalize.title')}</h2>
            <p className="text-gray-300 mb-1">
              {t('onboarding.personalize.description1')}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {t('onboarding.personalize.description2')}
            </p>
            <form onSubmit={handlePersonalizationFormSubmit}>
              <textarea
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder={t('onboarding.personalize.textAreaPlaceholder')}
                className="w-full p-3 mb-6 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none h-28 custom-scrollbar"
                aria-label={t('onboarding.personalize.textAreaAriaLabel')}
              />
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={onPersonalizationSkip}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors w-full sm:w-auto text-lg"
                  aria-label={t('onboarding.personalize.skipButtonAriaLabel')}
                >
                  {t('onboarding.personalize.skipButton')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors w-full sm:w-auto text-lg"
                  aria-label={t('onboarding.personalize.submitButtonAriaLabel')}
                >
                  {t('onboarding.personalize.submitButton')}
                </button>
              </div>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-lg lg:max-w-xl modal-content animate-modalFadeInScale">
        {renderStepContent()}
        {currentStep > 0 && currentStep < 5 && (
            <OnboardingStepIndicator stepCount={4} currentStep={currentStep} />
        )}
      </div>
    </div>
  );
};
