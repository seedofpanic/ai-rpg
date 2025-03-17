import { itemsData } from 'models/itemsData';
import { MessageType, NPC, TradeItem } from 'models/npc';
import { gameStore } from 'models/gameStore';
import { v4 as uuidv4 } from 'uuid';

const parseItems = (data: string) => {
  const items: TradeItem[] = [];
  const itemsMatch = data.split(';');

  for (const item of itemsMatch) {
    const [name, price] = item.split(',');
    if (
      itemsData.entries().find(([_, itemData]) => itemData.name === name.trim())
    ) {
      const itemId = Array.from(itemsData.keys()).find(
        (key) => itemsData.get(key)?.name === name.trim(),
      );
      if (itemId) {
        items.push({ itemId, price: parseFloat(price.trim()) });
      }
    }
  }

  return items;
};

interface QuestData {
  action: string;
  subject: string;
  quantity: number;
  reward: {
    gold?: number;
    items?: string[];
  };
}

const parseQuests = (data: string, description: string, npcId: string) => {
  try {
    const questsData = JSON.parse(data) as QuestData[];
    return questsData.map((questData) => {
      return {
        id: uuidv4(),
        title: `${questData.action} ${questData.quantity} ${questData.subject}`,
        description: description.trim(),
        subject: questData.subject,
        quantity: questData.quantity || 1,
        action: questData.action,
        completed: false,
        questGiverId: npcId,
        rewards: questData.reward,
        killCount: 0,
      };
    });
  } catch (error) {
    console.error('Error parsing quests:', error);
    return [];
  }
};

const extractTags = (text: string) => {
  const tags = new Map<string, string>();
  let message = text;

  let startTagIndex = message.indexOf('<');
  while (startTagIndex !== -1) {
    if (message[startTagIndex + 1] === '/') {
      startTagIndex = message.indexOf('>', startTagIndex + 1);
      continue;
    }

    // Find the end of tag name
    const tagNameEnd = message.indexOf('>', startTagIndex);

    if (tagNameEnd === -1) {
      startTagIndex = message.indexOf('<');
      continue;
    }

    // Extract tag name
    const tagName = message.substring(startTagIndex + 1, tagNameEnd);

    // Find closing tag
    let closingTagStart = message.indexOf(`</${tagName}>`, tagNameEnd);
    if (closingTagStart === -1) {
      closingTagStart = message.length - 1;
    }

    // Extract content between tags
    const content = message.substring(tagNameEnd + 1, closingTagStart);

    // Add to tags map
    tags.set(tagName, content);

    // Remove the tag and content from message
    const beforeTag = message.substring(0, startTagIndex);
    const afterTag = message.substring(closingTagStart + tagName.length + 3); // +3 for "</>"
    message = beforeTag + afterTag;

    // Find next tag
    startTagIndex = message.indexOf('<');
  }

  return { tags, message: message.trim() };
};

const parseCompletedQuests = (data: string) => {
  const completedQuests = data.split(';');
  completedQuests.forEach((quest) => {
    gameStore.completeQuest(quest);
  });
};

export const parseNpcMessage = (
  text: string,
  tokensCount: number,
  npcContext: NPC,
) => {
  const { tags, message } = extractTags(text);
  npcContext.setState(tags.get('state') || npcContext.state);
  const items = parseItems(tags.get('sell') || '');
  const buyItems = parseItems(tags.get('buy') || '');
  npcContext.setBuyItems(buyItems);
  npcContext.setShopItems(items);
  parseCompletedQuests(tags.get('completed') || '');

  // Parse and add quests
  const questData = tags.get('quest');
  if (questData) {
    const quests = parseQuests(questData, message, npcContext.id);
    quests.forEach((quest) => {
      if (gameStore.addQuest(quest)) {
        npcContext.addDialogHistory({
          text: `New quest received: ${quest.title}`,
          type: MessageType.Action,
          tokensCount: 10,
        });
      }
    });
  }

  const relationChange = npcContext.getRelationChange(npcContext.state);
  npcContext.changeRelation(relationChange); // Change relation based on response

  npcContext.addDialogHistory({
    text: message,
    type: MessageType.NPC,
    tokensCount,
    relationChange,
  }); // Save to dialogue history
};
