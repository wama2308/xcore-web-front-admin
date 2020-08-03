'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TypeBranch extends Model {
	static get hidden() {
		return [
			'enabled',
			'created_at',
			'created_by',
			'updated_at',
			'updated_by',
		]
	}

	branchOffices() {
    return this.hasMany('App/Models/BranchOffice')
  }
}

module.exports = TypeBranch
