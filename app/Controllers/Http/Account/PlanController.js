'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Plan = use('App/Models/Plan')
const Tax = use('App/Models/Country/Tax')
const Discount = use('App/Models/Discount')
const Schedule = use('App/Models/Schedule')
const penaltyRepository = use('App/Repositories/PenaltyRepository')
const planRepository = use('App/Repositories/PlanRepository')
const extraData = use('App/Utils/ExtraData')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class PlanController {

  async index({ request, response }) {
    let plan = await planRepository.datatable(request)

    return response.status(200).json(plan)
  }

  async indexDisabled({ request, response }) {
    let plan = await planRepository.datatable(request, false)

    return response.status(200).json(plan)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const plans = await planRepository.findAllPlan(branch_office_id, true)
    const select = (plans && plans.rows) ? plans.toJSON().map(item => {
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
    let plan

    try {
      plan = await planRepository.findOnePlan(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    plan = await extraData.extraData(plan.toJSON())

    return response.status(200).json({
      message: 'Ok',
      plan
    })
  }

  async store({ request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let data = request.only([
      'name',
      'description',
      'amount',
      'corporate_group',
      'date_change',
      'inscription',
      'amount_inscription',
      'expiration',
      'expiration_date',
      'cycle',
      'time_cycle',
      'additional_day',
      'amount_additional_day',
      'additional_day_array',
      'flexibility',
      'flexibility_day',
      'partial_payments',
      'days_partial_payments',
      'locker',
      'amount_locker',
      'attendance_limit',
      'type_limit',
      'limit_amount',
      'penalty',
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

    let newPlan = await branch_office
      .plan()
      .create({
        ...data,
        'created_by': user._id
      })

    await newPlan.tax().associate(tax)
    await newPlan.schedule().associate(schedule)

    if (penaltyIds.length > 0) {
      await newPlan.penalties().sync(penaltyIds)
    }

    if (discount != null) {
      await newPlan.discount().associate(discount)
    }

    return response.status(201).json({
      newPlan,
      ...new MessageFrontEnd('Plan creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let data = request.only([
      'name',
      'description',
      'amount',
      'corporate_group',
      'date_change',
      'inscription',
      'amount_inscription',
      'expiration',
      'expiration_date',
      'cycle',
      'time_cycle',
      'additional_day',
      'amount_additional_day',
      'additional_day_array',
      'flexibility',
      'flexibility_day',
      'partial_payments',
      'days_partial_payments',
      'locker',
      'amount_locker',
      'attendance_limit',
      'type_limit',
      'limit_amount',
      'penalty',
    ])

    try {
      await planRepository.findOnePlan(branch_office_id, params._id)
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

    const updatePlan = await Plan.findOrFail(params._id)
    updatePlan.merge({
      ...data,
      'updated_by': user._id
    })

    await updatePlan.tax().associate(tax)
    await updatePlan.schedule().associate(schedule)

    if (discount != null) {
      await updatePlan.discount().associate(discount)
    } else {
      updatePlan.merge({
        ...data,
        'discount_id': null
      })
    }

    await updatePlan.penalties().sync(penaltyIds)
    await updatePlan.save()

    return response.status(200).json({
      updatePlan,
      ...new MessageFrontEnd('Plan editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await planRepository.findOnePlanWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const updatePlan = await Plan.findOrFail(params._id)
    let message = (updatePlan.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    updatePlan.enabled = !updatePlan.enabled
    updatePlan.updated_by = auth.user._id

    await updatePlan.save()

    return response.status(200).json({
      updatePlan,
      ...new MessageFrontEnd(message)
    })
  }
}

module.exports = PlanController
