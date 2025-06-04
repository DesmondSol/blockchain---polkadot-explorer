
import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Sender } from './types';
import { ChatInterface } from './components/ChatInterface';
import { VisualBackground } from './components/VisualBackground';
// ErrorMessage and LoadingSpinner are used within ChatInterface or other specific contexts.
// import { ErrorMessage } from './components/ErrorMessage';
// import { LoadingSpinner } from './components/LoadingSpinner';
import { sendMessageToGemini } from './services/geminiService';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { IconButton } from './components/IconButton';
import { BottomNavigation, ActiveTab } from './components/BottomNavigation';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingModal } from './components/OnboardingModal';
import * as Constants from './constants';

type LearningPath = 'blockchainBasics' | 'polkadotAdvanced' | null;

const App: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentVisualKeyword, setCurrentVisualKeyword] = useState<string>('blockchain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(true);

  const [learningPath, setLearningPath] = useState<LearningPath>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  const [userNickname, setUserNickname] = useState<string>('Crypto Explorer');
  const [achievements, setAchievements] = useState<string[]>([
    "Initiated Learner"
  ]);

  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [userExpertise, setUserExpertise] = useState<string>('');

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak, cancelSpeaking, isSpeaking, browserSupportsSpeechSynthesis } = useSpeechSynthesis();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      setShowOnboardingModal(true);
    }
    const storedNickname = localStorage.getItem('userNickname');
    if (storedNickname) setUserNickname(storedNickname);

    const storedAchievements = localStorage.getItem('userAchievements');
    if (storedAchievements) setAchievements(JSON.parse(storedAchievements));

    const storedExpertise = localStorage.getItem('userExpertise');
    if (storedExpertise) setUserExpertise(storedExpertise);

  }, []);

  useEffect(() => {
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('userNickname', userNickname);
  }, [userNickname]);


  useEffect(() => {
    if (!learningPath && activeTab === 'chat') {
      setChatMessages([]);
    }
  }, [learningPath, activeTab]);

  useEffect(() => {
    if (speechError) {
      setError(`Speech recognition error: ${speechError}`);
    }
  }, [speechError]);

  const handleOnboardingSubmit = (expertise: string) => {
    setUserExpertise(expertise);
    localStorage.setItem('userExpertise', expertise);
    setShowOnboardingModal(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    if (expertise.trim() && !achievements.includes("Personalized Learner")) {
      setAchievements(prev => [...prev, "Personalized Learner"]);
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboardingModal(false);
    localStorage.setItem('hasCompletedOnboarding', 'true'); // Mark as completed even if skipped
  };


  const handleSendMessage = useCallback(async (messageText: string, isAutomatedFirstMessage = false) => {
    if (!messageText.trim() || !learningPath) return;

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
      // Pass userExpertise to the AI service
      const { text: aiResponseText, visualHint, suggestedTopics } = await sendMessageToGemini(
        messageText,
        currentContextMessages,
        learningPath,
        userExpertise // Pass the collected user expertise
      );

      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText,
        sender: Sender.AI,
        timestamp: Date.now(),
        suggestedTopics: suggestedTopics || [],
      };
      setChatMessages(prev => [...prev, newAiMessage]);

      if (visualHint) {
        setCurrentVisualKeyword(visualHint);
      }

      if (isAutoSpeakEnabled && browserSupportsSpeechSynthesis) {
        speak(aiResponseText);
      }

      if (chatMessages.length > 5 && !achievements.includes("Curious Chatterbox")) {
        setAchievements(prev => [...prev, "Curious Chatterbox"]);
      }
      if (suggestedTopics && suggestedTopics.length > 0 && !achievements.includes("Explorer Guide")) {
        setAchievements(prev => [...prev, "Explorer Guide"]);
      }

    } catch (err) {
      console.error('Error sending message to Gemini:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred with the AI service.';
      setError(errorMessage);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        text: `Error: ${errorMessage}`,
        sender: Sender.AI,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatMessages, speak, isAutoSpeakEnabled, browserSupportsSpeechSynthesis, learningPath, achievements, userExpertise]);

  const toggleAutoSpeak = () => {
    setIsAutoSpeakEnabled(prev => !prev);
    if (isSpeaking) {
      cancelSpeaking();
    }
  };

  const handleSelectPath = (path: 'blockchainBasics' | 'polkadotAdvanced') => {
    setLearningPath(path);
    setChatMessages([]);

    const firstUserQuery = path === 'blockchainBasics'
      ? Constants.INITIAL_PROMPT_BASICS
      : Constants.INITIAL_PROMPT_POLKADOT;

    const initialUserMessage: ChatMessage = {
      id: Date.now().toString() + '-init-user',
      text: firstUserQuery,
      sender: Sender.User,
      timestamp: Date.now(),
    };
    setChatMessages([initialUserMessage]);
    handleSendMessage(firstUserQuery, true);
    setActiveTab('chat');

    if (path === 'blockchainBasics' && !achievements.includes("Blockchain Basics Started")) {
      setAchievements(prev => [...prev, "Blockchain Basics Started"]);
    } else if (path === 'polkadotAdvanced' && !achievements.includes("Polkadot Advanced Started")) {
      setAchievements(prev => [...prev, "Polkadot Advanced Started"]);
    }
  };

  const pathwayButtonClasses = "bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 md:px-8 rounded-lg text-base md:text-lg font-semibold transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 flex items-center justify-center";

  const renderContent = () => {
    if (showOnboardingModal) return null; // Don't render main content if modal is shown

    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-xl lg:max-w-2xl">
              {/* Learning Path Selection */}
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-purple-200 drop-shadow-lg">Choose Your Learning Path</h2>
                <div className="space-y-4 md:space-y-0 md:space-x-6 flex flex-col md:flex-row justify-center mb-10 md:mb-16">
                  <button onClick={() => handleSelectPath('blockchainBasics')} className={pathwayButtonClasses}>
                    <i className="fas fa-cubes mr-2"></i><span>Blockchain Basics</span>
                  </button>
                  <button onClick={() => handleSelectPath('polkadotAdvanced')} className={pathwayButtonClasses}>
                    <i className="fas fa-project-diagram mr-2"></i><span>Polkadot Advanced</span>
                  </button>
                </div>
              </div>

              {/* More Resources Section */}
              <div className="border-t border-gray-700 pt-6 md:pt-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-purple-300 drop-shadow-lg">
                  Explore More Resources
                </h3>
                <div className="space-y-4 max-w-md mx-auto">
                  <button
                    onClick={() => window.location.href = 'https://docs.polkadot.com/'}
                    className={`${pathwayButtonClasses} w-full`}
                  >
                    <i className="fas fa-book-open mr-2"></i>
                    <span>Blockchain Deep Dive</span>
                  </button>
                  <button
                    onClick={() => window.location.href = 'https://docs.polkadot.com/'}
                    className={`${pathwayButtonClasses} w-full`}
                  >
                    <i className="fas fa-link mr-2"></i>
                    <span>Polkadot Ecosystem Links</span>
                  </button>
                </div>
              </div>
            </div>
          </div >
        );
      case 'chat':
        if (!learningPath) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="bg-black bg-opacity-60 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md">
                <i className="fas fa-info-circle text-purple-400 text-4xl mb-4"></i>
                <h2 className="text-2xl font-semibold mb-3 text-purple-200">No Learning Path Selected</h2>
                <p className="text-gray-300 mb-6">
                  Please go to the <i className="fas fa-home mx-1"></i><strong>Home</strong> tab to choose a learning path to begin your chat session.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Go to Home
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
              if (newExpertise.trim() && !achievements.includes("Personalized Learner")) {
                setAchievements(prev => [...prev, "Personalized Learner"]);
              } else if (!newExpertise.trim() && achievements.includes("Personalized Learner")) {
                setAchievements(prev => prev.filter(ach => ach !== "Personalized Learner"));
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
          <header className="fixed top-0 left-0 right-0 z-30 p-3 md:p-4 bg-gray-900 bg-opacity-80 backdrop-blur-lg flex justify-between items-center shadow-md h-16 md:h-20">
            <h1 className="text-lg md:text-xl font-bold text-purple-300 drop-shadow-md">
              Blockchain & Polkadot Explorer
            </h1>
            <div className="flex items-center space-x-1 md:space-x-2">
              {browserSupportsSpeechSynthesis && (
                <IconButton
                  iconClass={isAutoSpeakEnabled ? "fas fa-volume-up" : "fas fa-volume-mute"}
                  onClick={toggleAutoSpeak}
                  tooltip={isAutoSpeakEnabled ? "Disable AI Speech" : "Enable AI Speech"}
                  className={`p-2 rounded-full transition-colors text-sm md:text-base ${isAutoSpeakEnabled ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
                />
              )}
              {browserSupportsSpeechRecognition && activeTab === 'chat' && learningPath && (
                <IconButton
                  iconClass={isListening ? "fas fa-microphone-slash" : "fas fa-microphone"}
                  onClick={isListening ? stopListening : startListening}
                  tooltip={isListening ? "Stop Listening" : "Start Listening"}
                  className={`p-2 rounded-full transition-colors text-sm md:text-base ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                />
              )}
            </div>
          </header>

          <main className="flex-grow overflow-y-auto pt-16 md:pt-20 pb-16 md:pb-20 z-10">
            {renderContent()}
          </main>

          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
};

export default App;
