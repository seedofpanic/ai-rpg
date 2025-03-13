import { GoogleGenerativeAI } from '@google/generative-ai';
import { gameStore } from 'models/gameStore';
import { createContext } from './contextCreator';

export const sendMessage = async (message: string, npcId: string): Promise<{text: string, tokensCount: number} | null> => {
    try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const player = gameStore.player;

        if (!player) {
            throw new Error('Player not found');
        }

        const prompt = createContext(model, npcId, player, message);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return {text: response.text(), tokensCount: response.usageMetadata.candidatesTokensDetails[0].tokensCount};
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return null;
    }
};
