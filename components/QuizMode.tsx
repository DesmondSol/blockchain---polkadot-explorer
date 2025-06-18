import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LearningPathName, MustLearnTopic, QuizItem, QuizModeOption } from '../types';
import { generateQuizItem } from '../services/geminiService';
import * as Constants from '../constants';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { IconButton } from './IconButton';

interface QuizModeProps {
  learningPath: LearningPathName;
  activeTopic: MustLearnTopic | null;
  userExpertise: string;
  onMarkTopicComplete: (canonicalTitle: string) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ learningPath, activeTopic, userExpertise, onMarkTopicComplete }) => {
  const { t, i18n } = useTranslation();
  const [currentQuiz, setCurrentQuiz] = useState<QuizItem | null>(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRtl = i18n.language === 'ar';

  const fetchQuiz = useCallback(async (topic: MustLearnTopic) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuiz(null);
    setSelectedAnswerId(null);
    setShowFeedback(false);

    try {
      const quizResponse = await generateQuizItem(
        topic.canonicalTitle,
        learningPath,
        userExpertise,
        t(Constants.USER_EXPERTISE_NO_EXPERTISE_FALLBACK_KEY)
      );
      
      if (quizResponse.quizItem) {
        setCurrentQuiz(quizResponse.quizItem);
        onMarkTopicComplete(topic.canonicalTitle); // Mark as attempted/started
      } else {
        setError(t(Constants.QUIZ_MODE_NO_QUIZ_FOR_TOPIC_KEY));
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(err instanceof Error ? err.message : t('errors.unknownAiError'));
    } finally {
      setIsLoading(false);
    }
  }, [learningPath, userExpertise, t, onMarkTopicComplete]);

  useEffect(() => {
    if (activeTopic) {
      fetchQuiz(activeTopic);
    } else {
        setCurrentQuiz(null);
    }
  }, [activeTopic, fetchQuiz]);

  const handleAnswerSelect = (optionId: string) => {
    if (!showFeedback) {
      setSelectedAnswerId(optionId);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswerId || !currentQuiz) return;
    setShowFeedback(true);
    // Potentially add achievement for answering a quiz question
  };

  const handleNextQuestion = () => {
    // This will trigger a new fetch if activeTopic is changed by SidePanel
    // For now, it just implies user should select a new topic from side panel.
    // Or we could fetch another question for the same topic (more complex AI needed).
    if (activeTopic) {
        fetchQuiz(activeTopic); // Refetch for the same topic, hoping AI gives a different question
    }
  };

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-full p-4"><LoadingSpinner /><p className="mt-2 text-purple-300">{t(Constants.QUIZ_MODE_LOADING_QUIZ_KEY)}</p></div>;
  }
  
  if (error && !currentQuiz) {
     return <div className="flex flex-col items-center justify-center h-full p-4"><ErrorMessage message={error} onClose={() => setError(null)} /></div>;
  }

  if (!activeTopic && !currentQuiz) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-white text-center">
            <i className="fas fa-graduation-cap text-5xl text-purple-400 mb-4"></i>
            <h2 className="text-2xl font-semibold mb-2">{t('quizMode.noTopicSelectedTitle')}</h2>
            <p className="mb-4 text-gray-300">{t('quizMode.selectTopicPrompt')}</p>
        </div>
    );
  }
  
  if (!currentQuiz && !isLoading && !error) {
     return <div className="flex flex-col items-center justify-center h-full p-4 text-white"><p>{t(Constants.QUIZ_MODE_NO_QUIZ_FOR_TOPIC_KEY)}</p></div>;
  }


  return (
    <div className="flex flex-col h-full p-2 md:p-4 bg-transparent items-center">
        <div className="mb-2 text-center w-full max-w-2xl">
             <h2 className="text-lg font-semibold text-purple-300 bg-gray-800 bg-opacity-70 backdrop-blur-sm py-2 px-4 rounded-md inline-block">
                {t('quizMode.title')} {activeTopic ? `- ${t(activeTopic.titleKey)}` : ''}
            </h2>
        </div>
        
        {error && <ErrorMessage message={error} onClose={() => { setError(null); setCurrentQuiz(null);}} />}

        {currentQuiz && (
            <div className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl bg-black bg-opacity-30 backdrop-blur-sm p-4 md:p-6 rounded-lg">
                <p className={`text-xl md:text-2xl text-gray-100 mb-6 text-center ${isRtl ? 'text-right' : ''}`}>{currentQuiz.question}</p>
                <div className="space-y-3 w-full mb-6">
                    {currentQuiz.options.map((option: QuizModeOption) => {
                        const isSelected = selectedAnswerId === option.id;
                        let buttonClass = 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-purple-500 text-gray-200';
                        if (showFeedback) {
                            if (option.id === currentQuiz.correctAnswerId) {
                                buttonClass = 'bg-green-600 border-green-400 text-white'; // Correct answer
                            } else if (isSelected && option.id !== currentQuiz.correctAnswerId) {
                                buttonClass = 'bg-red-600 border-red-400 text-white'; // Incorrectly selected
                            } else {
                                buttonClass = 'bg-gray-700 border-gray-600 text-gray-400 opacity-70'; // Not selected, not correct
                            }
                        } else if (isSelected) {
                            buttonClass = 'bg-purple-600 border-purple-400 text-white ring-2 ring-purple-300';
                        }
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleAnswerSelect(option.id)}
                                disabled={showFeedback}
                                className={`w-full p-3 md:p-4 rounded-lg transition-all duration-200 border-2 ${buttonClass} ${isRtl ? 'text-right' : 'text-left'}`}
                                aria-pressed={isSelected}
                            >
                                <span className={`font-semibold ${isRtl ? 'ml-2' : 'mr-2'}`}>{option.id}.</span> {option.text}
                            </button>
                        );
                    })}
                </div>

                {!showFeedback && (
                    <IconButton
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswerId}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                        tooltip={t(Constants.QUIZ_MODE_SUBMIT_ANSWER_KEY)}
                    >
                        {t(Constants.QUIZ_MODE_SUBMIT_ANSWER_KEY)}
                    </IconButton>
                )}

                {showFeedback && (
                    <div className={`mt-4 p-4 rounded-md w-full ${selectedAnswerId === currentQuiz.correctAnswerId ? 'bg-green-800 bg-opacity-70' : 'bg-red-800 bg-opacity-70'}`}>
                        <h3 className={`text-lg font-semibold mb-2 ${selectedAnswerId === currentQuiz.correctAnswerId ? 'text-green-300' : 'text-red-300'}`}>
                            {selectedAnswerId === currentQuiz.correctAnswerId ? t(Constants.QUIZ_MODE_CORRECT_KEY) : t(Constants.QUIZ_MODE_WRONG_KEY)}
                        </h3>
                        <p className="text-gray-200 text-sm mb-3">{currentQuiz.explanation}</p>
                        <IconButton
                            onClick={handleNextQuestion}
                            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg text-lg"
                            tooltip={t(Constants.QUIZ_MODE_NEXT_QUESTION_KEY)}
                        >
                            {t(Constants.QUIZ_MODE_NEXT_QUESTION_KEY)}  {!isRtl && <i className="fas fa-arrow-right ml-2"></i>} {isRtl && <i className="fas fa-arrow-left mr-2"></i>}
                        </IconButton>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
