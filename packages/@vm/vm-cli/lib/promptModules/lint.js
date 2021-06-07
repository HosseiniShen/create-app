const injectPrompts = require('../utils/injectPrompts')

exports.featurePrompts = [
  {
    name: 'eslintConfig',
    type: 'list',
    message: 'Pick a linter config',
    description: 'Checking code errors and enforcing an homegeoneous code style',
    choices: [
      {
        name: 'ESLint + Airbnb config',
        value: 'airbnb',
        short: 'Airbnb',
      },
      {
        name: 'ESLint + Standard config',
        value: 'standard',
        short: 'Standard',
      },
    ]
  },
  {
    name: 'lintOn',
    message: 'Pick additional lint features:',
    type: 'checkbox',
    choices: [
      {
        name: 'Lint on save',
        value: 'save',
        checked: true,
      },
      {
        name: 'Lint and fix on commit',
        value: 'commit',
      },
    ]
  }
]

exports.initFeaturePrompt = (api) => {
  api.injectFeature({
    name: 'Linter',
    value: 'linter',
    short: 'Linter',
    description: 'Check and enforce code quality with ESLint or Prettier',
    link: 'https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint',
    checked: true
  })

  injectPrompts(api, exports.featurePrompts, 'linter')
}
