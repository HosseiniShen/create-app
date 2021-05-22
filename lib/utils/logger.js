const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

exports.log = (msg = '') => {
  console.log(msg)
}

exports.info = (msg = '') => {
  console.log(format(chalk.bgBlue.black('INFO'), msg))
}

exports.warn = (msg = '') => {
  console.warn(format(chalk.bgYellow.black('WARN'), msg))
}

exports.error = (msg) => {
  console.log(format(chalk.bgRed('ERROR'), msg))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

/**
 * Format message
 * @param {*} label 
 * @param {*} msg 
 * @returns 
 */
function format (label, msg) {
  return msg.split('/n').map((line, index) => (i === 0
     ? `${ label } ${ msg }`
     : line.padStart(stripAnsi(label).length)
  )).join('\n')
}
