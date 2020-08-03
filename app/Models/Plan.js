'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Plan extends Model {
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
    this.addHook('beforeSave', 'GlobalHook.timeCycleField')
    this.addHook('beforeSave', 'GlobalHook.amountAdditionalDayField')
    this.addHook('beforeSave', 'GlobalHook.flexibilityDayField')
    this.addHook('beforeSave', 'GlobalHook.amountLockerField')
    this.addHook('beforeSave', 'GlobalHook.limitAmountField')
    this.addHook('beforeSave', 'GlobalHook.amountInscriptionField')
    this.addHook('beforeSave', 'GlobalHook.daysPartialPaymentsField')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  users() {
    return this.belongsToMany('App/Models/User')
      .withTimestamps()
  }

  tax() {
    return this.belongsTo('App/Models/Country/Tax')
  }

  schedule() {
    return this.belongsTo('App/Models/Schedule')
  }

  penalties() {
    return this.belongsToMany('App/Models/Penalty')
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

  rewards() {
    return this.belongsToMany('App/Models/Reward')
      .withPivot(['discount_id', 'quantity'])
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

module.exports = Plan
