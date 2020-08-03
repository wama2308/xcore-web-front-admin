'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {

  static get hidden() {
    return [
      'business_default',
      'branch_office_default',
      'rol_id',
      'verified',
      'password',
      'check',
      'secret',
      'enabled',
      'created_at',
      'created_by',
      'updated_at',
      'updated_by'
    ]
  }

  static boot() {
    super.boot()
    this.addHook('beforeCreate', 'GlobalHook.enabledField')

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  secretQuestions() {
    return this.belongsToMany('App/Models/GeneralConfiguration/SecretQuestion')
      .withPivot(['answer'])
      .withTimestamps()
  }

  areas() {
    return this.belongsToMany('App/Models/Area')
      .withPivot(['rol'])
      .withTimestamps()
  }

  branchOffices() {
    return this.belongsToMany('App/Models/BranchOffice')
      .withPivot(['enabled', 'rol', 'special_permits'])
      .withTimestamps()
  }

  business() {
    return this.belongsToMany('App/Models/Business')
      .withPivot(['is_master'])
      .withTimestamps()
  }

  department() {
    return this.hasOne('App/Models/Department')
  }

  class() {
    return this.hasMany('App/Models/Class')
  }

  plan() {
    return this.hasMany('App/Models/Plan')
  }

  rol() {
    return this.belongsTo('App/Models/Rol')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

}

module.exports = User
