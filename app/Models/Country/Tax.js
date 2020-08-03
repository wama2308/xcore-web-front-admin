'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tax extends Model {
  static get hidden() {
    return [
      'enabled',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by',
    ]
  }
  
  country() {
    return this.belongsTo('App/Models/Country')
  }

  areas() {
    return this.hasMany('App/Models/Area')
  } 

  plans() {
    return this.hasMany('App/Models/Plan')
  }

  services() {
    return this.hasMany('App/Models/Service')
  }

  classes() {
    return this.hasMany('App/Models/Class')
  }

  lots() {
    return this.hasMany('App/Models/Product/Lot')
  }

  package() {
    return this.hasMany('App/Models/Package')
  }

}

module.exports = Tax
