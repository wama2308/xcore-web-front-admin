'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Service = use('App/Models/Service')
const Screen = use('App/Models/Screen')
const Tax = use('App/Models/Country/Tax')
const Discount = use('App/Models/Discount')
const Schedule = use('App/Models/Schedule')
const penaltyRepository = use('App/Repositories/PenaltyRepository')
const serviceRepository = use('App/Repositories/ServiceRepository')
const screenRespository = use('App/Repositories/ScreenRepository')
const extraData = use('App/Utils/ExtraData')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ServiceController {

  async index({ request, response }) {
    let services = await serviceRepository.datatable(request)

    return response.status(200).json(services)
  }

  async indexDisabled({ request, response }) {
    let services = await serviceRepository.datatable(request, false)

    return response.status(200).json(services)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const services = await serviceRepository.findAllService(branch_office_id, true)
    const select = (services && services.rows) ? services.toJSON().map(item => {
      return {
        label: item.name,
        value: item._id,
        info: item
      }
    }) : []
    return response.status(200).json(select)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let service

    try {
      service = await serviceRepository.findOneService(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    service = await extraData.extraData(service.toJSON())

    return response.status(200).json({
      message: 'Ok',
      service
    })
  }

  async store({ request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'amount',
      'quotas',
      'corporate_group',
      'gifted_service',
      'cumulative_service',
      'reserve',
      'type_reserve',
      'penalty',
      'additional_day',
      'amount_additional_day',
      'additional_day_array',
      'expiration',
      'expiration_date',
      'partial_payment',
      'days_partial_payments',
      'icon',
      'name_icon',
      'number_space',
    ])

    const dataId = request.only([
      'tax_id',
      'schedule_id',
      'discount_id'
    ])

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    const tax = await Tax.findOrFail(dataId.tax_id)
    const schedule = await Schedule.findOrFail(dataId.schedule_id)
    let discount = null
    if (dataId.discount_id) {
      discount = await Discount.findOrFail(dataId.discount_id)
    }

    let screensIds = []
    if (request.input('screens').length > 0) {
      try {
        screensIds = await screenRespository.byIds(request.input('screens'), branch_office_id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let penaltyIds = []
    if (request.input('penalty')) {
      try {
        penaltyIds = await penaltyRepository.byIds(request.input('type_penalties'), branch_office_id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let newService = await branch_office
      .services()
      .create({
        ...data,
        'created_by': user._id
      })

    for (let id of screensIds) {
      const screen = await Screen.findOrFail(id)
      await screen.service().associate(newService)
    }

    await newService.tax().associate(tax)
    await newService.schedule().associate(schedule)

    if (penaltyIds.length > 0) {
      await newService.penalties().sync(penaltyIds)
    }

    if (discount != null) {
      await newService.discount().associate(discount)
    }

    return response.status(201).json({
      newService,
      ...new MessageFrontEnd('Servicio creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'amount',
      'quotas',
      'corporate_group',
      'gifted_service',
      'cumulative_service',
      'reserve',
      'type_reserve',
      'penalty',
      'additional_day',
      'amount_additional_day',
      'additional_day_array',
      'expiration',
      'expiration_date',
      'partial_payment',
      'days_partial_payments',
      'icon',
      'name_icon',
      'number_space',
    ])

    try {
      await serviceRepository.findOneService(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const dataId = request.only([
      'tax_id',
      'schedule_id',
      'discount_id'
    ])

    const tax = await Tax.findOrFail(dataId.tax_id)
    const schedule = await Schedule.findOrFail(dataId.schedule_id)
    let discount = null
    if (dataId.discount_id) {
      discount = await Discount.findOrFail(dataId.discount_id)
    }

    let screensIds = []
    if (request.input('screens').length > 0) {
      try {
        screensIds = await screenRespository.byIds(request.input('screens'), branch_office_id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    let penaltyIds = []
    if (request.input('penalty')) {
      try {
        penaltyIds = await penaltyRepository.byIds(request.input('type_penalties'), branch_office_id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    const updateService = await Service.findOrFail(params._id)
    const screens = await screenRespository.findAllScreenInService(branch_office_id, updateService._id)
    updateService.merge({
      ...data,
      'updated_by': user._id
    })

    if (screens.length > 0) {
      for (let id of screens) {
        const screen = await Screen.findOrFail(id)
        await screen.service().dissociate()
      }
    }

    if (screensIds.length > 0) {
      for (let id of screensIds) {
        const screen = await Screen.findOrFail(id)
        await screen.service().associate(updateService)
      }
    }

    await updateService.tax().associate(tax)
    await updateService.schedule().associate(schedule)

    if (discount != null) {
      await updateService.discount().associate(discount)
    } else {
      updateService.merge({
        ...data,
        'discount_id': null
      })
    }

    await updateService.penalties().sync(penaltyIds)
    await updateService.save()

    return response.status(200).json({
      updateService,
      ...new MessageFrontEnd('Servicio actualizado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await serviceRepository.findOneServiceWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const updateService = await Service.findOrFail(params._id)
    let message = (updateService.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    updateService.enabled = !updateService.enabled
    updateService.updated_by = user._id

    updateService.save()

    return response.status(200).json({
      updateService,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = ServiceController
