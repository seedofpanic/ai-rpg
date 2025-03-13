import { GoogleGenerativeAI } from '@google/generative-ai';
import { npcStore } from './models/npcs';
import { gameStore } from 'models/gameStore';
import { itemsData } from './models/itemsData';
import { lore } from './models/loreBook';
import { createContext } from './contextCreator';

export const sendMessage = async (message: string, npcId: string): Promise<string> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const player = gameStore.player;

        if (!player) {
            throw new Error('Player not found');
        }

        const prompt = createContext(npcId, player, message);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Error: Failed to get response from AI';
    }
};
