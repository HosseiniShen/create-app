const path = require('path')
const fs = require('fs')

const globby = require('globby')
const { isbinaryfile } = require('isbinaryfile')
const ejs = require('ejs')

const { isObject } = require('./utils/type')
const { extractCallDir } = require('./utils/extractCallDir')
const { ensureEOL } = require('./utils/stringifyJS')
const { defaultConfigTransforms, ConfigTransform } = require('./ConfigTransforms')
const { normalizeFilePath } = require('./utils/normalizeFilePath')

/**
 * @class Generator
 * @description `generator` 
 */
class Generator {
  constructor (pkg, context) {
    this.pkg = pkg
    this.context = context

    this.imports = {}
    this.rootOptions = {}
    this.configTransforms = {}
    this.fileMiddlewares = []
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

  async generate () {
    this.extractConfigFiles()
    await this.resolveFiles()
  }

  extractConfigFiles () {
    const configTransforms = {
      ...defaultConfigTransforms,
      ...this.configTransforms,
      vue: new ConfigTransform({
        file: {
            js: ['vue.config.js'],
        },
      }),
    }

    const extract = (key) => {
      const value = this.pkg[key]
      const configTransform = configTransforms[key]
      if (!value || !configTransform) return

      const { content, filename } = configTransform.transform(value, this.context)
      this.files[filename] = ensureEOL(content)
      delete this.pkg[key]
    }

    extract('babel')
    extract('vue')
  }

  resolveFiles () {
    const { files } = this
    for (let middleware of this.fileMiddlewares) {
      await middleware(files)
    }

    normalizeFilePath(files)
  }

  /**
   * Add import statement to a file
   * @param {*} file 
   * @param {*} imports 
   */
  injectImports (file, imports) {
    const _imports = this.imports[file] || (this.imports[file] = new Set())
    (Array.isArray(imports) ? imports : [ imports ]).forEach(imp => {
      _imports.add(imp)
    })
  }

  /**
   * Add options to the root Vue instance (detected by `new Vue`)
   * @param {*} file 
   * @param {*} options 
   */
  injectRootOptions (file, options) {
    const _options = this.rootOptions[file] || (this.rootOptions[file] = new Set())
    (Array.isArray(options) ? options : [ options ]).forEach(opt => {
      _options.add(opt)
    })
  }

  /**
   * Render template files into the virtual files tree object
   * @param {*} source 
   * @param {*} additionalData 
   * @param {*} ejsOptions 
   */
  render (source, additionalData = {}, ejsOptions = {}) {
    const baseDir = extractCallDir(3)
    source = path.resolve(baseDir, source)
    this._injectFileMiddleware(async files => {
      const data = this._resolveData(additionalData)
      const _files = await globby([ '**/*' ], { cwd: source, dot: true })
      for (let rawPath of _files) {
        const sourcePath = path.resolve(source, rawPath)
        const content = this.renderFile(sourcePath, data, ejsOptions)
        if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
          files[rawPath] = content
        }
      }
    })
  }

  /**
   * Generate file content
   * @param {*} sourcePath 
   * @param {*} data 
   * @param {*} ejsOptions 
   * @returns 
   */
  renderFile (sourcePath, data, ejsOptions) {
    if (isbinaryfile(sourcePath)) {
      return fs.readFileSync(sourcePath)
    }

    const content = fs.readFileSync(sourcePath, 'utf-8')
    return ejs.render(content, data, ejsOptions)
  }

  /**
   * Inject a file processing middleware
   * @param {*} middleware 
   */
  _injectFileMiddleware (middleware) {
    this.fileMiddlewares.push(middleware)
  }

  /**
   * resolve template data
   * @param {*} additionalData 
   * @returns 
   */
  _resolveData (additionalData) {
    return {
      options: this.options,
      rootOptions: this.rootOptions,
      ...additionalData,
    }
  }

}

module.exports = Generator
