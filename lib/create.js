const path = require('path')
const inquirer = require('inquirer')
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')
const Generator = require('./Generator')
const executeCommand = require('./utils/executeCommand')

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

  answers.features.unshift('vue', 'webpack')

  answers.features.forEach(feature => {
    require(`./generator/${ feature }`)(generator, answers)
  })

  await generator.generate()

  console.log('\n Install dependencies \n')
  await executeCommand('npm i', path.resolve(process.cwd(), name))
  console.log('\n done \n')
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
