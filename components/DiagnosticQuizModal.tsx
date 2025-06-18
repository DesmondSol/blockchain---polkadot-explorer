
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { QuizQuestion, QuizAnswerOption, LearningPathName } from '../types';
import * as Constants from '../constants';
import { IconButton } from './IconButton';

interface DiagnosticQuizModalProps {
  isOpen: boolean;
  quizPath: LearningPathName | null;
  onClose: () => void;
  onSubmitQuiz: (path: LearningPathName, answers: Record<string, string>, score: number) => void;
  introTextKey: string; // New prop for the introductory text
}

export const DiagnosticQuizModal: React.FC<DiagnosticQuizModalProps> = ({
  isOpen,
  quizPath,
  onClose,
  onSubmitQuiz,
  introTextKey,
}) => {
  const { t, i18n } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (quizPath) {
      const filteredQuestions = Constants.DIAGNOSTIC_QUIZZES.filter(q => q.path === quizPath);
      setQuizQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    }
  }, [quizPath, isOpen]); // Reset quiz when path changes or modal opens

  if (!isOpen || !quizPath || quizQuestions.length === 0) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("Modal root element 'modal-root' not found for DiagnosticQuizModal.");
    return null;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Submit quiz
      let score = 0;
      quizQuestions.forEach(q => {
        const selectedOptionId = selectedAnswers[q.id];
        const correctOption = q.options.find(opt => opt.isCorrect);
        if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
          score++;
        }
      });
      onSubmitQuiz(quizPath, selectedAnswers, score);
    }
  };
  
  const title = t(`${Constants.DIAGNOSTIC_QUIZ_TITLE_KEY_PREFIX}${quizPath}`);
  const progressText = t(Constants.DIAGNOSTIC_QUIZ_QUESTION_PROGRESS_KEY, {
      current: currentQuestionIndex + 1,
      total: quizQuestions.length
  });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg lg:max-w-xl modal-content animate-modalFadeInScale text-white">
        
        <p className={`text-base text-gray-200 mb-4 ${isRtl ? 'text-right' : 'text-left'} italic`}>
          {t(introTextKey)}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl md:text-2xl font-semibold text-purple-300">{title}</h2>
          <IconButton
            iconClass="fas fa-times"
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1"
            aria-label={t('common.close')}
            tooltip={t('common.close')}
          />
        </div>
        <p className={`text-sm text-gray-400 mb-6 ${isRtl ? 'text-right' : 'text-center'}`}>{progressText}</p>

        {currentQuestion && (
          <div>
            <p className={`text-lg md:text-xl text-gray-100 mb-6 min-h-[60px] flex items-center ${isRtl ? 'justify-end text-right' : 'justify-center text-center'}`}>
                {t(currentQuestion.questionTextKey)}
            </p>
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                  className={`w-full p-3 md:p-4 rounded-lg transition-all duration-200 border-2
                                ${selectedAnswers[currentQuestion.id] === option.id 
                                    ? 'bg-purple-600 border-purple-400 text-white ring-2 ring-purple-300' 
                                    : 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-purple-500 text-gray-200'
                                } ${isRtl ? 'text-right' : 'text-left'}`}
                  aria-pressed={selectedAnswers[currentQuestion.id] === option.id}
                >
                  {t(option.textKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`mt-6 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion?.id]}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors text-base md:text-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
          >
            {currentQuestionIndex < quizQuestions.length - 1 
                ? <> {t(Constants.DIAGNOSTIC_QUIZ_NEXT_QUESTION_KEY)} {!isRtl && <i className="fas fa-arrow-right ml-2"></i>} {isRtl && <i className="fas fa-arrow-left mr-2"></i>} </>
                : <> <i className="fas fa-check-circle mr-2"></i> {t(Constants.DIAGNOSTIC_QUIZ_FINISH_KEY)} </>
            }
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};
