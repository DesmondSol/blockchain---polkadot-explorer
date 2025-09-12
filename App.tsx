
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom'; 
import { useTranslation } from 'react-i18next';
import { ChatMessage, Sender, MustLearnTopic, PolkadotAccount, ClaimedBadgeDetail, LearningPathName, QuizCompletionStatus, LearningMode, ResourceCardItem } from './types';
import { ChatInterface } from './components/ChatInterface';
import { VisualBackground } from './components/VisualBackground';
import { sendMessageToGeminiChat } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { IconButton } from './components/IconButton';
import { BottomNavigation, ActiveTab } from './components/BottomNavigation';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { SidePanel } from './components/SidePanel';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PolkadotAccountSelectorModal } from './components/PolkadotAccountSelectorModal';
import { NftBadgesScreen } from './components/NftBadgesScreen'; 
import { ClaimBadgeModal } from './components/ClaimBadgeModal'; 
import { ComingSoonModal } from './components/ComingSoonModal';
import { DiagnosticQuizModal } from './components/DiagnosticQuizModal';
import { LearningModeModal } from './components/LearningModeModal';
import { StoryMode } from './components/StoryMode';
import { QuizMode } from './components/QuizMode';
import { CampusLeadModal } from './components/CampusLeadModal';
import { BountiesModal } from './components/BountiesModal';
import { ResourceModal } from './components/ResourceModal'; // Import the new modal
import * as Constants from './constants';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'; 
import { encodeAddress } from '@polkadot/util-crypto';


type AppLearningPath = LearningPathName | null;
type OnboardingStatus = 'pending_intro' | 'intro_skipped' | 'completed';

interface LocalInjectedAccountWithMeta {
  address: string;
  meta: {
    name?: string;
    source: string;
  };
}

// Updated ResourceListItem to be more flexible
interface ResourceListItem {
  id: string;
  iconClass: string;
  translationKey?: string;
  label?: string; // For hardcoded labels
  url?: string; // For direct external links
  content?: ResourceCardItem[]; // For opening the resource modal
}

const campusLeadResource: ResourceListItem = { id: 'campusLead', iconClass: 'fas fa-graduation-cap', label: 'Join Campus Lead' };

