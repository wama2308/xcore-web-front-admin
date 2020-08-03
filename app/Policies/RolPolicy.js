'use strict'

const userRepository = use('App/Repositories/UserRepository')
const rolRepository = use('App/Repositories/RolRepository')

const ROLES = "ROLES"

const LIST = "LIST"
const LIST_DISABLED = "LIST_DISABLED"
const SHOW = "SHOW"
const CREATE = "CREATE"
const EDIT = "EDIT"
const DISBLED = "DISABLED"
const ENABLED = "ENABLED"

class RolPolicy {
  index(user) {
    //
  }

  async show(user, rol) {
    const business_id = rol.business_temp
    const branch_office_id = rol.branch_office_temp
    const business = await userRepository.is_master(business_id, user)
    
    if (business.$relations.pivot.is_master) {
      const branchOffices = await business.branchOffices()
        .where('_id', branch_office_id)
        .with('roles')
        .first()

      const roles = await branchOffices.roles()
        .first()

      return roles
    }

    return false
  }

  create(user) {
    //
  }

  update(user, rol) {
    //
  }

  create(edit) {
    //
  }

  destroy(user, rol) {
    //
  }
}

module.exports = RolPolicy
