'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Department extends Model {
  
  static get hidden() {
		return [
      'department_id',
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

  positions() {
    return this.hasMany('App/Models/DepartmentPosition')
  }

  parent() {
    return this.belongsTo('App/Models/Department')
  }

  childs() {
    return this.hasMany('App/Models/Department')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

}

module.exports = Department
