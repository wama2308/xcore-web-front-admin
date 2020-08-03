'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Area extends Model {
	static get hidden() {
		return [
			'branch_office_id',
			'tax_id',
			'schedule_id',
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
		this.addHook('beforeSave', 'GlobalHook.capacityField')
		this.addHook('beforeSave', 'GlobalHook.giftAreasField')
		this.addHook('beforeSave', 'GlobalHook.numberDaysField')
	}

	discount() {
		return this.belongsTo('App/Models/Discount')
	}

	schedule() {
		return this.belongsTo('App/Models/Schedule')
	}

	tax() {
		return this.belongsTo('App/Models/Country/Tax')
	}

	branchOffice() {
		return this.belongsTo('App/Models/BranchOffice')
	}

	users() {
		return this.belongsToMany('App/Models/User')
			.withPivot(['rol'])
			.withTimestamps()
	}

	packages() {
		return this.belongsToMany('App/Models/Package')
			.withPivot([
				'discount_id'
			])
			.withTimestamps()
	}

	goods() {
		return this.belongsToMany('App/Models/Good')
			.withPivot(['quantity'])
			.withTimestamps()
	}

	penalties() {
		return this.belongsToMany('App/Models/Penalty')
			.withTimestamps()
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

module.exports = Area
