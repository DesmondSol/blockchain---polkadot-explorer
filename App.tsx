
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage, Sender, MustLearnTopic, PolkadotAccount, ClaimedBadgeDetail } from './types';
import { ChatInterface } from './components/ChatInterface';
import { VisualBackground } from './components/VisualBackground';
import { sendMessageToGemini } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { IconButton } from './components/IconButton';
import { BottomNavigation, ActiveTab } from './components/BottomNavigation';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { SidePanel } from './components/SidePanel';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PolkadotAccountSelectorModal } from './components/PolkadotAccountSelectorModal';
import { NftBadgesScreen } from './components/NftBadgesScreen'; // New
import { ClaimBadgeModal } from './components/ClaimBadgeModal'; // New
import * as Constants from './constants';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'; 
import { encodeAddress } from '@polkadot/util-crypto';


type LearningPath = 'blockchainBasics' | 'polkadotAdvanced' | null;
type OnboardingStatus = 'pending_intro' | 'intro_skipped' | 'completed';

// Local interface to replace InjectedAccountWithMeta if import fails
interface LocalInjectedAccountWithMeta {
  address: string;
  meta: {
    name?: string;
    source: string;
  };
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentVisualKeyword, setCurrentVisualKeyword] = useState<string>('blockchain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(true);

  const [learningPath, setLearningPath] = useState<LearningPath>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  const [userNickname, setUserNickname] = useState<string>(t('profile.defaultNickname'));
  const [achievements, setAchievements] = useState<string[]>([
    Constants.ACHIEVEMENT_KEYS.INITIATED_LEARNER
  ]);

  const [userExpertise, setUserExpertise] = useState<string>('');
  const [onboardingStep, setOnboardingStep] = useState<number>(0); 

  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [currentMustLearnTopics, setCurrentMustLearnTopics] = useState<MustLearnTopic[]>([]);
  const [completedMustLearnTopics, setCompletedMustLearnTopics] = useState<{ [topicId: string]: boolean }>({});

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [polkadotAccount, setPolkadotAccount] = useState<PolkadotAccount | null>(null);
  const [availablePolkadotAccounts, setAvailablePolkadotAccounts] = useState<PolkadotAccount[]>([]);
  const [showAccountSelector, setShowAccountSelector] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const [claimedBadges, setClaimedBadges] = useState<{ [achievementKey: string]: ClaimedBadgeDetail }>({});
  const [showClaimBadgeModal, setShowClaimBadgeModal] = useState<boolean>(false);
  const [selectedBadgeToClaim, setSelectedBadgeToClaim] = useState<string | null>(null);


  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition(i18n.language);

  const { speak, cancelSpeaking, isSpeaking, browserSupportsSpeechSynthesis } = useSpeechSynthesis();

  useEffect(() => {
    const storedOnboardingStatus = localStorage.getItem('onboardingStatus') as OnboardingStatus | null;
    
    if (storedOnboardingStatus === 'completed') {
      setOnboardingStep(0);
    } else if (storedOnboardingStatus === 'intro_skipped') {
      setOnboardingStep(5); 
    } else { 
      setOnboardingStep(1); 
    }

    const storedNickname = localStorage.getItem('userNickname');
    if (storedNickname) setUserNickname(storedNickname);
    else setUserNickname(t('profile.defaultNickname'));

    const storedAchievements = localStorage.getItem('userAchievements');
    if (storedAchievements) setAchievements(JSON.parse(storedAchievements));

    const storedExpertise = localStorage.getItem('userExpertise');
    if (storedExpertise) setUserExpertise(storedExpertise);

    const storedProfilePicture = localStorage.getItem('userProfilePicture');
    if (storedProfilePicture) setProfilePictureUrl(storedProfilePicture);

    const storedPolkadotAccount = localStorage.getItem('polkadotAccount');
    if (storedPolkadotAccount) setPolkadotAccount(JSON.parse(storedPolkadotAccount));
    
    const storedClaimedBadges = localStorage.getItem('claimedBadges');
    if (storedClaimedBadges) setClaimedBadges(JSON.parse(storedClaimedBadges));

  }, [t]);

  useEffect(() => {
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('userNickname', userNickname);
  }, [userNickname]);

  useEffect(() => {
    if (profilePictureUrl) {
      localStorage.setItem('userProfilePicture', profilePictureUrl);
    } else {
      localStorage.removeItem('userProfilePicture');
    }
  }, [profilePictureUrl]);

  useEffect(() => {
    if (polkadotAccount) {
      localStorage.setItem('polkadotAccount', JSON.stringify(polkadotAccount));
       if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.WALLET_CONNECTOR)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.WALLET_CONNECTOR]);
      }
    } else {
      localStorage.removeItem('polkadotAccount');
    }
  }, [polkadotAccount, achievements]);

  useEffect(() => {
    localStorage.setItem('claimedBadges', JSON.stringify(claimedBadges));
  }, [claimedBadges]);


  useEffect(() => {
    if (!learningPath && activeTab === 'chat') {
        setChatMessages([]);
        setCurrentMustLearnTopics([]);
        setCompletedMustLearnTopics({});
        setIsSidePanelOpen(false); 
    } else if (learningPath) {
        const topics = learningPath === 'blockchainBasics' 
            ? Constants.MUST_LEARN_BLOCKCHAIN_BASICS 
            : Constants.MUST_LEARN_POLKADOT_ADVANCED;
        setCurrentMustLearnTopics(topics as MustLearnTopic[]);

        const storedCompletions = localStorage.getItem(`completedTopics_${learningPath}`);
        if (storedCompletions) {
            setCompletedMustLearnTopics(JSON.parse(storedCompletions));
        } else {
            setCompletedMustLearnTopics({});
        }
    }
  }, [learningPath, activeTab]);

  useEffect(() => {
    if (learningPath) {
        localStorage.setItem(`completedTopics_${learningPath}`, JSON.stringify(completedMustLearnTopics));
    }
  }, [completedMustLearnTopics, learningPath]);


  useEffect(() => {
    if (speechError) {
      setError(t('errors.speechRecognitionError', { message: speechError }));
    }
  }, [speechError, t]);

  const handleNextOnboardingStep = () => {
    if (onboardingStep === 4) { 
      localStorage.setItem('onboardingStatus', 'intro_skipped');
      setOnboardingStep(5); 
    } else if (onboardingStep < 5 && onboardingStep > 0) {
      setOnboardingStep(prev => prev + 1);
    }
  };
  
  const handleSkipIntroToPersonalization = () => {
    localStorage.setItem('onboardingStatus', 'intro_skipped');
    setOnboardingStep(5); 
  };
  
  const handlePersonalizationSubmit = (expertise: string) => {
    setUserExpertise(expertise);
    localStorage.setItem('userExpertise', expertise);
    localStorage.setItem('onboardingStatus', 'completed');
    localStorage.setItem('hasCompletedOnboarding', 'true'); 
    setOnboardingStep(0);
    if (expertise.trim() && !achievements.includes(Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER]);
    }
  };
  
  const handlePersonalizationSkip = () => {
    localStorage.setItem('onboardingStatus', 'completed');
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setOnboardingStep(0);
  };

  const handleUserExpertiseChange = (newExpertise: string) => {
    setUserExpertise(newExpertise);
    localStorage.setItem('userExpertise', newExpertise);
    if (newExpertise.trim() && !achievements.includes(Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER)) {
      setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER]);
    }
  };


  const markTopicAsCompletedByQuery = useCallback((queryText: string) => {
    if (!learningPath) return;

    const matchedTopic = currentMustLearnTopics.find(topic => 
        topic.canonicalTitle.trim().toLowerCase() === queryText.trim().toLowerCase()
    );

    if (matchedTopic && !completedMustLearnTopics[matchedTopic.id]) {
        setCompletedMustLearnTopics(prev => {
            const newCompletions = { ...prev, [matchedTopic.id]: true };
            
            if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.FIRST_TOPIC_CONQUERED) && Object.keys(newCompletions).length === 1) {
                setAchievements(prevAch => [...prevAch, Constants.ACHIEVEMENT_KEYS.FIRST_TOPIC_CONQUERED]);
            }

            const allTopicsForCurrentPathCompleted = currentMustLearnTopics.every(topic => newCompletions[topic.id]);
            if (allTopicsForCurrentPathCompleted && !achievements.includes(Constants.ACHIEVEMENT_KEYS.PATH_MASTER)) {
                 setAchievements(prevAch => [...prevAch, Constants.ACHIEVEMENT_KEYS.PATH_MASTER]);
            }
            return newCompletions;
        });
    }
  }, [currentMustLearnTopics, completedMustLearnTopics, learningPath, achievements]);


  const handleSendMessage = useCallback(async (
    messageText: string, 
    isAutomatedFirstMessage = false,
    pathToUseOverride?: LearningPath
  ) => {
    const activeLearningPath = pathToUseOverride || learningPath;

    if (!messageText.trim() || !activeLearningPath) {
        console.warn("handleSendMessage: No message text or active learning path.", { 
            messageText: messageText.trim(), 
            activeLearningPath, 
            learningPathFromState: learningPath,
            pathToUseOverride
        });
        return;
    }

    const userMessageQueryText = messageText; 

    if (!isAutomatedFirstMessage) {
        const newUserMessage: ChatMessage = {
          id: Date.now().toString() + '-user',
          text: messageText,
          sender: Sender.User,
          timestamp: Date.now(),
        };
        setChatMessages(prev => [...prev, newUserMessage]);
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const currentContextMessages = isAutomatedFirstMessage ? [] : chatMessages;
      // Note: Assuming geminiService.ts provided does not have currentLanguage param
      const { text: aiResponseText, visualHint, suggestedTopics, groundingChunks } = await sendMessageToGemini(
        messageText, 
        currentContextMessages, 
        activeLearningPath,
        userExpertise,
        t(Constants.USER_EXPERTISE_NO_EXPERTISE_FALLBACK_KEY)
      );
      
      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText,
        sender: Sender.AI,
        timestamp: Date.now(),
        suggestedTopics: suggestedTopics || [],
        groundingChunks: groundingChunks || [],
      };
      setChatMessages(prev => [...prev, newAiMessage]);

      if (visualHint) {
        setCurrentVisualKeyword(visualHint);
      }
      
      if (isAutoSpeakEnabled && browserSupportsSpeechSynthesis) {
        speak(aiResponseText, i18n.language);
      }
      
      markTopicAsCompletedByQuery(userMessageQueryText);
      
      if (chatMessages.length > 5 && !achievements.includes(Constants.ACHIEVEMENT_KEYS.CURIOUS_CHATTERBOX)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.CURIOUS_CHATTERBOX]);
      }
      if (suggestedTopics && suggestedTopics.length > 0 && !achievements.includes(Constants.ACHIEVEMENT_KEYS.EXPLORER_GUIDE)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.EXPLORER_GUIDE]);
      }
      if (groundingChunks && groundingChunks.length > 0 && !achievements.includes(Constants.ACHIEVEMENT_KEYS.SOURCE_SEEKER)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.SOURCE_SEEKER]);
      }

    } catch (err) {
      console.error('Error sending message to Gemini:', err);
      const errorMessage = (err instanceof Error) ? err.message : t('errors.unknownAiError');
      setError(errorMessage);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        text: t('errors.aiErrorPrefix', { message: errorMessage }),
        sender: Sender.AI,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [
    chatMessages, 
    speak, 
    isAutoSpeakEnabled, 
    browserSupportsSpeechSynthesis, 
    learningPath, 
    achievements, 
    userExpertise, 
    markTopicAsCompletedByQuery,
    t, i18n.language
  ]);

  const toggleAutoSpeak = () => {
    setIsAutoSpeakEnabled(prev => !prev);
    if (isSpeaking) {
      cancelSpeaking();
    }
  };

  const handleSelectPath = (path: 'blockchainBasics' | 'polkadotAdvanced') => {
    setLearningPath(path);
    setChatMessages([]); 
    setIsSidePanelOpen(false); 
    
    const firstUserQueryKey = path === 'blockchainBasics' 
      ? Constants.INITIAL_PROMPT_BASICS_KEY
      : Constants.INITIAL_PROMPT_POLKADOT_KEY;
    const firstUserQuery = t(firstUserQueryKey);
    
    const initialUserMessage: ChatMessage = {
        id: Date.now().toString() + '-init-user',
        text: firstUserQuery,
        sender: Sender.User,
        timestamp: Date.now(),
    };
    setChatMessages([initialUserMessage]); 
    handleSendMessage(firstUserQuery, true, path); 
    setActiveTab('chat'); 

    const achievementKey = path === 'blockchainBasics' 
        ? Constants.ACHIEVEMENT_KEYS.BLOCKCHAIN_BASICS_STARTED
        : Constants.ACHIEVEMENT_KEYS.POLKADOT_ADVANCED_STARTED;
    if (!achievements.includes(achievementKey)) {
        setAchievements(prev => [...prev, achievementKey]);
    }
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(prev => !prev);
  };

  const handleSelectMustLearnTopic = (topic: MustLearnTopic) => {
    handleSendMessage(topic.canonicalTitle, false); 
  };

  const handleProfilePictureChange = (dataUrl: string) => {
    setProfilePictureUrl(dataUrl);
    if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.PHOTO_FANATIC)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.PHOTO_FANATIC]);
    }
  };

  const handleConnectWallet = async () => {
    setWalletError(null);
    try {
      const extensions = await web3Enable(t('appTitle'));
      if (extensions.length === 0) {
        setWalletError(t('profile.noWalletsDetected'));
        return;
      }
      const allAccounts = await web3Accounts();
      if (allAccounts.length === 0) {
        setWalletError(t('profile.noAccountsFound'));
        return;
      }

      const formattedAccounts: PolkadotAccount[] = allAccounts.map((acc: LocalInjectedAccountWithMeta) => ({
        address: encodeAddress(acc.address, 0), // Polkadot mainnet format (SS58 prefix 0)
        name: acc.meta.name,
        source: acc.meta.source,
      }));
      
      setAvailablePolkadotAccounts(formattedAccounts);
      if (formattedAccounts.length === 1) {
        setPolkadotAccount(formattedAccounts[0]);
        setShowAccountSelector(false);
      } else if (formattedAccounts.length > 1) {
        setShowAccountSelector(true);
      } else {
        setWalletError(t('profile.noAccountsFound'));
      }

    } catch (err: any) {
      console.error('Error connecting to wallet:', err);
      if (err.message && (err.message.toLowerCase().includes('cancelled') || err.message.toLowerCase().includes('user rejected'))) {
        setWalletError(t('profile.walletsPermissionDenied'));
      } else {
        setWalletError(t('profile.walletsGenericError') + (err.message ? `: ${err.message}` : ''));
      }
    }
  };

  const handleSelectPolkadotAccount = (account: PolkadotAccount) => {
    setPolkadotAccount(account);
    setShowAccountSelector(false);
    setAvailablePolkadotAccounts([]); 
  };

  const handleCloseAccountSelector = () => {
    setShowAccountSelector(false);
    setAvailablePolkadotAccounts([]); 
  };

  const handleDisconnectWallet = () => {
    setPolkadotAccount(null);
    setWalletError(null);
    // Optionally, clear claimed badges associated with the disconnected wallet
    // For simplicity, this is not implemented here. User needs to be aware.
  };

  const handleClearWalletError = () => {
    setWalletError(null);
  };

  const handleOpenClaimBadgeModal = (achievementKey: string) => {
    setSelectedBadgeToClaim(achievementKey);
    setShowClaimBadgeModal(true);
  };

  const handleCloseClaimBadgeModal = () => {
    setShowClaimBadgeModal(false);
    setSelectedBadgeToClaim(null);
  };

  const handleConfirmClaimBadge = (achievementKey: string) => {
    if (polkadotAccount) {
      setClaimedBadges(prev => ({
        ...prev,
        [achievementKey]: {
          achievementKey,
          address: polkadotAccount.address,
          source: polkadotAccount.source,
          claimedAt: Date.now(),
        }
      }));
      if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.BADGE_PIONEER) && Object.keys(claimedBadges).length === 0) { // Check before this claim
        setAchievements(prevAch => [...prevAch, Constants.ACHIEVEMENT_KEYS.BADGE_PIONEER]);
      }
      handleCloseClaimBadgeModal();
    } else {
      // This should ideally not happen if claim button is disabled when no wallet
      console.error("Attempted to claim badge without a connected wallet.");
      // Optionally show an error to the user
    }
  };


  const renderContent = () => {
    if (onboardingStep > 0 && onboardingStep <= 5) {
      return (
        <OnboardingFlow
          currentStep={onboardingStep}
          onNextStep={handleNextOnboardingStep}
          onSkipIntro={handleSkipIntroToPersonalization}
          onPersonalizationSubmit={handlePersonalizationSubmit}
          onPersonalizationSkip={handlePersonalizationSkip}
          initialUserExpertise={userExpertise}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-white text-center">
            <i className="fas fa-project-diagram text-5xl md:text-6xl text-purple-400 mb-6"></i>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">{t('home.title')}</h1>
            <p className="mb-8 text-gray-300 max-w-md">{t('onboarding.welcome.subtitle', { appName: t('appTitle') })}</p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              <button
                onClick={() => handleSelectPath('blockchainBasics')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg"
              >
                <i className="fas fa-cubes mr-2"></i>{t('home.blockchainBasicsButton')}
              </button>
              <button
                onClick={() => handleSelectPath('polkadotAdvanced')}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg"
              >
                <i className="fas fa-atom mr-2"></i>{t('home.polkadotAdvancedButton')}
              </button>
            </div>
          </div>
        );
      case 'chat':
        if (!learningPath) {
          return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-white text-center">
              <i className="fas fa-comments text-5xl text-purple-400 mb-4"></i>
              <h2 className="text-2xl font-semibold mb-2">{t('chat.noPathSelectedTitle')}</h2>
              <p className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: t('chat.noPathSelectedMessage') }}></p>
              <button
                onClick={() => setActiveTab('home')}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                {t('chat.goToHomeButton')}
              </button>
            </div>
          );
        }
        return (
          <div className="h-full flex flex-col relative"> {/* Added relative for side panel absolute positioning context */}
            <ChatInterface
              messages={chatMessages}
              onSendMessage={(msg) => handleSendMessage(msg, false)}
              isLoading={isLoading}
              error={error}
              onClearError={() => setError(null)}
              transcript={transcript}
              interimTranscript={interimTranscript}
              isListening={isListening}
              micNotSupported={!browserSupportsSpeechRecognition}
              currentPath={learningPath}
              onSuggestedTopicClick={(topic) => handleSendMessage(topic, false)}
            />
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex space-x-2">
                {browserSupportsSpeechRecognition && (
                   <IconButton
                      iconClass={isListening ? "fas fa-microphone-slash" : "fas fa-microphone"}
                      onClick={isListening ? stopListening : startListening}
                      tooltip={isListening ? t('tooltips.stopListening') : t('tooltips.startListening')}
                      className={`p-2 w-10 h-10 md:w-12 md:h-12 rounded-full text-white transition-colors duration-200 shadow-md ${
                        isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      aria-pressed={isListening}
                    />
                )}
                {browserSupportsSpeechSynthesis && (
                   <IconButton
                      iconClass={isAutoSpeakEnabled ? "fas fa-volume-up" : "fas fa-volume-mute"}
                      onClick={toggleAutoSpeak}
                      tooltip={isAutoSpeakEnabled ? t('tooltips.disableAiSpeech') : t('tooltips.enableAiSpeech')}
                      className={`p-2 w-10 h-10 md:w-12 md:h-12 rounded-full text-white transition-colors duration-200 shadow-md ${
                        isAutoSpeakEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                      }`}
                      aria-pressed={isAutoSpeakEnabled}
                    />
                )}
                <IconButton
                    iconClass="fas fa-list-alt"
                    onClick={toggleSidePanel}
                    tooltip={t('tooltips.openTopics')}
                    className="p-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 shadow-md"
                 />
            </div>
          </div>
        );
      case 'badges': // New case for badges screen
        return <NftBadgesScreen
                  achievements={achievements}
                  claimedBadges={claimedBadges}
                  polkadotAccount={polkadotAccount}
                  onClaimBadgeClick={handleOpenClaimBadgeModal}
                  onConnectWalletClick={() => setActiveTab('profile')}
                />;
      case 'profile':
        return <ProfileScreen 
                  nickname={userNickname} 
                  onNicknameChange={setUserNickname} 
                  achievements={achievements}
                  expertise={userExpertise}
                  onExpertiseChange={handleUserExpertiseChange}
                  profilePictureUrl={profilePictureUrl}
                  onProfilePictureChange={handleProfilePictureChange}
                  polkadotAccount={polkadotAccount}
                  onConnectWallet={handleConnectWallet}
                  onDisconnectWallet={handleDisconnectWallet}
                  walletError={walletError}
                  onClearWalletError={handleClearWalletError}
               />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white overflow-hidden">
       <VisualBackground keyword={currentVisualKeyword} />
      <header className="absolute top-0 left-0 right-0 p-3 md:p-4 bg-gray-900 bg-opacity-30 backdrop-blur-sm z-20 flex justify-between items-center">
        <div className="flex items-center">
            {profilePictureUrl && polkadotAccount && (
                 <img 
                    src={profilePictureUrl} 
                    alt={t('profile.userProfilePictureAlt')} 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-2 border-2 border-purple-400 object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')} 
                 />
            )}
            {polkadotAccount && (
                <span className="text-xs md:text-sm text-gray-300 mr-2 hidden sm:block">
                    {polkadotAccount.name || `${polkadotAccount.address.substring(0,6)}...`}
                </span>
            )}
            <h1 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
               {t('appTitle')}
            </h1>
        </div>
        <LanguageSwitcher />
      </header>

      <main className={`flex-grow overflow-y-auto custom-scrollbar pt-16 pb-16 md:pt-20 md:pb-20 relative z-10`}> {/* Added relative for correct z-index stacking */}
        {renderContent()}
      </main>

      {onboardingStep === 0 && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />}
      
      <PolkadotAccountSelectorModal
        isOpen={showAccountSelector}
        accounts={availablePolkadotAccounts}
        onSelectAccount={handleSelectPolkadotAccount}
        onClose={handleCloseAccountSelector}
      />
      
      {showClaimBadgeModal && selectedBadgeToClaim && (
        <ClaimBadgeModal
          isOpen={showClaimBadgeModal}
          achievementKey={selectedBadgeToClaim}
          polkadotAccount={polkadotAccount}
          claimedBadgeDetail={claimedBadges[selectedBadgeToClaim]}
          onClose={handleCloseClaimBadgeModal}
          onConfirmClaim={handleConfirmClaimBadge}
        />
      )}

      {activeTab === 'chat' && learningPath && (
        <SidePanel 
          isOpen={isSidePanelOpen} 
          topics={currentMustLearnTopics}
          completedTopics={completedMustLearnTopics}
          onSelectTopic={handleSelectMustLearnTopic}
          onClose={toggleSidePanel}
          learningPath={learningPath}
        />
      )}
    </div>
  );
};

export default App;
