'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with goods
 */
const Good = use('App/Models/Good')
const BranchOffice = use('App/Models/BranchOffice')
const goodRepository = use('App/Repositories/GoodRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class GoodController {

  async index({ request, response }) {
    let goods = await goodRepository.datatable(request)

    return response.status(200).json(goods)
  }

  async indexDisabled({ request, response }) {
    let goods = await goodRepository.datatable(request, false)

    return response.status(200).json(goods)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const goods = await goodRepository.findAll(branch_office_id, true, request.get().search)
    const select = (goods && goods.rows)? goods.toJSON().map(item => {
      return {
        label: item.name,
        value: item._id,
        info: {
          ...item,
          quantity: 0
        }
      }
    }): []
    return response.status(200).json(select)
  }

  /**
   * Render a form to be used for creating a new good.
   * GET goods/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new good.
   * POST goods
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single good.
   * GET goods/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing good.
   * GET goods/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update good details.
   * PUT or PATCH goods/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a good with id.
   * DELETE goods/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = GoodController
