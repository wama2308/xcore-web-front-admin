'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class District extends Model {
  static get hidden() {
    return [
      'enabled',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
    ]
  }

  static get visible () {
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

  province() {
    return this.belongsTo('App/Models/Province')
  }
}

module.exports = District
