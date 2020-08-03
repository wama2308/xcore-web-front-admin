'use strict'

const permitRepository = use('App/RepositoriesBackEnd/PermitRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class PermitController {

  async index({ request, response }) {
    let permits = await permitRepository.datatable(request)

    return response.status(200).json(permits)
  }

  async indexDisabled({ request, response }) {
    let permits = await permitRepository.datatable(request, false)

    return response.status(200).json(permits)
  }

  async show({ params, request, response }) {
    let permit
    try {
      permit = await permitRepository.findOnePermit(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      permit
    })
  }

}

module.exports = PermitController
