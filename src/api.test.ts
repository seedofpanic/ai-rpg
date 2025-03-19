import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sendMessage } from './api';
import { gameStore } from 'models/gameStore';
import { Player } from 'models/Player';

// Mock the GoogleGenerativeAI class
const generateContentMock = vi.fn().mockResolvedValue({
  response: {
    text: () => 'Test response',
    functionCalls: () => [],
    usageMetadata: {
      candidatesTokensDetails: [{ tokensCount: 10 }],
    },
  },
});

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: generateContentMock,
      }),
    })),
    SchemaType: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING',
      NUMBER: 'NUMBER',
    },
    FunctionCallingMode: {
      AUTO: 'AUTO',
    },
  };
});

// Mock createContext
vi.mock('./contextCreator', () => ({
  createContext: vi.fn().mockReturnValue('Mocked context for testing'),
}));

describe('API Rate Limiting', () => {
  beforeEach(() => {
    // Reset the game store and create a test player
    gameStore.reset();
    const player = new Player('TestPlayer', 'Human', 'Warrior', 'Male');
    gameStore.startGame(player);

    // Reset timers and mocks
    vi.useFakeTimers();
    generateContentMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not make request if rate limit time has not passed', async () => {
    // Send first message
    sendMessage('Hello', 'npc-1');
    await vi.advanceTimersByTimeAsync(1300);

    // Send second message
    sendMessage('How are you?', 'npc-1');

    // Fast forward remaining time
    await vi.advanceTimersByTimeAsync(500);
    // Verify that generateContent was only called once
    expect(generateContentMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1000);

    expect(generateContentMock).toHaveBeenCalledTimes(2);

    await vi.clearAllTimers();
  });

  it('should respect rate limit of 1 request per second', async () => {
    // Send first message
    const firstPromise = sendMessage('Hello', 'npc-1');

    // Fast forward 1 second
    await vi.advanceTimersByTimeAsync(1500);

    // Send second message
    const secondPromise = sendMessage('How are you?', 'npc-1');

    // Fast forward 1 second to complete both requests
    await vi.advanceTimersByTimeAsync(2500);

    // Wait for both promises to resolve
    const [firstResponse, secondResponse] = await Promise.all([
      firstPromise,
      secondPromise,
    ]);

    // Verify both requests were successful
    expect(firstResponse).toBeTruthy();
    expect(secondResponse).toBeTruthy();
  });

  it('should handle multiple concurrent requests with rate limiting', async () => {
    // Send multiple messages concurrently
    const requests = [
      sendMessage('First', 'npc-1'),
      sendMessage('Second', 'npc-1'),
      sendMessage('Third', 'npc-1'),
    ];

    // Fast forward 2 seconds to allow all requests to complete
    await vi.advanceTimersByTimeAsync(7000);

    // Wait for all requests to resolve
    const responses = await Promise.all(requests);

    // Verify all requests were successful
    responses.forEach((response) => {
      expect(response).toBeTruthy();
    });
  });
});
