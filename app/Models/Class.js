'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Class extends Model {
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
    this.addHook('beforeSave', 'GlobalHook.cumulativeClassField')
    this.addHook('beforeSave', 'GlobalHook.giftedClassField')
    this.addHook('beforeSave', 'GlobalHook.numberDaysField')
    this.addHook('beforeSave', 'GlobalHook.quotasField')
    this.addHook('beforeSave', 'GlobalHook.numberClassField')
  }

  tax() {
    return this.belongsTo('App/Models/Country/Tax')
  }

  screens() {
    return this.hasMany('App/Models/Screen')
  }

  schedule() {
    return this.belongsTo('App/Models/Schedule')
  }

  penalties() {
    return this.belongsToMany('App/Models/Penalty')
      .withTimestamps()
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  users() {
    return this.belongsToMany('App/Models/User')
      .withTimestamps()
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

module.exports = Class
