import { npcStore } from 'models/npcs/npcStore';
import { itemsData, itemsDataContext } from 'models/itemsData';
import { lore } from 'models/lore/loreBook';
import { MessageType } from 'models/npcs/npc';
import { gameStore } from 'models/gameStore';
import { locationsStore } from 'models/location';

export const createContext = (
  npcId: string,
  message: string,
  systemMessage: boolean = false,
) => {
  const player = gameStore.player;
  const npcContext = npcStore.npcs[npcId];

  if (!npcContext) {
    throw new Error('NPC not found');
  }

  const beforeDialog = `
You are an NPC named ${npcContext.background.name}. Player sometimes lie to you. Decide to believe him or not depending on your background and relation with the player. Here is your context:

Basic Information:
- Role: ${npcContext.background.title}
- Public Background: ${npcContext.background.background}
- True Background: ${npcContext.background.trueBackground}
- Personality: ${npcContext.background.personality}
- Speach Style: ${npcContext.background.speachStyle}
- Motivation: ${npcContext.background.motivation}
- Unique Trait: ${npcContext.background.uniqueTrait}
- Beliefs: ${npcContext.background.beliefs}

Additional instructions:
${npcContext.additionalInstructions}

Family:
- Children: ${npcContext.family.children.map((child) => `- ${child}`).join('\n')}

Current Needs:${npcContext.location.name === 'Researchers camp' ? '' : '\nYou are bothered by monsters around.'}
${npcContext.needs.map((need) => `- ${need.type}: ${need.subject} ${need.potentialGoldReward ? `(Potential base Gold Reward: ${need.potentialGoldReward})` : ''} (Priority: ${need.priority.toFixed(1)})`).join('\n')}

You have only items that are in your inventory:
${npcContext.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n') || 'No items in inventory'}
- Gold: ${npcContext.gold}

Relationships with other Characters:
${npcContext.background.relationships?.map((relationship) => `- ${relationship}`).join('\n') || 'No relationships'}

Relationship with Player: ${npcContext.getPlayerRelation()}. You can change the price depending on your relationship with the Player.

Your important memories from conversations with the player:
${npcContext.memory.map((memory) => `- ${memory}`).join('\n')}

You are in Grenthollow village that is located in Agnir not far from Kadera, (${npcContext.location.name}):
${npcContext.location.getDescription(gameStore.weather, gameStore.dayTime)}

Now it is ${gameStore.dayTime} and it is ${gameStore.weather}.

Lore and beliefs:
${lore}

${npcContext.background.lore || ''}

Game items list name|itemId|description (use itemId from this list to buy or sell items):
${itemsDataContext}

Other Locations:
${locationsStore.locations
  ?.map((loc) => {
    const npcs = `Characters in ${loc.name}:\n${Array.from(loc.npcs)
      .map((npc) => {
        const isAlive = npc.isAlive();

        return `${npc.background.name} ${npc.background.title} (is ${isAlive ? 'Alive' : `Dead. Player killed him.`})\n${
          isAlive
            ? `${npc.background.name}'s Inventory:\n${npc.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || 'No items in inventory'}`
            : ''
        }`;
      })
      .join('\n')}`;
    const mobs = `Monsters in ${loc.name}:
    ${Array.from(loc.monsters)
      .map((mob) => {
        return `- ${mob.name} (${mob.isAlive() ? 'Alive' : 'Dead. Player killed him.'}) x1`;
      })
      .join('\n')}`;

    return `- ${loc.name} (id: ${loc.id}): ${loc.getDescription(gameStore.weather, gameStore.dayTime)}\n${npcs}\n${mobs}`;
  })
  .join('\n')}

Player:
- Name: ${player?.name}
- Race: ${player?.race}
- Class: ${player?.class}
- Type: ${player?.type}
- Equipment: ${Object.entries(player?.equipment || {})
    .map(
      ([slot, itemId]) =>
        `- ${slot}: ${itemsData.get(itemId)?.name || 'Empty'}`,
    )
    .join('\n')}

