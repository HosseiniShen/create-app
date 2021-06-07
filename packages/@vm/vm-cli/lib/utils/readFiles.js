const path = require('path')
const fs = require('fs-extra')
const globby = require('globby')
const { isBinaryFileSync } = require('isbinaryfile')
const normalizeFilePath = require('./normalizeFilePath')

module.exports = async (context) => {
  const ret = Object.create(null)
  const files = await globby(
    [ '**' ],
    {
      cwd: context,
      onlyFiles: true,
      gitignore: true,
      dot: true,
      ignore: [ '**/node_modules/**', '**/.git/**', '**/.svn/**' ]
    }
  )
  for (let file of files) {
    const name = path.resolve(context, file)
    ret[file] = isBinaryFileSync(name)
      ? fs.readFileSync(name)
      : fs.readFileSync(name, 'utf-8')
  }
  return normalizeFilePath(ret)
}
