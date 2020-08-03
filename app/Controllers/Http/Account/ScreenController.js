'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const Screen = use('App/Models/Screen')
const screenRespository = use('App/Repositories/ScreenRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class ScreenController {

  async index({ request, response }) {
    let screen = await screenRespository.datatable(request)

    return response.status(200).json(screen)
  }

  async indexDisabled({ request, response }) {
    let screen = await screenRespository.datatable(request, false)

    return response.status(200).json(screen)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let screen
    try {
      screen = await screenRespository.findOneScreen(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      screen
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'serial',
      'brand',
      'model',
      'ip',
      'mac',
    ])

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let screen = await branch_office
      .screens()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    return response.status(201).json({
      screen,
      ...new MessageFrontEnd('Pantalla creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
      'serial',
      'brand',
      'model',
      'ip',
      'mac',
    ])

    try {
      await screenRespository.findOneScreen(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let screen = await Screen.findOrFail(params._id)
    screen.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await screen.save()

    return response.status(201).json({
      screen,
      ...new MessageFrontEnd('Pantalla editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await screenRespository.findOneScreen(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let screen = await Screen.findOrFail(params._id)
    let message = (screen.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    screen.enabled = !screen.enabled
    screen.updated_by = auth.user._id
    await screen.save()

    return response.status(200).json({
      screen,
      ...new MessageFrontEnd(message)
    })
  }

  async selectScreen({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let screen = await screenRespository.findAllScreen(branch_office_id)

    let screenFormat = screen.toJSON().map(screen => {
      return {
        'label': screen.name,
        'value': screen._id,
        'info': {
          ...screen
        }
      }
    })

    return response.status(200).json(screenFormat)
  }

}

module.exports = ScreenController
