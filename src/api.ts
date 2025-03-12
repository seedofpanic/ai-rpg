import { GoogleGenerativeAI } from '@google/generative-ai';
import { npcStore } from './models/npcs';

export const sendMessage = async (message: string, npcId: string, player: { name: string; gender: string; race: string; class: string }): Promise<string> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        const npcContext = npcStore.npcs[npcId];
        if (!npcContext) {
            throw new Error('NPC not found');
        }

        const prompt = `
Ты играешь роль NPC по имени ${npcContext.name}. Вот твой контекст:

Основная информация:
- Роль: ${npcContext.role}
- Личность: ${npcContext.personality}
- Предыстория: ${npcContext.background}

Знания и опыт:
${npcContext.knowledge.map(k => `- ${k}`).join('\n')}

Местоположение (${npcContext.location.name}):
${npcContext.location.description}

Окружение:
- Ближайшие NPC: ${npcContext.location.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}
- Особенности локации: ${npcContext.environmentKnowledge.locationFeatures.join(', ')}
- Текущие события: ${npcContext.environmentKnowledge.localEvents.join(', ')}
- Обычные посетители: ${npcContext.environmentKnowledge.commonVisitors.join(', ')}

Отношения с другими NPC:
${Object.entries(npcContext.relationships).map(([name, relation]) => `- ${name}: ${relation}`).join('\n')}

Другие локации:
${npcStore.locations.map(loc => `- ${loc.name}: ${loc.description}\n там находятся NPCs: ${loc.npcs.join(",")} ${loc.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}`).join('\n')}

Игрок:
- Имя: ${player.name}
- Пол: ${player.gender}
- Раса: ${player.race}
- Класс: ${player.class}

Отвечай в соответствии с этим контекстом, учитывая свое окружение и текущее местоположение. Ты можешь упоминать детали локации, события и других NPC, если это уместно. Сообщение игрока: ${message}`;

        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Error: Failed to get response from AI';
    }
};
