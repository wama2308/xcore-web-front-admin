'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Module extends Model {
  static get hidden() {
    return [
      'category_id',
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

  category() {
    return this.belongsTo('App/Models/GeneralConfiguration/Category')
  }

  licenses() {
    return this.belongsToMany('App/Models/License')
      .withPivot([
        'permits'
      ])
      .withTimestamps()
  }

  rols() {
    return this.belongsToMany('App/Models/Rol')
      .withPivot([
        'permits'
      ])
      .withTimestamps()
  }

}

module.exports = Module
