import { itemsData } from 'models/itemsData';
import { MessageType, NPC, TradeItem } from 'models/npc';

const parseItems = (data: string) => {
  const items: TradeItem[] = [];
  const itemsMatch = data.split(';');

  for (const item of itemsMatch) {
    const [name, price] = item.split(',');
    if (
      itemsData
        .entries()
        .find(([_, itemData]) => itemData.name === name.trim())
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

const extractTags = (text: string) => {
  const regex = /<(.+?)>(.*?)<\/.+?>/g;
  const tags = new Map<string, string>();
  const message = text.replace(regex, '');
  let match;

  while (match = regex.exec(text)) {
    tags.set(match[1], match[2]);
  }

  return { tags, message };
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

  const relationChange = npcContext.getRelationChange(npcContext.state);
  npcContext.changeRelation(relationChange); // Change relation based on response

  npcContext.addDialogHistory({
    text: message,
    type: MessageType.NPC,
    tokensCount,
    relationChange,
  }); // Save to dialogue history
};
