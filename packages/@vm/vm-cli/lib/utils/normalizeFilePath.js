const slash = require('slash')

/**
 * Normalize file path
 * @param {*} files 
 * @returns 
 */
exports.normalizeFilePath = function (files) {
  for (let filepath in files) {
    const nomalized = slash(filepath)
    if (nomalized !== filepath) {
      files[nomalized] = files[filepath]
      delete files[filepath]
    }
  }

  return files
}
