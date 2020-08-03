'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Group extends Model {
  static get hidden() {
    return [
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

  person() {
    return this.belongsTo('App/Models/Person')
  }

  schedule() {
    return this.belongsTo('App/Models/Schedule')
  }

  discount() {
    return this.belongsTo('App/Models/Discount')
  }

  enterprise() {
    return this.belongsTo('App/Models/Enterprise')
  }

  branchOffice() {
    return this.belongsTo('App/Models/BranchOffice')
  }

  class() {
    return this.belongsToMany('App/Models/Class')
      .withTimestamps()
  }

  plans() {
    return this.belongsToMany('App/Models/Plan')
      .withTimestamps()
  }

  areas() {
    return this.belongsToMany('App/Models/Area')
      .withTimestamps()
  }

  products() {
    return this.belongsToMany('App/Models/Product')
      .withTimestamps()
  }

  packages() {
    return this.belongsToMany('App/Models/Package')
      .withTimestamps()
  }

  services() {
    return this.belongsToMany('App/Models/Service')
      .withTimestamps()
  }

  people() {
    return this.belongsToMany('App/Models/Person')
      .withTimestamps()
  }

}

module.exports = Group
