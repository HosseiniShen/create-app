const path = require('path')
const merge = require('webpack-merge')
const config = require('./base.config')

const resolve = (filePath) => path.resolve(__dirname, filePath)

module.exports = merge(config, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: resolve('../dist'),
        publicPath: './',
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
    }
})
