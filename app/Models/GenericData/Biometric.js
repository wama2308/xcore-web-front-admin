'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Biometric extends Model {
  static get hidden() {
    return [
      'finger_id',
      'person_id',
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

  finger() {
    return this.belongsTo('App/Models/GeneralConfiguration/Finger')
  }

}

module.exports = Biometric
