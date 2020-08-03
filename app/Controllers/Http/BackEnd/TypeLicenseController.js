'use strict'

const TypeLicense = use('App/Models/GeneralConfiguration/TypeLicense')
const TypeLicenseRepository = use('App/RepositoriesBackEnd/TypeLicenseRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class TypeLicenseController {

  async index({ request, response }) {
    let typeLicense = await TypeLicenseRepository.datatable(request)

    return response.status(200).json(typeLicense)
  }

  async indexDisabled({ request, response }) {
    let typeLicense = await TypeLicenseRepository.datatable(request, false)

    return response.status(200).json(typeLicense)
  }

  async show({ params, request, response }) {
    let typeLicense
    try {
      typeLicense = await TypeLicenseRepository.findOneTypeLicense(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      typeLicense
    })
  }

}

module.exports = TypeLicenseController
