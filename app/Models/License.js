'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class License extends Model {
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

  business() {
    return this.belongsToMany('App/Models/Business')
      .withTimestamps()
  }

  countries() {
    return this.belongsToMany('App/Models/Country')
      .withTimestamps()
  }

  typeLicense() {
    return this.belongsTo('App/Models/GeneralConfiguration/TypeLicense')
  }

  modules() {
    return this.belongsToMany('App/Models/GeneralConfiguration/Module')
      .withPivot([
        'permits'
      ])
      .withTimestamps()
  }
}

module.exports = License
