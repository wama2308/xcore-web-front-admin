'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TypeClient extends Model {
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

  penalties() {
    return this.belongsToMany('App/Models/Penalty')
      .withTimestamps()
  }

  areas() {
    return this.belongsToMany('App/Models/Area')
			.withPivot([
        'type_comparison', 
        'time_cycle', 
        'time_amount', 
        'percentage', 
        'percentage_amount'
      ])
      .withTimestamps()
  }

  classes() {
    return this.belongsToMany('App/Models/Class')
			.withPivot([
        'type_comparison', 
        'time_cycle', 
        'time_amount', 
        'percentage', 
        'percentage_amount'
      ])
      .withTimestamps()
  }

  packages() {
    return this.belongsToMany('App/Models/Package')
			.withPivot([
        'type_comparison', 
        'time_cycle', 
        'time_amount', 
        'percentage', 
        'percentage_amount'
      ])
      .withTimestamps()
  }

  plans() {
    return this.belongsToMany('App/Models/Plan')
			.withPivot([
        'type_comparison', 
        'time_cycle', 
        'time_amount', 
        'percentage', 
        'percentage_amount'
      ])
      .withTimestamps()
  }

  services() {
    return this.belongsToMany('App/Models/Service')
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

module.exports = TypeClient
