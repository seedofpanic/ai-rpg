import { getRelationChange, MessageType, NPC } from 'models/npcs/npc';
import { gameStore } from 'models/gameStore';
import { FunctionCall, FunctionDeclarationsTool } from '@google/generative-ai';
import { npcStore } from 'models/npcs/npcStore';
import { MobType, mobTypes } from 'models/mobs/mob';
import { itemsData } from 'models/itemsData';
import { modelTools } from 'modelTools';
import { Quest } from 'models/Quest';

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

interface AcceptedQuestData {
  questId: string;
}

interface DeclinedQuestData {
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
  if (!data.items) {
    return;
  }

  for (const item of data.items) {
    npcContext.setBuyItems({
      itemId: item.itemId,
      price: item.price,
      quantity: item.quantity,
    });
  }
};

const parseSellItems = (npcContext: NPC, data: SellItemsData) => {
  if (!data.items) {
    return;
  }

  for (const item of data.items) {
    npcContext.setSellItem({
      itemId: item.itemId,
      price: item.price,
      quantity: item.quantity,
    });
  }
};

const parseCompletedQuests = (data: CompletedQuestsData, npcContext: NPC) => {
  const quest = gameStore.completeQuest(data.questId);

  if (quest) {
    npcContext.addDialogHistory({
      text: `Quest completed: ${quest.title}`,
      type: MessageType.Action,
    }); // Save to dialogue history
  }
};

const parseAcceptedQuest = (data: AcceptedQuestData, npcContext: NPC) => {
  gameStore.acceptQuest(data.questId, npcContext);
};

const parseDeclinedQuest = (data: DeclinedQuestData, npcContext: NPC) => {
  gameStore.declineQuest(data.questId, npcContext);
};

interface QuestData {
  quests: {
    name: string;
    description: string;
    itemId?: string;
    monsterType?: string;
    npcId?: string;
    quantity?: number;
    subject?: string;
    locationId?: string;
    item?: {
      itemId: string;
      quantity: number;
      description: string;
    };
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
    let title = '';
    let questGiverId = npcContext.id;

    // Set subject and quantity based on quest type
    if (type === 'kill monsters' && quest.monsterType) {
      subject = quest.monsterType;
      if (!mobTypes.includes(subject as MobType)) {
        return;
      }
      quantity = quest.quantity || 1;
      action = 'kill';
      title = `${type} ${quantity} ${itemsData.get(subject)?.name || subject}`;
    } else if (type === 'kill NPC' && quest.npcId) {
      subject = quest.npcId;
      if (!npcStore.npcs[subject]) {
        return;
      }
      quantity = 1;
      action = 'kill';
      title = `${type} ${itemsData.get(subject)?.name || subject}`;
    } else if (type === 'bring items') {
      subject = quest.itemId || '';
      if (!itemsData.has(subject)) {
        return;
      }
      quantity = quest.quantity || 1;
      action = 'bring';
      title = `${type} ${quantity} ${itemsData.get(subject)?.name || subject}`;
    } else if (type === 'information') {
      subject = quest.subject || '';
      action = 'information';
      title = `${quest.name}`;
    } else if (type === 'deliver') {
      questGiverId =
        npcStore.npcIds.find(
          (id) => npcStore.npcs[id].background.name === quest.subject,
        ) || npcContext.id;
      subject = quest.item?.itemId || '';
      action = 'deliver';
      title = `${type} x${quest.item?.quantity || 1} ${itemsData.get(quest.item?.itemId || '')?.name || quest.item?.itemId}`;
    } else if (type === 'escort') {
      subject = quest.subject || '';
      action = 'escort';
      title = quest.name;
    }

    if (!title) {
      return;
    }

    npcContext.offerQuest(
      new Quest({
        title,
        description: quest.description,
        subject,
        quantity,
        action: action || '',
        questGiverId,
        rewards: {
          gold: quest.reward.gold,
          items: quest.reward.item ? [quest.reward.item.itemId] : undefined,
        },
      }),
    );
  }
};

