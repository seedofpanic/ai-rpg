import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/setupTests.ts", "src/contextCreator.test.ts", "src/playwright.config.ts", "src/vitest.config.ts"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/setupTests.ts", "src/playwright.config.ts", "src/vitest.config.ts", "src/contextCreator.ts"],
      reporter: ["text", "json", "html"],
    },
  },
  plugins: [
    tsconfigPaths(), // <—- Add here
  ],
});
