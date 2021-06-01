const execa = require('execa')

module.exports = (command, cwd) => {
  return new Promise((resolve, args = [], reject) => {
    const child = execa(command, args, {
      cwd,
      stdio: ['inherit', 'pipe', 'inherit'],
    })

    child.stdout.on('data', buffer => {
      process.stdout.write(buffer)
    })

    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(`command failed: ${command}`))
        return
      }

      resolve()
    })
  })
}
