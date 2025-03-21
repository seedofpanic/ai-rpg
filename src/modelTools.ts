import { SchemaType, Tool } from '@google/generative-ai';
import { mobTypes } from 'models/mob';

export const modelTools: Tool = {
  functionDeclarations: [
    {
      name: 'modifyMood',
      description: 'Update NPC mood/reaction based on player message',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          state: {
            type: SchemaType.STRING,
            description: 'The emotional state/reaction of the NPC',
            enum: [
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
            ],
            format: 'enum',
            nullable: false,
          },
        },
        required: ['state'],
      },
    },
    {
      name: 'giveBringQuest',
      description: 'Give a quest to the player',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          quests: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                description: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                itemId: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                quantity: {
                  type: SchemaType.NUMBER,
                  nullable: false,
                },
                reward: {
                  type: SchemaType.OBJECT,
                  properties: {
                    gold: { type: SchemaType.NUMBER },
                    item: {
                      type: SchemaType.OBJECT,
                      properties: {
                        itemId: { type: SchemaType.STRING },
                        quantity: { type: SchemaType.NUMBER },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      name: 'giveKillMonsterQuest',
      description: 'Give a quest to the player',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          quests: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                description: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                monsterType: {
                  nullable: false,
                  enum: mobTypes,
                  type: SchemaType.STRING,
                  format: 'enum',
                },
                quantity: {
                  type: SchemaType.NUMBER,
                  nullable: false,
                },
                reward: {
                  type: SchemaType.OBJECT,
                  properties: {
                    gold: { type: SchemaType.NUMBER },
                    item: {
                      type: SchemaType.OBJECT,
                      properties: {
                        itemId: { type: SchemaType.STRING },
                        quantity: { type: SchemaType.NUMBER },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      name: 'giveKillNpcQuest',
      description: 'Give a quest to the player',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          quests: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                description: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                npcId: {
                  type: SchemaType.STRING,
                  nullable: false,
                },
                reward: {
                  type: SchemaType.OBJECT,
                  properties: {
                    gold: { type: SchemaType.NUMBER },
                    item: {
                      type: SchemaType.OBJECT,
                      properties: {
                        itemId: { type: SchemaType.STRING, nullable: false },
                        quantity: { type: SchemaType.NUMBER, nullable: false },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      name: 'completeQuest',
      description: 'Complete a quest',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          questId: { type: SchemaType.STRING, nullable: false },
        },
      },
    },
    {
      name: 'setSellItemsList',
      description: 'Set a list of items that you want to sell',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                itemId: { type: SchemaType.STRING, nullable: false },
                price: { type: SchemaType.NUMBER, nullable: false },
              },
            },
          },
        },
      },
    },
    {
      name: 'setBuyItemsList',
      description: 'Set a list of items that you want to buy',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                itemId: { type: SchemaType.STRING, nullable: false },
                price: { type: SchemaType.NUMBER, nullable: false },
              },
            },
          },
        },
      },
    },
    {
      name: 'setTransformedUserMessage',
      description: "Transformed player's message.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          message: {
            type: SchemaType.STRING,
            description:
              "The player's message transformed to match their intellect level.",
            nullable: false,
          },
        },
      },
    },
  ],
};
