const path = require('path')

/**
 * extract the callSite file location using Error.captureStackTrace
 * @param {*} level 
 * @returns 
 */
exports.extractCallDir = function (level) {
  const ret = Object.create(null)
  Error.captureStackTrace(ret)
  const callSite = ret.stack.split('\n')[level]

  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
  const anonymousStackRegExp = /at (.*):\d+:\d+$/
  let match = callSite.match(namedStackRegExp) || callSite.match(anonymousStackRegExp)

  if (match) {
    return path.dirname(match[1])
  }
}