const functions = {
  offerKillMonsterQuest: (args: unknown, npcContext: NPC) =>
    addQuests('kill monsters', args as QuestData, npcContext),
  offerDeliverItemQuest: (args: unknown, npcContext: NPC) =>
    addQuests('bring items', args as QuestData, npcContext),
  offerKillNpcQuest: (args: unknown, npcContext: NPC) =>
    addQuests('kill NPC', args as QuestData, npcContext),
  offerInformationQuest: (args: unknown, npcContext: NPC) =>
    addQuests('information', args as QuestData, npcContext),
  offerEscortCharacterQuest: (args: unknown, npcContext: NPC) =>
    addQuests('escort', args as QuestData, npcContext),
  completeQuest: (args: unknown, npcContext: NPC) =>
    parseCompletedQuests(args as CompletedQuestsData, npcContext),
  acceptQuest: (args: unknown, npcContext: NPC) =>
    parseAcceptedQuest(args as AcceptedQuestData, npcContext),
  declineQuest: (args: unknown, npcContext: NPC) =>
    parseDeclinedQuest(args as DeclinedQuestData, npcContext),
  setBuyItemsList: (args: unknown, npcContext: NPC) =>
    parseBuyItems(npcContext, args as BuyItemsData),
  setSellItemsList: (args: unknown, npcContext: NPC) =>
    parseSellItems(npcContext, args as SellItemsData),
  giveReaction: (args: unknown, npcContext: NPC) => {
    npcContext.setState((args as { reaction: string }).reaction);
    const relationChange = getRelationChange(npcContext.state);
    npcContext.changeRelation(relationChange); // Change relation based on response
  },
  setTransformedUserMessage: (args: unknown, npcContext: NPC) => {
    npcContext.replaceUserMessage((args as { message: string }).message);
  },
  memorizeImportantInformation: (args: unknown, npcContext: NPC) => {
    npcContext.addMemory((args as { information: string }).information);
  },
  possibleReplies: (args: unknown, npcContext: NPC) => {
    gameStore.setPossibleReplies(
      npcContext.id,
      (args as { replies: string[] }).replies,
    );
  },
  giveItem: (args: unknown) => {
    gameStore.player.addItemToInventory(
      args as { itemId: string; quantity: number },
    );
  },
  giveGold: (args: unknown) => {
    gameStore.player.addGold((args as { gold: number }).gold);
  },
  spawnMonster: (args: unknown) => {
    const { monsterType, quantity, location } = args as {
      monsterType: string;
      quantity: number;
      location: string;
    };

    gameStore.spawnMonster(monsterType, quantity, location);
  },
  startFollowingPlayer: (_args: unknown, npcContext: NPC) => {
    npcContext.startFollowingPlayer();
  },
  stopFollowingPlayer: (_args: unknown, npcContext: NPC) => {
    npcContext.stopFollowingPlayer();
  },
};

export const parseNpcMessage = (
  text: string,
  npcContext: NPC,
  functionCalls: FunctionCall[],
) => {
  let stateChange;
  npcContext.setState('');

  for (const functionCall of functionCalls) {
    const f = functions[functionCall.name as keyof typeof functions];

    if (f) {
      f(functionCall.args as unknown, npcContext);
    } else {
      console.error(`Function ${functionCall.name} not found`);
    }
  }

  for (const tool of (modelTools as FunctionDeclarationsTool)
    .functionDeclarations || []) {
    text = text.replace(tool.name, '');
  }

  if (npcContext.state) {
    stateChange = {
      state: npcContext.state,
      change: getRelationChange(npcContext.state),
    };
  }

  npcContext.addDialogHistory({
    text,
    type: MessageType.NPC,
    moodChange: stateChange,
  }); // Save to dialogue history
};
