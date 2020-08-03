'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with documents
 */
const Document = use('App/Models/Document')
const BranchOffice = use('App/Models/BranchOffice')
const documentRepository = use('App/Repositories/DocumentRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class DocumentController {

  async index({ request, response }) {
    let documents = await documentRepository.datatable(request)

    return response.status(200).json(documents)
  }

  async indexDisabled({ request, response }) {
    let documents = await documentRepository.datatable(request, false)

    return response.status(200).json(documents)
  }

  /**
   * Create/save a new document.
   * POST documents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only([
      'name',
      'description',
      'format',
      'type_document_id'
    ])
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    if (business_id + '' !== branch_offices.business_id + '') {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      })
    }

    const $document = new Document(data)
    $document.merge({
      business_id,
      'branch_office_id': branch_offices._id,
      created_by: auth.user._id
    })
    await $document.save()
    return response.status(201).json({
      document: $document,
      ...new MessageFrontEnd('Documento creada con éxito')
    })
  }

  /**
   * Display a single document.
   * GET documents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    if (business_id + '' !== branch_offices.business_id + '') {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      })
    }

    const $document = await documentRepository.byId(params._id, branch_office_id)
    if (!$document) {
      return response.status(404).json({
        ...new MessageFrontEnd('Documento no encontrado', 'Alerta')
      })
    }

    return response.status(200).json({
      document: $document,
      message: 'ok'
    })

  }

  /**
   * Update document details.
   * PUT or PATCH documents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const data = request.only([
      'name',
      'description',
      'format',
      'type_document_id'
    ])
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    if (business_id + '' !== branch_offices.business_id + '') {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      })
    }

    const $document = await documentRepository.byId(params._id, branch_office_id)
    if (!$document) {
      return response.status(404).json({
        ...new MessageFrontEnd('Documento no encontrado', 'Alerta')
      })
    }

    $document.merge({
      ...data,
      updated_by: auth.user._id
    })
    await $document.save()
    return response.status(201).json({
      document: $document,
      ...new MessageFrontEnd('Documento editado con éxito')
    })
  }

  /**
   * Show a list of all documents.
   * GET documents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async changeStatus ({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    if (business_id + '' !== branch_offices.business_id + '') {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      })
    }

    const $document = await documentRepository.findOneWithoutStatus(params._id, branch_office_id)
    if (!$document) {
      return response.status(404).json({
        ...new MessageFrontEnd('Documento no encontrado', 'Alerta')
      })
    }

    let message = ($document.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'
    $document.merge({
      enabled: !$document.enabled,
      updated_by: auth.user._id
    })

    await $document.save()

    return response.status(200).json({
      document: $document,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = DocumentController
