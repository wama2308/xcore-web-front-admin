'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SecretQuestion extends Model {
	static get hidden() {
		return [
			'enabled',
			'created_at',
			'created_by',
			'updated_at',
			'updated_by',
		]
	}

	users() {
    return this.belongsToMany('App/Models/User')
      .withPivot(['answer'])
      .withTimestamps()
  }
}

module.exports = SecretQuestion
