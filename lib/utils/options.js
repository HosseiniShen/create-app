const fs = require('fs-extra')
const logger = require('./logger')
const { getRcPath } = require('./rcPath')

const RCFILENAME = '.visumrc'
const rcPath = getRcPath(RCFILENAME)
const cacheOptions = Object.create(null)

exports.rcPath = rcPath

exports.defaultPreset = {
  features: [ 'babel', 'linter' ],
  historyMode: false,
  eslintConfig: 'standard',
  lintOn: [ 'commit' ]
}

exports.defaults = {
  presets: {
    default: {
      ...exports.defaultPreset
    }
  }
}

/**
 * Load saved presets
 * @returns 
 * @example
 * {
  "useTaobaoRegistry": true,
  "latestVersion": "4.5.13",
  "lastChecked": 1622010730266,
  "packageManager": "yarn",
  "presets": {
    "demo": {
      "useConfigFiles": true,
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-router": {
          "historyMode": true
        },
        "@vue/cli-plugin-vuex": {},
        "@vue/cli-plugin-eslint": {
          "config": "standard",
          "lintOn": []
        }
      }
    }
  }
}
 */
exports.loadOptions = () => {
  if (cacheOptions) return cacheOptions

  if (fs.existsSync(rcPath)) {
    try {
      cacheOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
      return cacheOptions
    } catch (err) {
      logger.error(
        `Error loading saved preferences: `
        + `~/${ RCFILENAME } may be corrupted or have syntax errors. `
        + `(${e.message})`,
      )
      process.exit(1)
    }
  }

  return {}
}
