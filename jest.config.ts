/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/util/setup.ts'],
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/worktrees/', '<rootDir>/.claude/worktrees/'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/worktrees/', '<rootDir>/.claude/worktrees/'],
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
