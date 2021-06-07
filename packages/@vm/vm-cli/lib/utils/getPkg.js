const path = equire('path')
const fs = require('fs')

/**
 * Get content of package.json
 * @param {*} context 
 * @returns 
 */
module.exports = (context) => {
  const pkgPath = path.resolve(context, 'package.json')

  let pkgJson
  try {
    pkgJson = fs.readFileSync(pkgPath, 'utf-8')
  } catch (error) {
    throw new Error(`The 'package.json' file at ${ context } doesn't exist`)
  }

  try {
    pkgJson = JSON.parse(pkgJson  )
  } catch (error) {
    throw new Error('The package.json is malformed')
  }
  return pkgJson
}
