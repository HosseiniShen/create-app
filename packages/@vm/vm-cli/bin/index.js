#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const create = require('../lib/create')

program
  .version(`${ pkg.version }`, '-V, --version')
  .command('create <name>')
  .description('create a new project')
  .action(name => {
    create(name)
  })

program.parse()
