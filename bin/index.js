#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(`${ pkg.version }`, '-V, --version')
  .command('create <name>')
  .description('create a new project')
  .action(name => {
    console.log(`now creating a new app named ${ name }`)
  })

program.parse()
