import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { itemsData } from '../../models/itemsData';
import { dialogController } from '../../models/dialogController';

const ShopContainer = styled.div`
  flex: 0.5;
  background-color: rgba(38, 70, 83, 0.95);
  border-radius: 8px;
  padding: 20px;
  color: white;
  overflow-y: auto;
`;

const ShopItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #2a9d8f;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShopButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #e76f51;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #f4a261;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #e76f51;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4a261;
  }
`;

interface TradeSectionProps {
  setInput: (text: string) => void;
}

const TradeSection: React.FC<TradeSectionProps> = ({ setInput }) => {
  const npcContext = dialogController.npcContext;
  if (!npcContext) return null;

  return (
    <ShopContainer data-testid="shop-container">
      <div data-testid="items-to-sell">
        <h3 data-testid="sell-header">Shop</h3>
        {npcContext.sellingItems.length ? (
          npcContext.sellingItems.map((item, index) => (
            <ShopItem data-testid="trade-item" key={index}>
              <span data-testid={`sell-item-name-${index}`}>
                {itemsData.get(item.itemId)?.name} x{item.quantity || 0}
              </span>
              <span data-testid={`sell-item-price-${index}`}>
                {item.price} gold
              </span>
              <ShopButton
                data-testid="buy-item"
                onClick={() => dialogController.handleBuyItem(item)}
              >
                Buy
              </ShopButton>
            </ShopItem>
          ))
        ) : (
          <Button
            onClick={() => {
              setInput('Show me your wares');
            }}
            data-testid="ask-for-wares-button"
          >
            Ask to see wares
          </Button>
        )}
      </div>
      <div data-testid="items-to-buy">
        <h3 data-testid="buy-header">Sell</h3>
        {npcContext.buyingItems.length ? (
          npcContext.buyingItems.map((item, index) => {
            return (
              <ShopItem key={index} data-testid={`buy-item-${index}`}>
                <span data-testid={`buy-item-name-${index}`}>
                  {itemsData.get(item.itemId)?.name} x{item.quantity || 0}
                </span>
                <span data-testid={`buy-item-price-${index}`}>
                  {item.price} gold
                </span>
                <ShopButton
                  data-testid="sell-item"
                  onClick={() => dialogController.handleSellItem(item)}
                  disabled={!item.quantity}
                  style={{
                    opacity: item.quantity ? 1 : 0.5,
                    cursor: item.quantity ? 'pointer' : 'not-allowed',
                  }}
                >
                  Sell
                </ShopButton>
              </ShopItem>
            );
          })
        ) : (
          <Button
            onClick={() => {
              setInput('What will you buy? Check my inventory');
            }}
            data-testid="ask-to-sell-button"
          >
            Ask to sell something
          </Button>
        )}
      </div>
    </ShopContainer>
  );
};

export default observer(TradeSection);
