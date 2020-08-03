'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Enterprise extends Model {
  static get hidden() {
    return [
      'branch_office_id',
      'type_identity_id',
      'person_id',
      'search',
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

  typeIdentity() {
    return this.belongsTo('App/Models/Country/TypeIdentity')
  }

  people() {
    return this.hasMany('App/Models/Person')
  }

  person() {
    return this.belongsTo('App/Models/Person')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }
  
  addresses() {
    return this.hasMany('App/Models/GenericData/Address')
  }

  emails() {
    return this.hasMany('App/Models/GenericData/Email')
  }

  phones() {
    return this.hasMany('App/Models/GenericData/Phone')
  }

}

module.exports = Enterprise
