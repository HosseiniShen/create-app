const readline = require('readline')

/**
 * Clear ternminal
 * @param {*} title 
 */
module.exports = (title) => {
  if (process.stdout.isTTY) {
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}
