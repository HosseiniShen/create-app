const { stringify } =  require('javascript-stringify')

exports.stringifyJS = function (value) {
   return stringify(value, (val, indent, stringify) => {
    if (val && val.__expression) {
      return val.__expression
    }
    return stringify(val)
   }, 4)
}

exports.ensureEOL = function (str) {
  if (str.charAt(str.length - 1) !== '\n') {
    return `${ str }\n`
  }
  return str
}
