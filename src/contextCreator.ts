import { npcStore } from './models/npcStore';
import { itemsData, itemsDataContext } from './models/itemsData';
import { lore } from './models/loreBook';
import { MessageType } from 'models/npc';
import { gameStore } from './models/gameStore';
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

Current Needs:
You are bothered by monsters around.
${npcContext.needs.map((need) => `- ${need.type}: ${need.subject} ${need.potentialGoldReward ? `(Potential base Gold Reward: ${need.potentialGoldReward})` : ''} (Priority: ${need.priority.toFixed(1)})`).join('\n')}

You have only items that are in your inventory:
${npcContext.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n') || 'No items in inventory'}
- Gold: ${npcContext.gold}

Relationships with other Characters:
${npcContext.relationships?.map((relationship) => `- ${relationship}`).join('\n') || 'No relationships'}

Relationship with Player: ${npcContext.getPlayerRelation()}. You can change the price depending on your relationship with the Player.

Your important memories from conversations with the player:
${npcContext.memory.map((memory) => `- ${memory}`).join('\n')}

You are in Grenthollow village that is located in Agnir not far from Kadera, (${npcContext.location.name}):
${npcContext.location.description}

Now it is ${gameStore.dayTime} and it is ${gameStore.weather}.

Lore and beliefs:
${lore}

${
  npcContext.location.name === 'Research Camp'
    ? `
Common Knowledge About the Camp:

Location & Purpose
- The camp is a temporary but reinforced outpost established near the edge of the Zone of Unstable Magic.
- Its official purpose is to study the Zone’s effects, investigate magical anomalies, and report any findings to authorities in Kadera.
- Most of the structures are tents with a few reinforced huts for containment, research, and storage. Wards and basic magical protections are maintained daily.

The Zone
- The Zone was created after a catastrophic magical explosion in Arktown. While officials claim it's stable, everyone in the camp knows it's not.
- Exposure to the Zone is known to cause mutations, hallucinations, or soul-related phenomena. No one fully understands how it works.
- Strange creatures, shifting terrain, and anomalous weather are common at the edge.
- Artifacts, glowing crystals, and sometimes remnants of old structures have been recovered from shallow incursions into the Zone.

Safety & Protocol
- Daily decontamination procedures are required for any team returning from the Zone.
- Certain areas of the Zone are strictly off-limits, either because of risk—or because “someone higher up” said so.
- Accidents are covered up. At least two researchers are missing, and the official story doesn't add up. Most quietly assume the Zone got them—or something inside it did.
- Everyone knows that some of the guards follow different rules, but no one openly questions them unless they want to be reassigned or shut down.

Camp Dynamics
-The camp is divided into Research, Security, and Logistics, with occasional tension between them.
- Velra Droskin is the camp overseer—respected, but distant and cold. She keeps things running and tolerates little nonsense.
- The Brave Lions provide security. They used to be famous for honor, but now… not everyone is sure. Some are decent; others are too obedient.
- The researchers are divided between theory and fieldwork. Some think the Zone can be understood or harnessed—others think it’s a curse that should be sealed and forgotten.
- There’s an unspoken truth: everyone is watching everyone. Accusations are never voiced, but trust is always conditional.

Rumors Everyone Has Heard
- A crystal recovered from the Zone has gone missing.
- The Empire of Rok might be watching from afar, despite no official involvement yet.
- One of the senior researchers may be slowly going mad… or being “influenced” by the Zone.
- Some believe that a soul is trapped beneath the camp—a remnant from Arktown whispering through dreams.
`
    : ''
}

Game items list name|itemId|description (use itemId from this list to buy or sell items):
${itemsDataContext}

Other Locations:
${locationsStore.locations
  ?.map((loc) => {
    const npcs = ` Characters in ${loc.name}: ${loc.npcs
      .map((npc) => {
        const isAlive = npc.isAlive();

        return `${npc.background.name} ${npc.background.title} (is ${isAlive ? 'Alive' : 'Dead'})
        ${isAlive ? `- Inventory: ${npc.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || 'No items in inventory'}` : ''}`;
      })
      .join(', ')}`;
    const mobs = `Monsters in ${loc.name}:
${loc.monsters
  .map((mob) => {
    return `- ${mob.name} (${mob.isAlive() ? 'Alive' : 'Dead'}) x1`;
  })
  .join(', ')}`;

    return `- ${loc.name}: ${loc.description}\n${loc.npcs.length ? npcs : ''}\n${mobs}`;
  })
  .join('\n')}

Player:
- Name: ${player.name}
- Race: ${player.race}
- Class: ${player.class}
- Type: ${player.type}
- Equipment: ${Object.entries(player.equipment || {})
    .map(
      ([slot, itemId]) =>
        `- ${slot}: ${itemsData.get(itemId)?.name || 'Empty'}`,
    )
    .join('\n')}

Things that happend with player so far:
${Array.from(player.events)
  .map((event) => `- ${event}`)
  .join('\n')}

Player's Active Global Quests (don't speak about them in your response):
${
  gameStore.questLog
    ?.filter((quest) => !quest.completed && quest.questGiverId === null)
    .map((quest) => `- ${quest.title}`)
    .join('\n') || 'No active global quests'
}

