'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Store = use('App/Models/Store')
const storeRepository = use('App/Repositories/StoreRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class StoreController {

  async index({ request, response }) {
    let store = await storeRepository.datatable(request)

    return response.status(200).json(store)
  }

  async indexDisabled({ request, response }) {
    let store = await storeRepository.datatable(request, false)

    return response.status(200).json(store)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let store = await storeRepository.findOneStore(branch_office_id, params._id)

    if (!store) {
      return response.status(404).json({
        ...new MessageFrontEnd('Almacen no encontrado', 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      store
    })
  }

  async store({ request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'internal',
      'address',
      'location'
    ])

    let dataArray = request.only([
      'shelfs'
    ])

    let shelfs = []
    if (dataArray.shelfs && (dataArray.shelfs.length > 0)) {
      for (let shelf of dataArray.shelfs) {
        shelfs.push({
          "name": shelf.name,
          "description": shelf.description
        })
      }
    }

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
    let newStore = await branch_office
      .store()
      .create({
        ...data,
        'created_by': user._id
      })

    if (shelfs.length > 0) {
      await newStore.shelfs().createMany(shelfs)
    }

    return response.status(201).json({
      newStore,
      ...new MessageFrontEnd('Almacen creado con exito', 'Alerta')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'internal',
      'address',
      'location'
    ])

    let store = await storeRepository.findOneStore(branch_office_id, params._id)

    if (!store) {
      return response.status(404).json({
        ...new MessageFrontEnd('Almacen no encontrado', 'Alerta')
      })
    }

    const updateStore = await Store.findOrFail(params._id)
    updateStore.merge({
      ...data,
      'updated_by': user._id
    })

    await updateStore.save()

    return response.status(200).json({
      updateStore,
      ...new MessageFrontEnd('Almacen editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let store = await storeRepository.findOneStoreWithoutStatus(branch_office_id, params._id)

    if (!store) {
      return response.status(404).json({
        ...new MessageFrontEnd('Almacen no encontrado', 'Alerta')
      })
    }

    const updateStore = await Store.findOrFail(params._id)
    let message = (updateStore.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    updateStore.enabled = !updateStore.enabled
    updateStore.updated_by = auth.user._id

    await updateStore.save()

    return response.status(200).json({
      updateStore,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = StoreController
