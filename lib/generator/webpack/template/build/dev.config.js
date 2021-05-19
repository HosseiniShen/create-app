const path = require('path')
const merge = require('webpack-merge')
const config = require('./base.config')

const resolve = filePath => path.resolve(__dirname, filePath)

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: resolve('../dist')
  },
  devServer: {
    contentBase: resolve('../dist'),
    hot: true,
    port: 8080
  }
})
