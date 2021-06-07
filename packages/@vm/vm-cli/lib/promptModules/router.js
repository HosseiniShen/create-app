const injectPrompts = require('../utils/injectPrompts')

exports.featurePrompts = [
  {
    name: 'historyMode',
    type: 'confirm',
    messge: 'Use history mode for router?',
    description: `By using the HTML5 History API, the URLs don't need the '#' character anymore.`,
    link: 'https://router.vuejs.org/guide/essentials/history-mode.html'
  }
]

exports.initFeaturePrompt = (api) => {
  api.injectFeature({
    name: 'Router',
    value: 'router',
    description: 'Structure the app with dynamic pages',
    link: 'https://router.vuejs.org/'
  })

  injectPrompts(api, exports.featurePrompts, 'router')
}
