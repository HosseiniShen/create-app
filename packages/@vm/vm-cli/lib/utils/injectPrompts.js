/**
 * Inject feature prompt
 * @param {*} api 
 * @param {*} featurePrompts 
 * @param {*} feature 
 * @returns 
 */
module.exports = (api, featurePrompts, feature) => {
  if (!featurePrompts || !featurePrompts.length) return

  featurePrompts.forEach(prompt => {
    api.injectPrompt({ 
      when: answers => answers.features.includes(feature)
     }, prompt)
  })
}
