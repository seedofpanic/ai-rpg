import { npcStore } from './models/npcs';
import { itemsData } from './models/itemsData';
import { lore } from './models/loreBook';
import { Player } from 'models/Player';
import { GenerativeModel } from '@google/generative-ai';

export const createContext = (model: GenerativeModel, npcId: string, player: Player, message: string) => {
    const npcContext = npcStore.npcs[npcId];

    if (!npcContext) {
        throw new Error('NPC not found');
    }

    const beforeDialog = `
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

    Location: Agnir, Kadera, (${npcContext.location.name}):
    ${npcContext.location.description}

    Environment:
    - Nearby NPCs: ${npcContext.location.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}
    - Location Features: ${npcContext.environmentKnowledge.locationFeatures.join(', ')}
    - Current Events: ${npcContext.environmentKnowledge.localEvents.join(', ')}
    - Common Visitors: ${npcContext.environmentKnowledge.commonVisitors.join(', ')}

    Relationships with other NPCs:
    ${Object.entries(npcContext.relationships).map(([name, relation]) => `- ${name}: ${relation}`).join('\n')}
    
    Relationship with Player: ${npcContext.getPlayerRelation()}. Increase selling price if you don't like the player.

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
    `;
    const afterDialog = `

    Lore:
    ${lore}

    Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.
    If you liked the player's message, add "*like*".
    If you found the player's message confusing, add "*confused*".
    If you found the player's message offensive, add "*offensive*".
    If you found the player's message interesting, add "*interesting*".
    If you found the player's message unfriendly or hostile, add "*unfriendly*".
    If you are talking about trade, add a list of items with prices wrapped in <sell></sell>. Example: <sell>Iron Sword,50;Red mask,34</sell>

    Player's message: ${message}`;

    let tokensCount = 0;
    let dialogIndex = 0;

    while (tokensCount < 500000 && dialogIndex < npcContext.dialogueHistory.length) {
        const dialogItem = npcContext.dialogueHistory[dialogIndex];
        tokensCount += dialogItem.tokensCount || 20; // 20 for hello message
        dialogIndex++;
    }
    const dialogContext = dialogIndex > 1 ? npcContext.dialogueHistory.slice(-dialogIndex + 1).map(d => `${d.isPlayer ? 'Player' : npcContext.name}: ${d.text}`).join('\n') : '';
    console.log("Total dialog tokens count:", tokensCount);

    return `${beforeDialog}${dialogContext}${afterDialog}`;
};
