'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Schedule extends Model {
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
	}
  
  areas() {
    return this.hasMany('App/Models/Area')
  }

  plans() {
    return this.hasMany('App/Models/Plan')
  }

  services() {
    return this.hasMany('App/Models/Service')
  }

  classes() {
    return this.hasMany('App/Models/Class')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

}

module.exports = Schedule
