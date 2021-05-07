const path = require('path')
const yaml = require('js-yaml')
const { stringifyJS } = require('./stringifyJS')

const transformJS = {
  read: ({ filename, context }) => {
    try {
      return require(path.resolve(context, filename))
    } catch (error) {
      return null
    }
  },

  write: ({ value }) => `module.exports = ${ stringifyJS(value, null, 4) }`
}

const transformJSON = {
  read: ({ source }) => JSON.parse(source),
  write: ({ value }) => JSON.stringify(value, null, 4)
}

const transformYAML = {
  read: ({ source }) => yaml.safeLoad(source),
  write: ({ value }) => yaml.safeDump(value, { skipInvalid: true })
}

const transformLines = {
  read: ({ source }) => source.split('\n'),
  write: ({ value }) => value.join('\n')
}

module.exports = {
  js: transformJS,
  json: transformJSON,
  yaml: transformYAML,
  lines: transformLines
}
