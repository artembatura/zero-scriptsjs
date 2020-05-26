module.exports = {
  testEnvironment: require.resolve('jest-environment-node'),
  roots: ['packages/', 'examples/'],
  testMatch: ['**/__tests__/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        ...require('./packages/ts-config/tsconfig.json').compilerOptions
      }
    }
  }
};
