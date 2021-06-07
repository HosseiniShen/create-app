exports.initFeaturePrompt = (api) => {
  api.injectFeature({
    name: 'Babel',
    short: 'Babel',
    description: 'Transpile modern JavaScript to older version (for compatibility)',
    link: 'https://babeljs.io/',
    checked: true
  })
}
