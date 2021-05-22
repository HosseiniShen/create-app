const { defaults } = require('./utils/options')
const isMunual = answer => (answer.preset === '__manual__')
/**
 * @class Creator
 * @description create inquirer prompts
 */
class Creator {
  constructor () {
    const { featurePrompt, presetPrompt } = this.getDefaultPrompts()
    this.featurePrompt = featurePrompt
    this.presetPrompt = presetPrompt
    this.injectedPrompts = []
  }

  getPresets () {
    return defaults.presets
  }

  getDefaultPrompts () {
    const presets = this.getPresets()
    const presetChoices = Object.entries(presets).map(([ name, preset ]) => ({
      name: `${ name } (${ preset.features })`,
      value: name
    }))

    const presetPrompt = {
      name: 'preset',
      type: 'list',
      messge: 'Please pick a preset:',
      choices: [
        ...presetChoices,
        {
          name: 'Manually select features',
          value: '__manual__',
        }
      ]
    }

    const featurePrompt = {
      name: 'features',
      when: isMunual,
      type: 'checkbox',
      messge: 'Check the feature needed for your project: ',
      choices: [],
      pageSize: 10
    }
    return {
      presetPrompt,
      featurePrompt
    }
  }

  getFinalPrompts () {
    this.injectedPrompts.forEach(prompt => {
      const origin = prompt.when || (() => true)
      prompt.when = answer => isMunual(answer) && origin(answer)
    })
    return [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts
    ]
  }

}

module.exports = Creator
