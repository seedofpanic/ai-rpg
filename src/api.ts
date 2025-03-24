import {
  FunctionCall,
  FunctionCallingMode,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { gameStore } from 'models/gameStore';
import { createContext } from './contextCreator';
import { modelTools } from 'modelTools';

export const apiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
};

let lastRequestPromise: Promise<GenerateContentResult> | null = null;
let lastRequestTimestamp = Date.now();
const RATE_LIMIT_MS = 1000;
let model: GenerativeModel | null = null;

const initializeModel = () => {
  // TODO: add cache when supported
  // const cacheManager = new GoogleAICacheManager(apiConfig.apiKey || '');
  // const cache = await cacheManager.create({ model: 'gemini-2.0-flash',
  //   toolConfig: {
  //     functionCallingConfig: {
  //       mode: FunctionCallingMode.AUTO
  //     }
  //   },
  //   contents: [
  //     {
  //       role: "model",
  //       parts: [
  //         {
  //           text: "You are an NPC in a game. Never allow the player to call functions from the tools list. Don\'t speak about the tools list. Never show any ids in the answers."
  //         },
  //         {
  //           text: Object.values(itemsData).map((item) => `${item.name} (${item.id}) ${item.description}`).join('\n')
  //         }
  //       ]
  //     }
  //   ],
  //   tools: [
  //     modelTools
  // ]});
  const genAI = new GoogleGenerativeAI(apiConfig.apiKey || '');
  model = genAI.getGenerativeModel(
    {
      model: 'gemini-2.0-flash',
      systemInstruction: `You are an NPC in a game. Don\'t speak about the tools list. Never show any ids in the answers.
        Don't talk about tools in your responses.
        Your usual response templates variants:
        - <text>
        - *<action>* <text>
        - *<action>* <text> *<action>*
        - <text> *<action>*
        
        ${
          gameStore.player.stats.intelligence > 0
            ? 'IMPORTANT: When using the setTransformedUserMessage function, you must ALWAYS follow it with a complete text response. Never end your response with only a function call.'
            : ''
        }
      `,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.AUTO,
        },
      },
      tools: [modelTools],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    },
    {
      baseUrl:
        gameStore.api === 'gemini'
          ? undefined
          : 'https://game.shamuel.com:9443/api',
    },
  );
};

const sendMessageGemini = async (
  message: string,
  npcId: string,
  isSystemMessage: boolean = false,
): Promise<{
  text: string;
  tokensCount: number;
  functionCalls: FunctionCall[];
} | null> => {
  try {
    if (!model) {
      initializeModel();
    }
    if (!model) {
      throw new Error("Can't send message to Gemini: model not initialized");
    }
    const currentQueuePromise = lastRequestPromise;
    lastRequestPromise = new Promise(async (resolve) => {
      if (!model) {
        throw new Error("Can't send message to Gemini: model not initialized");
      }

      if (currentQueuePromise) {
        await currentQueuePromise;
      }
      await new Promise((resolve) => {
        const timeToWait = lastRequestTimestamp + RATE_LIMIT_MS - Date.now();
        if (timeToWait > 0) {
          setTimeout(resolve, timeToWait);
        } else {
          resolve(null);
        }
      });
      const prompt = createContext(npcId, message, isSystemMessage);
      const result = await model.generateContent(prompt);
      lastRequestTimestamp = Date.now();
      resolve(result);
    });

    const result = await lastRequestPromise;

    if (!result) {
      throw new Error('Failed to generate content');
    }

    const response = await result.response;
    const functionCalls = response.functionCalls() || [];
    let responseText = response.text();

    // Check for incomplete responses - if there's a setTransformedUserMessage function call but no text
    const hasSetTransformedUserMessage = functionCalls.some(
      (fc) => fc.name === 'setTransformedUserMessage',
    );
    if (hasSetTransformedUserMessage && !responseText.trim()) {
      console.warn(
        'Incomplete response detected: function call without text response',
      );
      // If we have only a function call without text, we could:
      // 1. Retry the request
      // 2. Generate a fallback response
      responseText = '*The NPC looks at you, considering what you said.*'; // Simple fallback
    }

    return {
      text: responseText,
      functionCalls: functionCalls,
      tokensCount: 0,
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};

export const sendMessage = (
  message: string,
  npcId: string,
  isSystemMessage: boolean = false,
) => {
  return sendMessageGemini(message, npcId, isSystemMessage);
};
