'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rol extends Model {
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

  user() {
    return this.hasMany('App/Models/User')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  penalties() {
    return this.belongsToMany('App/Models/Penalty')
      .withTimestamps()
  }

  modules() {
    return this.belongsToMany('App/Models/GeneralConfiguration/Module')
      .withPivot([
        'permits'
      ])
      .withTimestamps()
  }

}

module.exports = Rol
