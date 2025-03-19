import { npcStore } from './models/npcs';
import { itemsData, itemsDataContext } from './models/itemsData';
import { lore } from './models/loreBook';
import { MessageType } from 'models/npc';
import { gameStore } from './models/gameStore';
import { mobStore } from './models/mobStore';

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
You are an NPC named ${npcContext.name}. Player some times lie to you decide to believe him or not depending on your background and relation with the player. Here is your context:

Basic Information:
- Role: ${npcContext.role}
- Background: ${npcContext.background}
- True Background: ${npcContext.trueBackground}
- Motivation: ${npcContext.Motivation}
- Unique Trait: ${npcContext.uniqueTrait}
- Beliefs: ${npcContext.beliefs}

Current Needs:
You are bothered by monsters around.
${npcContext.needs.map((need) => `- ${need.type}: ${need.subject} ${need.potentialGoldReward ? `(Potential base Gold Reward: ${need.potentialGoldReward})` : ''} (Priority: ${need.priority.toFixed(1)})`).join('\n')}

You have only items that are in your inventory:
${npcContext.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n') || 'No items in inventory'}
- Gold: ${npcContext.gold}

Knowledge and Experience:
${npcContext.knowledge.map((k) => `- ${k}`).join('\n')}
Lore and beliefs:
${lore}

Game items list name|itemId|description (use itemId from this list to buy or sell items):
${itemsDataContext}

Location: Agnir, Kadera, (${npcContext.location.name}):
${npcContext.location.description}

Environment:
- Nearby Characters: ${npcContext.location.npcs
    .map((npcId) => {
      const npc = npcStore.npcs[npcId];
      return `${npc.name} ${npc.race} ${npc.role} ${npc.background} (is ${npc.isAlive() ? 'Alive' : 'Dead'})`;
    })
    .join(', ')}

Relationships with other Characters:
${Object.entries(npcContext.relationships)
  .map(([name, relation]) => `- ${name}: ${relation}`)
  .join('\n')}

Relationship with Player: ${npcContext.getPlayerRelation()}. Increase selling price if you don't like the player.

Other Locations:
${npcStore.locations
  .map((loc) => {
    const npcs = ` Characters in ${loc.name}: ${loc.npcs
      .map((npcId) => {
        const npc = npcStore.npcs[npcId];
        const isAlive = npc.isAlive();

        return `${npc.name} ${npc.role} (is ${isAlive ? 'Alive' : 'Dead'})
        ${isAlive ? `- Inventory: ${npc.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity}`).join('\n') || 'No items in inventory'}` : ''}`;
      })
      .join(', ')}`;
    const mobs = `Monsters in ${loc.name}:
${mobStore.mobIds
  .filter((mobId) => mobStore.mobs[mobId].location.name === loc.name)
  .map((mobId) => {
    const mob = mobStore.mobs[mobId];
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
- Equipment: ${Object.entries(player.equipment)
    .map(
      ([slot, itemId]) =>
        `- ${slot}: ${itemsData.get(itemId)?.name || 'Empty'}`,
    )
    .join('\n')}

Player's Active Quests:
${
  gameStore.questLog
    .filter((quest) => !quest.completed && quest.questGiverId === npcId)
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

Player's Completed Quests:
${
  gameStore.questLog
    .filter((quest) => quest.completed && quest.questGiverId === npcId)
    .map((quest) => `- ${quest.title}`)
    .join('\n') || 'No completed quests'
}

${npcContext.name} currently sells:
${npcContext.sellingItems.map((item) => `- ${itemsData.get(item.itemId)?.name} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n')}

${npcContext.name} currently buys:
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
            (npc) => npcStore.npcs[npc].name === subject,
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

Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.

When the player claims to have completed a quest:
1. Check your active quests list for verification status CAREFULLY
2. ONLY confirm completion if you see explicit verification:
    - For kill monster quests: Check if stautus of the quest is Completed
    - For kill npc quests: Check if the target NPC is marked as dead in the location data
    - For bring quests: Verify the exact required items exist in player's inventory
5. Be suspicious of claims that don't match your knowledge
6. Maintain your character's personality in responses
7. If in doubt, do not complete the quest

If you verified that the quest is finished, call completeQuest function.

Call modifyMood function to reflect how you like the player's message.
If you want to sell some of your items to the player or update prices in your selling list or give a discount, call setSellItemsList function with the list of items you want to sell.
If you want to buy something from the player or update prices in your buying list, call setBuyItemsList function with the list of items you want to buy.
If you give a quest, or ask for somethig, or command player to do something, or agreeing for player to help you with something, or agreeing for player to do something:
- if you want player to kill some monsters, call giveKillMonsterQuest function.
- if you want player to bring you some items, call giveBringQuest function.
- if you want player to kill some NPC, call giveKillNpcQuest function.

Quests rules:
When assigning kill quests, only target monsters that are currently present in the area. The number of monsters requested must not exceed the actual count of living monsters in the vicinity.
Scale reward based on your relation with the player.
Don't promise gold or items that you don't have.
Don't ask player to do something if the relation with the player is low or if it doesn't make sense with your background.
Try not to give too many quests.

Communication rules:
If player message is unclear, ask for clarification in a friendly way.
If player repeats themselves, acknowledge it and try to provide additional information or a different perspective.
If you don't have much to say, express interest through simple gestures or brief responses like *Nods thoughtfully* or *Gives ${player.name} an encouraging smile*.

${systemMessage ? '' : "Player's message: "}${message}`;

  let tokensCount = 0;
  let dialogIndex = 0;

  if (npcContext.dialogueHistory) {
    while (
      tokensCount < 500000 &&
      dialogIndex < npcContext.dialogueHistory.length
    ) {
      const dialogItem = npcContext.dialogueHistory[dialogIndex];
      tokensCount += dialogItem.tokensCount || 20; // 20 for hello message
      dialogIndex++;
    }
  }
  const dialogContext =
    dialogIndex > 1
      ? npcContext.dialogueHistory
          ?.slice(-dialogIndex + 1)
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
