'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Photo extends Model {
  static get hidden() {
    return [
      'enterprise_id',
      'person_id',
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

  person() {
    return this.belongsTo('App/Models/Person')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

}

module.exports = Photo
