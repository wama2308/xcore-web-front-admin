'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BranchOffice = use('App/Models/BranchOffice')
const Business = use('App/Models/Business')
const Contact = use('App/Models/Contact')
const Country = use('App/Models/Country')
const Province = use('App/Models/Province')
const District = use('App/Models/District')
const TypeBranch = use('App/Models/GeneralConfiguration/TypeBranch')
const User = use('App/Models/User')
const countryRepository = use('App/Repositories/CountryRepository')
const formRepository = use('App/Repositories/FormRepository')
const branchOfficeRepository = use('App/Repositories/BranchOfficeRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * Resourceful controller for interacting with branchoffices
 */
class BranchOfficeController {

  async index({ request, response }) {
    let branchoffices = await branchOfficeRepository.datatable(request)

    return response.status(200).json(branchoffices)
  }

  async indexDisabled({ request, response }) {
    let branchoffices = await branchOfficeRepository.datatable(request, false)

    return response.status(200).json(branchoffices)
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
    const business_id = request.header('business_id')
    const data = request.only([
      'name',
      'logo',
      'address',
      'center',
      'code',
      'location',
      'photos',
      'social_network'
    ])

    let idsSeaching = request.only([
      'type_id',
      'country_id',
      'province_id',
      'district_id',
    ])
    
    data.config = {}

    const country = await Country.findOrFail(idsSeaching.country_id)
    const province = await Province.findOrFail(idsSeaching.province_id)
    const district = await District.findOrFail(idsSeaching.district_id)
    const typeBranch = await TypeBranch.findOrFail(idsSeaching.type_id)

    const business = await Business.findOrFail(business_id)
    const branch_office = await business.branchOffices()
      .create({
        ...data,
        'created_by': user._id
      })

    for (const element of request.input('contacts')) {
      await branch_office.contacts().create({
        name: element.name,
        surname: element.surname,
        email: element.email,
        phone: element.phone
      })
    }

    user.merge({
      branch_office_default: (business.branchOffices.length === 0) ?
        branch_office._id : user.branch_office_default,
    })
    await user.save()

    await branch_office.country().associate(country)
    await branch_office.province().associate(province)
    await branch_office.district().associate(district)
    await branch_office.typeBranch().associate(typeBranch)

    return response.status(201).json({
      branch_office,
      ...new MessageFrontEnd('Sucursal creada con exito')
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
    let branchoffices
    try {
      branchoffices = await branchOfficeRepository.byId(params._id, request)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const country = await countryRepository.findCountry(branchoffices)
    let type = await formRepository.typeBranchOffice(branchoffices.type_branch_id)
    type = {
      'label': type.name,
      'value': type._id
    }

    branchoffices.merge({country, type})
    return response.status(200).json(branchoffices)
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
    const data = request.only([
      'name',
      'logo',
      'address',
      'center',
      'code',
      'location',
      'photos',
      'social_network'
    ])

    let idsSeaching = request.only([
      'type_id',
      'country_id',
      'province_id',
      'district_id',
    ])

    let branch_office = await BranchOffice.findOrFail(params._id)

    const country = await Country.findOrFail(idsSeaching.country_id)
    await branch_office.country().associate(country)
    
    const province = await Province.findOrFail(idsSeaching.province_id)
    await branch_office.province().associate(province)
    
    const district = await District.findOrFail(idsSeaching.district_id)
    await branch_office.district().associate(district)

    const typeBranch = await TypeBranch.findOrFail(idsSeaching.type_id)
    await branch_office.typeBranch().associate(typeBranch)

    branch_office.merge(data)

    await branch_office.save()

    for (const element of request.input('contacts')) {
      let $data = {
        name: element.name,
        surname: element.surname,
        email: element.email,
        phone: element.phone
      }; 

      if(element._id){
        const contact = await Contact.find(element._id)
        if(contact){
          contact.merge($data)
          await contact.save()
        }        
      }else {
        await branch_office.contacts().create($data)
      }
    }

    return response.status(200).json({
      branch_office,
      ...new MessageFrontEnd('Sucursal editada con exito')
    })
  }

  async asociateUser({ params, request, response }) {

    const branch_offices = await BranchOffice.findOrFail(params._id)
    const user = await User.findOrFail(params.user_id)
    const branchoffice_user = await user
      .branchOffices()
      .attach([branch_offices._id])

    return response.status(200).json(branchoffice_user)
  }
}

module.exports = BranchOfficeController
