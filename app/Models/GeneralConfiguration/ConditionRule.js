'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ConditionRule extends Model {
	static get hidden() {
		return [
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

	rules() {
		return this.hasMany('App/Models/GeneralConfiguration/Rule')
	}
}

module.exports = ConditionRule
