
import { GoogleGenAI, GenerateContentResponse, Part, Content, Tool } from "@google/genai";
import { ChatMessage, GeminiResponse, Sender, GroundingChunk } from '../types';
import { GEMINI_MODEL_TEXT, SYSTEM_INSTRUCTION_TEMPLATE, MAX_CHAT_HISTORY_FOR_CONTEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure the API_KEY environment variable is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 

const parseAiResponsePayload = (responseText: string, groundingMetadata?: any): GeminiResponse => {
  let text = responseText;
  let visualHint: string | undefined = undefined;
  let suggestedTopics: string[] | undefined = undefined;

  const hintRegex = /VISUAL_HINT:\s*\[?(.*?)\]?$/im;
  const hintMatch = text.match(hintRegex);
  if (hintMatch && hintMatch[1]) {
    visualHint = hintMatch[1].trim();
    text = text.replace(hintRegex, '').trim();
  }

  const topicsRegex = /NEXT_TOPICS:\s*\[(.*?)\]$/im;
  const topicsMatch = text.match(topicsRegex);
  if (topicsMatch && topicsMatch[1]) {
    suggestedTopics = topicsMatch[1].split(',').map(topic => topic.trim()).filter(topic => topic.length > 0);
    text = text.replace(topicsRegex, '').trim();
  }
  
  const chunks: GroundingChunk[] | undefined = groundingMetadata?.groundingChunks?.filter(
    (chunk: any) => chunk.web && chunk.web.uri && chunk.web.title
  );

  return { text, visualHint, suggestedTopics, groundingChunks: chunks };
};


export const sendMessageToGemini = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  learningPath: 'blockchainBasics' | 'polkadotAdvanced',
  userExpertise?: string,
  userExpertiseNoneProvidedText: string = "None provided" // Default fallback text
): Promise<GeminiResponse> => {
  if (!API_KEY) {
    return { 
      text: "AI Service is not configured. Missing API Key.",
      suggestedTopics: ["How to set up API Key?", "What are environment variables?"],
      groundingChunks: []
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

    const expertiseToUse = userExpertise && userExpertise.trim() ? userExpertise.trim() : userExpertiseNoneProvidedText;
    const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE
        .replace("{USER_EXPERTISE_PLACEHOLDER}", expertiseToUse)
        .replace("{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}", userExpertiseNoneProvidedText);


    const tools: Tool[] = [{ googleSearch: {} }];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
      }
    });
    
    const responseText = response.text;
    if (responseText === undefined || responseText === null) { 
        throw new Error("Received no text response from AI.");
    }
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return parseAiResponsePayload(responseText, groundingMetadata);

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