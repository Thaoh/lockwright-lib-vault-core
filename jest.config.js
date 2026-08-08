export default {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  // pnpm nests packages under node_modules/.pnpm/.../node_modules/<pkg>
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(bare-crypto|expo-asset|pear-apps-utils-validator|otpauth|@noble)/)'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // optionalDependency — excluded from pnpm install when platform check fails
    '^@tetherto/swarmconf$': '<rootDir>/test-stubs/swarmconf.js'
  }
}
