'use strict'

const TypeIdentity = use('App/Models/Country/TypeIdentity')
const Person = use('App/Models/Person')
const Enterprise = use('App/Models/Enterprise')
const BranchOffice = use('App/Models/BranchOffice')
const enterpriseRepository = use('App/Repositories/EnterpriseRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class EnterpriseController {

  async index({ request, response }) {
    let enterprises = await enterpriseRepository.datatable(request)

    return response.status(200).json(enterprises)
  }

  async indexDisabled({ request, response }) {
    let enterprises = await enterpriseRepository.datatable(request, false)

    return response.status(200).json(enterprises)
  }

  async select({ request, response }) {
    return "select"
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const products = await enterpriseRepository.findAllProduct(branch_office_id, true)
    const select = (products && products.rows) ? products.toJSON().map(item => {
      return {
        label: item.name,
        value: item._id,
        info: item
      }
    }) : []
    return response.status(200).json(select)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let enterprise,
      typeidentity;

    try {
      enterprise = await enterpriseRepository.findOneEnterprise(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    enterprise = enterprise.toJSON()

    enterprise.typeIdentity = {
      'label': enterprise.typeIdentity.name,
      'value': enterprise.typeIdentity._id,
      'info': enterprise.typeIdentity,
    }

    enterprise.person.typeIdentity = {
      'label': enterprise.person.typeIdentity.name,
      'value': enterprise.person.typeIdentity._id,
      'info': enterprise.person.typeIdentity,
    }

    return response.status(200).json({
      message: 'Ok',
      enterprise
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let data = request.only([
      'name',
      'description',
      'nif',
      'retainer',
    ])

    let dataArray = request.only([
      'phone',
      'email',
      'address',
    ])

    const idsRules = request.only([
      'type_identity_id',
      'person_id',
    ])

    const typeIdentity = await TypeIdentity.findOrFail(idsRules.type_identity_id)
    const person = await Person.findOrFail(idsRules.person_id)
    const branch_office = await BranchOffice.findOrFail(branch_office_id)

    if (data.retainer) {
      data = {
        ...data,
        ...request.only(['percentage_amount'])
      }
    }

    let array_aux = []
    if (dataArray.email && (dataArray.email.length > 0)) {
      array_aux = []
      for (let obj of dataArray.email) {
        array_aux.push({
          'type': obj.type,
          'email': obj.email
        })
      }
      dataArray.email = array_aux
    }

    if (dataArray.phone && (dataArray.phone.length > 0)) {
      array_aux = []
      for (let obj of dataArray.phone) {
        array_aux.push({
          'type': obj.type,
          'number': obj.number
        })
      }
      dataArray.phone = array_aux
    }

    if (dataArray.address && (dataArray.address.length > 0)) {
      for (let obj of dataArray.address) {
        array_aux.push({
          'type': obj.type,
          'address': obj.address
        })
      }
      dataArray.address = array_aux
    }

    const search = `${data.name} ${data.description} ${typeIdentity.name}-${data.nif} ${typeIdentity.name} - ${data.nif} ${typeIdentity.name} ${data.nif} ${typeIdentity.name}${data.nif}` 
    let enterprise = await branch_office
      .enterprises()
      .create({
        ...data,
        search,
        'created_by': auth.user._id
      })

    await enterprise.typeIdentity().associate(typeIdentity)
    await enterprise.person().associate(person)

    if (dataArray.email && (dataArray.email.length > 0)) {
      await enterprise.emails().createMany(dataArray.email)
    }

    if (dataArray.phone && (dataArray.phone.length > 0)) {
      await enterprise.phones().createMany(dataArray.phone)
    }

    if (dataArray.address && (dataArray.address.length > 0)) {
      await enterprise.addresses().createMany(dataArray.address)
    }

    return response.status(201).json({
      enterprise,
      ...new MessageFrontEnd('Empresa creada con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let data = request.only([
      'name',
      'description',
      'nif',
      'retainer',
    ])

    const idsRules = request.only([
      'type_identity_id',
      'person_id',
    ])

    const typeIdentity = await TypeIdentity.findOrFail(idsRules.type_identity_id)
    const person = await Person.findOrFail(idsRules.person_id)

    if (data.retainer) {
      data = {
        ...data,
        ...request.only(['percentage_amount'])
      }
    } else {
      data = {
        ...data,
        'percentage_amount': null
      }
    }

    const search = `${data.name} ${data.description} ${typeIdentity.name}-${data.nif} ${typeIdentity.name} - ${data.nif} ${typeIdentity.name} ${data.nif} ${typeIdentity.name}${data.nif}` 
    const enterprise = await Enterprise.findOrFail(params._id)
    enterprise.merge({
      ...data,
      search,
      'updated_by': auth.user._id
    })

    await enterprise.typeIdentity().associate(typeIdentity)
    await enterprise.person().associate(person)

    await enterprise.save()

    return response.status(200).json({
      enterprise,
      ...new MessageFrontEnd('Empresa editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await enterpriseRepository.findOneEnterpriseWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const enterprise = await Enterprise.findOrFail(params._id)
    let message = (enterprise.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    enterprise.enabled = !enterprise.enabled
    enterprise.updated_by = auth.user._id

    await enterprise.save()

    return response.status(200).json({
      enterprise,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = EnterpriseController
