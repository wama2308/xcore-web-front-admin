'use strict'

const Service = use('App/Models/Service')
const Space = use('App/Models/Space')
const spaceRepository = use('App/Repositories/SpaceRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class SpaceController {

  async index({ request, response }) {
    let spaces = await spaceRepository.datatable(request)

    return response.status(200).json(spaces)
  }

  async indexDisabled({ request, response }) {
    let spaces = await spaceRepository.datatable(request, false)

    return response.status(200).json(spaces)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const service_id = request.header('service_id')
    
    let space = await spaceRepository.findOneSpace(service_id, params._id)

    if (!space) {
      return response.status(404).json({
        ...new MessageFrontEnd('Espacio no encontrado', 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      space
    })
  }

  async store({ request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const service_id = request.header('service_id')

    const data = request.only([
      'responsable_id',
      'schedule_id',
    ])

    let business = await user.business()
      .where('_id', business_id)
      .where('enabled', true)
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

    const service = await Service.findOrFail(service_id)

    let newSpace = await service
      .spaces()
      .create({
        ...data,
        'created_by': user._id
      })

    return response.status(201).json({
      newSpace,
      ...new MessageFrontEnd('Espacio creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'responsable_id',
      'schedule_id',
    ])

    const updateSpace = await Space.findOrFail(params._id)
    updateSpace.merge({
      ...data,
      'updated_by': user._id
    })

    updateSpace.save()

    return response.status(200).json({
      updateSpace,
      ...new MessageFrontEnd('Espacio actualizado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const updateSpace = await Space.findOrFail(params._id)
    let message = (updateSpace.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    updateSpace.enabled = !updateSpace.enabled
    updateSpace.updated_by = user._id

    updateSpace.save()

    return response.status(200).json({
      updateSpace,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = SpaceController
