import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/setupTests.ts", "src/contextCreator.test.ts"],
  },
  plugins: [
    tsconfigPaths(), // <—- Add here
  ],
});
