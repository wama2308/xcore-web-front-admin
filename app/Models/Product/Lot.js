'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Lot extends Model {
  static get hidden() {
    return [
      'discount_id',
      'tax_id',
      'product_id',
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

  product() {
		return this.belongsTo('App/Models/Product')
  }

  tax() {
		return this.belongsTo('App/Models/Country/Tax')
  }

  movements() {
    return this.hasMany('App/Models/Product/Movement')
  }
  
  discount() {
    return this.belongsTo('App/Models/Discount')
  }
}

module.exports = Lot
