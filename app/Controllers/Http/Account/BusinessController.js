'use strict'

const Business = use('App/Models/Business')
const businessRepository = use('App/Repositories/BusinessRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with businesses
 */
class BusinessController {

  async index({ request, response, auth }) {
    const business = await businessRepository.datatable(request, auth.user._id)
    return response.status(200).json(business)
  }

  async indexDisabled({ request, response }) {
    const business = await businessRepository.datatable(request, auth.user._id, false)
    return response.status(200).json(business)
  }

  /**
   * Display a single business.
   * GET businesses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, auth }) {
    const user = auth.user
    let business = await user.business()
      .where('_id', params._id)
      .with('branchOffices', (builder) => {
        builder.where('enabled', true)
      })
      .first()

    if (!business) {
      return response.status(404).json({
        ...new MessageFrontEnd('Empresa no encontrada', 'Alerta')
      })
    }

    return response.status(200).json(business)
  }

  /**
   * Update business details.
   * PUT or PATCH businesses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const user = auth.user
    let business = await user.business()
      .where('_id', params._id)
      .with('branchOffices', (builder) => {
        builder.where('enabled', true)
      })
      .first()

    if (!business) {
      return response.status(404).json({
        ...new MessageFrontEnd('Empresa no encontrada', 'Alerta')
      })
    }

    let { name, logo } = request.only(['name', 'logo'])

    business.merge({ name, logo })

    await business.save()

    return response.status(200).json({
      ...new MessageFrontEnd('Empresa editada con éxito')
    })
  }

}

module.exports = BusinessController
