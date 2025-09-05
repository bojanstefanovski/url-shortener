// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,               // so describe/it/expect are available
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
    },
  },
});