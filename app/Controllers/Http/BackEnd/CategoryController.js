'use strict'

const Category = use('App/Models/GeneralConfiguration/Category')
const categoryRepository = use('App/RepositoriesBackEnd/CategoryRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class CategoryController {

  async index({ request, response }) {
    let categories = await categoryRepository.datatable(request)

    return response.status(200).json(categories)
  }

  async indexDisabled({ request, response }) {
    let categories = await categoryRepository.datatable(request, false)

    return response.status(200).json(categories)
  }

  async show({ params, request, response }) {
    let category
    try {
      category = await categoryRepository.findOneCategory(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      category
    })
  }

  async store({ request, response, auth }) {
    const data = request.only([
      'name',
      'menu_title',
      'menu_icon',
      'description',
      'type_multi',
      'new_item',
    ])

    let category = await Category.create(data)

    return response.status(201).json({
      category,
      ...new MessageFrontEnd('Categoria creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    let category
    try {
      category = await categoryRepository.findOneCategory(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'menu_title',
      'menu_icon',
      'description',
      'type_multi',
      'new_item',
    ])

    category.merge(data)
    await category.save()

    return response.status(200).json({
      category,
      ...new MessageFrontEnd('Categoria editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    let category
    try {
      category = await categoryRepository.findOneCategoryWithoutStatus(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let message = (category.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'
    
    category.merge({
      enabled: !category.enabled
    })

    await category.save()

    return response.status(200).json({
      category,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = CategoryController
