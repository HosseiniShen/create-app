const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const { exit } = require('process')


let _hasYarn
/**
 * Check yarn
 * @returns 
 */
exports.hasYarn = () => {
  if (_hasYarn === true) return _hasYarn

  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return (_hasYarn = true)
  } catch (error) {
    return (_hasYarn = false)
  }
}

/**
 * Check yarn.lock
 * @param {*} cwd 
 * @returns 
 */
exports.hasProjectYarn = (cwd) => {
  const lockFile = path.resolve(cwd, 'yarn.lock')
  const exist = fs.existsSync(lockFile)
  if (exist && !exports.hasYarn()) throw new Error(`The project seems to require yarn but it's not installed`)
  return exist 
}
