'use strict'

const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const ForeignExchange = use('App/Models/ForeignExchange')
const foreignExchangeRepository = use('App/Repositories/ForeignExchangeRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ForeignExchangeController {

  async index({ request, response }) {
    let store = await foreignExchangeRepository.datatable(request)

    return response.status(200).json(store)
  }

  async indexDisabled({ request, response }) {
    let store = await foreignExchangeRepository.datatable(request, false)

    return response.status(200).json(store)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let foreignExchange
    try {
      foreignExchange = await foreignExchangeRepository.findOneForeignExchange(business_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      foreignExchange
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'acronym',
      'currency_symbol',
      'rate',
    ])

    const business = await Business.findOrFail(business_id)
    let search = `${data.name} ${data.acronym} ${data.currency_symbol}`
    let foreignExchange = await business
      .foreignExchanges()
      .create({
        ...data,
        search,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      foreignExchange,
      ...new MessageFrontEnd('Divisa creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await foreignExchangeRepository.findOneForeignExchange(business_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'acronym',
      'currency_symbol',
      'rate',
    ])

    let obj = await ForeignExchange.findOrFail(params._id)
    let search = `${data.name} ${data.acronym} ${data.currency_symbol}`
    obj.merge({
      ...data,
      search,
      'updated_by': auth.user._id
    })

    await obj.save()

    return response.status(200).json({
      obj,
      ...new MessageFrontEnd('Divisa editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await foreignExchangeRepository.findOneForeignExchangeWithoutStatus(business_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let obj = await ForeignExchange.findOrFail(params._id)
    let message = (obj.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    obj.enabled = !obj.enabled
    obj.updated_by = auth.user._id

    await obj.save()

    return response.status(200).json({
      obj,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = ForeignExchangeController
