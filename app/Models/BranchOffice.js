'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BranchOffice extends Model {
  static get hidden() {
    return [
      'type_branch_id',
      'country_id',
      'province_id',
      'district_id',
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

  persons() {
    return this.hasMany('App/Models/Person')
  }

  products() {
    return this.hasMany('App/Models/Product')
  }

  packages() {
    return this.hasMany('App/Models/Package')
  }

  rewards() {
    return this.hasMany('App/Models/Reward')
  }
  
  areas() {
    return this.hasMany('App/Models/Area')
  }

  documents() {
    return this.hasMany('App/Models/Document')
  }

  goods() {
    return this.hasMany('App/Models/Good')
  }

  discounts() {
    return this.hasMany('App/Models/Discount')
  }

  business() {
    return this.belongsTo('App/Models/Business')
  }

  schedules() {
    return this.hasMany('App/Models/Schedule') 
  }

  screens() {
    return this.hasMany('App/Models/Screen')
  }

  goals() {
    return this.hasMany('App/Models/Goal')
  }

  terms() {
    return this.hasMany('App/Models/Term')
  }

  typeClients() {
    return this.hasMany('App/Models/TypeClient')
  }

  penalties() {
    return this.hasMany('App/Models/Penalty')
  }

  class() {
    return this.hasMany('App/Models/Class')
  }

  country() {
    return this.belongsTo('App/Models/Country')
  }

  province() {
    return this.belongsTo('App/Models/Province')
  }

  district() {
    return this.belongsTo('App/Models/District')
  }

  typeBranch() {
    return this.belongsTo('App/Models/GeneralConfiguration/TypeBranch')
  }

  services() {
    return this.hasMany('App/Models/Service')
  }

  store() {
    return this.hasMany('App/Models/Store')
  }

  plan() {
    return this.hasMany('App/Models/Plan')
  }

  roles() {
    return this.hasMany('App/Models/Rol')
  }

  contacts() {
    return this.hasMany('App/Models/Contact')
  }

  departments() {
    return this.hasMany('App/Models/Department')
  }

  departmentPositions() {
    return this.hasMany('App/Models/DepartmentPosition')
  }

  users() {
    return this.belongsToMany('App/Models/User')
      .withPivot(['enabled', 'rol', 'special_permits'])
      .withTimestamps()
  }

  groups() {
    return this.hasMany('App/Models/Group')
  }

  enterprises() {
    return this.hasMany('App/Models/Enterprise')
  }

  foreignExchanges() {
    return this.belongsToMany('App/Models/ForeignExchange')
      .withPivot(['rate'])
      .withTimestamps()
  }
}

module.exports = BranchOffice
