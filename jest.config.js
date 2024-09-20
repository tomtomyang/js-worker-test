module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/*.test.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
   'test/**/*.{js,jsx,ts,tsx}',
  ],
};