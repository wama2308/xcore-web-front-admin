'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
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
  
  modules() {
		return this.hasMany('App/Models/GeneralConfiguration/Module')
	}
}

module.exports = Category
