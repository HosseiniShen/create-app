const webpack = require('webpack')
const WebpackDevServer  = require('webpack-dev-server')
const devConfig = require('../lib/dev.config')
const buildConfig = require('../lib/pro.config')

const env = process.env.args.slice(2)[0]

if (env === 'serve') {
  const compiler = webpack(devConfig)
  const server = new WebpackDevServer(compiler)

  server.listen(8080, '0.0.0.0', console.log)
} else if (env === 'build') {
  webpack(buildConfig, (err, stats) => {
    if (err) console.log(err)
    if (stats.hasErrors()) {
        console.log(new Error('Build failed with errors.'))
    }
  })
} else {
  console.log('Unknow script command')
}
