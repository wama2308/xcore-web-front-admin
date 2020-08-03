'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Department = use('App/Models/Department')
const BranchOffice = use('App/Models/BranchOffice')
const departmentRepository = use('App/Repositories/DepartmentRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * Resourceful controller for interacting with departments
 */
class DepartmentController {
  /**
 * Show a list of all departments.
 * GET departments
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
  async index({ request, response }) {
    let departments = await departmentRepository.datatable(request)
    return response.status(200).json(departments)
  }

  async indexDisabled({ request, response }) {
    let departments = await departmentRepository.datatable(request, false)
    return response.status(200).json(departments)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const departments = await departmentRepository.findAll(branch_office_id)
    const select = (departments && departments.rows) ? departments.toJSON().map(item => {
      return {
        label: item.name,
        value: item._id,
        info: {
          _id: item._id,
          name: item.name,
          description: item.description
        },
        positions: item.positions.map(item => {
          return {
            label: item.name,
            value: item._id,
            info: {
              _id: item._id,
              name: item.name,
              description: item.description
            }
          }
        })
      }
    }) : []
    return response.status(200).json(select)
  }

  /**
   * Create/save a new department.
   * POST departments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
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

    let department = null
    if (request.input('department_id')) {
      const parent = await Department.findOrFail(request.input('department_id'))
      department = await parent.childs().create({
        ...data,
        created_by: user._id,
        branch_office_id: branch_offices._id
      })
    } else {
      department = await branch_offices.departments().create({
        ...data,
        created_by: user._id,
        department_id: null
      })
    }

    return response.status(201).json({
      department,
      ...new MessageFrontEnd('Departamento creado con éxito')
    })

  }

  /**
   * Display a single department.
   * GET departments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let department
    try {
      department = await departmentRepository.byId(params._id, branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    department = department.toJSON()
    if (department && department.parent) {
      department.parent = {
        'label': department.parent.name,
        'value': department.parent._id,
        'info': {
          '_id': department.parent._id,
          'name': department.parent.name,
          'description': department.parent.description
        }
      }
    }

    return response.status(200).json({
      message: 'OK',
      department,
    })
  }

  /**
   * Update department details.
   * PUT or PATCH departments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let department
    try {
      department = await departmentRepository.byId(params._id, branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let parent
    if (request.input('department_id')) {
      try {
        parent = await departmentRepository.byId(request.input('department_id'), branch_office_id)
      } catch (error) {
        return response.status(error.status).json({
          ...new MessageFrontEnd(error.message, 'Alerta')
        })
      }
    }

    const data = request.only([
      'name',
      'description'
    ])

    department.merge({
      ...data,
      updated_by: user._id
    })
    await department.save()

    if (request.input('department_id')) {
      await department.parent().associate(parent)
    }

    return response.status(200).json({
      department: department,
      ...new MessageFrontEnd('Departamento editado con éxito')
    })
  }

  /**
   * Show a list of all departments.
   * GET departments
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

    const department = await departmentRepository.findOneWithoutStatus(params._id, branch_office_id)
    if (!department) {
      return response.status(404).json({
        ...new MessageFrontEnd('Departamento no encontrado', 'Alerta')
      })
    }

    let message = (department.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'
    department.merge({
      enabled: !department.enabled,
      updated_by: user._id
    })

    await department.save()

    return response.status(200).json({
      department,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = DepartmentController
