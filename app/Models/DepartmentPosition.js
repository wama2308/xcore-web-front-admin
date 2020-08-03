'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DepartmentPosition extends Model {

  static get hidden() {
		return [
			'enabled',
      'department_id',
      'branch_office_id',
      'user_id',
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

  department() {
    return this.belongsTo('App/Models/Department')
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
  
  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

}

module.exports = DepartmentPosition
