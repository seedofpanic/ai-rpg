import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { gameStore } from 'models/gameStore';
import { createContext } from './contextCreator';

export const apiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
};

let lastRequestPromise: Promise<GenerateContentResult> | null = null;
let lastRequestTimestamp = Date.now();
const RATE_LIMIT_MS = 1000;

const sendMessageProxy = async (
  message: string,
  npcId: string,
  isSystemMessage: boolean = false,
) => {
  try {
    const prompt = createContext(npcId, message, isSystemMessage);

    const response = await fetch('http://167.71.7.172:9003/api/v1/send', {
      method: 'POST',
      body: JSON.stringify({
        "generationConfig": {},
        "safetySettings": [],
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": prompt
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      tokensCount: data.usageMetadata.candidatesTokensDetails[0].tokensCount,
    };
  } catch (error) {
    console.error('Error calling Proxy API:', error);
    return null;
  }
};

const sendMessageGemini = async (
  message: string,
  npcId: string,
  isSystemMessage: boolean = false,
): Promise<{ text: string; tokensCount: number } | null> => {
  try {
    const genAI = new GoogleGenerativeAI(apiConfig.apiKey || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    await lastRequestPromise;
    await new Promise((resolve) => {
      const timeToWait = lastRequestTimestamp + RATE_LIMIT_MS - Date.now();
      if (timeToWait > 0) {
        setTimeout(resolve, timeToWait);
      } else {
        resolve(null);
      }
    });

    const prompt = createContext(npcId, message, isSystemMessage);
    lastRequestPromise = model.generateContent(prompt).then((result) => {
      lastRequestTimestamp = Date.now();
      return result;
    });
    const result = await lastRequestPromise;

    if (!result) {
      throw new Error('Failed to generate content');
    }

    const response = await result.response;
    return {
      text: response.text(), // Ensure <sell></sell> tags are preserved
      tokensCount: (
        response as unknown as {
          usageMetadata: { candidatesTokensDetails: { tokensCount: number }[] };
        }
      ).usageMetadata.candidatesTokensDetails[0].tokensCount,
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};

export const sendMessage = (message: string,
  npcId: string,
  isSystemMessage: boolean = false,) => {
  if (gameStore.api === 'gemini') {
    return sendMessageGemini(message, npcId, isSystemMessage);
  } else {
    return sendMessageProxy(message, npcId, isSystemMessage);
  }
};