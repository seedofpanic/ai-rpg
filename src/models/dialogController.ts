import { NPC, MessageType, TradeItem } from './npc';
import { gameStore } from './gameStore';
import { itemsData } from './itemsData';
import { sendMessage } from '../api';
import { parseNpcMessage } from '../components/dialogSystem/parseNpcMessage';
import { npcStore } from './npcStore';
import { makeAutoObservable } from 'mobx';
export class DialogController {
  npcContext: NPC | null = null;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  initializeDialog(npcId: string) {
    this.npcContext = npcStore.npcs[npcId] as NPC;

    if (this.npcContext && this.npcContext.dialogueHistory === null) {
      this.npcContext.initializeDialogueHistory();
      this.handleSendMessage(
        'You see a player standing in front of you. You can great him or meet him with a blank stare.',
        true,
      );
    }
  }

  async handleSendMessage(
    message: string,
    systemMessage: boolean = false,
  ): Promise<void> {
    if (this.npcContext === null) return;
    if (message.trim() === '' || this.isLoading) return;

    this.setIsLoading(true);

    try {
      if (!systemMessage) {
        this.npcContext.addDialogHistory({
          text: message,
          type: MessageType.Player,
          tokensCount: 30,
        });
      }

      const response = await sendMessage(
        message,
        this.npcContext.id,
        systemMessage,
      );

      if (!response) {
        return;
      }

      const { text, tokensCount, functionCalls } = response;
      parseNpcMessage(text, tokensCount, this.npcContext, functionCalls);
    } catch (error) {
      console.error('Failed to send message:', error);
      this.npcContext.addDialogHistory({
        text: "Sorry, I couldn't process that message. Please try again.",
        type: MessageType.NPC,
        tokensCount: 20,
      });
    } finally {
      this.setIsLoading(false);
    }
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  handleBuyItem(item: TradeItem): void {
    if (this.npcContext === null) return;
    if (gameStore.player.gold >= item.price) {
      const itemData = itemsData.get(item.itemId);

      if (!itemData) {
        return;
      }

      gameStore.player.updateGold(-item.price);
      this.npcContext.updateGold(item.price);
      this.npcContext.removeBuyItem(item, 1);

      this.npcContext.removeItem({ itemId: item.itemId, quantity: 1 });
      gameStore.player?.addItemToInventory({
        itemId: item.itemId,
        quantity: 1,
      });
      const textToAdd = `Player bought ${itemData.name} for ${item.price} gold from ${this.npcContext.background.name}`;
      if (
        this.npcContext.dialogueHistory &&
        this.npcContext.dialogueHistory[
          this.npcContext.dialogueHistory?.length - 1
        ].text !== textToAdd
      ) {
        this.npcContext.addDialogHistory({
          text: textToAdd,
          type: MessageType.Action,
          tokensCount: 20,
        });
      }
      console.log(`Bought ${itemData.name} for ${item.price} gold.`);
      gameStore.player.events.add(
        `${gameStore.player.name} traded with ${this.npcContext.background.name}`,
      );
    } else {
      console.log('Not enough gold.');
    }
  }

  handleSellItem(item: TradeItem): void {
    if (this.npcContext === null) return;
    if (this.npcContext.gold >= item.price) {
      const itemData = itemsData.get(item.itemId);

      if (!itemData) {
        return;
      }

      gameStore.player.updateGold(item.price);
      this.npcContext.updateGold(-item.price);
      this.npcContext.removeBuyItem(item, 1);
      gameStore.player?.removeItemFromInventory({
        itemId: item.itemId,
        quantity: 1,
      });
      this.npcContext.addItem({ itemId: item.itemId, quantity: 1 });
      this.npcContext.addDialogHistory({
        text: `Player sold ${itemData.name} for ${item.price} gold to ${this.npcContext.background.name}`,
        type: MessageType.Action,
        tokensCount: 20,
      });
      console.log(`Sold ${itemData.name} for ${item.price} gold.`);
      gameStore.player.events.add(
        `${gameStore.player.name} traded with ${this.npcContext.background.name}`,
      );
    }
  }
}

export const dialogController = new DialogController();
