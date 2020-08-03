'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Person extends Model {
  static get hidden() {
    return [
      'pivot',
      'business_id',
      'branch_office_id',
      'sex_id',
      'civil_state_id',
      'type_identity_id',
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

  business() {
    return this.belongsTo('App/Models/Business')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  sex() {
    return this.belongsTo('App/Models/GeneralConfiguration/Sex')
  }

  civilState() {
    return this.belongsTo('App/Models/GeneralConfiguration/CivilState')
  }

  typeIdentity() {
    return this.belongsTo('App/Models/Country/TypeIdentity')
  }

  addresses() {
    return this.hasMany('App/Models/GenericData/Address')
  }

  biometrics() {
    return this.hasMany('App/Models/GenericData/Biometric')
  }

  emails() {
    return this.hasMany('App/Models/GenericData/Email')
  }

  phones() {
    return this.hasMany('App/Models/GenericData/Phone')
  }

  photos() {
    return this.hasMany('App/Models/GenericData/Photo')
  }
	
	groups() {
    return this.belongsToMany('App/Models/Group')
			.withTimestamps()
  }

  group() {
    return this.belongsTo('App/Models/Group')
  }

}

module.exports = Person
