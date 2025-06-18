
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LearningPathName, MustLearnTopic, StorySlide, ParsedStoryItem } from '../types';
import { generateStorySlides, generateImageForStory } from '../services/geminiService';
import * as Constants from '../constants';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { IconButton } from './IconButton';

interface StoryModeProps {
  learningPath: LearningPathName;
  activeTopic: MustLearnTopic | null;
  userExpertise: string;
  onMarkTopicComplete: (canonicalTitle: string) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({ learningPath, activeTopic, userExpertise, onMarkTopicComplete }) => {
  const { t, i18n } = useTranslation();
  const [slides, setSlides] = useState<StorySlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRtl = i18n.language === 'ar';

  const fetchStoryAndImages = useCallback(async (topic: MustLearnTopic) => {
    setIsLoadingStory(true);
    setError(null);
    setSlides([]);
    setCurrentSlideIndex(0);

    try {
      const storyResponse = await generateStorySlides(
        topic.canonicalTitle,
        learningPath,
        userExpertise,
        t(Constants.USER_EXPERTISE_NO_EXPERTISE_FALLBACK_KEY)
      );

      if (!storyResponse.storySlides || storyResponse.storySlides.length === 0) {
        setError(t('storyMode.noStoryAvailable')); 
        setSlides([]);
        setIsLoadingStory(false);
        return;
      }
      
      const initialSlides: StorySlide[] = storyResponse.storySlides.map((parsedSlide: ParsedStoryItem, index: number) => ({
        id: `${topic.id}_slide_${index}`,
        sentence: parsedSlide.sentence,
        illustrationIdea: parsedSlide.illustrationIdea,
        imageUrl: undefined, 
        isLoadingImage: true, 
        errorImage: null,
      }));
      setSlides(initialSlides);
      setIsLoadingStory(false); 

      for (let i = 0; i < initialSlides.length; i++) {
        try {
          const base64Image = await generateImageForStory(initialSlides[i].illustrationIdea);
          setSlides(prevSlides => 
            prevSlides.map((s, idx) => 
              idx === i ? { ...s, imageUrl: `data:image/jpeg;base64,${base64Image}`, isLoadingImage: false } : s
            )
          );
        } catch (imgError) {
          console.error(`Error generating image for slide ${i}:`, imgError);
          setSlides(prevSlides => 
            prevSlides.map((s, idx) => 
              idx === i ? { ...s, isLoadingImage: false, errorImage: t(Constants.STORY_MODE_IMAGE_ERROR_KEY) } : s
            )
          );
        }
      }
       onMarkTopicComplete(topic.canonicalTitle);

    } catch (err) {
      console.error('Error fetching story:', err);
      setError(err instanceof Error ? err.message : t('errors.unknownAiError'));
      setIsLoadingStory(false);
    }
  }, [learningPath, userExpertise, t, onMarkTopicComplete]);

  useEffect(() => {
    if (activeTopic) {
      fetchStoryAndImages(activeTopic);
    } else {
      setSlides([]); 
      setCurrentSlideIndex(0);
      setError(null);
      setIsLoadingStory(false);
    }
  }, [activeTopic, fetchStoryAndImages]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };
  
  const currentSlide = slides[currentSlideIndex];

  if (!activeTopic && !isLoadingStory && !error && slides.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-white text-center">
            <i className="fas fa-book-reader text-5xl text-purple-400 mb-4"></i>
            <h2 className="text-2xl font-semibold mb-2">{t('storyMode.noTopicSelectedTitle')}</h2>
            <p className="mb-4 text-gray-300">{t('storyMode.selectTopicPrompt')}</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-2 md:p-4 bg-transparent items-center">
        <div className="mb-2 text-center w-full max-w-2xl">
            <h2 className="text-lg font-semibold text-purple-300 bg-gray-800 bg-opacity-70 backdrop-blur-sm py-2 px-4 rounded-md inline-block">
                {activeTopic ? t(activeTopic.titleKey) : t('storyMode.defaultTitle')}
            </h2>
        </div>

        {error && !isLoadingStory && <ErrorMessage message={error} onClose={() => setError(null)} />}
        
        {isLoadingStory && <div className="flex flex-col items-center justify-center flex-grow p-4"><LoadingSpinner /><p className="mt-2 text-purple-300">{t(Constants.STORY_MODE_LOADING_STORY_KEY)}</p></div>}

        {!isLoadingStory && !error && slides.length === 0 && activeTopic && (
             <div className="flex-grow flex items-center justify-center text-white"><p>{t('storyMode.noStoryAvailable')}</p></div>
        )}

        {!isLoadingStory && slides.length > 0 && (
          <>
            <div className="flex-grow flex flex-col items-center w-full max-w-2xl bg-black bg-opacity-30 backdrop-blur-sm p-4 rounded-lg overflow-y-auto custom-scrollbar mb-4 min-h-0"> {/* Scrollable content area */}
                {currentSlide ? (
                    <>
                        <div className="w-full aspect-video bg-gray-700 rounded-md mb-4 flex items-center justify-center overflow-hidden border-2 border-gray-600 shrink-0">
                            {currentSlide.isLoadingImage &&  <div className="flex flex-col items-center"><LoadingSpinner /><p className="text-sm text-purple-200 mt-1">{t(Constants.STORY_MODE_LOADING_IMAGE_KEY)}</p></div>}
                            {currentSlide.imageUrl && !currentSlide.isLoadingImage && (
                                <img src={currentSlide.imageUrl} alt={t('storyMode.slideImageAlt', { idea: currentSlide.illustrationIdea })} className="w-full h-full object-contain" />
                            )}
                            {currentSlide.errorImage && !currentSlide.isLoadingImage && (
                                <div className="p-4 text-center text-red-400">
                                    <i className="fas fa-image-slash text-4xl mb-2"></i>
                                    <p>{currentSlide.errorImage}</p>
                                </div>
                            )}
                            {!currentSlide.imageUrl && !currentSlide.isLoadingImage && !currentSlide.errorImage && (
                                <div className="p-4 text-center text-gray-400">
                                    <i className="fas fa-cat text-4xl mb-2"></i>
                                    <p>{t('storyMode.generatingCatMagic')}</p>
                                </div>
                            )}
                        </div>
                        <p className={`w-full text-center text-gray-100 text-lg md:text-xl p-2 rounded bg-gray-700 bg-opacity-50 min-h-[60px] flex items-center justify-center ${isRtl ? 'text-right' : 'text-left'}`}>
                            {currentSlide.sentence}
                        </p>
                    </>
                ) : (
                    !isLoadingStory && <div className="flex-grow flex items-center justify-center"><p className="text-gray-400">{t(Constants.STORY_MODE_LOADING_STORY_KEY)}</p></div>
                )}
            </div>

            <div className={`flex justify-between w-full max-w-2xl px-2 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <IconButton
                    iconClass={`fas ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`}
                    onClick={handlePreviousSlide}
                    disabled={currentSlideIndex === 0 || slides.length === 0}
                    className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:bg-gray-600 disabled:opacity-50"
                    tooltip={t(Constants.STORY_MODE_PREVIOUS_BUTTON_KEY)}
                >
                    {t(Constants.STORY_MODE_PREVIOUS_BUTTON_KEY)}
                </IconButton>
                <span className="text-gray-300 self-center">{slides.length > 0 ? t(Constants.DIAGNOSTIC_QUIZ_QUESTION_PROGRESS_KEY, { current: currentSlideIndex + 1, total: slides.length }) : ''}</span>
                <IconButton
                    iconClass={`fas ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'}`}
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex >= slides.length - 1 || slides.length === 0}
                    className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:bg-gray-600 disabled:opacity-50"
                    tooltip={t(Constants.STORY_MODE_NEXT_BUTTON_KEY)}
                >
                    {t(Constants.STORY_MODE_NEXT_BUTTON_KEY)}
                </IconButton>
            </div>
            {currentSlideIndex >= slides.length - 1 && slides.length > 0 && !isLoadingStory && (
                <p className="text-center text-green-400 mt-2 animate-pulse shrink-0">{t(Constants.STORY_MODE_END_KEY)}</p>
            )}
          </>
        )}
    </div>
  );
};
