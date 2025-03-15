import { GoogleGenerativeAI } from '@google/generative-ai';
import { gameStore } from 'models/gameStore';
import { createContext } from './contextCreator';

export const apiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
};

export const sendMessage = async (
  message: string,
  npcId: string,
): Promise<{ text: string; tokensCount: number } | null> => {
  try {
    const genAI = new GoogleGenerativeAI(apiConfig.apiKey || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const player = gameStore.player;

    if (!player) {
      throw new Error('Player not found');
    }

    const prompt = createContext(npcId, player, message);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      text: response.text(), // Ensure <sell></sell> tags are preserved
      tokensCount:
        response.usageMetadata.candidatesTokensDetails[0].tokensCount,
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};
