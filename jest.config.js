module.exports = {
  roots: ['packages/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '.*/__tests__/.*(test|spec).tsx?$',
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      tsConfig: 'packages/ts-config/tsconfig.json'
    }
  }
};
