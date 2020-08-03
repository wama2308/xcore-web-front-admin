'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contacts
 */
const Contact = use('App/Models/Contact')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ContactController {
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
  }

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {
  }

  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const business_id = request.header('business_id')
    const contact = await Contact.findOrFail(params._id)
    await contact.load('branchOffice.business')
    if ((contact.$relations) && (contact.$relations.branchOffice) && (contact.$relations.branchOffice.$relations) && (contact.$relations.branchOffice.$relations.business)) {
      if (`${contact.$relations.branchOffice.$relations.business._id}` === business_id) {
        await contact.delete()   
        return response.status(200).json({
          ...new MessageFrontEnd('Contacto eliminado con éxito')
        })
      }
    }
    return response.status(404).json({
      ...new MessageFrontEnd('El Contacto no pertenece a la empresa selecionada', 'Alerta')
    })
  }
}

module.exports = ContactController
