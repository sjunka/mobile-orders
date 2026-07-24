const mswPackages = require('./jest.msw-packages')

// The RN preset resolves with react-native/browser conditions, which pick MSW's
// ESM entry points (and those of its deps). Jest runs on Node, so resolve MSW's
// whole dependency closure with Node/CommonJS conditions instead.
const CJS = new RegExp(`(^|/)(${mswPackages.join('|')})(/|$)`)

// react-native-worklets ships .native files that expect a real native module;
// its own jest resolver skips them, so do the same here (see its jest/resolver.js).
const isWorklets = (request, basedir) =>
  request.includes('react-native-worklets') || basedir.includes('react-native-worklets')

module.exports = (request, options) => {
  return options.defaultResolver(request, {
    ...options,
    conditions: CJS.test(request) ? ['node', 'require', 'default'] : options.conditions,
    extensions: isWorklets(request, options.basedir)
      ? options.extensions?.filter((ext) => !ext.includes('native'))
      : options.extensions,
  })
}
