const transforms = require('./utils/configTransforms')

/**
 * @class ConfigTransform
 */
class ConfigTransform {
  constructor (options) {
    this.fileDescriptor = options.file
  }

  /**
   * transform file content
   * @param {*} value 
   * @param {*} context 
   * @returns 
   */
  transform (value, context) {
    const { type, filename } = this.getDefaultFile()
    const transform = transforms[type]
    const content = transform.write({ value, context, filename })
    return {
      filename,
      content
    }
  }

  /**
   * get default file type
   * @returns 
   */
  getDefaultFile () {
    const [ type ] = Object.keys(this.fileDescriptor)
    const [ filename ] = this.fileDescriptor[type]
    return { type, filename }
  }
}

const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: [ 'babel.config.js' ]
    }
  }),

  postcss: new ConfigTransform({
    file: {
        js: ['postcss.config.js'],
        json: ['.postcssrc.json', '.postcssrc'],
        yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
    },
  }),

  eslintConfig: new ConfigTransform({
      file: {
          js: ['.eslintrc.js'],
          json: ['.eslintrc', '.eslintrc.json'],
          yaml: ['.eslintrc.yaml', '.eslintrc.yml'],
      },
  }),

  jest: new ConfigTransform({
      file: {
          js: ['jest.config.js'],
      },
  }),
  
  browserslist: new ConfigTransform({
      file: {
          lines: ['.browserslistrc'],
      },
  }),
}

module.exports = {
  ConfigTransform,
  defaultConfigTransforms
}
