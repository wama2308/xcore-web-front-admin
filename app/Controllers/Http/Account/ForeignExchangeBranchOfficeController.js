'use strict'

const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const ForeignExchange = use('App/Models/ForeignExchange')
const foreignExchangeRepository = use('App/Repositories/ForeignExchangeRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ForeignExchangeBranchOfficeController {

  async index({ request, response }) {
    let store = await foreignExchangeRepository.datatable(request)

    return response.status(200).json(store)
  }

  async indexDisabled({ request, response }) {
    let store = await foreignExchangeRepository.datatableBranchOffice(request, false)

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

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    const foreignE = await branch_office.foreignExchanges()
      .pivotQuery()
      .where('foreign_exchange_id', foreignExchange._id)
      .first()
    
    if (foreignE.rate) {
      foreignExchange.rate = foreignE.rate
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
      'foreign_exchange_id',
      'rate',
    ])

    try {
      await foreignExchangeRepository.findOneForeignExchange(business_id, data.foreign_exchange_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    let foreign_exchange = await ForeignExchange.findOrFail(data.foreign_exchange_id)

    if (data.rate && (data.rate > 0)) {
      await branch_office.foreignExchanges().attach([foreign_exchange._id], (row) => {
        row.rate = data.rate
      })

      foreign_exchange.rate = data.rate
    } else {
      await branch_office.foreignExchanges().attach([foreign_exchange._id])
    }

    return response.status(201).json({
      foreign_exchange,
      ...new MessageFrontEnd('Divisa creada con exito', 'Alerta')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'rate',
    ])

    try {
      await foreignExchangeRepository.findOneForeignExchange(business_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    const foreign_exchange = await ForeignExchange.findOrFail(params._id)

    await branch_office.foreignExchanges().detach([foreign_exchange._id])

    if (data.rate && (data.rate > 0)) {
      await branch_office.foreignExchanges().attach([foreign_exchange._id], (row) => {
        row.rate = data.rate
      })

      foreign_exchange.rate = data.rate
    } else {
      await branch_office.foreignExchanges().attach([foreign_exchange._id])
    }

    return response.status(200).json({
      foreign_exchange,
      ...new MessageFrontEnd('Divisa editada con exito', 'Alerta')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await foreignExchangeRepository.findOneForeignExchange(business_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    const foreign_exchange = await ForeignExchange.findOrFail(params._id)

    await branch_office.foreignExchanges().detach([foreign_exchange._id])

    return response.status(200).json({
      foreign_exchange,
      ...new MessageFrontEnd('Eliminada con exito')
    })
  }
}

module.exports = ForeignExchangeBranchOfficeController
