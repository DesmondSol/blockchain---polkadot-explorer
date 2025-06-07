
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage, Sender, MustLearnTopic } from './types';
import { ChatInterface } from './components/ChatInterface';
import { VisualBackground } from './components/VisualBackground';
import { sendMessageToGemini } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { IconButton } from './components/IconButton';
import { BottomNavigation, ActiveTab } from './components/BottomNavigation';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { SidePanel } from './components/SidePanel';
import { LanguageSwitcher } from './components/LanguageSwitcher'; // New component
import * as Constants from './constants';

type LearningPath = 'blockchainBasics' | 'polkadotAdvanced' | null;

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

  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [userExpertise, setUserExpertise] = useState<string>('');

  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [currentMustLearnTopics, setCurrentMustLearnTopics] = useState<MustLearnTopic[]>([]);
  const [completedMustLearnTopics, setCompletedMustLearnTopics] = useState<{ [topicId: string]: boolean }>({});


  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition(i18n.language); // Pass language to speech recognition

  const { speak, cancelSpeaking, isSpeaking, browserSupportsSpeechSynthesis } = useSpeechSynthesis();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      setShowOnboardingModal(true);
    }
    const storedNickname = localStorage.getItem('userNickname');
    if (storedNickname) setUserNickname(storedNickname);
    else setUserNickname(t('profile.defaultNickname'));


    const storedAchievements = localStorage.getItem('userAchievements');
    if (storedAchievements) setAchievements(JSON.parse(storedAchievements));

    const storedExpertise = localStorage.getItem('userExpertise');
    if (storedExpertise) setUserExpertise(storedExpertise);

  }, [t]); // Add t to dependencies if defaultNickname relies on it

  useEffect(() => {
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('userNickname', userNickname);
  }, [userNickname]);


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
        setCurrentMustLearnTopics(topics as MustLearnTopic[]); // Cast as MustLearnTopic

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

  const handleOnboardingSubmit = (expertise: string) => {
    setUserExpertise(expertise);
    localStorage.setItem('userExpertise', expertise);
    setShowOnboardingModal(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    if (expertise.trim() && !achievements.includes(Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER)) {
        setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER]);
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboardingModal(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
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
      const { text: aiResponseText, visualHint, suggestedTopics, groundingChunks } = await sendMessageToGemini(
        messageText, 
        currentContextMessages, 
        activeLearningPath,
        userExpertise,
        t(Constants.USER_EXPERTISE_NO_EXPERTISE_FALLBACK_KEY) // Pass translated "None provided"
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
        speak(aiResponseText, i18n.language); // Pass current language to speech synthesis
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


  const pathwayButtonClasses = "bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 md:px-8 rounded-lg text-base md:text-lg font-semibold transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 flex items-center justify-center";

  const renderContent = () => {
    if (showOnboardingModal) return null; 

    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-xl lg:max-w-2xl">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-purple-200 drop-shadow-lg">{t('home.title')}</h2>
                <div className="space-y-4 md:space-y-0 md:space-x-6 flex flex-col md:flex-row justify-center mb-10 md:mb-16">
                  <button onClick={() => handleSelectPath('blockchainBasics')} className={pathwayButtonClasses}>
                    <i className="fas fa-cubes mr-2"></i><span>{t('home.blockchainBasicsButton')}</span>
                  </button>
                  <button onClick={() => handleSelectPath('polkadotAdvanced')} className={pathwayButtonClasses}>
                    <i className="fas fa-project-diagram mr-2"></i><span>{t('home.polkadotAdvancedButton')}</span>
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-6 md:pt-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-purple-300 drop-shadow-lg">
                  {t('home.resourcesTitle')}
                </h3>
                <div className="space-y-4 max-w-md mx-auto">
                  <button 
                    onClick={() => window.open('https://ethereum.org/developers/docs/', '_blank')} 
                    className={`${pathwayButtonClasses} w-full`}
                  >
                    <i className="fas fa-book-open mr-2"></i>
                    <span>{t('home.blockchainDeepDiveButton')}</span>
                  </button>
                  <button 
                    onClick={() => window.open('https://polkadot.network/ecosystem/projects/', '_blank')} 
                    className={`${pathwayButtonClasses} w-full`}
                  >
                    <i className="fas fa-link mr-2"></i>
                    <span>{t('home.polkadotEcosystemButton')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chat':
        if (!learningPath) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="bg-black bg-opacity-60 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md">
                <i className="fas fa-info-circle text-purple-400 text-4xl mb-4"></i>
                <h2 className="text-2xl font-semibold mb-3 text-purple-200">{t('chat.noPathSelectedTitle')}</h2>
                <p className="text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: t('chat.noPathSelectedMessage') }}></p>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {t('chat.goToHomeButton')}
                </button>
              </div>
            </div>
          );
        }
        return (
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
            onSuggestedTopicClick={(topicText) => {
                handleSendMessage(topicText, false);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            nickname={userNickname}
            onNicknameChange={setUserNickname}
            achievements={achievements}
            expertise={userExpertise}
            onExpertiseChange={(newExpertise) => {
                setUserExpertise(newExpertise);
                localStorage.setItem('userExpertise', newExpertise);
                 if (newExpertise.trim() && !achievements.includes(Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER)) {
                    setAchievements(prev => [...prev, Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER]);
                } else if (!newExpertise.trim() && achievements.includes(Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER)) {
                    setAchievements(prev => prev.filter(ach => ach !== Constants.ACHIEVEMENT_KEYS.PERSONALIZED_LEARNER));
                }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-white bg-gray-900 flex flex-col">
      <VisualBackground keyword={currentVisualKeyword} />
      
      {showOnboardingModal && (
        <OnboardingModal 
          onSubmit={handleOnboardingSubmit}
          onSkip={handleOnboardingSkip}
        />
      )}

      {!showOnboardingModal && (
        <>
          {learningPath && activeTab === 'chat' && (
            <SidePanel
              isOpen={isSidePanelOpen}
              topics={currentMustLearnTopics}
              completedTopics={completedMustLearnTopics}
              onSelectTopic={handleSelectMustLearnTopic}
              onClose={toggleSidePanel}
              learningPath={learningPath}
            />
          )}

          <header className="fixed top-0 left-0 right-0 z-30 p-3 md:p-4 bg-gray-900 bg-opacity-80 backdrop-blur-lg flex justify-between items-center shadow-md h-16 md:h-20">
            <div className="flex items-center">
              <h1 className="text-lg md:text-xl font-bold text-purple-300 drop-shadow-md">
                {t('appTitle')}
              </h1>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <LanguageSwitcher />
              {browserSupportsSpeechSynthesis && (
                 <IconButton
                  iconClass={isAutoSpeakEnabled ? "fas fa-volume-up" : "fas fa-volume-mute"}
                  onClick={toggleAutoSpeak}
                  tooltip={t(isAutoSpeakEnabled ? "tooltips.disableAiSpeech" : "tooltips.enableAiSpeech")}
                  className={`p-2 rounded-full transition-colors text-sm md:text-base ${isAutoSpeakEnabled ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
                />
              )}
              {browserSupportsSpeechRecognition && activeTab === 'chat' && learningPath && ( 
                <IconButton
                  iconClass={isListening ? "fas fa-microphone-slash" : "fas fa-microphone"}
                  onClick={isListening ? stopListening : startListening}
                  tooltip={t(isListening ? "tooltips.stopListening" : "tooltips.startListening")}
                  className={`p-2 rounded-full transition-colors text-sm md:text-base ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                />
              )}
              {activeTab === 'chat' && learningPath && (
                  <IconButton
                    iconClass="fas fa-bars" 
                    onClick={toggleSidePanel}
                    tooltip={t(isSidePanelOpen ? "tooltips.closeTopics" : "tooltips.openTopics")}
                    className="p-2 rounded-full transition-colors text-white hover:bg-gray-700 text-sm md:text-base"
                  />
              )}
            </div>
          </header>
          
          <main className={`flex-grow overflow-y-auto pt-16 md:pt-20 pb-16 md:pb-20 z-10 transition-all duration-300 ease-in-out ${isSidePanelOpen && activeTab === 'chat' ? 'pr-64 md:pr-72' : 'pr-0'}`}> 
            {renderContent()}
          </main>

          <BottomNavigation activeTab={activeTab} onTabChange={(newTab) => {
            setActiveTab(newTab);
            if (newTab !== 'chat') setIsSidePanelOpen(false); 
          }} />
        </>
      )}
    </div>
  );
};

export default App;