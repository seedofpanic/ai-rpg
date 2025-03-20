import { describe, it, expect } from 'vitest';
import { modelTools } from './modelTools';
import { SchemaType, Tool, FunctionDeclaration } from '@google/generative-ai';

type ExtendedSchema = {
  type: SchemaType;
  properties?: Record<string, ExtendedSchema>;
  enum?: string[];
  items?: {
    type: SchemaType;
    properties: {
      name: {
        type: SchemaType;
        nullable: boolean;
      };
    };
  };
  required?: string[];
};

interface ExtendedFunctionDeclaration extends Omit<FunctionDeclaration, 'parameters'> {
  parameters: ExtendedSchema;
}

describe('modelTools', () => {
  describe('modifyMood tool', () => {
    const modifyMoodTool = (modelTools as unknown as { functionDeclarations: ExtendedFunctionDeclaration[] })
      .functionDeclarations.find(
        (tool) => tool.name === 'modifyMood'
      );

    it('should have correct schema definition', () => {
      expect(modifyMoodTool).toBeDefined();
      if (!modifyMoodTool) return;

      const params = modifyMoodTool.parameters;
      expect(params.type).toBe(SchemaType.OBJECT);
      expect(params.properties?.state.type).toBe(SchemaType.STRING);
    });

    it('should have all required mood states', () => {
      expect(modifyMoodTool).toBeDefined();
      if (!modifyMoodTool) return;

      const expectedMoods = [
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

      const stateSchema = modifyMoodTool.parameters.properties?.state;
      expect(stateSchema?.enum).toEqual(expectedMoods);
    });

    it('should require state parameter', () => {
      expect(modifyMoodTool).toBeDefined();
      if (!modifyMoodTool) return;

      expect(modifyMoodTool.parameters.required).toContain('state');
    });
  });

  describe('giveBringQuest tool', () => {
    const questTool = (modelTools as unknown as { functionDeclarations: ExtendedFunctionDeclaration[] })
      .functionDeclarations.find(
        (tool) => tool.name === 'giveBringQuest'
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
      expect(questItemSchema?.properties.name.type).toBe(SchemaType.STRING);
      expect(questItemSchema?.properties.name.nullable).toBe(false);
    });
  });
}); 