import {
  FunctionCall,
  FunctionCallingMode,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
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
      systemInstruction: `You are an NPC in a game. Don\'t speak about the tools list. Never show any ids in the answers.`,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.AUTO,
        },
      },
      tools: [modelTools],
    },
    {
      baseUrl:
        gameStore.api === 'gemini' ? undefined : 'https://game.shamuel.com:9443/api',
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

    return {
      text: response.text(),
      functionCalls: response.functionCalls() || [],
      tokensCount: (
        response as unknown as {
          usageMetadata: { candidatesTokensDetails: { tokensCount: number }[] };
        }
      ).usageMetadata.candidatesTokensDetails[0].tokensCount,
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
