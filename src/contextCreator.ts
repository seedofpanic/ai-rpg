import { npcStore } from './models/npcs';
import { itemsData } from './models/itemsData';
import { lore } from './models/loreBook';
import { Player } from 'models/Player';
import { MessageType } from 'models/npc';

export const createContext = (
  npcId: string,
  player: Player,
  message: string,
) => {
  const npcContext = npcStore.npcs[npcId];

  if (!npcContext) {
    throw new Error('NPC not found');
  }

  const beforeDialog = `
    You are an NPC named ${npcContext.name}. Player can lie to you, rely mostly on your personal knowledge. Here is your context:

    Basic Information:
    - Role: ${npcContext.role}
    - Background: ${npcContext.background}
    - True Background: ${npcContext.trueBackground}
    - Motivation: ${npcContext.Motivation}
    - Unique Trait: ${npcContext.uniqueTrait}
    - Beliefs: ${npcContext.beliefs}

    You have only items that are in your inventory:
    ${npcContext.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n') || 'No items in inventory'}
    - Gold: ${npcContext.gold}

    Knowledge and Experience:
    ${npcContext.knowledge.map((k) => `- ${k}`).join('\n')}
    Lore and beliefs:
    ${lore}

    Location: Agnir, Kadera, (${npcContext.location.name}):
    ${npcContext.location.description}

    Environment:
    - Nearby NPCs: ${npcContext.location.npcs.map((npcId) => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].race} ${npcStore.npcs[npcId].role} ${npcStore.npcs[npcId].background}`).join(', ')}

    Relationships with other NPCs:
    ${Object.entries(npcContext.relationships)
      .map(([name, relation]) => `- ${name}: ${relation}`)
      .join('\n')}
    
    Relationship with Player: ${npcContext.getPlayerRelation()}. Increase selling price if you don't like the player.

    Other Locations:
    ${npcStore.locations
      .map((loc) => {
        const npcs = ` NPCs there: ${loc.npcs.map((npcId) => `${npcStore.npcs[npcId].name} ${npcStore.npcs[npcId].role}`).join(', ')}`;

        return `- ${loc.name}: ${loc.description}\n${loc.npcs.length ? npcs : ''}`;
      })
      .join('\n')}

    Player:
    - Name: ${player.name}
    - Race: ${player.race}
    - Class: ${player.class}
    Players inventory:
    - Gold: ${player.gold}
    ${player.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n') || 'No items in inventory'}

    Recent Dialog:
    `;
  const afterDialog = `

    Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.
    If you liked the player's message, add "*like*".
    If you found the player's message confusing, add "*confused*".
    If you found the player's message offensive, add "*offensive*".
    If you found the player's message interesting, add "*interesting*".
    If you found the player's message unfriendly or hostile, add "*unfriendly*".
    If you want to sell something to the player, add a list of items with prices wrapped in <sell></sell>. Example: <sell>Iron Sword,50;Red mask,34</sell>
    If you want to buy something from the player, add a list of items with prices wrapped in <buy></buy>. Example: <buy>Iron Sword,50;Red mask,34</buy>

    Player's message: ${message}`;

  let tokensCount = 0;
  let dialogIndex = 0;

  while (
    tokensCount < 500000 &&
    dialogIndex < npcContext.dialogueHistory.length
  ) {
    const dialogItem = npcContext.dialogueHistory[dialogIndex];
    tokensCount += dialogItem.tokensCount || 20; // 20 for hello message
    dialogIndex++;
  }
  const dialogContext =
    dialogIndex > 1
      ? npcContext.dialogueHistory
          .slice(-dialogIndex + 1)
          .map((d) => {
            let prefix = '';
            if (d.type === MessageType.Player) {
              prefix = 'Player: ';
            } else if (d.type === MessageType.Action) {
              prefix = '';
            } else {
              prefix = `${npcContext.name}: `;
            }
            return `${prefix}${d.text}`;
          })
          .join('\n')
      : '';
  console.log('Total dialog tokens count:', tokensCount);

  return `${beforeDialog}${dialogContext}${afterDialog}`;
};
