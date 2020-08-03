'use strict'

const Tax = use('App/Models/Country/Tax')
const Lot = use('App/Models/Product/Lot')
const Movement = use('App/Models/Product/Movement')
const Category = use('App/Models/GeneralConfiguration/Category')
const Module = use('App/Models/GeneralConfiguration/Module')
const Permit = use('App/Models/GeneralConfiguration/Permit')
const TypeLicense = use('App/Models/GeneralConfiguration/TypeLicense')
const SecretQuestion = use('App/Models/GeneralConfiguration/SecretQuestion')
const License = use('App/Models/License')
const Country = use('App/Models/Country')
const Discount = use('App/Models/Discount')
const BranchOffice = use('App/Models/BranchOffice')
const Product = use('App/Models/Product')
const lotRespository = use('App/Repositories/LotRepository')
const Email = use('App/Models/GenericData/Email')
const emailRepository = use('App/Repositories/GenericData/EmailRepository')

class BackController {

  async index({ request, response }) {
    return "index"
  }

  async indexDisabled({ request, response }) {
    return "index disabled"
  }

  async show({ params, request, response }) {
    return "show"
  }

  async store({ request, response, auth }) {
    await SecretQuestion.create({ })
    return "store"
  }

  async update({ params, request, response, auth }) {
    return "update"
  }

  async changeStatus({ params, request, response, auth }) {
    return "changeStatus"
  }

}

module.exports = BackController
