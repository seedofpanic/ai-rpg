import { SchemaType, Tool } from '@google/generative-ai';
import { mobTypes } from 'models/mob';

export const modelTools: Tool = {
  functionDeclarations: [
    {
      name: 'possibleReplies',
      description: 'Suggest what the player can say next`',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          replies: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING, nullable: false },
          },
        },
      },
    },
    {
      name: 'giveReaction',
      description: 'Give reaction to the player message',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          reaction: {
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
        required: ['reaction'],
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
              required: ['name', 'description', 'itemId', 'quantity', 'reward'],
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
              required: [
                'name',
                'description',
                'monsterType',
                'quantity',
                'reward',
              ],
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
              required: ['name', 'description', 'npcId', 'reward'],
            },
          },
        },
      },
    },
    {
      name: 'giveInformationQuest',
      description: 'Give a quest to the player',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          quests: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING, nullable: false },
                description: { type: SchemaType.STRING, nullable: false },
                subject: {
                  type: SchemaType.STRING,
                  nullable: false,
                  description:
                    'Information that needs to be provided by the player to complete the quest',
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
                  nullable: false,
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
        required: ['questId'],
      },
    },
    {
      name: 'setSellItemsList',
      description: 'Add all the items you want to sell to the list.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                itemId: { type: SchemaType.STRING, nullable: false },
                quantity: { type: SchemaType.NUMBER, nullable: false },
                price: { type: SchemaType.NUMBER, nullable: false },
              },
              required: ['itemId', 'quantity', 'price'],
            },
          },
        },
      },
    },
    {
      name: 'setBuyItemsList',
      description:
        'Add all the items you want to buy to the list. Be mindful about how much gold you have.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          items: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                itemId: { type: SchemaType.STRING, nullable: false },
                quantity: { type: SchemaType.NUMBER, nullable: false },
                price: { type: SchemaType.NUMBER, nullable: false },
              },
              required: ['itemId', 'quantity', 'price'],
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
    {
      name: 'memorizeImportantInformation',
      description: 'Memorize important information from ueser message.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          information: {
            type: SchemaType.STRING,
            description: 'Important information from user message.',
            nullable: false,
          },
        },
        required: ['information'],
      },
    },
  ],
};
