const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')
const Generator = require('./Generator')
const executeCommand = require('./utils/executeCommand')
const clear = require('./utils/clear')

/**
 * create project
 * @param {*} name 
 */
async function create (name) {
  await exist(name)
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

/**
 * Exist
 * @param {*} name 
 * @returns 
 */
async function exist (name) {
  if (!name) return Promise.reject()
  const targetDir = path.resolve(process.cwd(), name)

  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(targetDir)) return resolve()
    
    clear()
    

    try {
      const answer = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${ chalk.cyan(targetDir) } already exist`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' }
          ]
        }
      ])

      if (answer.action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
      resolve()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

module.exports = create
