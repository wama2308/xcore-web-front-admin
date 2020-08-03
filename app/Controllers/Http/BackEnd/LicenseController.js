'use strict'

const Module = use('App/Models/GeneralConfiguration/Module')
const Permit = use('App/Models/GeneralConfiguration/Permit')
const TypeLicense = use('App/Models/GeneralConfiguration/TypeLicense')
const License = use('App/Models/License')
const Country = use('App/Models/Country')
const licenseRepository = use('App/RepositoriesBackEnd/LicenseRepository')
const businessRepository = use('App/Repositories/BusinessRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class LicenseController {

  async index({ request, response }) {
    let license = await licenseRepository.datatable(request)

    return response.status(200).json(license)
  }

  async indexDisabled({ request, response }) {
    let license = await licenseRepository.datatable(request, false)

    return response.status(200).json(license)
  }

  async show({ params, request, response }) {
    let license
    try {
      license = await licenseRepository.findOneLicense(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    return response.status(200).json({
      message: 'Ok',
      license
    })
  }

  async assignLicense({ request, response, auth }) {
    const data = request.only([
      'license_id',
      'business_id',
    ])

    let license, business;
    try {
      license = await licenseRepository.findOneLicense(data.license_id)
      business = await businessRepository.byId(data.business_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    await license.business().detach();
    await license.business().sync([business._id])

    return response.status(201).json({
      ...new MessageFrontEnd('Licencia asignada con exito')
    })
  }

  async store({ request, response, auth }) {
    const data = request.only([
      'name',
      'description',
      'amount',
      'time_cycle',
      'time_amount',
      'time_notice_cycle',
      'time_notice',
      'quantity_branchoffice',
      'quantity_users',
      'quantity_clients',
      'quantity_products',
      'quantity_classes',
      'quantity_packages',
      'quantity_services',
      'quantity_plans',
    ])

    let idRule = request.only([
      'type_license_id',
    ])

    let arrayData = request.only([
      'countries',
      'modules', 
    ])

    let module_ids = [],
      aux,
      permitAux = [],
      country_ids = [];

    for (let modu of arrayData.modules) {
      aux = await Module.findOrFail(modu._id)
      module_ids.push(aux._id)
      for (let permit of modu.permits) {
        aux = await Permit.findOrFail(permit)
        permitAux.push(aux._id)
      }
      arrayData.modules.find((element) => {
        if (element._id == `${aux._id}`) {
          element.permits = permitAux
        }
      })
      permitAux = []
    }

    for (let country of arrayData.countries) {
      aux = await Country.findOrFail(country)
      country_ids.push(aux._id)
    }

    const typeLicense = await TypeLicense.findOrFail(idRule.type_license_id)
    
    const license = await License.create(data)
    await license.typeLicense().associate(typeLicense)

    await license.countries().sync(country_ids)

    await license.modules().sync(module_ids, (row) => {
      let element = arrayData.modules.find(item => 
        `${item._id}` == `${row.module_id}`
      )
      
      row.permits = element.permits
    })


    return response.status(201).json({
      license,
      ...new MessageFrontEnd('Licencia creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    let license
    try {
      license = await licenseRepository.findOneLicense(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'description',
      'amount',
      'time_cycle',
      'time_amount',
      'time_notice_cycle',
      'time_notice',
      'quantity_branchoffice',
      'quantity_users',
      'quantity_clients',
      'quantity_products',
      'quantity_classes',
      'quantity_packages',
      'quantity_services',
      'quantity_plans',
    ])

    let idRule = request.only([
      'type_license_id',
    ])

    let arrayData = request.only([
      'modules', 
      'countries',
    ])

    let module_ids = [],
      aux,
      permitAux = [],
      country_ids = [];

    for (let modu of arrayData.modules) {
      aux = await Module.findOrFail(modu._id)
      module_ids.push(aux._id)
      for (let permit of modu.permits) {
        aux = await Permit.findOrFail(permit)
        permitAux.push(aux._id)
      }
      arrayData.modules.find((element) => {
        if (element._id == `${aux._id}`) {
          element.permits = permitAux
        }
      })
      permitAux = []
    }

    for (let country of arrayData.countries) {
      aux = await Country.findOrFail(country)
      country_ids.push(aux._id)
    }

    const typeLicense = await TypeLicense.findOrFail(idRule.type_license_id)
    
    license.merge(data)
    await license.typeLicense().associate(typeLicense)

    await license.countries().sync(country_ids)

    await license.modules().sync(module_ids, (row) => {
      let element = arrayData.modules.find(item => 
        `${item._id}` == `${row.module_id}`
      )
      
      row.permits = element.permits
    })


    return response.status(200).json({
      license,
      ...new MessageFrontEnd('Licencia editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    let license
    try {
      license = await licenseRepository.findOneLicenseWithoutStatus(params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }
    let message = (license.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    license.merge({
      enabled: !license.enabled
    })

    await license.save()

    return response.status(200).json({
      license,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = LicenseController
