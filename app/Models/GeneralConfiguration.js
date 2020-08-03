'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class GeneralConfiguration extends Model {
  static get hidden() {
    return [
      'name',
      'methods',
      'modules',
      'menu',
      'permits',
      'secret_questions',
      'selects_services',
      'enabled',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
    ]
  }
}

module.exports = GeneralConfiguration
