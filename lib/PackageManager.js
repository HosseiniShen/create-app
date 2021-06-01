const { hasProjectYarn } = require('./utils/env')
const { shouldUseTaobao, getRegistry, registries } = require('./utils/registry')
const executeCommand = require('./utils/executeCommand')
const logger = require('./utils/logger')

class PackageManager {
  constructor (context, pm) {
    this.context = context
    this._registries = Object.create(null)

    if (pm) {
      this.bin = pm
    } else if (context) {
      this.bin = hasProjectYarn(context) ? 'yarn' : 'npm'
    }
  }

  async setRegistry (scope) {
    const cacheKey = scope || ''
    const { _registries, bin } = this
    if (_registries[cacheKey]) return _registries[cacheKey]

    let registry
    if (await shouldUseTaobao(bin)) {
      registry = registries.taobao
    } else {
      registry = getRegistry(bin)
    }
    return registry
  }

  runCommand (args) {
    await this.setRegistry()
    await executeCommand(this.bin, args, this.context)
  }

  install () {
    logger.log(`\n正在下载依赖...\n`)
    return await this.runCommand([ 'install' ])
  }
}

module.exports = PackageManager
