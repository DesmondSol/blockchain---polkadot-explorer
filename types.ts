export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isInterim?: boolean; // For speech recognition interim results
  suggestedTopics?: string[]; // For AI suggested next topics
}

export interface GeminiResponse {
  text: string;
  visualHint?: string;
  suggestedTopics?: string[];
}