Player's Active Quests for you:
${
  gameStore.questLog
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
  gameStore.questLog
    .filter((quest) => quest.completed && quest.questGiverId === npcId)
    .map((quest) => `- ${quest.title}`)
    .join('\n') || 'No completed quests'
}

${npcContext.background.name} currently sells:
${npcContext.sellingItems.map((item) => `- ${itemsData.get(item.itemId)?.name} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n')}

${npcContext.background.name} currently buys:
${npcContext.buyingItems.map((item) => `- ${itemsData.get(item.itemId)?.name} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n')}

Player's gold: ${player.gold}
Player's inventory:${
    [
      ...player.inventory?.map(
        (item) =>
          ` - ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`,
      ),
      ...gameStore.questLog
        .filter((quest) => quest.questGiverId === npcId)
        .map((quest) => {
          const { action, subject } = quest;
          const targetNpc = Object.keys(npcStore.npcs).find(
            (npc) => npcStore.npcs[npc].background.name === subject,
          );
          if (
            action === 'kill' &&
            targetNpc &&
            !npcStore.npcs[targetNpc].isAlive()
          ) {
            return `      - ${subject}'s head`;
          }
        }),
    ].join('\n') || '\nNo items in inventory'
  }

Recent Dialog:
    `;
  const afterDialog = `

Respond based on this context. Be mindful of surrounding environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.

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
- if you want player to kill some monsters, call giveKillMonsterQuest function.
- if you want player to bring you some items, call giveBringQuest function.
- if you want player to kill some NPC, call giveKillNpcQuest function.
- if you want player to find some information, call giveInformationQuest function.

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
If player message is unclear, ask for clarification in a way that reflects your relationship with the Player.
If player repeats themselves, acknowledge it and try to provide additional information or a different perspective.
If you don't have much to say, express interest through simple gestures or brief responses like *Nods thoughtfully* or *Gives ${player.name} an encouraging smile*.
Always suggest 2 or more possible replies for the player's message using possibleReplies function.

${
  !systemMessage && player.stats.intelligence > 0
    ? `In addition to your reply always call setTransformedUserMessage function. 
Message Transformation:
- Transform player's message to match player's intellect level (${player.getIntellectLevel()}). Always use direct speech.
Internal Processing:
- Note: This function call is solely for internal processing and should not alter the way ${npcContext.background.name} speaks.
Text Reply:
- Generate your response as if the player's original message had already been written in the transformed style.
- Ensure that the final text reply is clear and independent, without referencing or including the internal transformation process.
- Never leave the response empty.
- If you don't have much to say, express interest through simple gestures or brief responses like *Nods thoughtfully* or *Gives ${player.name} an encouraging smile*`
    : ''
}

${systemMessage ? '' : "Player's message: "}${message}`;

  const dialogContext = npcContext.dialogueHistory
    ?.slice(-100)
    .map((d) => {
      let prefix = '';
      if (d.type === MessageType.Player) {
        prefix = 'Player: ';
      } else if (d.type === MessageType.Action) {
        prefix = '';
      } else {
        prefix = `${npcContext.background.name}: `;
      }
      return `${prefix}${d.text}`;
    })
    .join('\n');

  return `${beforeDialog}${dialogContext}${afterDialog}`;
};
