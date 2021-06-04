const fs = require('fs-extra')
const path = require('path')

/**
 * Write file content
 * @param {*} dir 
 * @param {*} files 
 */
module.exports = function writeFileTree (dir, files) {
  Object.keys(files).forEach(name => {
    const abPath = path.resolve(dir, name)
    fs.ensureDirSync(path.dirname(abPath))
    fs.writeFileSync(abPath, files[name])
  })
}
