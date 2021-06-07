#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const create = require('../lib/create')
const add = require('../lib/add')

program
  .version(`${ pkg.version }`, '-V, --version')
  .command('create <name>')
  .description('create a new project')
  .action(name => {
    create(name)
  })

program
  .command('add <name>')
  .description('Add a plugin')
  .action(name => {
    add(name)
  })

program.parse()
