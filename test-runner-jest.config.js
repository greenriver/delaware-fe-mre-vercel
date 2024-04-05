import { getJestConfig } from "@storybook/test-runner";

module.exports = {
  ...getJestConfig(),
  testMatch: ["**/*.fixtures.tsx"],
  transform: {
    "^.+\\.stories\\.[jt]sx?$": "@storybook/test-runner/playwright/transform"
  }
};
