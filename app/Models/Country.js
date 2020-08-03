'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Country extends Model {
  static get hidden() {
    return [
      'enabled',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
    ]
  }

  static get visible() {
    return [
      '_id',
      'name'
    ]
  }

  static boot() {
    super.boot()
    this.addHook('beforeCreate', 'GlobalHook.enabledField')
  }

  branchOffice() {
    return this.hasMany('App/Models/BranchOffice')
  }

  provinces() {
    return this.hasMany('App/Models/Province')
  }

  benches() {
    return this.hasMany('App/Models/Country/Banking')
  }

  taxes() {
    return this.hasMany('App/Models/Country/Tax')
  }

  typeIdentities() {
    return this.hasMany('App/Models/Country/TypeIdentity')
  }

  wayToPays() {
    return this.hasMany('App/Models/Country/WayToPay')
  }

  licenses() {
    return this.belongsToMany('App/Models/License')
      .withTimestamps()
  }
}

module.exports = Country