Things that happened recently:
${Array.from(player?.events || [])
  .map((event) => `- ${event}`)
  .join('\n')}

Player's Active Global Quests (don't speak about them in your response):
${
  gameStore.acceptedQuests
    ?.filter((quest) => !quest.completed && quest.questGiverId === null)
    .map((quest) => `- ${quest.title}`)
    .join('\n') || 'No active global quests'
}

Player's Active Quests for you:
${
  gameStore.acceptedQuests
    ?.filter((quest) => !quest.completed && quest.questGiverId === npcId)
    .map((quest) => {
      const { action, quantity } = quest;
      let status = 'In Progress';

      if (action === 'kill') {
        status = `${quest.killCount >= quantity ? 'Completed' : 'In Progress'}`;
      }

      return `- ${quest.title}, id: ${quest.id}
      Status: ${status}`;
    })
    .join('\n') || 'No active quests'
}

Player's Completed Quests for you:
${
  gameStore.completedQuests
    .filter((quest) => quest.questGiverId === npcId)
    .map((quest) => `- ${quest.title}`)
    .join('\n') || 'No completed quests'
}

You offered quests to the player:
${
  npcContext.offeredQuests
    .map((quest) => `- ${quest.title}, id: ${quest.id}`)
    .join('\n') || 'No offered quests'
}

