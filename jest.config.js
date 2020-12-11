process.env.TS_JEST_DISABLE_VER_CHECKER = 'true';

module.exports = {
  testEnvironment: 'node',
  roots: ['packages/', 'examples/'],
  testMatch: ['**/__tests__/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest'
  }
};
