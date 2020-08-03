'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ForeignExchange extends Model {
  static get hidden() {
    return [
      'business_id',
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

  business() {
    return this.belongsTo('App/Models/Business')
  }

  branchOffices() {
    return this.belongsToMany('App/Models/BranchOffice')
      .withPivot(['rate'])
      .withTimestamps()
  }
}

module.exports = ForeignExchange
