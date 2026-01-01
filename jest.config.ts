/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/util/setup.ts'],
  testEnvironment: 'node',
};
