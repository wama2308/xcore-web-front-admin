'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Service extends Model {
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
    this.addHook('beforeSave', 'GlobalHook.quotasField')
    this.addHook('beforeSave', 'GlobalHook.daysPartialPaymentsField')
    this.addHook('beforeSave', 'GlobalHook.amountAdditionalDayField')
    this.addHook('beforeSave', 'GlobalHook.giftedServiceField')
    this.addHook('beforeSave', 'GlobalHook.cumulativeServiceField')
  }

  tax() {
    return this.belongsTo('App/Models/Country/Tax')
  }

  schedule() {
    return this.belongsTo('App/Models/Schedule')
  }

  screens() {
    return this.hasMany('App/Models/Screen')
  }

  penalties() {
    return this.belongsToMany('App/Models/Penalty')
      .withTimestamps()
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  spaces() {
    return this.hasMany('App/Models/Space')
  }

  packages() {
    return this.belongsToMany('App/Models/Package')
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

module.exports = Service
