const execa = require('execa')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { hasYarn } = require('./env')
const { loadOptions, saveOptions } = require('./options')
const request = require('./request')
const { combineFlagAndOptionalValue } = require('commander')

exports.registries = {
  npm: 'https://registry.npmjs.org',
  yarn: 'https://registry.yarnpkg.com',
  taobao: 'https://registry.npm.taobao.org'
}

let checked = false
let result
/**
 * Should use taobao registry
 * @param {*} pm 
 */
exports.shouldUseTaobao = async (pm) => {
  if (checked) return result
  checked = true

  let command = pm
  if (!command) {
    command = hasYarn() ? 'yarn' : 'npm'
  }

  const { useTaobaoRegistry } = loadOptions()
  if (typeof useTaobaoRegistry === 'boolean') {
    return (result = useTaobaoRegistry)
  }

  const save = (val) => {
    result = val
    saveOptions({ useTaobaoRegistry: val })
    return val
  }

  // custom registry
  const registries = exports.registries
  let currentRegistry = await getRegistry(command)
  let defaultRegistry = registries[command]
  console.log('xxxxxxxx', command, currentRegistry, defaultRegistry)
  if (removeSlash(currentRegistry) !== removeSlash(defaultRegistry)) {
    return save(false)
  }

  // test connection
  let faster
  try {
    faster = await Promise.race([
      ping(defaultRegistry),
      ping(registries.taobao)
    ])
  } catch (error) {
    return save(false)
  }
  if (faster !== registries.taobao) {
    return save(false)
  }

  const ret = await inquirerRegistry(command)
  return save(ret)
}

exports.getRegistry = getRegistry

/**
 * Get registry
 * @param {*} command 
 * @returns 
 */
async function getRegistry (command) {
  let registry
  const args = [ 'config', 'get', 'registry' ]
  try {
    registry = (await execa(command, args)).stdout
  } catch (registryError) {
    try {
      args[2] = 'npmRegistryServer'
      registry = (await execa(command, args)).stdout
    } catch (npmRegistryServerError) {

    }
  }
  return registry
}

/**
 * Remove tail slash
 * @param {*} str 
 * @returns 
 */
function removeSlash (str) {
  return str.replace(/\/$/, '')
}

/**
 * Ping resolve
 * @param {*} registry 
 * @returns 
 */
async function ping (registry) {
  request(`${ registry }/vue-cli-version-marker/latest`)
  return registry
}

/**
 * Inquire re
 * @param {*} command 
 * @returns 
 */
async function inquirerRegistry (command) {
  const registries = exports.registries
  const { useTaobaoRegistry } = await inquirer.prompt([{
    name: 'useTaobaoRegistry',
    type: 'confirm',
    message: chalk.yellow(
      ` Your connection to the default ${ command } registry seems to be slow.\n`
            + `   Use ${ chalk.cyan(registries.taobao) } for faster installation?`,
    )
  }])

  if (useTaobaoRegistry) {
    await execa(command, [ 'config', 'set', 'registry', registries.taobao ])
  }
  return useTaobaoRegistry
}