const resourceList: ResourceListItem[] = [
  { 
    id: 'games', 
    iconClass: 'fas fa-gamepad', 
    translationKey: 'home.resources.games',
    content: [
      { iconClass: 'fas fa-rocket', titleKey: 'resourcesContent.games.exiledRacers.title', descriptionKey: 'resourcesContent.games.exiledRacers.description', link: 'https://exiledracers.com/' },
      { iconClass: 'fas fa-chess', titleKey: 'resourcesContent.games.ajuna.title', descriptionKey: 'resourcesContent.games.ajuna.description', link: 'https://ajuna.io/' },
      { iconClass: 'fas fa-star', titleKey: 'resourcesContent.games.astar.title', descriptionKey: 'resourcesContent.games.astar.description', link: 'https://astar.network/astar2' },
    ]
  },
  { 
    id: 'wallets', 
    iconClass: 'fas fa-wallet', 
    translationKey: 'home.resources.wallets',
    content: [
      { iconClass: 'fas fa-mobile-alt', titleKey: 'resourcesContent.wallets.nova.title', descriptionKey: 'resourcesContent.wallets.nova.description', link: 'https://novawallet.io/' },
      { iconClass: 'fas fa-magic', titleKey: 'resourcesContent.wallets.talisman.title', descriptionKey: 'resourcesContent.wallets.talisman.description', link: 'https://www.talisman.xyz/' },
      { iconClass: 'fas fa-puzzle-piece', titleKey: 'resourcesContent.wallets.polkadotjs.title', descriptionKey: 'resourcesContent.wallets.polkadotjs.description', link: 'https://polkadot.js.org/extension/' },
      { iconClass: 'fas fa-shield-alt', titleKey: 'resourcesContent.wallets.subwallet.title', descriptionKey: 'resourcesContent.wallets.subwallet.description', link: 'https://subwallet.app/' },
    ]
  },
  { 
    id: 'dapps', 
    iconClass: 'fas fa-th-large', 
    translationKey: 'home.resources.dapps',
    content: [
      { iconClass: 'fas fa-water', titleKey: 'resourcesContent.dapps.hydration.title', descriptionKey: 'resourcesContent.dapps.hydration.description', link: 'https://hydration.net/' },
      { iconClass: 'fas fa-rainbow', titleKey: 'resourcesContent.dapps.bifrost.title', descriptionKey: 'resourcesContent.dapps.bifrost.description', link: 'https://bifrost.finance/' },
      { iconClass: 'fas fa-moon', titleKey: 'resourcesContent.dapps.moonbeam.title', descriptionKey: 'resourcesContent.dapps.moonbeam.description', link: 'https://moonbeam.network/' },
      { iconClass: 'fas fa-route', titleKey: 'resourcesContent.dapps.hyperbridge.title', descriptionKey: 'resourcesContent.dapps.hyperbridge.description', link: 'https://app.hyperbridge.network/' },
    ]
  }, 
  { 
    id: 'gov', 
    iconClass: 'fas fa-landmark', 
    translationKey: 'home.resources.gov',
    content: [
      { iconClass: 'fas fa-comments-dollar', titleKey: 'resourcesContent.gov.polkassembly.title', descriptionKey: 'resourcesContent.gov.polkassembly.description', link: 'https://polkadot.polkassembly.io/' },
      { iconClass: 'fas fa-vote-yea', titleKey: 'resourcesContent.gov.portal.title', descriptionKey: 'resourcesContent.gov.portal.description', link: 'https://polkadot.network/governance/' },
      { iconClass: 'fas fa-archive', titleKey: 'resourcesContent.gov.treasury.title', descriptionKey: 'resourcesContent.gov.treasury.description', link: 'https://polkadot.network/development/treasury/' },
      { iconClass: 'fas fa-lightbulb', titleKey: 'resourcesContent.gov.opengov.title', descriptionKey: 'resourcesContent.gov.opengov.description', link: 'https://wiki.polkadot.network/docs/learn-gov2' },
    ]
  },
  {
    id: 'community',
    iconClass: 'fas fa-users',
    translationKey: 'home.resources.community',
    content: [
      { iconClass: 'fas fa-globe-africa', titleKey: 'resourcesContent.community.polkadotAfrica.title', descriptionKey: 'resourcesContent.community.polkadotAfrica.description', link: 'https://linktr.ee/PolkadotAfrica' },
      { iconClass: 'fab fa-telegram-plane', titleKey: 'resourcesContent.community.polkadotEthiopia.title', descriptionKey: 'resourcesContent.community.polkadotEthiopia.description', link: 'https://t.me/polkadot_et' }
    ]
  },
  { id: 'bounties', iconClass: 'fas fa-trophy', translationKey: 'home.resources.bounties' },
  { id: 'discord', iconClass: 'fab fa-discord', translationKey: 'home.resources.discord', url: 'https://discord.gg/polkadot' },
  { id: 'videos', iconClass: 'fas fa-video', translationKey: 'home.resources.videos' },
  { id: 'socials', iconClass: 'fas fa-users', translationKey: 'home.resources.socials' },
  { id: 'news', iconClass: 'fas fa-newspaper', translationKey: 'home.resources.news' },
  { id: 'market', iconClass: 'fas fa-chart-line', translationKey: 'home.resources.market' },
  { id: 'others', iconClass: 'fas fa-ellipsis-h', translationKey: 'home.resources.others' },
];

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentVisualKeyword, setCurrentVisualKeyword] = useState<string>('blockchain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(true);

  const [learningPath, setLearningPath] = useState<AppLearningPath>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  const [userNickname, setUserNickname] = useState<string>(t('profile.defaultNickname'));
  const [achievements, setAchievements] = useState<string[]>([]);

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

  const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);
  const [comingSoonResourceTitle, setComingSoonResourceTitle] = useState<string>('');
  const [showCampusLeadModal, setShowCampusLeadModal] = useState<boolean>(false);
  const [showBountiesModal, setShowBountiesModal] = useState<boolean>(false);
  
  // New state for the generic Resource Modal
  const [showResourceModal, setShowResourceModal] = useState<boolean>(false);
  const [resourceModalContent, setResourceModalContent] = useState<{ title: string; items: ResourceCardItem[] } | null>(null);

  // Diagnostic Quiz State
  const [showDiagnosticQuizModal, setShowDiagnosticQuizModal] = useState<boolean>(false);
  const [currentQuizPath, setCurrentQuizPath] = useState<LearningPathName | null>(null);
  const [quizCompletionStatus, setQuizCompletionStatus] = useState<QuizCompletionStatus>({});
  
  // Learning Mode State
  const [showLearningModeModal, setShowLearningModeModal] = useState<boolean>(false);
  const [selectedLearningMode, setSelectedLearningMode] = useState<LearningMode | null>(null);
  const [pendingPathForModeSelection, setPendingPathForModeSelection] = useState<LearningPathName | null>(null);
  const [activeStoryOrQuizTopic, setActiveStoryOrQuizTopic] = useState<MustLearnTopic | null>(null);


  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);


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
    const storedQuizCompletion = localStorage.getItem('quizCompletionStatus');
    
    if (storedQuizCompletion) setQuizCompletionStatus(JSON.parse(storedQuizCompletion));

    if (storedOnboardingStatus === 'completed') setOnboardingStep(0);
    else if (storedOnboardingStatus === 'intro_skipped') setOnboardingStep(5);
    else setOnboardingStep(1);

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

  useEffect(() => { localStorage.setItem('userAchievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('userNickname', userNickname); }, [userNickname]);
  useEffect(() => {
    if (profilePictureUrl) localStorage.setItem('userProfilePicture', profilePictureUrl);
    else localStorage.removeItem('userProfilePicture');
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
  useEffect(() => { localStorage.setItem('claimedBadges', JSON.stringify(claimedBadges)); }, [claimedBadges]);
  useEffect(() => { localStorage.setItem('quizCompletionStatus', JSON.stringify(quizCompletionStatus)); }, [quizCompletionStatus]);


  useEffect(() => {
    if (!learningPath && activeTab === 'chat') { // 'chat' tab is now the generic learning area
        setChatMessages([]);
        setCurrentMustLearnTopics([]);
        setCompletedMustLearnTopics({});
        setIsSidePanelOpen(false); 
        setSelectedLearningMode(null); // Reset learning mode
        setActiveStoryOrQuizTopic(null);
    } else if (learningPath) {
        const topics = learningPath === 'blockchainBasics' 
            ? Constants.MUST_LEARN_BLOCKCHAIN_BASICS 
            : Constants.MUST_LEARN_POLKADOT_ADVANCED;
        setCurrentMustLearnTopics(topics as MustLearnTopic[]);

        const storedCompletions = localStorage.getItem(`completedTopics_${learningPath}`);
        if (storedCompletions) setCompletedMustLearnTopics(JSON.parse(storedCompletions));
        else setCompletedMustLearnTopics({});
        
        // If not chat mode, set the first topic for story/quiz mode
        if (selectedLearningMode && selectedLearningMode !== 'chat' && topics.length > 0) {
           setActiveStoryOrQuizTopic(topics[0]);
        }
    }
  }, [learningPath, activeTab, selectedLearningMode]);

  useEffect(() => {
    if (learningPath) localStorage.setItem(`completedTopics_${learningPath}`, JSON.stringify(completedMustLearnTopics));
  }, [completedMustLearnTopics, learningPath]);


  useEffect(() => { if (speechError) setError(t('errors.speechRecognitionError', { message: speechError })); }, [speechError, t]);

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


  const handleSendChatMessage = useCallback(async (
    messageText: string, 
    isAutomatedFirstMessage = false,
    pathToUseOverride?: LearningPathName, // This is AppLearningPath (LearningPathName | null)
    canonicalQueryForCompletion?: string
  ) => {
    const activeLearningPath = pathToUseOverride || learningPath;

    if (!messageText.trim() || !activeLearningPath) {
        console.warn("handleSendChatMessage: No message text or active learning path.");
        return;
    }

    const userMessageQueryTextForCompletion = canonicalQueryForCompletion || messageText; 

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
      const { text: aiResponseText, visualHint, suggestedTopics, groundingChunks } = await sendMessageToGeminiChat(
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

      if (visualHint) setCurrentVisualKeyword(visualHint);
      if (isAutoSpeakEnabled && browserSupportsSpeechSynthesis) speak(aiResponseText, i18n.language);
      markTopicAsCompletedByQuery(userMessageQueryTextForCompletion); 
      
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
      console.error('Error sending message to Gemini Chat:', err);
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
    chatMessages, speak, isAutoSpeakEnabled, browserSupportsSpeechSynthesis, 
    learningPath, achievements, userExpertise, markTopicAsCompletedByQuery,
    t, i18n.language
  ]);

  const toggleAutoSpeak = () => {
    setIsAutoSpeakEnabled(prev => !prev);
    if (isSpeaking) cancelSpeaking();
  };


  const startChatModeForPath = (path: LearningPathName) => {
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
    setChatMessages([initialUserMessage]); // Set initial message
    handleSendChatMessage(firstUserQuery, true, path, undefined); // Send to AI
  };

  const handleSelectPathFromHome = (path: LearningPathName) => {
    if (!quizCompletionStatus[path]) {
      setCurrentQuizPath(path);
      setPendingPathForModeSelection(path); // Store the path for mode selection after quiz
      setShowDiagnosticQuizModal(true);
    } else {
      // If quiz already done, directly show learning mode selector
      setPendingPathForModeSelection(path);
      setShowLearningModeModal(true);
    }
  };
  
  const handleDiagnosticQuizSubmit = (path: LearningPathName, answers: Record<string, string>, score: number) => {
    setQuizCompletionStatus(prev => ({ ...prev, [path]: true }));
    setShowDiagnosticQuizModal(false);
    setCurrentQuizPath(null);

    const achievementKey = path === 'blockchainBasics' 
        ? Constants.ACHIEVEMENT_KEYS.QUIZ_COMPLETER_BASICS 
        : Constants.ACHIEVEMENT_KEYS.QUIZ_COMPLETER_ADVANCED;
    if (!achievements.includes(achievementKey)) setAchievements(prev => [...prev, achievementKey]);
    if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.INITIATED_LEARNER)) setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.INITIATED_LEARNER]);

    // Now show the learning mode modal
    if (pendingPathForModeSelection === path) {
        setShowLearningModeModal(true);
    }
  };

  const handleCloseDiagnosticQuizModal = () => {
    setShowDiagnosticQuizModal(false);
    setCurrentQuizPath(null);
    setPendingPathForModeSelection(null); 
  };


  const handleLearningModeSelect = (mode: LearningMode) => {
    if (!pendingPathForModeSelection) return;

    setSelectedLearningMode(mode);
    setLearningPath(pendingPathForModeSelection); // Set the active learning path
    setActiveTab('chat'); // 'chat' is the main content area tab
    setShowLearningModeModal(false);
    setChatMessages([]); // Clear previous chat messages
    setActiveStoryOrQuizTopic(null); // Reset active topic for story/quiz
    setIsSidePanelOpen(false);


    const currentPathTopics = pendingPathForModeSelection === 'blockchainBasics'
        ? Constants.MUST_LEARN_BLOCKCHAIN_BASICS
        : Constants.MUST_LEARN_POLKADOT_ADVANCED;
    
    if (currentPathTopics.length > 0) {
        setActiveStoryOrQuizTopic(currentPathTopics[0]); // Set first topic for story/quiz modes
    }


    if (mode === 'chat') {
      startChatModeForPath(pendingPathForModeSelection);
    } else if (mode === 'story') {
        if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.STORY_EXPLORER)) {
            setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.STORY_EXPLORER]);
        }
        // StoryMode component will pick up activeStoryOrQuizTopic
    } else if (mode === 'quiz') {
         if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.QUIZ_MASTER)) {
            setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.QUIZ_MASTER]);
        }
        // QuizMode component will pick up activeStoryOrQuizTopic
    }
    
    const achievementKey = pendingPathForModeSelection === 'blockchainBasics'
      ? Constants.ACHIEVEMENT_KEYS.BLOCKCHAIN_BASICS_STARTED
      : Constants.ACHIEVEMENT_KEYS.POLKADOT_ADVANCED_STARTED;
    if (!achievements.includes(achievementKey)) setAchievements(prev => [...prev, achievementKey]);
    
    setPendingPathForModeSelection(null); // Clear the pending path
  };

  const handleCloseLearningModeModal = () => {
    setShowLearningModeModal(false);
    setPendingPathForModeSelection(null);
  };

  const toggleSidePanel = () => setIsSidePanelOpen(prev => !prev);

  const handleTopicSelectionFromSidePanel = (topic: MustLearnTopic) => {
    if (!learningPath) return;
    
    if (selectedLearningMode === 'chat') {
      const translatedTopicTitle = t(topic.titleKey);
      handleSendChatMessage(translatedTopicTitle, false, learningPath, topic.canonicalTitle);
    } else if (selectedLearningMode === 'story' || selectedLearningMode === 'quiz') {
      setActiveStoryOrQuizTopic(topic);
      // Respective components (StoryMode, QuizMode) will use useEffect to react to this prop change.
    }
    if (window.innerWidth < 768) setIsSidePanelOpen(false); // Close panel on mobile after selection
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
      if (extensions.length === 0) { setWalletError(t('profile.noWalletsDetected')); return; }
      const allAccounts = await web3Accounts();
      if (allAccounts.length === 0) { setWalletError(t('profile.noAccountsFound')); return; }

      const formattedAccounts: PolkadotAccount[] = allAccounts.map((acc: LocalInjectedAccountWithMeta) => ({
        address: encodeAddress(acc.address, 0), 
        name: acc.meta.name,
        source: acc.meta.source,
      }));
      
      setAvailablePolkadotAccounts(formattedAccounts);
      if (formattedAccounts.length === 1) { setPolkadotAccount(formattedAccounts[0]); setShowAccountSelector(false); }
      else if (formattedAccounts.length > 1) setShowAccountSelector(true);
      else setWalletError(t('profile.noAccountsFound'));

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
  const handleCloseAccountSelector = () => { setShowAccountSelector(false); setAvailablePolkadotAccounts([]); };
  const handleDisconnectWallet = () => { setPolkadotAccount(null); setWalletError(null); };
  const handleClearWalletError = () => setWalletError(null);

  const handleOpenClaimBadgeModal = (achievementKey: string) => { setSelectedBadgeToClaim(achievementKey); setShowClaimBadgeModal(true); };
  const handleCloseClaimBadgeModal = () => { setShowClaimBadgeModal(false); setSelectedBadgeToClaim(null); };
  const handleConfirmClaimBadge = (achievementKey: string) => {
    if (polkadotAccount) {
      setClaimedBadges(prev => ({ ...prev, [achievementKey]: { achievementKey, address: polkadotAccount.address, source: polkadotAccount.source, claimedAt: Date.now() } }));
      if (!achievements.includes(Constants.ACHIEVEMENT_KEYS.BADGE_PIONEER) && Object.keys(claimedBadges).length === 0) { 
        setAchievements(prevAch => [...prevAch, Constants.ACHIEVEMENT_KEYS.BADGE_PIONEER]);
      }
      handleCloseClaimBadgeModal();
    }
  };

  const handleResourceClick = (resource: ResourceListItem) => {
    const title = resource.label || (resource.translationKey ? t(resource.translationKey) : resource.id);

    if (resource.id === 'campusLead') {
      setShowCampusLeadModal(true);
    } else if (resource.id === 'bounties') {
      setShowBountiesModal(true);
    } else if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else if (resource.content) {
      setResourceModalContent({ title: title, items: resource.content });
      setShowResourceModal(true);
    } else {
      setComingSoonResourceTitle(title);
      setShowComingSoonModal(true);
    }
  };


  const renderContent = () => {
    if (onboardingStep > 0 && onboardingStep <= 5) {
      return <OnboardingFlow currentStep={onboardingStep} onNextStep={handleNextOnboardingStep} onSkipIntro={handleSkipIntroToPersonalization} onPersonalizationSubmit={handlePersonalizationSubmit} onPersonalizationSkip={handlePersonalizationSkip} initialUserExpertise={userExpertise} browserSupportsSpeechRecognition={browserSupportsSpeechRecognition} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center px-4 md:px-8 py-6 md:py-10 text-white text-center">
            <i className="fas fa-project-diagram pt-10 text-5xl md:text-6xl text-purple-400 mb-6"></i>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">{t('home.title')}</h1>
            <p className="mb-8 text-gray-300 max-w-md">{t('onboarding.welcome.subtitle', { appName: t('appTitle') })}</p>
            <div className={`space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row mb-10 md:mb-12 ${isRtl ? 'md:space-x-reverse' : ''}`}>
              <button onClick={() => handleSelectPathFromHome('blockchainBasics')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg">
                <i className={`fas fa-cubes ${isRtl ? 'ml-2' : 'mr-2'}`}></i>{t('home.blockchainBasicsButton')}
              </button>
              <button onClick={() => handleSelectPathFromHome('polkadotAdvanced')} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg">
                <i className={`fas fa-atom ${isRtl ? 'ml-2' : 'mr-2'}`}></i>{t('home.polkadotAdvancedButton')}
              </button>
            </div>
            <div className="w-full max-w-xl px-6 pb-4 lg:max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-purple-300 mb-4 text-center">{t('home.resourcesTitle')}</h2>
              <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-lg">
                <div className="flex flex-col gap-4">
                  <button
                    key={campusLeadResource.id}
                    onClick={() => handleResourceClick(campusLeadResource)}
                    className={`flex items-center justify-center w-full p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 transform hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-purple-400 ${isRtl ? 'flex-row-reverse' : ''}`}
                    aria-label={campusLeadResource.label}
                  >
                    <i className={`${campusLeadResource.iconClass} text-2xl text-white ${isRtl ? 'ml-3' : 'mr-3'} transition-colors`}></i>
                    <span className="text-base font-semibold text-white text-center transition-colors">
                      {campusLeadResource.label}
                    </span>
                  </button>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {resourceList.map(resource => (
                      <button key={resource.id} onClick={() => handleResourceClick(resource)} className="flex flex-col items-center justify-center p-3 bg-gray-700 hover:bg-purple-600 rounded-lg transition-all duration-200 transform hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-purple-400" aria-label={resource.label || (resource.translationKey ? t(resource.translationKey) : resource.id)}>
                        <i className={`${resource.iconClass} text-3xl md:text-4xl text-purple-400 group-hover:text-white mb-2 transition-colors`}></i>
                        <span className="text-xs md:text-sm text-gray-200 group-hover:text-white text-center transition-colors">
                          {resource.label || (resource.translationKey ? t(resource.translationKey) : '')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chat': // This tab now serves as the main learning area
        if (!learningPath || !selectedLearningMode) {
          return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-white text-center">
              <i className="fas fa-route text-5xl text-purple-400 mb-4"></i>
              <h2 className="text-2xl font-semibold mb-2">{t('chat.noPathSelectedTitle')}</h2>
              <p className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: t('chat.noPathSelectedMessage') }}></p>
              <button onClick={() => setActiveTab('home')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">{t('chat.goToHomeButton')}</button>
            </div>
          );
        }
        return (
          <div className="h-full flex flex-col relative"> 
            {selectedLearningMode === 'chat' && (
                <ChatInterface messages={chatMessages} onSendMessage={(msg) => handleSendChatMessage(msg, false, undefined, msg)} isLoading={isLoading} error={error} onClearError={() => setError(null)} transcript={transcript} interimTranscript={interimTranscript} isListening={isListening} micNotSupported={!browserSupportsSpeechRecognition} browserSupportsSpeechRecognition={browserSupportsSpeechRecognition} currentPath={learningPath} onSuggestedTopicClick={(topic) => handleSendChatMessage(topic, false, undefined, topic)} startListening={startListening} stopListening={stopListening} cancelSpeaking={cancelSpeaking} />
            )}
            {selectedLearningMode === 'story' && learningPath && (
                <StoryMode learningPath={learningPath} activeTopic={activeStoryOrQuizTopic} userExpertise={userExpertise} onMarkTopicComplete={markTopicAsCompletedByQuery} />
            )}
            {selectedLearningMode === 'quiz' && learningPath && (
                <QuizMode learningPath={learningPath} activeTopic={activeStoryOrQuizTopic} userExpertise={userExpertise} onMarkTopicComplete={markTopicAsCompletedByQuery} />
            )}
            <div className={`absolute top-2 md:top-4 z-20 flex space-x-2 ${isRtl ? 'left-2 md:left-4 space-x-reverse' : 'right-2 md:right-4'}`}>
                {selectedLearningMode === 'chat' && browserSupportsSpeechSynthesis && (
                   <IconButton iconClass={isAutoSpeakEnabled ? "fas fa-volume-up" : "fas fa-volume-mute"} onClick={toggleAutoSpeak} tooltip={isAutoSpeakEnabled ? t('tooltips.disableAiSpeech') : t('tooltips.enableAiSpeech')} className={`p-2 w-10 h-10 md:w-12 md:h-12 rounded-full text-white transition-colors duration-200 shadow-md ${isAutoSpeakEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`} aria-pressed={isAutoSpeakEnabled}/>
                )}
                <IconButton iconClass="fas fa-list-alt" onClick={toggleSidePanel} tooltip={t('tooltips.openTopics')} className="p-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 shadow-md" />
            </div>
          </div>
        );
      case 'badges': 
        return <NftBadgesScreen achievements={achievements} claimedBadges={claimedBadges} polkadotAccount={polkadotAccount} onClaimBadgeClick={handleOpenClaimBadgeModal} onConnectWalletClick={() => setActiveTab('profile')} />;
      case 'profile':
        return <ProfileScreen nickname={userNickname} onNicknameChange={setUserNickname} achievements={achievements} expertise={userExpertise} onExpertiseChange={handleUserExpertiseChange} profilePictureUrl={profilePictureUrl} onProfilePictureChange={handleProfilePictureChange} polkadotAccount={polkadotAccount} onConnectWallet={handleConnectWallet} onDisconnectWallet={handleDisconnectWallet} walletError={walletError} onClearWalletError={handleClearWalletError} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white overflow-hidden">
       <VisualBackground keyword={currentVisualKeyword} />
      <header className={`absolute top-0 left-0 right-0 p-3 md:p-4 bg-gray-900 bg-opacity-30 backdrop-blur-sm z-20 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
        <h1 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('appTitle')}</h1>
        <div className={`flex items-center ${isRtl ? 'flex-row-reverse space-x-reverse space-x-3 md:space-x-4' : 'space-x-3 md:space-x-4'}`}>
            <LanguageSwitcher />
            {polkadotAccount && (<div className={`flex items-center ${isRtl ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}> {profilePictureUrl && (<img src={profilePictureUrl} alt={t('profile.userProfilePictureAlt')} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-purple-400 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />)} <span className="text-xs md:text-sm text-gray-300 hidden sm:block">{polkadotAccount.name || `${polkadotAccount.address.substring(0,6)}...${polkadotAccount.address.substring(polkadotAccount.address.length - 4)}`}</span></div>)}
        </div>
      </header>

      <main className={`flex-grow overflow-y-auto custom-scrollbar pt-16 pb-16 md:pt-20 md:pb-20 relative z-10`}>
        {renderContent()}
      </main>

      {onboardingStep === 0 && !showDiagnosticQuizModal && !showLearningModeModal && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />}
      
      <PolkadotAccountSelectorModal isOpen={showAccountSelector} accounts={availablePolkadotAccounts} onSelectAccount={handleSelectPolkadotAccount} onClose={handleCloseAccountSelector} />
      
      {showClaimBadgeModal && selectedBadgeToClaim && (<ClaimBadgeModal isOpen={showClaimBadgeModal} achievementKey={selectedBadgeToClaim} polkadotAccount={polkadotAccount} claimedBadgeDetail={claimedBadges[selectedBadgeToClaim]} onClose={handleCloseClaimBadgeModal} onConfirmClaim={handleConfirmClaimBadge} /> )}
      <ComingSoonModal isOpen={showComingSoonModal} resourceName={comingSoonResourceTitle} onClose={() => setShowComingSoonModal(false)} />
      <CampusLeadModal isOpen={showCampusLeadModal} onClose={() => setShowCampusLeadModal(false)} />
      <BountiesModal isOpen={showBountiesModal} onClose={() => setShowBountiesModal(false)} />
      <DiagnosticQuizModal isOpen={showDiagnosticQuizModal} quizPath={currentQuizPath} onClose={handleCloseDiagnosticQuizModal} onSubmitQuiz={handleDiagnosticQuizSubmit} introTextKey="diagnosticQuiz.introductionText" />
      <LearningModeModal isOpen={showLearningModeModal} onSelectMode={handleLearningModeSelect} onClose={handleCloseLearningModeModal} />
      
      {resourceModalContent && (
        <ResourceModal
          isOpen={showResourceModal}
          onClose={() => setShowResourceModal(false)}
          title={resourceModalContent.title}
          items={resourceModalContent.items}
        />
      )}

      {activeTab === 'chat' && learningPath && ( <SidePanel isOpen={isSidePanelOpen} topics={currentMustLearnTopics} completedTopics={completedMustLearnTopics} onSelectTopic={handleTopicSelectionFromSidePanel} onClose={toggleSidePanel} learningPath={learningPath} /> )}
    </div>
  );
};

export default App;
