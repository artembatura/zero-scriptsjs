module.exports = {
  roots: ['packages/'],
  testMatch: ['**/src/**/__tests__/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'packages/ts-config/tsconfig.json'
    }
  }
};
