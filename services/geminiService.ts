import { GoogleGenAI, GenerateContentResponse, Part, Content } from "@google/genai";
import { ChatMessage, GeminiResponse, Sender } from '../types';
import { GEMINI_MODEL_TEXT, SYSTEM_INSTRUCTION as SYSTEM_INSTRUCTION_TEMPLATE, MAX_CHAT_HISTORY_FOR_CONTEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure the API_KEY environment variable is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 

const parseAiResponsePayload = (responseText: string): GeminiResponse => {
  let text = responseText;
  let visualHint: string | undefined = undefined;
  let suggestedTopics: string[] | undefined = undefined;

  // Extract Visual Hint
  const hintRegex = /VISUAL_HINT:\s*\[?(.*?)\]?$/im;
  const hintMatch = text.match(hintRegex);
  if (hintMatch && hintMatch[1]) {
    visualHint = hintMatch[1].trim();
    text = text.replace(hintRegex, '').trim();
  }

  // Extract Next Topics
  const topicsRegex = /NEXT_TOPICS:\s*\[(.*?)\]$/im;
  const topicsMatch = text.match(topicsRegex);
  if (topicsMatch && topicsMatch[1]) {
    suggestedTopics = topicsMatch[1].split(',').map(topic => topic.trim()).filter(topic => topic.length > 0);
    text = text.replace(topicsRegex, '').trim();
  }
  
  return { text, visualHint, suggestedTopics };
};


export const sendMessageToGemini = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  learningPath: 'blockchainBasics' | 'polkadotAdvanced',
  userExpertise?: string // Added userExpertise parameter
): Promise<GeminiResponse> => {
  if (!API_KEY) {
    return { 
      text: "AI Service is not configured. Missing API Key.",
      suggestedTopics: ["How to set up API Key?", "What are environment variables?"]
    };
  }
  try {
    const model = GEMINI_MODEL_TEXT;

    const history: Content[] = chatHistory
      .slice(-MAX_CHAT_HISTORY_FOR_CONTEXT) 
      .map(msg => ({
        role: msg.sender === Sender.User ? 'user' : 'model',
        parts: [{ text: msg.text }] as Part[], 
      }));
    
    const contents: Content[] = [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] as Part[] } 
    ];

    // Dynamically insert user expertise into the system instruction
    const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE.replace(
        "{USER_EXPERTISE_PLACEHOLDER}", 
        userExpertise && userExpertise.trim() ? userExpertise.trim() : "None provided"
    );

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction, // Use the modified system instruction
      }
    });
    
    const responseText = response.text;
    if (responseText === undefined || responseText === null) { 
        throw new Error("Received no text response from AI.");
    }

    return parseAiResponsePayload(responseText);

  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
             throw new Error('Invalid API Key. Please check your configuration.');
        }
         throw new Error(`AI service error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while contacting the AI service.');
  }
};