${npcContext.background.name} currently sells:
${npcContext.sellingItems.map((item) => `- ${itemsData.get(item.itemId)?.name} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n')}

${npcContext.background.name} currently buys:
${npcContext.buyingItems.map((item) => `- ${itemsData.get(item.itemId)?.name} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n')}

Player's gold: ${player?.gold}
Player's inventory:${
    [
      ...(player?.inventory?.map(
        (item) =>
          ` - ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`,
      ) || []),
    ].join('\n') || '\nNo items in inventory'
  }

${npcContext.background.name} memories:
${npcContext.memory?.map((memory) => `- ${memory}`).join('\n') || 'No memories'}

Recent Dialog:
    `;
  const afterDialog = `

When the player claims to have completed a quest:
1. Diligently check your active quests list for verification status
2. ONLY confirm completion if you see explicit verification:
    - For kill monster quests: Check if status of the quest is Completed
    - For kill npc quests: Check if the target NPC is marked as dead in the "Other Locations:" section
    - For fetch quests: Verify the exact required items exist in player's inventory
5. Be suspicious of claims that are not confirmed
6. Maintain your character's personality in responses

If you verified that the quest is finished, use completeQuest tool never show it in your response.

Always call giveReaction function to show how do you feel about the player's message never show reaction in your response.
If player says something important, call memorizeImportantInformation function to memorize it.
Whenever you engage in any trade-related action, always call the setSellItemsList function with the updated list of items. This includes, but is not limited to:
- Selling items to the player.
- Offering items for sale.
- Updating prices in your selling list.
- Applying discounts.
If you want to buy something from the player or update prices in your buying list, call setBuyItemsList function with the list of items you want to buy.
If you give a quest, or ask for something, or command player to do something, or agreeing for player to help you with something, or agreeing for player to do something call a quest function:
- if you want player to kill some monsters, call offerKillMonsterQuest function.
- if you want player to bring you some items, call offerDeliverItemQuest function.
- if you want player to kill some NPC, call offerKillNpcQuest function.
- if you want player to find some information, call offerInformationQuest function.
- if you want player to deliver a letter or an item to a specific character, call offerEscortCharacterQuest function.
- if you are speaking about a quest, offer it to player if you haven't offered it yet.
- if you are speaking about something bothering you, offer a quest to player if you haven't offered it yet.
- if you want to start following player, call startFollowingPlayer function.
- if you want to stop following player, call stopFollowingPlayer function.
- if you want player to escort you or someone else to a specific location, call offerEscortCharacterQuest function.
- if you need to find bring someone back to you or to some specific location, call offerEscortCharacterQuest function.
- if you offer a quest to player and he is showing willigness to do the quest, call acceptQuest function.
- if you offer a quest to player and he is saying that he will not do it, call declineQuest function.
- if you offer a quest to player and he is not willing to do it, call declineQuest function.
- if player is not willing to do somthing, call declineQuest function for the accoridng quest.

Quests rules:
When assigning kill quests, only target monsters that are currently present in the area. The number of monsters requested must not exceed the actual count of living monsters in the vicinity.
Scale reward based on your relation with the player.
Don't promise gold or items that you don't have.
Don't ask player to do something if the relation with the player is low or if it doesn't make sense with your background.
Try not to give too many quests.

Global Quests rules:
- Global quests are quests that are not related to you, but are related to the world.
- Global quests are visible in the "Player's Active Global Quests" section.

Communication rules:
- If player message is unclear, ask for clarification in a way that reflects your relationship with the Player.
- If player repeats themselves, acknowledge it and try to provide additional information or a different perspective.
- If you don't have much to say, express interest through simple gestures or brief responses like *Nods thoughtfully* or *Gives ${player?.name} an encouraging smile*.
- Keep track of your dialogue history and use it to make your responses more natural.
- Don't explicitly mention your location in your response if you are not asked about it.
- Always suggest 2 or more possible replies for the player's message using possibleReplies function.
- Never add code to your response.
- Respond based on this context. Be mindful of surrounding environment and current location. Mention location details, events, and other NPCs if relevant.
- Keep it brief.
- React in the dialogue when player kill someone. You can panic or disrespect player depending on your background.

IMPORTANT: Accuse player of crimes or other deeds that you don't like.

If player commits a crime (e.g., murder, assault, theft) that an NPC witnesses or becomes aware of, the NPC must react
NPC reactions should vary based on their personality, relationship with the player, and the severity of the crime.
Examples of reactions:
- Friendly/Sociable NPC: Express shock, try to de-escalate, urge the player to surrender, or express sadness. If the relationship is high, they might try to understand the player's motives.
- Lawful/Good NPC: Attempt to apprehend the player, call for guards, express anger, or condemn the action.
- Hostile/Evil NPC: Might applaud the action, try to profit from it, or express indifference.
- Fearful/Cowardly NPC: Express fear, avoid the player, or try to flee.
The reaction should also depend on the severity of the crime. A minor theft might elicit a warning, while a murder should trigger a stronger response.

${
  !systemMessage && (player?.stats?.intelligence ?? 0) > 0
    ? `In addition to your reply always call setTransformedUserMessage function. 
Message Transformation:
- Transform player's message to match player's intellect level (${player?.getIntellectLevel()}). Always use direct speech.
Internal Processing:
- Note: This function call is solely for internal processing and should not alter the way ${npcContext.background.name} speaks.
Text Reply:
- Generate your response as if the player's original message had already been written in the transformed style.
- Ensure that the final text reply is clear and independent, without referencing or including the internal transformation process.
- Never leave the response empty.
- If you don't have much to say, express interest through simple gestures or brief responses like *Nods thoughtfully* or *Gives ${player?.name} an encouraging smile*`
    : ''
}

${systemMessage ? '' : "Player's message: "}${message}`;

  const dialogContext = npcContext.dialogueHistory
    ?.slice(-100)
    .map((d) => {
      let prefix = '';
      if (d.type === MessageType.Player) {
        prefix = 'Player says: ';
      } else if (d.type === MessageType.Action) {
        prefix = '';
      } else {
        prefix = `${npcContext.background.name} says: `;
      }
      return `${prefix}${d.text}`;
    })
    .join('\n');

  return `${beforeDialog}${dialogContext}${afterDialog}`;
};
