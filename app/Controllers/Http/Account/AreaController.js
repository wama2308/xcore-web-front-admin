'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Area = use('App/Models/Area')
const User = use('App/Models/User')
const Schedule = use('App/Models/Schedule')
const Discount = use('App/Models/Discount')
const Tax = use('App/Models/Country/Tax')
const BranchOffice = use('App/Models/BranchOffice')
const userRepository = use('App/Repositories/UserRepository')
const areaRepository = use('App/Repositories/AreaRepository')
const goodRepository = use('App/Repositories/GoodRepository')
const penaltyRepository = use('App/Repositories/PenaltyRepository')
const extraData = use('App/Utils/ExtraData')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * Resourceful controller for interacting with branchoffices
 */
class AreaController {
  /**
   * Show a list of all branchoffices.
   * GET branchoffices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response }) {
    let areas = await areaRepository.datatable(request)
    return response.status(200).json(areas)
  }

  async indexDisabled({ request, response }) {
    let areas = await areaRepository.datatable(request, false)
    return response.status(200).json(areas)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const areas = await areaRepository.findAll(branch_office_id, true)
    const select = (areas && areas.rows) ? areas.toJSON().map(item => {
      return {
        label: item.name,
        value: item._id,
        info: item
      }
    }) : []
    return response.status(200).json(select)
  }

  /**
   * Create/save a new branchoffice.
   * POST branchoffices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const user = auth.user
    const data = request.only([
      'name',
      'description',
      'photos',
      'required_manager',
      'reserve',
      'type_reserve',
      'capacity',
      'gift_areas',
      'icon',
      'name_icon',
      'phone',
      'biometric_control',
      'internal',
      'location',
      'penalty',
      'required_maintenance',
      'amount',
      'partial_payment',
      'number_days'
    ])
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    //Buscamos la sucursal
    const branch_offices = await BranchOffice.findOrFail(branch_office_id)
    if (business_id + '' !== branch_offices.business_id + '') {
      return response.status(404).json({
        ...new MessageFrontEnd('La sucursal no pertenece a la empresa selecionada', 'Alerta')
      })
    }

    //si requiere gerente lo buscamos
    if (request.input('required_manager')) {
      const manager = await userRepository.byId(request.input('manager'))
      if (!manager) {
        return response.status(404).json({
          ...new MessageFrontEnd('Usuario gerente no encontrado', 'Alerta')
        })
      }
      data.manager = manager._id
    } else {
      data.manager = null
    }

    //si requiere mantenimiento buscamos al usuario
    if (request.input('required_maintenance')) {
      const maintenance = await userRepository.byId(request.input('responsible_maintenance'))
      if (!maintenance) {
        return response.status(404).json({
          ...new MessageFrontEnd('Usuario de mantenimiento no encontrado', 'Alerta')
        })
      }
      data.maintenance_time = request.input('maintenance_time')
      data.responsible_maintenance = request.input('responsible_maintenance')
    } else {
      data.responsible_maintenance = null
    }

    //si tiene descuento lo buscamos
    if (request.input('discount_id')) {
      const discount = await Discount.findOrFail(request.input('discount_id'))
      data.discount_id = discount._id
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

    // buscamos el horario disponuble del area
    const schedule = await Schedule.findOrFail(request.input('schedule_id'))
    data.schedule_id = schedule._id

    // buscamos el impuesto
    const tax = await Tax.findOrFail(request.input('tax_id'))
    data.tax_id = tax._id

    let quantity = (request.input('quantity') !== 0) ? request.input('quantity') : 1

    //se cargan los Ids de usuarios responsables del area
    let users_area = []
    if (request.input('required_manager')) {
      users_area.push(request.input('manager'))
    }
    if (request.input('required_maintenance')) {
      users_area.push(request.input('responsible_maintenance'))
    }

    //si tiene bienes los buscamos
    const goods = request.input('goods')
    let goods_ids = []
    if (goods) {
      for (const element of goods) {
        const good = await goodRepository.byId(element.goods_id, branch_office_id)
        if (!good) {
          return response.status(404).json({
            ...new MessageFrontEnd('Bien no encontrado', 'Alerta')
          })
        } else {
          goods_ids.push(good._id)
        }
      }
    }

    let areas = []
    // Iteramos la cantidad de areas a crear
    let nameArea = data.name
    for (var i = 0; i < quantity; i++) {
      // creamos el area
      data.name = `${nameArea} ${++i}`
      --i
      const area = await branch_offices.areas().create({
        ...data,
        created_by: user._id
      })
      areas.push(area)
      // si hay Ids de usuarios responsables se asocian en la colecion pivote
      if (users_area.length > 0) {
        await area
          .users()
          .sync(users_area, (row) => {
            if (`${row.user_id}` === request.input('manager')) {
              row.rol = 'manager'
            } else if (`${row.user_id}` === request.input('responsible_maintenance')) {
              row.rol = 'maintenance'
            }
          })
      }

      // si hay bienes se asocian en la colecion pivote
      if (goods_ids.length > 0) {
        await area.goods().sync(goods_ids, (row) => {
          let element = goods.find(item => item.goods_id === `${row.good_id}`)
          row.quantity = element.quantity
        })
      }

      // si hay penalizaciones se asocian en la colecion pivote
      if (penaltyIds.length > 0) {
        await area.penalties().sync(penaltyIds)
      }

    }

    return response.status(201).json({
      areas,
      ...new MessageFrontEnd('Area creada con exito')
    })

  }

  /**
   * Display a single branchoffice.
   * GET branchoffices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let area = await areaRepository.byId(params._id, branch_office_id)
    if (area && area.toJSON) {
      area = await extraData.extraData(area.toJSON())
      
      return response.status(200).json({
        area,
        message: 'OK'
      })
    }

    return response.status(404).json({
      ...new MessageFrontEnd('Area no encontrada', 'Alerta')
    })

  }

  /**
   * Update branchoffice details.
   * PUT or PATCH branchoffices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const area = await areaRepository.byId(params._id, branch_office_id)

    if (!area) {
      return response.status(404).json({
        ...new MessageFrontEnd('Area no encontrada', 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'description',
      'photos',
      'required_manager',
      'reserve',
      'type_reserve',
      'capacity',
      'gift_areas',
      'icon',
      'name_icon',
      'phone',
      'biometric_control',
      'internal',
      'location',
      'penalty',
      'required_maintenance',
      'amount',
      'partial_payment',
      'number_days'
    ])

    //si requiere gerente lo buscamos
    if (request.input('required_manager')) {
      const manager = await userRepository.byId(request.input('manager'))
      if (!manager) {
        return response.status(404).json({
          ...new MessageFrontEnd('Usuario gerente no encontrado', 'Alerta')
        })
      }
      data.manager = manager._id
    } else {
      data.manager = null
    }

    //si requiere mantenimiento buscamos al usuario
    if (request.input('required_maintenance')) {
      const maintenance = await userRepository.byId(request.input('responsible_maintenance'))
      if (!maintenance) {
        return response.status(404).json({
          ...new MessageFrontEnd('Usuario de mantenimiento no encontrado', 'Alerta')
        })
      }
      data.maintenance_time = request.input('maintenance_time')
      data.responsible_maintenance = request.input('responsible_maintenance')
    } else {
      data.responsible_maintenance = null
    }

    //si tiene descuento lo buscamos
    if (request.input('discount_id')) {
      const discount = await Discount.findOrFail(request.input('discount_id'))
      data.discount_id = discount._id
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

    // buscamos el horario disponuble del area
    const schedule = await Schedule.findOrFail(request.input('schedule_id'))
    data.schedule_id = schedule._id

    // buscamos el impuesto
    const tax = await Tax.findOrFail(request.input('tax_id'))
    data.tax_id = tax._id

    //se cargan los Ids de usuarios responsables del area
    let users_area = []
    if (request.input('required_manager')) {
      users_area.push(request.input('manager'))
    }

    if (request.input('required_maintenance')) {
      users_area.push(request.input('responsible_maintenance'))
    }

    //si tiene bienes los buscamos
    const goods = request.input('goods')
    let goods_ids = []
    if (goods) {
      for (const element of goods) {
        const good = await goodRepository.byId(element.goods_id, branch_office_id)
        if (!good) {
          return response.status(404).json({
            ...new MessageFrontEnd('Bien no encontrado', 'Alerta')
          })
        } else {
          goods_ids.push(good._id)
        }
      }
    }

    area.merge({
      ...data,
      updated_by: user._id
    })
    await area.save()

    // si hay Ids de usuarios responsables se asocian en la colecion pivote
    await area.users()
      .sync(users_area, (row) => {
        if (`${row.user_id}` === request.input('manager')) {
          row.rol = 'manager'
        } else if (`${row.user_id}` === request.input('responsible_maintenance')) {
          row.rol = 'maintenance'
        }
      })

    // si hay bienes se asocian en la colecion pivote
    await area.goods().detach()
    await area.goods().sync(goods_ids, (row) => {
      let element = goods.find(item => item.goods_id === `${row.good_id}`)
      row.quantity = element.quantity
    })

    // si hay penalizaciones se asocian en la colecion pivote
    await area.penalties().sync(penaltyIds)

    return response.status(200).json({
      area: area,
      ...new MessageFrontEnd('Area editada con exito')
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

    const area = await areaRepository.findOneWithoutStatus(params._id, branch_office_id)
    if (!area) {
      return response.status(404).json({
        ...new MessageFrontEnd('Area no encontrada', 'Alerta')
      })
    }

    area.merge({
      enabled: !area.enabled,
      updated_by: user._id
    })

    await area.save()

    return response.status(200).json({
      area,
      message: 'ok'
    })
  }

}

module.exports = AreaController
