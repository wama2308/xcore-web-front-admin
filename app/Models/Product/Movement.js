'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Movement extends Model {
  static get hidden() {
    return [
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

    this.addHook('beforeSave', 'GlobalHook.amountField')
  }

  product() {
		return this.belongsTo('App/Models/Product')
  }
  
  lot() {
    return this.belongsTo('App/Models/Product/Lot')
  }
}

module.exports = Movement
