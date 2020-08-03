'use strict'

const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const Goal = use('App/Models/Goal')
const goalRespository = use('App/Repositories/GoalRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class GoalController {

  async index({ request, response }) {
    let goals = await goalRespository.datatable(request)

    return response.status(200).json(goals)
  }

  async indexDisabled({ request, response }) {
    let goals = await goalRespository.datatable(request, false)

    return response.status(200).json(goals)
  }

  async show({ guard, params, request, response, auth }) {
    let goal = await Goal.findOrFail(params._id)

    return response.status(200).json({
      message: "Ok",
      goal
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'period',
      'period_cycle',
      'rol_id',
      'terms',
      'incentives'
    ])

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let newGoal = await branch_office
      .goals()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      newGoal,
      ...new MessageFrontEnd('Meta creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'period',
      'period_cycle',
      'rol_id',
      'terms',
      'incentives'
    ])

    let editGoal = await Goal.findOrFail(params._id)
    editGoal.merge({
      ...data,
      'updated_by': auth.user._id
    })
    await editGoal.save()

    return response.status(200).json({
      editGoal,
      ...new MessageFrontEnd('Meta editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let editGoal = await Goal.findOrFail(params._id)
    let message = (editGoal.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'
    editGoal.enabled = !editGoal.enabled
    editGoal.updated_at = auth.user._id
    await editGoal.save()

    return response.status(200).json({
      editGoal,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = GoalController
