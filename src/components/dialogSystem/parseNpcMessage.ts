import { MessageType, NPC } from 'models/npc';
import { gameStore } from 'models/gameStore';
import { v4 as uuidv4 } from 'uuid';
import { FunctionCall } from '@google/generative-ai';
import { npcStore } from 'models/npcs';
import { MobType, mobTypes } from 'models/mob';
import { itemsData } from 'models/itemsData';

interface QuestData {
  action: string;
  subject: string;
  quantity: number;
  reward: {
    gold?: number;
    items?: string[];
  };
}

interface CompletedQuestsData {
  questId: string;
}

interface BuyItemsData {
  items: {
    itemId: string;
    quantity: number;
    price: number;
  }[];
}

interface SellItemsData {
  items: {
    itemId: string;
    quantity: number;
    price: number;
  }[];
}

const parseBuyItems = (npcContext: NPC, data: BuyItemsData) => {
  for (const item of data.items) {
    npcContext.setBuyItems({
      itemId: item.itemId,
      price: item.price,
      quantity: item.quantity,
    });
  }
};

const parseSellItems = (npcContext: NPC, data: SellItemsData) => {
  for (const item of data.items) {
    npcContext.setSellItem({
      itemId: item.itemId,
      price: item.price,
      quantity: item.quantity,
    });
  }
};

const parseCompletedQuests = (data: CompletedQuestsData) => {
  gameStore.completeQuest(data.questId);
};

interface QuestData {
  quests: {
    name: string;
    description: string;
    itemId?: string;
    monsterType?: string;
    npcId?: string;
    quantity?: number;
    reward: {
      gold?: number;
      item?: {
        itemId: string;
        quantity: number;
      };
    };
  }[];
}

export const addQuests = (type: string, data: QuestData, npcContext: NPC) => {
  for (const quest of data.quests) {
    let subject = '';
    let quantity = 1;
    let action;

    // Set subject and quantity based on quest type
    if (type === 'kill monsters' && quest.monsterType) {
      subject = quest.monsterType;
      if (!mobTypes.includes(subject as MobType)) {
        return;
      }
      quantity = quest.quantity || 1;
      action = 'kill';
    } else if (type === 'kill NPC' && quest.npcId) {
      subject = quest.npcId;
      if (!npcStore.npcs[subject]) {
        return;
      }
      quantity = 1;
      action = 'kill';
    } else if (type === 'bring items') {
      subject = quest.itemId || '';
      if (!itemsData.has(subject)) {
        return;
      }
      quantity = quest.quantity || 1;
      action = 'bring';
    }

    gameStore.addQuest({
      id: uuidv4(),
      title: `${type} ${quantity} ${subject}`,
      description: quest.description,
      subject,
      quantity,
      action: action || '',
      completed: false,
      questGiverId: npcContext.id,
      rewards: {
        gold: quest.reward.gold,
        items: quest.reward.item ? [quest.reward.item.itemId] : undefined,
      },
      killCount: 0,
    });
  }
};

export const parseNpcMessage = (
  text: string,
  tokensCount: number,
  npcContext: NPC,
  functionCalls: FunctionCall[],
) => {
  for (const functionCall of functionCalls) {
    if (functionCall.name === 'giveKillMonsterQuest') {
      addQuests('kill monsters', functionCall.args as QuestData, npcContext);
    } else if (functionCall.name === 'giveBringQuest') {
      addQuests('bring items', functionCall.args as QuestData, npcContext);
    } else if (functionCall.name === 'giveKillNpcQuest') {
      addQuests('kill NPC', functionCall.args as QuestData, npcContext);
    } else if (functionCall.name === 'completeQuest') {
      parseCompletedQuests(functionCall.args as CompletedQuestsData);
    } else if (functionCall.name === 'setBuyItemsList') {
      parseBuyItems(npcContext, functionCall.args as BuyItemsData);
    } else if (functionCall.name === 'setSellItemsList') {
      parseSellItems(npcContext, functionCall.args as SellItemsData);
    }
  }

  // npcContext.setState(tags.get('state') || npcContext.state);
  // const items = parseItems(tags.get('sell') || '');
  // const buyItems = parseItems(tags.get('buy') || '');
  // npcContext.setBuyItems(buyItems);
  // npcContext.setShopItems(items);
  // parseCompletedQuests(tags.get('completed') || '');

  const relationChange = npcContext.getRelationChange(npcContext.state);
  npcContext.changeRelation(relationChange); // Change relation based on response

  npcContext.addDialogHistory({
    text,
    type: MessageType.NPC,
    tokensCount,
    relationChange,
  }); // Save to dialogue history
};
