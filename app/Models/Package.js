'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Package extends Model {

	static get hidden() {
		return [
			'discount_id',
			'branch_office_id',
			'tax_id',
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

	branchOffice() {
		return this.belongsTo('App/Models/BranchOffice')
			.withTimestamps()
	}

	class() {
		return this.belongsToMany('App/Models/Class')
			.withPivot([
				'discount_id'
			])
			.withTimestamps()
	}

	plans() {
		return this.belongsToMany('App/Models/Plan')
			.withPivot([
				'discount_id'
			])
			.withTimestamps()
	}

	areas() {
		return this.belongsToMany('App/Models/Area')
			.withPivot([
				'discount_id'
			])
			.withTimestamps()
	}

	products() {
		return this.belongsToMany('App/Models/Product')
			.withPivot([
				'discount_id'
			])
			.withTimestamps()
	}

	services() {
		return this.belongsToMany('App/Models/Service')
			.withPivot([
				'discount_id'
			])
			.withTimestamps()
	}

	rewards() {
		return this.belongsToMany('App/Models/Reward')
			.withPivot(['discount_id', 'quantity'])
			.withTimestamps()
	}

	penalties() {
		return this.belongsToMany('App/Models/Penalty')
			.withTimestamps()
	}

	tax() {
		return this.belongsTo('App/Models/Country/Tax')
	}

	discount() {
		return this.belongsTo('App/Models/Discount')
	}

	groups() {
		return this.belongsToMany('App/Models/Group')
			.withTimestamps()
	}

	typeClients() {
		return this.belongsToMany('App/Models/TypeClient')
			.withPivot([
				'type_comparison',
				'time_cycle',
				'time_amount',
				'percentage',
				'percentage_amount'
			])
			.withTimestamps()
	}

}

module.exports = Package
