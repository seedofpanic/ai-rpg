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
    You are an NPC named ${npcContext.name}. Player can lie to you. Here is your context:

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
          let progressStatus = '';

          if (action === 'Kill') {
            // For kill quests, check if the target is dead
            const targetNpc = Object.keys(npcStore.npcs).find(
              (npc) => npcStore.npcs[npc].name === subject,
            );
            if (targetNpc) {
              if (!npcStore.npcs[targetNpc].isAlive()) {
                verificationStatus = `Player killed ${subject} and showed proof of ${subject}'s death to ${npcContext.name}`;
                progressStatus = 'Complete';
              } else {
                progressStatus = `Target ${subject} is still alive`;
              }
            } else {
              progressStatus = 'Target not found';
            }
          } else if (action === 'Bring') {
            // For bring/collect quests, check player's inventory
            const matchingItems = player.inventory.filter(
              (item) =>
                itemsData.get(item.itemId)?.name.toLowerCase() ===
                subject.toLowerCase()
            );
            
            if (matchingItems.length > 0) {
              const totalQuantity = matchingItems.reduce((sum, item) => sum + item.quantity, 0);
              if (totalQuantity >= quantity) {
                verificationStatus = '(Items collected)';
                progressStatus = `Has all required items (${totalQuantity}/${quantity})`;
              } else {
                progressStatus = `Has some items (${totalQuantity}/${quantity})`;
              }
            } else {
              progressStatus = `Missing required items (0/${quantity})`;
            }
          }

          return `- ${quest.title}, id: ${quest.id}
          Quest Type: ${action} ${quantity} ${subject}`;
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

    Player's gold: ${player.gold}
    Player's inventory:${[...player.inventory?.map((item) => ` - ${itemsData.get(item.itemId)?.name} x${item.quantity} cost ${itemsData.get(item.itemId)?.price} piece`),
      ...gameStore.questLog
        .filter((quest) => quest.questGiverId === npcId)
        .map((quest) => {
          const { action, subject } = quest;
          const targetNpc = Object.keys(npcStore.npcs).find(
            (npc) => npcStore.npcs[npc].name === subject,
          );
          if (action === 'Kill' && targetNpc && !npcStore.npcs[targetNpc].isAlive()) {
            return `      - ${subject}'s head`;
          }
        })].join('\n') || '\nNo items in inventory'
    }

    Recent Dialog:
    `;
  const afterDialog = `

    Respond based on this context, considering your environment and current location. Mention location details, events, and other NPCs if relevant. Keep it brief.

    When the player claims to have completed a quest:
    1. Check your active quests list for verification status CAREFULLY
    2. ONLY confirm completion if you see explicit verification:
       - For kill quests: Target must be dead and Player should have it's head in his inventory
       - For bring quests: Must show have the items in their inventory
    4. NEVER mark a quest as completed without proper verification
    5. Be suspicious of claims that don't match your knowledge
    6. Check player's inventory for proof of kills
    7. Maintain your character's personality in responses
    8. If in doubt, do not complete the quest

    If and ONLY IF you have verified quest completion, add <completed>questId</completed> example <completed>fb999a3a-d6b3-4066-956f-bf3e2c3ae759</completed> to the message.

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
