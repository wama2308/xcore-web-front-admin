'use strict'

const { Command } = require('@adonisjs/ace')
const Helpers = use('Helpers')
const fs = require('fs')

class MakeRepository extends Command {
  static get signature () {
    return `
      make:repository
      { name : Name of the repository to make:repository }
    `
  }

  static get description () {
    return 'Make a new repository as'
  }

  async handle (args, options) {
    if (args.name) {
      
      const repository = Helpers.appRoot(`app/Repositories/${args.name}Repository.js`)

      await this.ensureFile(repository)

      this.info(`${args.name}Repository.js creado con exito`)
    }
  }
}

module.exports = MakeRepository
