'use strict'

const Discount = use('App/Models/Discount')
const BranchOffice = use('App/Models/BranchOffice')
const Person = use('App/Models/Person')
const Area = use('App/Models/Area')
const Plan = use('App/Models/Plan')
const Package = use('App/Models/Package')
const Service = use('App/Models/Service')
const Product = use('App/Models/Product')
const Class = use('App/Models/Class')
const Schedule = use('App/Models/Schedule')
const Enterprise = use('App/Models/Enterprise')
const Group = use('App/Models/Group')
const groupRepository = use('App/Repositories/GroupRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class GroupController {

  async index({ request, response }) {
    let groups = await groupRepository.datatable(request)

    return response.status(200).json(groups)
  }

  async indexDisabled({ request, response }) {
    let groups = await groupRepository.datatable(request, false)

    return response.status(200).json(groups)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let group
    try {
      group = await groupRepository.findOneGroup(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    group = group.toJSON()

    return response.status(200).json({
      message: 'Ok',
      group
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let person = null,
      schedule = null,
      discount = null,
      enterprise = null,
      arrayAux = [],
      aux = null;

    const data = request.only([
      'name',
      'description',
      'code',
      'corporate',
    ])

    const idsRules = request.only([
      'person_id',
      'enterprise_id',
      'schedule_id',
      'discount_id'
    ])

    let dataArray  = request.only([
      'areas',
      'plans',
      'packages',
      'services',
      'class',
      'products',
      'people'
    ])
    
    person = await Person.findOrFail(idsRules.person_id)
    if (idsRules.schedule_id) {
      schedule = await Schedule.findOrFail(idsRules.schedule_id)
    }

    if (idsRules.discount_id) {
      discount = await Discount.findOrFail(idsRules.discount_id)
    }

    if (data.corporate) {
      enterprise = await Enterprise.findOrFail(idsRules.enterprise_id)
    }

    for (let obj of dataArray.people) {
      aux = await Person.findOrFail(obj._id)
      arrayAux.push(aux._id)
    }

    dataArray.people = arrayAux

    if (dataArray.areas && (dataArray.areas.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.areas) {
        aux = await Area.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }

      dataArray.areas = arrayAux
    }

    if (dataArray.plans && (dataArray.plans.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.plans) {
        aux = await Plan.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.plans = arrayAux
    }

    if (dataArray.packages && (dataArray.packages.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.packages) {
        aux = await Package.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.packages = arrayAux
    }

    if (dataArray.services && (dataArray.services.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.services) {
        aux = await Service.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.services = arrayAux
    }

    if (dataArray.class && (dataArray.class.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.class) {
        aux = await Class.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.class = arrayAux
    }
    
    if (dataArray.products && (dataArray.products.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.products) {
        aux = await Product.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.products = arrayAux
    }

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let group = await branch_office
      .groups()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    await group.person().associate(person)

    if (schedule) {
      await group.schedule().associate(schedule)
    }

    if (discount) {
      await group.discount().associate(discount)
    }

    if (enterprise) {
      await group.enterprise().associate(enterprise)
    }

    if (dataArray.people.length > 0) {
      await group.people().sync(dataArray.people)
    }

    if (dataArray.areas && (dataArray.areas.length > 0)) {
      await group.areas().sync(dataArray.areas)
    }

    if (dataArray.plans && (dataArray.plans.length > 0)) {
      await group.plans().sync(dataArray.plans)
    }

    if (dataArray.packages && (dataArray.packages.length > 0)) {
      await group.packages().sync(dataArray.packages)
    }

    if (dataArray.services && (dataArray.services.length > 0)) {
      await group.services().sync(dataArray.services)
    }

    if (dataArray.class && (dataArray.class.length > 0)) {
      await group.class().sync(dataArray.class)
    }
    
    if (dataArray.products && (dataArray.products.length > 0)) {
      await group.products().sync(dataArray.products)
    }

    return response.status(201).json({
      group,
      ...new MessageFrontEnd('Grupo creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let person = null,
      schedule = null,
      discount = null,
      enterprise = null,
      arrayAux = [],
      aux = null;

    const data = request.only([
      'name',
      'description',
      'code',
      'corporate',
    ])

    const idsRules = request.only([
      'person_id',
      'enterprise_id',
      'schedule_id',
      'discount_id'
    ])

    let dataArray  = request.only([
      'areas',
      'plans',
      'packages',
      'services',
      'class',
      'products',
      'people'
    ])
    
    person = await Person.findOrFail(idsRules.person_id)
    if (idsRules.schedule_id) {
      schedule = await Schedule.findOrFail(idsRules.schedule_id)
    }

    if (idsRules.discount_id) {
      discount = await Discount.findOrFail(idsRules.discount_id)
    }

    if (data.corporate) {
      enterprise = await Enterprise.findOrFail(idsRules.enterprise_id)
    }

    for (let obj of dataArray.people) {
      aux = await Person.findOrFail(obj._id)
      arrayAux.push(aux._id)
    }

    dataArray.people = arrayAux

    if (dataArray.areas && (dataArray.areas.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.areas) {
        aux = await Area.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }

      dataArray.areas = arrayAux
    }

    if (dataArray.plans && (dataArray.plans.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.plans) {
        aux = await Plan.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.plans = arrayAux
    }

    if (dataArray.packages && (dataArray.packages.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.packages) {
        aux = await Package.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.packages = arrayAux
    }

    if (dataArray.services && (dataArray.services.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.services) {
        aux = await Service.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.services = arrayAux
    }

    if (dataArray.class && (dataArray.class.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.class) {
        aux = await Class.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.class = arrayAux
    }
    
    if (dataArray.products && (dataArray.products.length > 0)) {
      arrayAux = []
      for (let obj of dataArray.products) {
        aux = await Product.findOrFail(obj._id)
        arrayAux.push(aux._id)
      }
      
      dataArray.products = arrayAux
    }

    let group = await Group.findOrFail(params._id)
      group.merge({
        ...data,
        'updated_by': auth.user._id
      })

    await group.save()
    await group.person().associate(person)

    if (schedule) {
      await group.schedule().associate(schedule)
    } else {
      await group.schedule().dissociate()
    }

    if (discount) {
      await group.discount().associate(discount)
    } else {
      await group.discount().dissociate()
    }

    if (enterprise) {
      await group.enterprise().associate(enterprise)
    } else {
      await group.enterprise().dissociate()
    }

    await group.people().detach()
    await group.areas().detach()
    await group.plans().detach()
    await group.packages().detach()
    await group.services().detach()
    await group.products().detach()
    await group.class().detach()

    if (dataArray.people.length > 0) {
      await group.people().sync(dataArray.people)
    }

    if (dataArray.areas && (dataArray.areas.length > 0)) {
      await group.areas().sync(dataArray.areas)
    }

    if (dataArray.plans && (dataArray.plans.length > 0)) {
      await group.plans().sync(dataArray.plans)
    }

    if (dataArray.packages && (dataArray.packages.length > 0)) {
      await group.packages().sync(dataArray.packages)
    }

    if (dataArray.services && (dataArray.services.length > 0)) {
      await group.services().sync(dataArray.services)
    }

    if (dataArray.class && (dataArray.class.length > 0)) {
      await group.class().sync(dataArray.class)
    }
    
    if (dataArray.products && (dataArray.products.length > 0)) {
      await group.products().sync(dataArray.products)
    }

    return response.status(200).json({
      group,
      ...new MessageFrontEnd('Grupo editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await groupRepository.findOneGroupWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const obj = await Group.findOrFail(params._id)
    let message = (obj.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    obj.enabled = !obj.enabled
    obj.updated_by = auth.user._id

    await obj.save()

    return response.status(200).json({
      obj,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = GroupController
