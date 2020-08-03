'use strict'

const userRepository = use('App/Repositories/UserRepository')
const Business = use('App/Models/Business')

class PermissionsVerify {
  async handle({ request, response, auth }, next) {
    const { 
      business_id, 
      branch_office_id 
    } = request.only([
      'business_id', 
      'branch_office_id'
    ])
    const user = auth.user
    let business = await Business.findOrFail(business_id)
    let result = business.masterPermissions(user)

    if (result.is_master === true) {
      await next()
    } else {
      
      return response.status(403).json({
        message: 'Acceso denegado, no tiene permiso'
      })
    }
  }

}

module.exports = new PermissionsVerify()
