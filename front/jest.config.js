const expoPreset = require('jest-expo/jest-preset')
const mswPackages = require('./jest.msw-packages')

// Extend jest-expo's default ignore list with the ESM packages this app pulls in
// (some of MSW's deps ship ESM-only and must be transformed, not skipped).
const [rnIgnore, ...restIgnore] = expoPreset.transformIgnorePatterns
const extra = ['tamagui', '@tamagui', '@tanstack', ...mswPackages].join('|')

// MSW's runtime deps ship as .mjs, which expo's transform regex doesn't match.
const babelTransform = expoPreset.transform['\\.[jt]sx?$']

module.exports = {
  ...expoPreset,
  resolver: '<rootDir>/jest.resolver.js',
  transform: { ...expoPreset.transform, '^.+\\.mjs$': babelTransform },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs'],
  setupFilesAfterEnv: [...(expoPreset.setupFilesAfterEnv ?? []), '<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [rnIgnore.replace('))', `|${extra}))`), ...restIgnore],
}
