'use strict'

const Category = use('App/Models/GeneralConfiguration/Category')
const Module = use('App/Models/GeneralConfiguration/Module')
const moduleRepository = use('App/RepositoriesBackEnd/ModuleRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ModuleController {
  
  async index({ request, response }) {
    let modules = await moduleRepository.datatable(request)

    return response.status(200).json(modules)
  }

  async indexDisabled({ request, response }) {
    let modules = await moduleRepository.datatable(request, false)

    return response.status(200).json(modules)
  }

  async show({ params, request, response }) {
    let modul
    try {
      modul = await moduleRepository.findOneModule(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      modul
    })
  }

  async store({ request, response, auth }) {
    const data = request.only([
      'name',
      'menu_title',
      'new_item',
      'path'
    ])

    const idRule = request.only([
      'category_id'
    ])

    let category = await Category.findOrFail(idRule.category_id)

    let modul = await Module.create(data)
    await modul.category().associate(category)

    return response.status(201).json({
      modul,
      ...new MessageFrontEnd('Modulo creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    let modul
    try {
      modul = await moduleRepository.findOneModule(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'menu_title',
      'new_item',
      'path'
    ])

    const idRule = request.only([
      'category_id'
    ])

    let category = await Category.findOrFail(idRule.category_id)

    modul.merge(data)
    await modul.category().associate(category)

    return response.status(200).json({
      modul,
      ...new MessageFrontEnd('Modulo editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    let modul
    try {
      modul = await moduleRepository.findOneModuleWithoutStatus(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let message = (modul.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'
    
    modul.merge({
      enabled: !modul.enabled
    })

    await modul.save()

    return response.status(200).json({
      modul,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = ModuleController
