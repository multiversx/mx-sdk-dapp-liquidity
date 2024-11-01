module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/tests/*.{test.ts,test.tsx,spec.tsx,spec.ts,bgTest.ts}',
    '!src/**/*.d.ts',
    '!src/__mocks__/**'
  ],
  coveragePathIgnorePatterns: [],
  setupFiles: ['./test-config/setupJest.ts'],
  setupFilesAfterEnv: ['./test-config/setupTests.ts'],
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': ['@swc/jest']
  },
  transformIgnorePatterns: ['node_modules/(^.+\\\\.(ts|js|tsx|jsx)$)'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test|bgTest).[jt]s?(x)'
  ],
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: [
    // Place tsx and ts to beginning as suggestion from Jest team
    // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
    'tsx',
    'ts',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'node'
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  moduleDirectories: ['node_modules', 'src'],
  workerIdleMemoryLimit: 0.33,
  bail: 1
};
