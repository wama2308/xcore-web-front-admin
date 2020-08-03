'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Shelf = use('App/Models/Shelf')
const shelfRepository = use('App/Repositories/ShelfRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ShelfController {

  async index({ request, response }) {
    let shelf = await shelfRepository.datatable(request)

    return response.status(200).json(shelf)
  }

  async indexDisabled({ request, response }) {
    let shelf = await shelfRepository.datatable(request, false)

    return response.status(200).json(shelf)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const store_id = params.store_id
    let shelf = await shelfRepository.findOneShelf(store_id, params._id)

    if (!shelf) {
      return response.status(404).json({
        ...new MessageFrontEnd('Estante no encontrado', 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      shelf
    })
  }

  async store({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const store_id = params.store_id

    const data = request.only([
      'name',
      'description'
    ])

    let business = await user.business()
      .where('_id', business_id)
      .with('branchOffices', (builder) => {
        builder.where('_id', branch_office_id)
        builder.where('enabled', true)
      })
      .first()

    if (!business) {
      return response.status(404).json({
        ...new MessageFrontEnd('Empresa no encontrada', 'Alerta')
      })
    }

    const branchOffice = business.$relations.branchOffices

    if (branchOffice.rows.length === 0) {
      return response.status(404).json({
        ...new MessageFrontEnd('Sucursal no encontrada', 'Alerta')
      })
    }

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    const store = await branch_office.store()
      .where('_id', store_id)
      .where('enabled', true)
      .first()
    
    if (!store) {
      return response.status(404).json({
        ...new MessageFrontEnd('Almacen no encontrado', 'Alerta')
      })
    } 

    let newShelf = await store
      .shelfs()
      .create({
        ...data,
        'created_by': user._id
      }) 

    return response.status(201).json({
      newShelf,
      ...new MessageFrontEnd('Estante creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const store_id = params.store_id

    const data = request.only([
      'name',
      'description'
    ])

    let shelf = await shelfRepository.findOneShelf(store_id, params._id)

    if (!shelf) {
      return response.status(404).json({
        ...new MessageFrontEnd('Estante no encontrado', 'Alerta')
      })
    }

    const updateShelf = await Shelf.findOrFail(params._id)
    updateShelf.merge({
      ...data,
      'updated_by': user._id
    })

    updateShelf.save()

    return response.status(200).json({
      updateShelf,
      ...new MessageFrontEnd('Estante editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const store_id = params.store_id
    let shelf = await shelfRepository.findOneShelfWithoutStatus(store_id, params._id)

    if (!shelf) {
      return response.status(404).json({
        ...new MessageFrontEnd('Estante no encontrado', 'Alerta')
      })
    }

    const updateShelf = await Shelf.findOrFail(params._id)
    let message = (updateShelf.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    updateShelf.enabled = !updateShelf.enabled
    updateShelf.updated_by = auth.user._id

    await updateShelf.save()

    return response.status(200).json({
      updateShelf,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = ShelfController
