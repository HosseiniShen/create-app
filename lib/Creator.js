/**
 * @class Creator
 * @description create inquirer prompts
 */
class Creator {
  constructor () {
    this.featurePrompt = {
      name: 'features',
      type: 'checkbox',
      messge: 'Check the feature needed for your project: ',
      choices: [],
      pageSize: 10
    }

    this.injectedPrompts = []
  }

  getFinalPrompts () {
    return [
      this.featurePrompt,
      ...this.injectedPrompts
    ]
  }

}

module.exports = Creator
