import { describe, it, expect } from 'vitest';
import { modelTools } from './modelTools';
import { SchemaType, FunctionDeclaration } from '@google/generative-ai';

type ExtendedSchema = {
  type: SchemaType;
  properties?: Record<string, ExtendedSchema>;
  enum?: string[];
  nullable?: boolean;
  items?: {
    type: SchemaType;
    properties: {
      name?: {
        type: SchemaType;
        nullable: boolean;
      };
      description?: {
        type: SchemaType;
        nullable: boolean;
      };
      itemId?: {
        type: SchemaType;
        nullable: boolean;
      };
      quantity?: {
        type: SchemaType;
        nullable: boolean;
      };
      price?: {
        type: SchemaType;
        nullable: boolean;
      };
      monsterType?: {
        type: SchemaType;
        nullable: boolean;
        enum?: string[];
        format?: string;
      };
      npcId?: {
        type: SchemaType;
        nullable: boolean;
      };
      subject?: {
        type: SchemaType;
        nullable: boolean;
      };
      locationId?: {
        type: SchemaType;
        nullable: boolean;
      };
      reward?: {
        type: SchemaType;
        properties?: {
          gold?: {
            type: SchemaType;
          };
          item?: {
            type: SchemaType;
            properties?: {
              itemId: {
                type: SchemaType;
                nullable: boolean;
              };
              quantity: {
                type: SchemaType;
                nullable: boolean;
              };
            };
          };
        };
      };
    };
  };
  required?: string[];
};

interface ExtendedFunctionDeclaration
  extends Omit<FunctionDeclaration, 'parameters'> {
  parameters: ExtendedSchema;
}

