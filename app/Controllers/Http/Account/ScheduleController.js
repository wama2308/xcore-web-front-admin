'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with schedules
 */

const scheduleRepository = use('App/Repositories/ScheduleRepository')
const Schedule = use('App/Models/Schedule')
const BranchOffice = use('App/Models/BranchOffice')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ScheduleController {

  async index({ request, response }) {
    let schedules = await scheduleRepository.datatable(request)

    return response.status(200).json(schedules)
  }

  async indexDisabled({ request, response }) {
    let schedules = await scheduleRepository.datatable(request, false)

    return response.status(200).json(schedules)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const schedules = await scheduleRepository.findAll(branch_office_id)
    const select = (schedules && schedules.rows) ? schedules.toJSON().map(item => {
      return {
        "label": item.name,
        "value": item._id,
        "info": {
          ...item
        }
      }
    }) : []

    return response.status(200).json(select)
  }

  /**
   * Create/save a new schedule.
   * POST schedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const user = auth.user
    const data = request.all()
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    let schedule = await branch_offices.schedules()
      .create({
        ...data,
        'created_by': user._id
      })

    schedule = schedule.toJSON()

    schedule = {
      'label': schedule.name,
      'value': schedule._id,
      'info': {
        ...schedule
      }
    }

    return response.status(201).json({
      schedule,
      ...new MessageFrontEnd('Horario creado con éxito')
    })
  }

  /**
   * Display a single schedule.
   * GET schedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let schedule = await scheduleRepository.byId(params._id, branch_office_id)

    if (schedule) {
      return response.status(200).json({
        schedule,
        message: 'OK'
      })
    } else {
      return response.status(404).json({
        ...new MessageFrontEnd( 'Horario no encontrado', 'Alerta')
      })
    }
  }

  /**
   * Update schedule details.
   * PUT or PATCH schedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const schedule = await scheduleRepository.byId(params._id, branch_office_id)

    if (!schedule) {
      return response.status(404).json({
        ...new MessageFrontEnd('Horario no encontrado', 'Alerta')
      })
    }

    const data = request.all()

    schedule.merge({
      ...data,
      updated_by: user._id
    })
    await schedule.save()

    return response.status(201).json({
      schedule,
      ...new MessageFrontEnd('Horario editado con éxito')
    })

  }

  /**
   * Show a list of all documents.
   * GET documents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async changeStatus({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    if (business_id + '' !== branch_offices.business_id + '') {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      })
    }

    const schedule = await scheduleRepository.findOneWithoutStatus(params._id, branch_office_id)
    if (!schedule) {
      return response.status(404).json({
        ...new MessageFrontEnd('Horario no encontrado', 'Alerta')
      })
    }

    let message = (schedule.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'
    schedule.merge({
      enabled: !schedule.enabled,
      updated_by: user._id
    })

    await schedule.save()

    return response.status(200).json({
      schedule,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = ScheduleController
