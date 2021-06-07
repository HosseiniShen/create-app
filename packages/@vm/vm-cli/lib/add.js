const inquirer = require('inquirer')
const getPkg = require('./utils/getPkg')
const clear = require('./utils/clear')
const Generator = require('./Generator')
const PackageManager = require('./PackageManager')
const readFiles = require('./utils/readFiles')

/**
 * Add a plugin
 * @param {*} name 
 */
module.exports = async (name) => {
  const rootDir = process.cwd()
  const pkgJson = getPkg(rootDir)

  clear()
  let answers = Object.create(null)
  try {
    const prompts = require(`./promptModules/${ name }`).featurePrompts
    if (prompts && prompts.length) {
      answers = await inquirer.prompt(prompts)
    }
  } catch (error) {
    console.log(error)
  }

  const generator = new Generator(pkgJson, rootDir, await readFiles(rootDir))
  const pm = new PackageManager(rootDir, answers.packageManager)
  require(`@vm/vm-plugin-${ name }/generator`)(generator, answers)

  await generator.generate()
  await pm.install()
}
