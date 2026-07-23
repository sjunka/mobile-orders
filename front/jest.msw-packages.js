// MSW's dependency closure. Jest runs on Node but the RN preset resolves with
// react-native/browser conditions and doesn't transform node_modules, so these
// packages (some ESM-only) need special handling in both jest.config.js and
// jest.resolver.js. Kept in one place so adding a dep means one edit.
module.exports = [
  'msw',
  '@mswjs',
  '@open-draft',
  '@bundled-es-modules',
  'until-async',
  'rettime',
  'headers-polyfill',
  'outvariant',
  'strict-event-emitter',
  'is-node-process',
  'cookie',
  'tough-cookie',
  'statuses',
  'graphql',
  'path-to-regexp',
  'picocolors',
  'type-fest',
]
