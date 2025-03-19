import { test, expect } from "@playwright/test";
import {
  FinishReason,
  FunctionCall,
  GenerateContentResponse,
  UsageMetadata,
} from "@google/generative-ai";

const mockGeminiResponse = (mock, functionCall?: FunctionCall) => {
  const response: GenerateContentResponse = {
    candidates: [
      {
        content: {
          parts: [
            {
              text: mock,
            },
          ],
          role: "model",
        },
        finishReason: FinishReason.STOP,
        avgLogprobs: -0.8996576876253695,
        index: 0,
      },
    ],
    usageMetadata: {
      promptTokenCount: 2785,
      candidatesTokenCount: 74,
      totalTokenCount: 2859,
      candidatesTokensDetails: [
        {
          modality: "TEXT",
          tokenCount: 74,
        },
      ],
    } as UsageMetadata,
  };

  if (functionCall) {
    response.candidates?.[0].content.parts.push({
      functionCall: functionCall,
    });
  }

  return response;
};

const isFullyVisible = async (page, element) => {
  const box = await element.boundingBox();
  if (!box) return false;

  const viewport = await page.viewportSize();

  return (
    box.x >= 0 &&
    box.y >= 0 &&
    box.x + box.width <= viewport.width &&
    box.y + box.height <= viewport.height
  );
};

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://generativelanguage.googleapis.com/**",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockGeminiResponse("Mocked AI response")),
      });
    },
  );

  await page.goto("http://localhost:3030");

  // Customize character
  await page.waitForSelector('input[placeholder="Name"]', { state: "visible" });

  if (await page.isVisible('[data-testid="api-key-input"]')) {
    await page.fill('[data-testid="api-key-input"]', "test-api-key");
  }

  await page.fill('input[placeholder="Name"]', "TestPlayer");
  await page.selectOption('select:has-text("Race")', "Human");
  await page.selectOption('select:has-text("Class")', "Warrior");
  await page.check("#ageVerification");
  await page.click('button:has-text("Start Game")');
});

test.describe("AI RPG E2E Tests", () => {
  test("should load the game and allow character customization", async ({
    page,
  }) => {
    // Verify the game map is loaded
    await page
      .locator('[data-testid="player-view"]')
      .waitFor({ state: "visible" });
  });

  test("should allow interaction with NPCs", async ({ page }) => {
    // Interact with an NPC
    const npc = page.locator('[data-testid="npc-view"]').first();
    await npc.scrollIntoViewIfNeeded();
    await npc.hover();
    await page.keyboard.press("e");

    const dialogContainer = page.locator('[data-testid="dialog-container"]');
    await dialogContainer.waitFor({ state: "visible" });

    await page.locator('[data-testid="game-container"]').evaluate((el) => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
    expect(await isFullyVisible(page, dialogContainer)).toBe(true);
    await page.locator("h3", { hasText: "Shop" }).waitFor({ state: "visible" });
  });

  test("should ask for trade and see the items in trade", async ({ page }) => {
    await page.route(
      "https://generativelanguage.googleapis.com/**",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockGeminiResponse("Mocked AI response")),
        });
      },
    );

    // Interact with an NPC
    const npc = page.locator('[data-testid="npc-view"]').first();
    await npc.hover();
    await page.keyboard.press("e");

    const dialogContainer = page.locator('[data-testid="dialog-container"]');
    dialogContainer.waitFor({ state: "visible" });

    await dialogContainer
      .locator('[data-testid="message"]', { hasText: "Mocked AI response" })
      .waitFor({ state: "visible" });

    await page.route(
      "https://generativelanguage.googleapis.com/**",
      async (route) => {
        const postData = route.request().postData();

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(
            mockGeminiResponse("Let's trade", {
              name: "setSellItemsList",
              args: {
                items: [
                  { itemId: postData?.match(/Sword\|(.*?)\|/)?.[1], price: 10 },
                ],
              },
            }),
          ),
        });
      },
    );

    // Send  let's trade message
    await page.fill('[data-testid="message-input"]', "let's trade");
    await page.click('[data-testid="send-message"]');

    // Verify the trade dialog is visible
    const tradeDialog = page.locator('[data-testid="items-to-sell"]');
    await tradeDialog.waitFor({ state: "visible" });

    // Verify the items are visible
    const item = page.locator('[data-testid="trade-item"]', {
      hasText: "Sword",
    });
    await item.waitFor({ state: "visible" });

    // Buy sword
    await item.locator('[data-testid="buy-item"]').click();
    // await item.waitFor({ state: "hidden" });
    await page
      .locator('[data-testid="player-inventory"]')
      .locator('[data-testid="item-view"]', { hasText: "Sword (x1)" })
      .waitFor({ state: "visible" });
  });
});
