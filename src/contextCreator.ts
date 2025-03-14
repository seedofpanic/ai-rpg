import { npcStore } from './models/npcs';
import { itemsData } from './models/itemsData';
import { Player } from 'models/Player';
import { GenerativeModel } from '@google/generative-ai';
import { t } from './localization'; // Import localization

export const createContext = (model: GenerativeModel, npcId: string, player: Player, message: string) => {
    const npcContext = npcStore.npcs[npcId];

    if (!npcContext) {
        throw new Error(t('contextCreator.npcNotFound')); // Localized text
    }

    const beforeDialog = `
    ${t('contextCreator.npcIntroduction', { name: npcContext.name })}

    ${t('contextCreator.basicInformation')}:
    - ${t('contextCreator.race')}: ${npcContext.race}
    - ${t('contextCreator.role')}: ${npcContext.role}
    - ${t('contextCreator.background')}: ${npcContext.background}
    - ${t('contextCreator.trueBackground')}: ${npcContext.trueBackground}
    - ${t('contextCreator.motivation')}: ${npcContext.Motivation}
    - ${t('contextCreator.uniqueTrait')}: ${npcContext.uniqueTrait}
    - ${t('contextCreator.beliefs')}: ${npcContext.beliefs}
    
    ${t('contextCreator.inventory')}:
    ${npcContext.inventory?.map(item => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || t('noItems')}
    - ${t('contextCreator.gold')}: ${npcContext.gold}

    ${t('contextCreator.knowledgeAndExperience')}:
    ${npcContext.knowledge.map(k => `- ${k}`).join('\n')}
    ${t('contextCreator.loreAndBeliefs')}:
    ${t('lore')}

    ${t('contextCreator.location')}: (${t(npcContext.location.name)}):
    ${t(npcContext.location.description)}

    ${t('contextCreator.environment')}:
    - ${t('contextCreator.nearbyNpcs')}: ${npcContext.location.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role} ${npcStore.npcs[npcId].background}`).join(', ')}

    ${t('contextCreator.relationshipsWithOtherNpcs')}:
    ${Object.entries(npcContext.relationships).map(([name, relation]) => `- ${name}: ${relation}`).join('\n')}
    
    ${t('contextCreator.relationshipWithPlayer')}: ${npcContext.getPlayerRelation()}. ${t('contextCreator.increaseSellingPrice')}

    ${t('contextCreator.otherLocations')}:
    ${npcStore.locations.map(loc => {
    const npcs = ` ${t('contextCreator.npcsThere')}: ${loc.npcs.map(npcId => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}`

    return `- ${loc.name}: ${loc.description}\n${loc.npcs.length ? npcs : ''}`
    }).join('\n')}

    ${t('contextCreator.player')}:
    - ${t('contextCreator.name')}: ${player.name}
    - ${t('contextCreator.gender')}: ${player.gender}
    - ${t('contextCreator.race')}: ${player.race}
    - ${t('contextCreator.class')}: ${player.class}
    ${t('contextCreator.playersInventory')}:
    ${player.inventory?.map(item => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || t('contextCreator.noItems')}
    - ${t('contextCreator.gold')}: ${player.gold}

    ${t('contextCreator.recentDialog')}:
    `;
    const afterDialog = `

    ${t('contextCreator.responseInstructions')}

    ${t('contextCreator.playersMessage')}: ${message}`;

    let tokensCount = 0;
    let dialogIndex = 0;

    while (tokensCount < 500000 && dialogIndex < npcContext.dialogueHistory.length) {
        const dialogItem = npcContext.dialogueHistory[dialogIndex];
        tokensCount += dialogItem.tokensCount || 20; // 20 for hello message
        dialogIndex++;
    }
    const dialogContext = dialogIndex > 1 ? npcContext.dialogueHistory.slice(-dialogIndex + 1).map(d => `${d.isPlayer ? t('contextCreator.player') : npcContext.name}: ${d.text}`).join('\n') : '';

    return `${beforeDialog}${dialogContext}${afterDialog}`;
};
