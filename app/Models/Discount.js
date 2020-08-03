'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Discount extends Model {

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

  branchOffice() {
		return this.belongsTo('App/Models/BranchOffice')
	}

	clases() {
		return this.hasMany('App/Models/Class')
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

	products() {
		return this.hasMany('App/Models/Product')
	}

	rewards() {
		return this.hasMany('App/Models/Reward')
	}

	packages() {
		return this.hasMany('App/Models/Package')
	}

	lots() {
    return this.hasMany('App/Models/Product/Lot')
  }

}

module.exports = Discount
