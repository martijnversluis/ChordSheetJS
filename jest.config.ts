/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/util/setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        moduleResolution: 'node10',
        ignoreDeprecations: '6.0',
      },
    }],
  },
};
