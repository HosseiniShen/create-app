module.exports = (api) => {
  api.injectFeature({
    name: 'Router',
    value: 'router',
    description: 'Structure the app with dynamic pages',
    link: 'https://router.vuejs.org/'
  })

  api.injectPrompt({
    name: 'routerMode',
    when: answers => answers.features.includes('router'),
    type: 'confirm',
    messge: 'Use history mode for router?',
    description: `By using the HTML5 History API, the URLs don't need the '#' character anymore.`,
    link: 'https://router.vuejs.org/guide/essentials/history-mode.html'
  })
}
