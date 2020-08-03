'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Penalty extends Model {
  static get hidden() {
    return [
      'branch_office_id',
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
    
		this.addHook('beforeSave', 'GlobalHook.amountField')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  areas() {
    return this.belongsToMany('App/Models/Area')
      .withTimestamps()
  }

  plans() {
    return this.belongsToMany('App/Models/Plan')
      .withTimestamps()
  }
  
  services() {
    return this.belongsToMany('App/Models/Service')
      .withTimestamps()
  }

  classes() {
    return this.belongsToMany('App/Models/Class')
      .withTimestamps()
  }

  packages() {
    return this.belongsToMany('App/Models/Package')
      .withTimestamps()
  }

  roles() {
    return this.belongsToMany('App/Models/Rol')
      .withTimestamps()
  }

  typeClients() {
    return this.belongsToMany('App/Models/TypeClient')
      .withTimestamps()
  }

}

module.exports = Penalty
