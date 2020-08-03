'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Department = use('App/Models/Department')
const User = use('App/Models/User')
const DepartmentPosition = use('App/Models/DepartmentPosition')
const BranchOffice = use('App/Models/BranchOffice')
const departmentPositionRepository = use('App/Repositories/DepartmentPositionRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * Resourceful controller for interacting with departmentpositions
 */
class DepartmentPositionController {
    /**
   * Show a list of all departmentPositions.
   * GET departmentPositions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    let departmentPositions = await departmentPositionRepository.datatable(request)
    return response.status(200).json(departmentPositions)
  }

  async indexDisabled ({ request, response }) {
    let departmentPositions = await departmentPositionRepository.datatable(request, false)
    return response.status(200).json(departmentPositions)
  }

  /**
   * Create/save a new department.
   * POST departmentPositions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const user = auth.user
    const data = request.only([
      'name',
      'description'
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

    const department = await Department.findOrFail(request.input('department_id'))
    const $user = await User.findOrFail(request.input('user_id'))
    data.department_id = department._id

    const departmentPosition = await branch_offices.departmentPositions().create({
      ...data,
      user_id: $user._id,
      created_by: user._id
    })

    return response.status(201).json({
      departmentPosition,
      ...new MessageFrontEnd('Cargo creado con éxito', 'Alerta')
    })

  }

  /**
   * Display a single department.
   * GET departmentPositions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let departmentPosition 

    try {
      departmentPosition = await departmentPositionRepository.byId(params._id, branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    departmentPosition = departmentPosition.toJSON()

    if (departmentPosition.department) {
      departmentPosition.department = {
        'label': departmentPosition.department.name,
        'value': departmentPosition.department._id
      }
    }

    if (departmentPosition.user) {
      departmentPosition.user = {
        'label': `${departmentPosition.user.names} ${departmentPosition.user.surnames}`,
        'value': departmentPosition.user._id
      }
    }

    return response.status(200).json({
      departmentPosition,
      message: 'OK'
    })
  }

  /**
   * Update department details.
   * PUT or PATCH departmentPositions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let departmentPosition = await departmentPositionRepository.byId(params._id, branch_office_id)

    if (!departmentPosition) {
      return response.status(404).json({
        ...new MessageFrontEnd('Cargo no encontrado', 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'description'
    ])
    
    const department = await Department.findOrFail(request.input('department_id'))
    const $user = await User.findOrFail(request.input('user_id'))
    data.department_id = department._id


    departmentPosition.merge({
      ...data,
      user_id: $user._id,
      updated_by: user._id
    })
    await departmentPosition.save()

    return response.status(200).json({
      departmentPosition: departmentPosition,
      ...new MessageFrontEnd('Cargo editado con éxito', 'Alerta')
    })
  }

  /**
   * Show a list of all departmentPositions.
   * GET departmentPositions
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

    const departmentPosition = await departmentPositionRepository.findOneWithoutStatus(params._id, branch_office_id)
    if (!departmentPosition) {
      return response.status(404).json({
        ...new MessageFrontEnd('Cargo no encontrado', 'Alerta')
      })
    }

    let message = (departmentPosition.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    departmentPosition.merge({
      enabled: !departmentPosition.enabled,
      updated_by: user._id
    })

    await departmentPosition.save()

    return response.status(200).json({
      departmentPosition,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = DepartmentPositionController
