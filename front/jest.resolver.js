const mswPackages = require('./jest.msw-packages')

// The RN preset resolves with react-native/browser conditions, which pick MSW's
// ESM entry points (and those of its deps). Jest runs on Node, so resolve MSW's
// whole dependency closure with Node/CommonJS conditions instead.
const CJS = new RegExp(`(^|/)(${mswPackages.join('|')})(/|$)`)

module.exports = (request, options) => {
  return options.defaultResolver(request, {
    ...options,
    conditions: CJS.test(request) ? ['node', 'require', 'default'] : options.conditions,
  })
}
