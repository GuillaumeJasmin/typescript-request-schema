module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
}
