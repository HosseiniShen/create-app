const inquirer = require('inquirer')
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')

/**
 * create project
 * @param {*} name 
 */
async function create (name) {
  const creator = new Creator()
  const promptModuleAPI = new PromptModuleAPI(creator)

  getPromptModules()
    .forEach(m => m(promptModuleAPI))

  const answers = await inquirer.prompt(creator.getFinalPrompts())
}

/**
 * get project feature
 * @returns 
 */
function getPromptModules () {
  return [
    'babel'
  ].map(filename => require(`./promptModules/${ filename }`))
}

module.exports = create
