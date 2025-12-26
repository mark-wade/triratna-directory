const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  moduleNameMapper: {
      "\\.(css|less|scss)$": "<rootDir>/src/tests/styleMock.js"
    },
  setupFiles: ["<rootDir>/src/tests/setupEnv.js"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
};