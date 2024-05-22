// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
    testTimeout: 30000,
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    preset: "ts-jest",
    // setupFilesAfterEnv: ["<rootDir>/src/tests/test-setup.ts"],
};
