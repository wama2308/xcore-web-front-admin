'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Screen extends Model {
  static get hidden() {
    return [
      'branch_office_id',
      'enabled',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
    ]
  }

  static boot() {
    super.boot()
    this.addHook('beforeCreate', 'GlobalHook.enabledField')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  class() {
    return this.belongsTo('App/Models/Class')
  }

  service() {
    return this.belongsTo('App/Models/Service')
  }

  area() {
    return this.belongsTo('App/Models/Area')
  }
}

module.exports = Screen
