const { defaults, loadOptions } = require('./utils/options')
const { hasYarn } = require('./utils/env')

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

  /**
   * Get default prompts
   * @returns 
   */
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

  /**
   * Get package manager prompt
   * @returns 
   */
  getOtherPrompts () {
    const prompts = [
      {
        name: 'save',
        when: isMunual,
        type: 'confirm',
        messge: 'Save this as a preset for future projects?',
        default: false
      },
      {
        name: 'saveName',
        when: answer => answer.save,
        type: 'input',
        messge: 'Save preset as: '
      }
    ]

    const savedOptions = loadOptions()
    if (!savedOptions.packageManager) {
      const packageManagerChoices = [
        {
          name: 'Use NPM',
          value: 'npm',
          short: 'NPM'
        }
      ]

      if (hasYarn()) {
        packageManagerChoices.push({
          name: 'Use YARN',
          value: 'yarn',
          short: 'YARN'
        })
      }

      prompts.push({
        name: 'packageManager',
        type: 'list',
        message: 'Pick the package manager to install dependence package:',
        choices: packageManagerChoices
      })
    }
    return prompts
  }

  /**
   * Get final prompt
   * @returns 
   */
  getFinalPrompts () {
    this.injectedPrompts.forEach(prompt => {
      const origin = prompt.when || (() => true)
      prompt.when = answer => isMunual(answer) && origin(answer)
    })
    return [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts,
      ...this.getOtherPrompts()
    ]
  }

}

module.exports = Creator
