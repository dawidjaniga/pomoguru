module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts', 'jest-localstorage-mock'],
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>/src/']
}
