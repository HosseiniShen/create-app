const sortObject = require('./sortObject')

module.exports = function prettifyPkg (pkg) {
  if (!pkg) return pkg

  pkg.dependencies = sortObject(pkg.dependencies)
  pkg.devDependencies = sortObject(pkg.devDependencies)
  pkg.scripts = sortObject(pkg.scripts, [
    'dev',
    'build',
    'test:unit',
    'test:e2e',
    'lint',
    'deploy',
  ])
  return sortObject(pkg, [
    'name',
    'version',
    'private',
    'description',
    'author',
    'scripts',
    'husky',
    'lint-staged',
    'main',
    'module',
    'browser',
    'jsDelivr',
    'unpkg',
    'files',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'vue',
    'babel',
    'eslintConfig',
    'prettier',
    'postcss',
    'browserslist',
    'jest',
  ])
}
