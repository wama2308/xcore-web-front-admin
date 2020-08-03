'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TypeIdentity extends Model {
  static get hidden() {
    return [
      'country_id',
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
}

module.exports = TypeIdentity
