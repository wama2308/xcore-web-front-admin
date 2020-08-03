'use strict'

const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const Term = use('App/Models/Term')
const termRespository = use('App/Repositories/TermRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class TermController {

  async index({ request, response }) {
    let terms = await termRespository.datatable(request)

    return response.status(200).json(terms)
  }

  async indexDisabled({ request, response }) {
    let terms = await termRespository.datatable(request, false)

    return response.status(200).json(terms)
  }

  async show({ guard, params, request, response, auth }) {
    let term = await Term.findOrFail(params._id)

    return response.status(200).json({
      message: "Ok",
      term
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'ruler_id',
      'name',
      'description',
      'percentage',
      'amount',
      'quantity',
    ])

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let newGoal = await branch_office
      .terms()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      newGoal,
      ...new MessageFrontEnd('Condicion creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'ruler_id',
      'name',
      'description',
      'percentage',
      'amount',
      'quantity',
    ])

    let editTerm = await Goal.findOrFail(params._id)
    editTerm.merge({
      ...data,
      'updated_at': auth.user._id
    })
    await editTerm.save()

    return response.status(200).json({
      editTerm,
      ...new MessageFrontEnd('Condicion editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let editTerm = await Term.findOrFail(params._id)
    let message = (editTerm.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    editTerm.enabled = !editTerm.enabled
    editTerm.updated_at = auth.user._id
    await editTerm.save()

    return response.status(200).json({
      editTerm,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = TermController
