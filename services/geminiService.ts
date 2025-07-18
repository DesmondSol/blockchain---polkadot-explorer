
import { GoogleGenAI, GenerateContentResponse, Part, Content, Tool } from "@google/genai";
import { 
    ChatMessage, 
    GeminiResponse, 
    Sender, 
    GroundingChunk, 
    LearningPathName, 
    QuizItem,
    ParsedStoryItem,
    GeminiStoryResponse,
    GeminiQuizItemResponse
} from '../types';
import { 
    GEMINI_MODEL_TEXT, 
    GEMINI_MODEL_IMAGE,
    SYSTEM_INSTRUCTION_CHAT_TEMPLATE, 
    SYSTEM_INSTRUCTION_STORY_TEMPLATE,
    SYSTEM_INSTRUCTION_QUIZ_TEMPLATE,
    MAX_CHAT_HISTORY_FOR_CONTEXT,
    STORY_SLIDE_SEPARATOR,
    SENTENCE_MARKER,
    ILLUSTRATION_IDEA_MARKER
} from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure the API_KEY environment variable is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 

const parseAiChatResponsePayload = (responseText: string, groundingMetadata?: any): GeminiResponse => {
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


export const sendMessageToGeminiChat = async (
  userMessage: string,
  chatHistory: ChatMessage[],
  learningPath: LearningPathName,
  userExpertise?: string,
  userExpertiseNoneProvidedText: string = "None provided"
): Promise<GeminiResponse> => {
  if (!API_KEY) {
    return { 
      text: "AI Service is not configured. Missing API Key.",
      suggestedTopics: ["How to set up API Key?", "What are environment variables?"],
      groundingChunks: []
    };
  }
  try {
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
    const systemInstruction = SYSTEM_INSTRUCTION_CHAT_TEMPLATE
        .replace(/{USER_EXPERTISE_PLACEHOLDER}/g, expertiseToUse)
        .replace(/{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}/g, userExpertiseNoneProvidedText);


    const tools: Tool[] = [{ googleSearch: {} }];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
      }
    });
    
    const responseText = response.text;
    if (responseText === undefined || responseText === null) { 
        throw new Error("Received no text response from AI for chat.");
    }
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return parseAiChatResponsePayload(responseText, groundingMetadata);

  } catch (error) {
    console.error('Gemini API chat error:', error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
             throw new Error('Invalid API Key. Please check your configuration.');
        }
         throw new Error(`AI service error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while contacting the AI service for chat.');
  }
};

export const generateStorySlides = async (
    topicName: string,
    learningPath: LearningPathName,
    userExpertise: string,
    userExpertiseNoneProvidedText: string
): Promise<GeminiStoryResponse> => {
    if (!API_KEY) {
        return { text: "AI Service not configured (Story Mode).", storySlides: [] };
    }
    try {
        const expertiseToUse = userExpertise && userExpertise.trim() ? userExpertise.trim() : userExpertiseNoneProvidedText;
        const systemInstruction = SYSTEM_INSTRUCTION_STORY_TEMPLATE
            .replace(/{TOPIC_NAME}/g, topicName)
            .replace(/{LEARNING_PATH_NAME}/g, learningPath)
            .replace(/{USER_EXPERTISE_PLACEHOLDER}/g, expertiseToUse)
            .replace(/{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}/g, userExpertiseNoneProvidedText);

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: [{ role: 'user', parts: [{ text: `Generate a story about ${topicName}.` }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, // Slightly creative for story
            }
        });
        
        const responseText = response.text;
        if (!responseText) {
            throw new Error("Received no text response from AI for story generation.");
        }

        const slides: ParsedStoryItem[] = [];
        const slideParts = responseText.split(STORY_SLIDE_SEPARATOR);
        
        for (const part of slideParts) {
            if (part.trim() === "") continue;

            const sentenceMatch = part.match(new RegExp(`${SENTENCE_MARKER}\\s*(.*?)\\s*${ILLUSTRATION_IDEA_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "s"));
            const illustrationIdeaMatch = part.match(new RegExp(`${ILLUSTRATION_IDEA_MARKER}\\s*(.*)`, "s"));


            const sentence = sentenceMatch && sentenceMatch[1] ? sentenceMatch[1].trim() : null;
            const illustrationIdea = illustrationIdeaMatch && illustrationIdeaMatch[1] ? illustrationIdeaMatch[1].trim() : null;

            if (sentence && illustrationIdea) {
                slides.push({ sentence, illustrationIdea });
            } else {
                 console.warn("Could not parse slide part:", part, "Sentence found:", sentence, "Illustration idea found:", illustrationIdea);
            }
        }
        
        if (slides.length === 0 && responseText.length > 0) {
            console.warn("No slides parsed, but received text. Attempting fallback for single slide:", responseText);
             // Fallback for potentially unformatted single slide response.
            const sentenceMatch = responseText.match(new RegExp(`${SENTENCE_MARKER}\\s*(.*?)(?:${ILLUSTRATION_IDEA_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|$)`, "s"));
            const illustrationIdeaMatch = responseText.match(new RegExp(`${ILLUSTRATION_IDEA_MARKER}\\s*(.*)`, "s"));
            const sentence = sentenceMatch && sentenceMatch[1] ? sentenceMatch[1].trim() : responseText.substring(0, responseText.indexOf(ILLUSTRATION_IDEA_MARKER)).replace(SENTENCE_MARKER, "").trim() || responseText ;
            const illustrationIdea = illustrationIdeaMatch && illustrationIdeaMatch[1] ? illustrationIdeaMatch[1].trim() : "A cute cat thinking about " + topicName;
             if(sentence && illustrationIdea) slides.push({ sentence, illustrationIdea });
        }


        return { text: "Story generated", storySlides: slides };

    } catch (error) {
        console.error('Gemini API story generation error:', error);
        throw new Error(`AI service error (Story Mode): ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const generateImageForStory = async (illustrationIdea: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error("AI Service not configured (Image Generation).");
    }
    try {
        const imagePrompt = `${illustrationIdea}. Cute, minimal illustration, black ink on white background, cat metaphor, simple lines, vector art style.`;
        
        const response = await ai.models.generateImages({
            model: GEMINI_MODEL_IMAGE,
            prompt: imagePrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
            return response.generatedImages[0].image.imageBytes; // This is a base64 string
        } else {
            throw new Error("No image generated or image data missing.");
        }
    } catch (error) {
        console.error('Gemini API image generation error:', error);
        throw new Error(`AI service error (Image Generation): ${error instanceof Error ? error.message : String(error)}`);
    }
};

const cleanQuizJsonString = (rawJson: string): string => {
    let cleaned = rawJson;

    // Remove markdown code fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const fenceMatch = cleaned.match(fenceRegex);
    if (fenceMatch && fenceMatch[2]) {
      cleaned = fenceMatch[2].trim();
    }

    // Attempt to remove specific conversational/note patterns observed
    // This looks for "text": "Some text." Some unwanted phrase until the next comma or closing brace
    cleaned = cleaned.replace(/("text":\s*"[^"]*?")(\s*[^,{}\]]+)(?=[,}])/g, '$1');
    
    // Simpler removal of specific known interjections if they are on their own line or clearly separable
    // For example, removing lines starting with "Tapiwa Nyamakope..." or "inhaled_note:"
    cleaned = cleaned.split('\n').filter(line => 
        !line.trim().startsWith('Tapiwa Nyamakope') && 
        !line.trim().startsWith('inhaled_note":') &&
        !line.trim().startsWith('I am sorry, but I cannot include anything') &&
        !line.trim().startsWith('I will stop here.')
    ).join('\n');

    // General attempt to strip text that might be outside legitimate JSON string values
    // This is more complex and might need refinement based on observed errors.
    // One approach: if a line within an "options" array doesn't look like a valid JSON part
    // (e.g., doesn't start with "{" or "id": or "text":), it might be an interjection.
    // However, this regex-based cleaning is heuristic and might not cover all cases or could be too aggressive.
    // A simpler step for now: ensure no text *after* the final closing brace of the JSON.
    const lastBraceIndex = cleaned.lastIndexOf('}');
    if (lastBraceIndex !== -1 && lastBraceIndex < cleaned.length -1) {
        cleaned = cleaned.substring(0, lastBraceIndex + 1);
    }
    
    return cleaned.trim();
};


export const generateQuizItem = async (
    topicName: string,
    learningPath: LearningPathName,
    userExpertise: string,
    userExpertiseNoneProvidedText: string
): Promise<GeminiQuizItemResponse> => {
    if (!API_KEY) {
         return { text: "AI Service not configured (Quiz Mode)." };
    }
    let rawResponseText = ""; 
    try {
        const expertiseToUse = userExpertise && userExpertise.trim() ? userExpertise.trim() : userExpertiseNoneProvidedText;
        const systemInstruction = SYSTEM_INSTRUCTION_QUIZ_TEMPLATE
            .replace(/{TOPIC_NAME}/g, topicName)
            .replace(/{LEARNING_PATH_NAME}/g, learningPath)
            .replace(/{USER_EXPERTISE_PLACEHOLDER}/g, expertiseToUse)
            .replace(/{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}/g, userExpertiseNoneProvidedText);
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: [{ role: 'user', parts: [{ text: `Generate a quiz question about ${topicName}.` }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            }
        });

        rawResponseText = response.text; 
        if (!rawResponseText) {
            throw new Error("Received no text response from AI for quiz generation.");
        }
        
        const cleanedJsonString = cleanQuizJsonString(rawResponseText);
        
        const parsedData = JSON.parse(cleanedJsonString) as QuizItem; 
        return { text: "Quiz item generated", quizItem: { ...parsedData, id: Date.now().toString()} };

    } catch (error) {
        console.error('Gemini API quiz generation error:', error, 'Attempted to parse (after cleaning):', cleanQuizJsonString(rawResponseText));
        const errorMessage = error instanceof Error ? error.message : String(error);
        const truncatedJson = rawResponseText.length > 500 ? rawResponseText.substring(0, 497) + "..." : rawResponseText;
        throw new Error(`AI service error (Quiz Mode): ${errorMessage}. Problematic RAW JSON string (or part of it): [${truncatedJson}]`);
    }
};
