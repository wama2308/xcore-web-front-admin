'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
  static get hidden() {
    return [
      'pivot',
      'type_supply_id',
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

  typeSupply() {
    return this.belongsTo('App/Models/GeneralConfiguration/TypeSupply')
  }

  lots() {
    return this.hasMany('App/Models/Product/Lot')
  }

  movements() {
    return this.hasMany('App/Models/Product/Movement')
  }

  rewards() {
    return this.belongsToMany('App/Models/Reward')
      .withPivot(['discount_id', 'quantity'])
      .withTimestamps()
  }

  packages() {
    return this.belongsToMany('App/Models/Package')
      .withPivot([
        'discount_id'
      ])
      .withTimestamps()
  }

  discount() {
    return this.belongsTo('App/Models/Discount')
  }
	
	groups() {
    return this.belongsToMany('App/Models/Group')
			.withTimestamps()
  }

}

module.exports = Product
