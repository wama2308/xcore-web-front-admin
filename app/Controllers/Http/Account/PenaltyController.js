'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Rol = use('App/Models/Rol')
const TypeClient = use('App/Models/TypeClient')
const Penalty = use('App/Models/Penalty')
const penaltyRepository = use('App/Repositories/PenaltyRepository')
const typeClientRepository = use('App/Repositories/TypeClientRepository')
const rolRepository = use('App/Repositories/RolRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class PenaltyController {

  async index({ request, response }) {
    let penalty = await penaltyRepository.datatable(request)

    return response.status(200).json(penalty)
  }

  async indexDisabled({ request, response }) {
    let penalty = await penaltyRepository.datatable(request, false)

    return response.status(200).json(penalty)
  }

  async show({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let penalty

    try {
      penalty = await penaltyRepository.byId(params._id, branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      penalty
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'percentage',
      'amount',
      'time_type',
      'time_amount',
      'type_user',
      'type_of_comparison',
      'rule'
    ])

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    let categories = []
    for (let category of request.input('categories')) {
      try {
        if (data.type_user) {
          let rol = await rolRepository.oneRol(branch_office_id, category)
          categories.push(rol._id)
        } else {
          let typeClient = await typeClientRepository.findOneTypeClient(branch_office_id, category)
          categories.push(typeClient._id)
        }
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let penalty = await branch_office
      .penalties()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    if (data.type_user) {
      await penalty.roles().sync(categories)
    } else {
      await penalty.typeClients().sync(categories)
    }

    return response.status(201).json({
      penalty,
      ...new MessageFrontEnd('Penalizacion creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'percentage',
      'amount',
      'time_type',
      'time_amount',
      'type_user',
      'type_of_comparison',
      'rule'
    ])

    try {
      await penaltyRepository.byId(params._id, branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let categories = []
    for (let category of request.input('categories')) {
      try {
        if (data.type_user) {
          let rol = await rolRepository.oneRol(branch_office_id, category)
          categories.push(rol._id)
        } else {
          let typeClient = await typeClientRepository.findOneTypeClient(branch_office_id, category)
          categories.push(typeClient._id)
        }
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    const penalty = await Penalty.findOrFail(params._id)
    penalty.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await penalty.save()

    if (data.type_user) {
      await penalty.typeClients().detach()
      await penalty.roles().sync(categories)
    } else {
      await penalty.roles().detach()
      await penalty.typeClients().sync(categories)
    }

    return response.status(200).json({
      penalty,
      ...new MessageFrontEnd('Penalizacion editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await penaltyRepository.byId(params._id, branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const penalty = await Penalty.findOrFail(params._id)

    let message = (penalty.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    penalty.enabled = !penalty.enabled
    penalty.updated_by = auth.user._id
    await penalty.save()

    return response.status(200).json({
      penalty,
      ...new MessageFrontEnd(message)
    })
  }

  async typePenalties({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let penalties = await penaltyRepository.findAllPenalty(branch_office_id)

    let penaltiesFormat = penalties.toJSON().map(penalty => {
      return {
        'label': penalty.name,
        'value': penalty._id,
        'info': {
          ...penalty
        }
      }
    })

    return response.status(200).json(penaltiesFormat)
  }

}

module.exports = PenaltyController
