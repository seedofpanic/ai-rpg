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

export const sendMessage = async (
  message: string,
  npcId: string,
  systemMessage: boolean = false,
): Promise<{ text: string; tokensCount: number } | null> => {
  try {
    const genAI = new GoogleGenerativeAI(apiConfig.apiKey || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const player = gameStore.player;

    if (!player) {
      throw new Error('Player not found');
    }
    await lastRequestPromise;
    await new Promise((resolve) => {
      const timeToWait = lastRequestTimestamp + RATE_LIMIT_MS - Date.now();
      if (timeToWait > 0) {
        setTimeout(resolve, timeToWait);
      } else {
        resolve(null);
      }
    });

    const prompt = createContext(npcId, player, message, systemMessage);
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
