'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Reward extends Model {

  static get hidden() {
    return [
      'discount_id',
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

  rule() {
    return this.belongsTo('App/Models/GeneralConfiguration/Rule')
  }

	discount() {
		return this.belongsTo('App/Models/Discount')
	}

  classes() {
    return this.belongsToMany('App/Models/Class')
      .withPivot(['discount_id', 'quantity'])
      .withTimestamps()
  }

  packages() {
    return this.belongsToMany('App/Models/Package')
      .withPivot(['discount_id', 'quantity'])
      .withTimestamps()
  }

  products() {
    return this.belongsToMany('App/Models/Product')
      .withPivot(['discount_id', 'quantity'])
      .withTimestamps()
  }

  plans() {
    return this.belongsToMany('App/Models/Plan')
      .withPivot(['discount_id', 'quantity'])
      .withTimestamps()
  }

  services() {
    return this.belongsToMany('App/Models/Service')
      .withPivot(['discount_id', 'quantity'])
      .withTimestamps()
  }

}

module.exports = Reward
