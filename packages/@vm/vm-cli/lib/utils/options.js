const fs = require('fs-extra')
const deepClone = require('lodash.clonedeep')
const logger = require('./logger')
const { getRcPath } = require('./rcPath')

const RCFILENAME = '.visumrc'
const rcPath = getRcPath(RCFILENAME)
let cacheOptions

exports.rcPath = rcPath

exports.defaultPreset = {
  features: [ 'babel', 'linter' ],
  historyMode: false,
  eslintConfig: 'standard',
  lintOn: [ 'commit' ]
}

exports.defaults = {
  useTaobaoRegistry: false,
  packageManager: 'yarn',
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
  if (cacheOptions) return deepClone(cacheOptions)

  if (fs.existsSync(rcPath)) {
    try {
      cacheOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
      return deepClone(cacheOptions)
    } catch (err) {
      logger.error(
        `Error loading saved preferences: `
        + `~/${ RCFILENAME } may be corrupted or have syntax errors. `
        + `(${ err.message })`,
      )
      process.exit(1)
    }
  }

  return {}
}

/**
 * Save config
 * @param {*} toSave 
 * @returns 
 */
exports.saveOptions = (toSave) => {
  const option = Object.assign(exports.loadOptions(), toSave)
  for (const key in option) {
    if (!(key in exports.defaults)) {
      delete option.key
    }
  }

  cacheOptions = option
  try {
    fs.writeFileSync(rcPath, JSON.stringify(option, null, 2))
    return true
  } catch (error) {
    logger.error(
      `Error saving presets: `
      + `make sure you have access to ${ rcPath }.\n`
      + `(${ error.message })`
    )
  }
}

/**
 * Save preset
 * @param {*} name 
 * @param {*} preset 
 * @returns 
 */
exports.savePresets = (name, preset) => {
  const toSave = filterPreset(preset)
  const presets = exports.loadOptions()
  presets[name] = toSave
  return exports.saveOptions(presets)
}

const FilterPresetKeys = [ 'preset', 'save', 'saveName', 'packageManager' ]
/**
 * Filter invalid preset
 * @param {*} preset 
 * @returns 
 */
function filterPreset (preset = {}) {
  const ret = Object.create(null)
  for (const key in preset) {
    if (!FilterPresetKeys.includes(key)) {
      ret[key] = preset[key]
    }
  }
  return ret
}