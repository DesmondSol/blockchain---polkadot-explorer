export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
  // We can add other types of chunks here if needed in the future e.g., 'retrievedContext'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isInterim?: boolean; // For speech recognition interim results
  suggestedTopics?: string[]; // For AI suggested next topics
  groundingChunks?: GroundingChunk[]; // For displaying sources from search grounding
}

export interface GeminiResponse {
  text: string;
  visualHint?: string;
  suggestedTopics?: string[];
  groundingChunks?: GroundingChunk[];
}

export interface MustLearnTopic {
  id: string;
  titleKey: string; // Key for localized title
  canonicalTitle: string; // English title for AI and internal logic
  descriptionKey?: string; // Key for localized description
}

export interface PolkadotAccount {
  address: string;
  name?: string; // User-defined name in the extension
  source: string; // Extension's source/name e.g., 'polkadot-js', 'talisman'
  // We can add type (e.g. sr25519, ed25519) if needed later
}

export interface ClaimedBadgeDetail {
  achievementKey: string; // The key of the achievement this badge represents
  address: string;        // Wallet address it was claimed with
  source: string;         // Wallet source (e.g., 'polkadot-js')
  claimedAt: number;      // Timestamp of claim
}

// Types for Diagnostic Quiz
export interface QuizAnswerOption {
  id: string; // e.g., 'a', 'b', 'c'
  textKey: string; // Translation key for the answer text
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string; // e.g., 'q1_basics'
  questionTextKey: string; // Translation key for the question
  options: QuizAnswerOption[];
  path: LearningPathName; // To associate question with a learning path
}

export type LearningPathName = 'blockchainBasics' | 'polkadotAdvanced';

export interface QuizCompletionStatus {
  blockchainBasics?: boolean;
  polkadotAdvanced?: boolean;
}

// New Types for Learning Modes
export type LearningMode = 'chat' | 'story' | 'quiz';

export interface StorySlide {
  id: string;
  sentence: string;
  illustrationIdea: string;
  imageUrl?: string | null; // URL of the generated image or null if not yet loaded/failed
  isLoadingImage: boolean;
  errorImage?: string | null;
}

export interface QuizModeOption {
  id: string; // e.g., 'A', 'B'
  text: string;
}
export interface QuizItem {
  id: string;
  question: string;
  options: QuizModeOption[];
  correctAnswerId: string;
  explanation: string;
  userAnswerId?: string;
  isCorrect?: boolean;
}

export interface ParsedStoryItem {
  sentence: string;
  illustrationIdea: string;
}

export interface GeminiStoryResponse extends GeminiResponse {
    storySlides?: ParsedStoryItem[];
}

export interface GeminiQuizItemResponse extends GeminiResponse {
    quizItem?: QuizItem;
}
