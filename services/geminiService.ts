
import { GoogleGenAI, GenerateContentResponse, Part, Content } from "@google/genai";
import { ChatMessage, GeminiResponse, Sender } from '../types';
import { GEMINI_MODEL_TEXT, SYSTEM_INSTRUCTION, MAX_CHAT_HISTORY_FOR_CONTEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure the API_KEY environment variable is configured.");
  // In a real app, you might want to throw an error or disable AI features.
  // For this example, we'll proceed, but API calls will fail.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // The "!" asserts API_KEY is non-null, handle missing key appropriately

const extractVisualHint = (responseText: string): { text: string, visualHint?: string } => {
  const hintRegex = /VISUAL_HINT:\s*\[?(.*?)\]?$/im; // Updated regex to be more flexible with brackets
  const match = responseText.match(hintRegex);
  if (match && match[1]) {
    const hint = match[1].trim();
    const cleanedText = responseText.replace(hintRegex, '').trim();
    return { text: cleanedText, visualHint: hint };
  }
  return { text: responseText };
};


export const sendMessageToGemini = async (
  userMessage: string,
  chatHistory: ChatMessage[]
): Promise<GeminiResponse> => {
  if (!API_KEY) {
    return { text: "AI Service is not configured. Missing API Key." };
  }
  try {
    const model = GEMINI_MODEL_TEXT;

    // Prepare chat history for Gemini API
    const history: Content[] = chatHistory
      .slice(-MAX_CHAT_HISTORY_FOR_CONTEXT) // Take last N messages
      .map(msg => ({
        role: msg.sender === Sender.User ? 'user' : 'model',
        parts: [{ text: msg.text }] as Part[], 
      }));
    
    const contents: Content[] = [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] as Part[] } 
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // temperature: 0.7, // Example of other config options
        // topK: 40,
        // topP: 0.95,
      }
    });
    
    const responseText = response.text;
    if (responseText === undefined || responseText === null) { // Check for undefined or null, empty string is a valid response.
        throw new Error("Received no text response from AI.");
    }

    return extractVisualHint(responseText);

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
