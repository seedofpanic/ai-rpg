import { GoogleGenerativeAI } from '@google/generative-ai';
import { npcStore } from './models/npcs';
import { gameStore } from 'models/gameStore';
import { itemsData } from './models/itemsData';

export const sendMessage = async (message: string, npcId: string): Promise<string> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const player = gameStore.player;

        if (!player) {
            throw new Error('Player not found');
        }
        
        const npcContext = npcStore.npcs[npcId];
        if (!npcContext) {
            throw new Error('NPC not found');
        }

        const prompt = `
        You are an NPC named ${npcContext.name}. Here is your context:

        Basic Information:
        - Role: ${npcContext.role}
        - Personality: ${npcContext.personality}
        - Background: ${npcContext.background}
        You have only items that are in your inventory:
        ${npcContext.inventory?.map(item => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || 'No items in inventory'}
        - Gold: ${npcContext.gold}

        Knowledge and Experience:
        ${npcContext.knowledge.map(k => `- ${k}`).join('\n')}

        Location (${npcContext.location.name}):
        ${npcContext.location.description}

        Environment:
        - Nearby NPCs: ${npcContext.location.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}
        - Location Features: ${npcContext.environmentKnowledge.locationFeatures.join(', ')}
        - Current Events: ${npcContext.environmentKnowledge.localEvents.join(', ')}
        - Common Visitors: ${npcContext.environmentKnowledge.commonVisitors.join(', ')}

        Relationships with other NPCs:
        ${Object.entries(npcContext.relationships).map(([name, relation]) => `- ${name}: ${relation}`).join('\n')}

        Other Locations:
        ${npcStore.locations.map(loc => {
        const npcs = ` NPCs there: ${loc.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}`

        return `- ${loc.name}: ${loc.description}\n${loc.npcs.length ? npcs : ''}`
        }).join('\n')}

        Player:
        - Name: ${player.name}
        - Gender: ${player.gender}
        - Race: ${player.race}
        - Class: ${player.class}
        Players inventory:
        ${player.inventory?.map(item => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || 'No items in inventory'}
        - Gold: ${player.gold}

        Recent Dialog:
        ${npcContext.dialogueHistory.slice(-5).map(d => `${d.isPlayer ? 'Player' : npcContext.name}: ${d.text}`).join('\n')}

        Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.
        If you liked the player's message, add "*like*".
        If you found the player's message confusing, add "*confused*".
        If you found the player's message offensive, add "*offensive*".
        If you found the player's message interesting, add "*interesting*".
        Player's message: ${message}`;

        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Error: Failed to get response from AI';
    }
};