describe('modelTools', () => {
  describe('possibleReplies tool', () => {
    const repliesTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'possibleReplies');

    it('should have correct schema definition', () => {
      expect(repliesTool).toBeDefined();
      if (!repliesTool) return;

      const params = repliesTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.replies.type).toBe(SchemaType.ARRAY);
      expect(params.properties?.replies.items?.type).toBe(SchemaType.STRING);
    });
  });

  describe('giveReaction tool', () => {
    const reactionTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'giveReaction');

    it('should have correct schema definition', () => {
      expect(reactionTool).toBeDefined();
      if (!reactionTool) return;

      const params = reactionTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.reaction.type).toBe(SchemaType.STRING);
    });

    it('should have all required reaction states', () => {
      expect(reactionTool).toBeDefined();
      if (!reactionTool) return;

      const expectedReactions = [
        'like',
        'confused',
        'offensive',
        'interesting',
        'unfriendly',
        'hostile',
        'friendly',
        'neutral',
        'cautious',
        'wary',
        'frugality',
      ];

      const reactionSchema = reactionTool.parameters.properties?.reaction;
      expect(reactionSchema?.enum).toEqual(expectedReactions);
    });

    it('should require reaction parameter', () => {
      expect(reactionTool).toBeDefined();
      if (!reactionTool) return;

      expect(reactionTool.parameters.required).toContain('reaction');
    });
  });

  describe('offerDeliverItemQuest tool', () => {
    const questTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find(
      (tool) => tool.name === 'offerDeliverItemQuest',
    );

    it('should have correct schema definition', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const params = questTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.quests.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct quest item schema', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const questSchema = questTool.parameters.properties?.quests;
      const questItemSchema = questSchema?.items;
      expect(questItemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = questItemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.name?.type).toBe(SchemaType.STRING);
      expect(properties.name?.nullable).toBe(false);
      expect(properties.description?.type).toBe(SchemaType.STRING);
      expect(properties.description?.nullable).toBe(false);
      expect(properties.itemId?.type).toBe(SchemaType.STRING);
      expect(properties.itemId?.nullable).toBe(false);
      expect(properties.quantity?.type).toBe(SchemaType.NUMBER);
      expect(properties.quantity?.nullable).toBe(false);
    });
  });

  describe('offerKillMonsterQuest tool', () => {
    const questTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find(
      (tool) => tool.name === 'offerKillMonsterQuest',
    );

    it('should have correct schema definition', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const params = questTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.quests.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct quest item schema', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const questSchema = questTool.parameters.properties?.quests;
      const questItemSchema = questSchema?.items;
      expect(questItemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = questItemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.name?.type).toBe(SchemaType.STRING);
      expect(properties.name?.nullable).toBe(false);
      expect(properties.description?.type).toBe(SchemaType.STRING);
      expect(properties.description?.nullable).toBe(false);
      expect(properties.monsterType?.type).toBe(SchemaType.STRING);
      expect(properties.monsterType?.nullable).toBe(false);
      expect(properties.quantity?.type).toBe(SchemaType.NUMBER);
      expect(properties.quantity?.nullable).toBe(false);
    });
  });

  describe('offerKillNpcQuest tool', () => {
    const questTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'offerKillNpcQuest');

    it('should have correct schema definition', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const params = questTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.quests.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct quest item schema', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const questSchema = questTool.parameters.properties?.quests;
      const questItemSchema = questSchema?.items;
      expect(questItemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = questItemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.name?.type).toBe(SchemaType.STRING);
      expect(properties.name?.nullable).toBe(false);
      expect(properties.description?.type).toBe(SchemaType.STRING);
      expect(properties.description?.nullable).toBe(false);
      expect(properties.npcId?.type).toBe(SchemaType.STRING);
      expect(properties.npcId?.nullable).toBe(false);
    });
  });

  describe('offerInformationQuest tool', () => {
    const questTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find(
      (tool) => tool.name === 'offerInformationQuest',
    );

    it('should have correct schema definition', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const params = questTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.quests.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct quest item schema', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const questSchema = questTool.parameters.properties?.quests;
      const questItemSchema = questSchema?.items;
      expect(questItemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = questItemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.name?.type).toBe(SchemaType.STRING);
      expect(properties.name?.nullable).toBe(false);
      expect(properties.description?.type).toBe(SchemaType.STRING);
      expect(properties.description?.nullable).toBe(false);
      expect(properties.subject?.type).toBe(SchemaType.STRING);
      expect(properties.subject?.nullable).toBe(false);
    });
  });

  describe('offerEscortCharacterQuest tool', () => {
    const questTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find(
      (tool) => tool.name === 'offerEscortCharacterQuest',
    );

    it('should have correct schema definition', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const params = questTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.quests.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct quest item schema', () => {
      expect(questTool).toBeDefined();
      if (!questTool) return;

      const questSchema = questTool.parameters.properties?.quests;
      const questItemSchema = questSchema?.items;
      expect(questItemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = questItemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.name?.type).toBe(SchemaType.STRING);
      expect(properties.name?.nullable).toBe(false);
      expect(properties.description?.type).toBe(SchemaType.STRING);
      expect(properties.description?.nullable).toBe(false);
      expect(properties.subject?.type).toBe(SchemaType.STRING);
      expect(properties.subject?.nullable).toBe(false);
      expect(properties.locationId?.type).toBe(SchemaType.STRING);
      expect(properties.locationId?.nullable).toBe(false);
    });
  });

  describe('completeQuest tool', () => {
    const completeQuestTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'completeQuest');

    it('should have correct schema definition', () => {
      expect(completeQuestTool).toBeDefined();
      if (!completeQuestTool) return;

      const params = completeQuestTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.questId.type).toBe(SchemaType.STRING);
      expect(params.properties?.questId.nullable).toBe(false);
    });
  });

  describe('acceptQuest tool', () => {
    const acceptQuestTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'acceptQuest');

    it('should have correct schema definition', () => {
      expect(acceptQuestTool).toBeDefined();
      if (!acceptQuestTool) return;

      const params = acceptQuestTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.questId.type).toBe(SchemaType.STRING);
      expect(params.properties?.questId.nullable).toBe(false);
    });
  });

  describe('declineQuest tool', () => {
    const declineQuestTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'declineQuest');

    it('should have correct schema definition', () => {
      expect(declineQuestTool).toBeDefined();
      if (!declineQuestTool) return;

      const params = declineQuestTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.questId.type).toBe(SchemaType.STRING);
      expect(params.properties?.questId.nullable).toBe(false);
    });
  });

  describe('setSellItemsList tool', () => {
    const sellItemsTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'setSellItemsList');

    it('should have correct schema definition', () => {
      expect(sellItemsTool).toBeDefined();
      if (!sellItemsTool) return;

      const params = sellItemsTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.items.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct item schema', () => {
      expect(sellItemsTool).toBeDefined();
      if (!sellItemsTool) return;

      const itemsSchema = sellItemsTool.parameters.properties?.items;
      const itemSchema = itemsSchema?.items;
      expect(itemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = itemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.itemId?.type).toBe(SchemaType.STRING);
      expect(properties.itemId?.nullable).toBe(false);
      expect(properties.quantity?.type).toBe(SchemaType.NUMBER);
      expect(properties.quantity?.nullable).toBe(false);
      expect(properties.price?.type).toBe(SchemaType.NUMBER);
      expect(properties.price?.nullable).toBe(false);
    });
  });

  describe('setBuyItemsList tool', () => {
    const buyItemsTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'setBuyItemsList');

    it('should have correct schema definition', () => {
      expect(buyItemsTool).toBeDefined();
      if (!buyItemsTool) return;

      const params = buyItemsTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.items.type).toBe(SchemaType.ARRAY);
    });

    it('should have correct item schema', () => {
      expect(buyItemsTool).toBeDefined();
      if (!buyItemsTool) return;

      const itemsSchema = buyItemsTool.parameters.properties?.items;
      const itemSchema = itemsSchema?.items;
      expect(itemSchema?.type).toBe(SchemaType.OBJECT);

      const properties = itemSchema?.properties;
      expect(properties).toBeDefined();
      if (!properties) return;

      expect(properties.itemId?.type).toBe(SchemaType.STRING);
      expect(properties.itemId?.nullable).toBe(false);
      expect(properties.quantity?.type).toBe(SchemaType.NUMBER);
      expect(properties.quantity?.nullable).toBe(false);
      expect(properties.price?.type).toBe(SchemaType.NUMBER);
      expect(properties.price?.nullable).toBe(false);
    });
  });

  describe('memorizeImportantInformation tool', () => {
    const memorizeTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find(
      (tool) => tool.name === 'memorizeImportantInformation',
    );

    it('should have correct schema definition', () => {
      expect(memorizeTool).toBeDefined();
      if (!memorizeTool) return;

      const params = memorizeTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.information.type).toBe(SchemaType.STRING);
      expect(params.properties?.information.nullable).toBe(false);
    });
  });

  describe('spawnMonster tool', () => {
    const spawnTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'spawnMonster');

    it('should have correct schema definition', () => {
      expect(spawnTool).toBeDefined();
      if (!spawnTool) return;

      const params = spawnTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.monsterType.type).toBe(SchemaType.STRING);
      expect(params.properties?.quantity.type).toBe(SchemaType.NUMBER);
      expect(params.properties?.location.type).toBe(SchemaType.STRING);
    });
  });

  describe('startFollowingPlayer and stopFollowingPlayer tools', () => {
    const startFollowTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'startFollowingPlayer');

    const stopFollowTool = (
      modelTools as unknown as {
        functionDeclarations: ExtendedFunctionDeclaration[];
      }
    ).functionDeclarations.find((tool) => tool.name === 'stopFollowingPlayer');

    it('should have correct definitions', () => {
      expect(startFollowTool).toBeDefined();
      expect(stopFollowTool).toBeDefined();
    });
  });
});
