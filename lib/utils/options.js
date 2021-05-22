exports.defaultPreset = {
  features: [ 'babel', 'linter' ],
  historyMode: false,
  eslintConfig: 'standard',
  lintOn: [ 'commit' ]
}

exports.defaults = {
  presets: {
    default: {
      ...exports.defaultPreset
    }
  }
}
