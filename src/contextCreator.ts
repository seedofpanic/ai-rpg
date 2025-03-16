import { npcStore } from './models/npcs';
import { itemsData } from './models/itemsData';
import { lore } from './models/loreBook';
import { Player } from 'models/Player';
import { MessageType } from 'models/npc';
import { gameStore } from './models/gameStore';

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

    Current Needs:
    ${npcContext.needs.map((need) => `- ${need.type}: ${need.subject} (Priority: ${need.priority.toFixed(1)})`).join('\n')}

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
    - Nearby NPCs: ${npcContext.location.npcs
      .map((npcId) => {
        const npc = npcStore.npcs[npcId];
        return `${npc.name} ${npc.race} ${npc.role} ${npc.background} (is ${npc.isAlive() ? 'Alive' : 'Dead'})`;
      })
      .join(', ')}

    Relationships with other NPCs:
    ${Object.entries(npcContext.relationships)
      .map(([name, relation]) => `- ${name}: ${relation}`)
      .join('\n')}
    
    Relationship with Player: ${npcContext.getPlayerRelation()}. Increase selling price if you don't like the player.

    Other Locations:
    ${npcStore.locations
      .map((loc) => {
        const npcs = ` NPCs there: ${loc.npcs
          .map((npcId) => {
            const npc = npcStore.npcs[npcId];
            return `${npc.name} ${npc.role} (is${npc.isAlive() ? 'Alive' : 'Dead'})`;
          })
          .join(', ')}`;

        return `- ${loc.name}: ${loc.description}\n${loc.npcs.length ? npcs : ''}`;
      })
      .join('\n')}

    Player:
    - Name: ${player.name}
    - Race: ${player.race}
    - Class: ${player.class}
    
    Player's Active Quests:
    ${
      gameStore.questLog
        .filter((quest) => !quest.completed && quest.questGiverId === npcId)
        .map((quest) => {
          const { action, quantity, subject } = quest;
          let verificationStatus = '';

          if (action === 'Kill') {
            // For kill quests, check if the target is dead
            const targetNpc = Object.keys(npcStore.npcs).find(
              (npc) => npcStore.npcs[npc].name === subject,
            );
            if (targetNpc && !npcStore.npcs[targetNpc].isAlive()) {
              verificationStatus = '(Target eliminated)';
            }
          } else if (action === 'Bring') {
            // For bring/collect quests, check player's inventory
            const hasItem = player.inventory.some(
              (item) =>
                itemsData.get(item.itemId)?.name.toLowerCase() ===
                  subject.toLowerCase() && item.quantity >= quantity,
            );
            if (hasItem) {
              verificationStatus = '(Items collected)';
            }
          }

          return `- ${quest.title} ${verificationStatus}, id: ${quest.id}`;
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

    Players inventory:
    - Gold: ${player.gold}
    ${player.inventory?.map((item) => `- ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`).join('\n') || 'No items in inventory'}

    Recent Dialog:
    `;
  const afterDialog = `

    Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.

    When the player claims to have completed a quest:
    1. Check your active quests list for verification status
    2. If the quest shows "(Target eliminated)" or "(Items collected)", you can confirm it's completed
    3. If not verified, ask the player to prove completion (show items, etc.)
    4. Be suspicious of claims that don't match your knowledge
    5. Maintain your character's personality in responses
    If you think that the player has completed a quest add <completed>questId</completed> example <completed></completed> to the message.

    Add your mood towards the player's message using <mood>like</mood> or <mood>unfriendly</mood>. Valid moods are: like, confused, offensive, interesting, unfriendly.
    If you want to sell something to the player, add a list of items with prices wrapped in <sell></sell>. Example: <sell>Iron Sword,50;Red mask,34</sell>
    If you want to buy something from the player, add a list of items with prices wrapped in <buy></buy>. Example: <buy>Iron Sword,50;Red mask,34</buy>
    You can give quests to the player, if you do so add <quest></quest>. Example:
    <quest>
    [
      {
      "action": "Kill",
      "subject": "Haskir \\"The Iron Tactician\\"",
      "quantity": 10,
      "reward": {
        "gold": 50
      }, {
        "action": "Bring",
        "subject": "red mask",
        "quantity": 1,
        "reward": {
          "items": ["Healing Potion"]
        }
      }
    ]
    </quest>

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
