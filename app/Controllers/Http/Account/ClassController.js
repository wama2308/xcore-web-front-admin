'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Class = use('App/Models/Class')
const Screen = use('App/Models/Screen')
const Discount = use('App/Models/Discount')
const Tax = use('App/Models/Country/Tax')
const Schedule = use('App/Models/Schedule')
const penaltyRepository = use('App/Repositories/PenaltyRepository')
const classRepository = use('App/Repositories/ClassRepository')
const screenRespository = use('App/Repositories/ScreenRepository')
const extraData = use('App/Utils/ExtraData')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ClassController {

  async index({ request, response }) {
    let classes = await classRepository.datatable(request)

    return response.status(200).json(classes)
  }

  async indexDisabled({ request, response }) {
    let classes = await classRepository.datatable(request, false)

    return response.status(200).json(classes)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const classes = await classRepository.findAllClass(branch_office_id, true)
    const select = (classes && classes.rows) ? classes.toJSON().map(item => {
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
    let classes

    try {
      classes = await classRepository.findOneClass(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    classes = await extraData.extraData(classes.toJSON())

    return response.status(200).json({
      message: 'Ok',
      classes
    })
  }

  async store({ request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'reserve',
      'type_reserve',
      'amount',
      'penalty',
      'quotas',
      'cumulative_class',
      'gifted_class',
      'icon',
      'name_icon',
      'expiration_cycle',
      'expiration_time',
      'inscription',
      'corporate_group',
      'multiple_assistance',
      'number_class',
      'partial_payment',
      'amount_inscription',
      'number_days'
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

    let newClass = await branch_office
      .class()
      .create({
        ...data,
        'created_by': user._id
      })

    for (let id of screensIds) {
      const screen = await Screen.findOrFail(id)
      await screen.class().associate(newClass)
    }

    await newClass.tax().associate(tax)
    await newClass.schedule().associate(schedule)
    
    if (penaltyIds.length > 0) {
      await newClass.penalties().sync(penaltyIds)
    }

    if (discount != null) {
      await newClass.discount().associate(discount)
    }

    return response.status(201).json({
      newClass,
      ...new MessageFrontEnd('Clase creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'reserve',
      'type_reserve',
      'amount',
      'penalty',
      'quotas',
      'cumulative_class',
      'gifted_class',
      'icon',
      'name_icon',
      'expiration_cycle',
      'expiration_time', ,
      'inscription',
      'corporate_group',
      'multiple_assistance',
      'number_class',
      'partial_payment',
      'amount_inscription',
      'number_days'
    ])

    try {
      await classRepository.findOneClass(branch_office_id, params._id)
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

    const updateClass = await Class.findOrFail(params._id)
    const screens = await screenRespository.findAllScreenInClass(branch_office_id, updateClass._id)

    updateClass.merge({
      ...data,
      'updated_by': auth.user._id
    })

    if (screens.length > 0) {
      for (let id of screens) {
        const screen = await Screen.findOrFail(id)
        await screen.class().dissociate()
      }
    }

    if (screensIds.length > 0) {
      for (let id of screensIds) {
        const screen = await Screen.findOrFail(id)
        await screen.class().associate(updateClass)
      }
    }

    await updateClass.tax().associate(tax)
    await updateClass.schedule().associate(schedule)
    await updateClass.penalties().sync(penaltyIds)

    if (discount != null) {
      await updateClass.discount().associate(discount)
    } else {
      updateClass.merge({
        ...data,
        'discount_id': null
      })
    }

    await updateClass.save()

    return response.status(200).json({
      updateClass,
      ...new MessageFrontEnd('Clase editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await classRepository.findOneClassWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const updateClass = await Class.findOrFail(params._id)
    let message = (updateClass.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    updateClass.enabled = !updateClass.enabled
    updateClass.updated_by = auth.user._id

    await updateClass.save()

    return response.status(200).json({
      updateClass,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = ClassController
