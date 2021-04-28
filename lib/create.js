const path = require('path')
const inquirer = require('inquirer')
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')
const Generator = require('./Generator')

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

  const pkg = {
    name,
    version: '0.1.0',
    dependencies: {},
    devDependencies: {},
  }
  const generator = new Generator(pkg, path.join(process.cwd(), name))
}

/**
 * get project feature
 * @returns 
 */
function getPromptModules () {
  return [
    'babel',
    'lint',
    'router',
    'vuex'
  ].map(filename => require(`./promptModules/${ filename }`))
}

module.exports = create
