import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/prisma/**",
      "**/src/routes/**",
      "**/src/index.ts",
    ],
  },
});
