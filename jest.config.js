module.exports = {
  testEnvironment: 'node',
  roots: ['packages/', 'examples/'],
  testMatch: ['**/__tests__/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'packages/ts-config/tsconfig.json'
    }
  }
};
