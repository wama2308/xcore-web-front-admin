'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Business extends Model {
  static get hidden() {
    return [
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

  licenses() {
    return this.belongsToMany('App/Models/License')
      .withTimestamps()
  }

  users() {
    return this.belongsToMany('App/Models/User')
      .withPivot(['is_master'])
      .withTimestamps()
  }

  branchOffices() {
    return this.hasMany('App/Models/BranchOffice')
  }

  foreignExchanges() {
    return this.hasMany('App/Models/ForeignExchange')
  }

}

module.exports = Business
