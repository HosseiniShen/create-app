const { isObject } = require('./utils/type')

/**
 * @class Generator
 * @description generator 
 */
class Generator {
  constructor (pkg, context) {
    this.pkg = pkg
    this.context = context
  }

  /**
   * extend package json
   * @param {*} fields 
   */
  extendPackage (fields) {
    const pkg = this.pkg
    let value
    let existValue
    for (let key in fields) {
      value = fields[key]
      if (isObject(value) && (key === 'scripts' || key === 'dependencies' || key === 'devDependencies')) {
        existValue = pkg[key]
        pkg[key] = Object.assign(existValue || {}, value)
      } else {
        pkg[key] = value
      }
    }
  }

  generate () {
    
  }

}

module.exports = Generator
