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