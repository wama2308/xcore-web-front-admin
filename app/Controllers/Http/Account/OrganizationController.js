'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Department = use('App/Models/Department')
const BranchOffice = use('App/Models/BranchOffice')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * Resourceful controller for interacting with organizations
 */
class OrganizationController {
  /**
   * Show a list of all organizations.
   * GET organizations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {

    const branchOffice = await BranchOffice.findOrFail(request.header('branch_office_id'))

    let query = branchOffice.departments().query()
      .where('enabled', true)
      .where('department_id', null);
      
    let levelChilds = ['childs']
    for (let index = 0; index <= 20; index++) {
      
      query.with('positions.user', (builder) => {
        builder.where('enabled', true)
      })

      let level = levelChilds.join('.') 
      query.with(level, (builder) => {
        builder.where('enabled', true)
      })
      
      query.with(`${level}.positions.user`, (builder) => {
        builder.where('enabled', true)
      })
      
      levelChilds.push('childs')
    
    }

    let organizations = await query.fetch()

    return response.status(200).json(organizations)

  }

}

module.exports = OrganizationController
