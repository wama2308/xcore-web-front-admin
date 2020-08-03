'use strict'

const BranchOffice = use('App/Models/BranchOffice')
const TypeClient = use('App/Models/TypeClient')
const typeClientRespository = use('App/Repositories/TypeClientRepository')
const areaRepository = use('App/Repositories/AreaRepository')
const classRepository = use('App/Repositories/ClassRepository')
const packageRepository = use('App/Repositories/PackageRepository')
const planRepository = use('App/Repositories/PlanRepository')
const serviceRepository = use('App/Repositories/ServiceRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

class TypeClientController {

  async index({ request, response }) {
    let typeClient = await typeClientRespository.datatable(request)

    return response.status(200).json(typeClient)
  }

  async indexDisabled({ request, response }) {
    let typeClient = await typeClientRespository.datatable(request, false)

    return response.status(200).json(typeClient)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let typeClient
    try {
      typeClient = await typeClientRespository.findOneTypeClient(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    typeClient = typeClient.toJSON()

    return response.status(200).json({
      message: 'Ok',
      typeClient
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let arrayAux = [],
      arrayIds = {
        'areas': [],
        'packages': [],
        'services': [],
        'classes': [],
        'plans': [],
      };

    let data = request.only([
      'name',
      'description',
      'stars',
      'general',
      'restart_season',
      'restart_season_time',
      'restart_season_amount',
    ])

    if (data.general) {
      data = {
        ...data,
        ...request.only([
          'type_comparison',
          'time_cycle',
          'time_amount',
          'percentage',
          'percentage_amount',
        ])
      }
    }

    let rules = request.only([
      'areas',
      'package',
      'service',
      'class',
      'plan'
    ])

    if (rules.areas && rules.areas.length > 0) {
      for (let obj of rules.areas) {
        let areas
        try {
          areas = await areaRepository.byId(obj._id, branch_office_id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.areas.push(areas._id)

        arrayAux.push({
          ...obj,
          _id: areas._id
        })
      }
      rules.areas = arrayAux
    }

    if (rules.package && rules.package.length > 0) {
      arrayAux = []
      for (let obj of rules.package) {
        let packages
        try {
          packages = await packageRepository.findOnePackage(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.packages.push(packages._id)

        arrayAux.push({
          ...obj,
          _id: packages._id
        })
      }
      rules.package = arrayAux
    }

    if (rules.service && rules.service.length > 0) {
      arrayAux = []
      for (let obj of rules.service) {
        let services
        try {
          services = await serviceRepository.findOneService(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.services.push(services._id)

        arrayAux.push({
          ...obj,
          _id: services._id
        })
      }
      rules.service = arrayAux
    }

    if (rules.class && rules.class.length > 0) {
      arrayAux = []
      for (let obj of rules.class) {
        let classes
        try {
          classes = await classRepository.findOneClass(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.classes.push(classes._id)

        arrayAux.push({
          ...obj,
          _id: classes._id
        })
      }
      rules.class = arrayAux
    }

    if (rules.plan && rules.plan.length > 0) {
      arrayAux = []
      for (let obj of rules.plan) {
        let plans
        try {
          plans = await planRepository.findOnePlan(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.plans.push(plans._id)

        arrayAux.push({
          ...obj,
          _id: plans._id
        })
      }
      rules.plan = arrayAux
    }

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let typeClient = await branch_office
      .typeClients()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    if (arrayIds.areas.length > 0) {
      if (data.general) {
        await typeClient.areas().sync(arrayIds.areas)
      } else {
        await typeClient.areas().sync(arrayIds.areas, (row) => {
          let element = rules.areas.find(item => `${item._id}` === `${row.area_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.packages.length > 0) {
      if (data.general) {
        await typeClient.packages().sync(arrayIds.packages)
      } else {
        await typeClient.packages().sync(arrayIds.packages, (row) => {
          let element = rules.package.find(item => `${item._id}` === `${row.package_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.services.length > 0) {
      if (data.general) {
        await typeClient.services().sync(arrayIds.services)
      } else {
        await typeClient.services().sync(arrayIds.services, (row) => {
          let element = rules.service.find(item => `${item._id}` === `${row.service_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.classes.length > 0) {
      if (data.general) {
        await typeClient.classes().sync(arrayIds.classes)
      } else {
        await typeClient.classes().sync(arrayIds.classes, (row) => {
          let element = rules.class.find(item => `${item._id}` === `${row.class_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.plans.length > 0) {
      if (data.general) {
        await typeClient.plans().sync(arrayIds.plans)
      } else {
        await typeClient.plans().sync(arrayIds.plans, (row) => {
          let element = rules.plan.find(item => `${item._id}` === `${row.plan_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    return response.status(201).json({
      typeClient,
      ...new MessageFrontEnd('Tipo de cliente creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await typeClientRespository.findOneTypeClient(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let arrayAux = [],
      arrayIds = {
        'areas': [],
        'packages': [],
        'services': [],
        'classes': [],
        'plans': [],
      };

    let data = request.only([
      'name',
      'description',
      'stars',
      'general',
      'restart_season',
      'restart_season_time',
      'restart_season_amount',
    ])

    if (data.general) {
      data = {
        ...data,
        ...request.only([
          'type_comparison',
          'time_cycle',
          'time_amount',
          'percentage',
          'percentage_amount',
        ])
      }
    } else {
      data = {
        ...data,
        'type_comparison': null,
        'time_cycle': null,
        'time_amount': null,
        'percentage': null,
        'percentage_amount': null,
      }
    }

    let rules = request.only([
      'areas',
      'package',
      'service',
      'class',
      'plan'
    ])

    if (rules.areas && rules.areas.length > 0) {
      for (let obj of rules.areas) {
        let areas
        try {
          areas = await areaRepository.byId(obj._id, branch_office_id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.areas.push(areas._id)

        arrayAux.push({
          ...obj,
          _id: areas._id
        })
      }
      rules.areas = arrayAux
    }

    if (rules.package && rules.package.length > 0) {
      arrayAux = []
      for (let obj of rules.package) {
        let packages
        try {
          packages = await packageRepository.findOnePackage(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.packages.push(packages._id)

        arrayAux.push({
          ...obj,
          _id: packages._id
        })
      }
      rules.package = arrayAux
    }

    if (rules.service && rules.service.length > 0) {
      arrayAux = []
      for (let obj of rules.service) {
        let services
        try {
          services = await serviceRepository.findOneService(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.services.push(services._id)

        arrayAux.push({
          ...obj,
          _id: services._id
        })
      }
      rules.service = arrayAux
    }

    if (rules.class && rules.class.length > 0) {
      arrayAux = []
      for (let obj of rules.class) {
        let classes
        try {
          classes = await classRepository.findOneClass(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.classes.push(classes._id)

        arrayAux.push({
          ...obj,
          _id: classes._id
        })
      }
      rules.class = arrayAux
    }

    if (rules.plan && rules.plan.length > 0) {
      arrayAux = []
      for (let obj of rules.plan) {
        let plans
        try {
          plans = await planRepository.findOnePlan(branch_office_id, obj._id)
        } catch (error) {
          return response.status(error.status).json({
            ...new MessageFrontEnd(error.message, 'Alerta')
          })
        }

        arrayIds.plans.push(plans._id)

        arrayAux.push({
          ...obj,
          _id: plans._id
        })
      }
      rules.plan = arrayAux
    }

    let typeClient = await TypeClient.findOrFail(params._id)
    typeClient.merge({
      ...data,
      'updated_by': auth.user._id
    })

    await typeClient.save()

    await typeClient.areas().detach()
    await typeClient.packages().detach()
    await typeClient.services().detach()
    await typeClient.classes().detach()
    await typeClient.plans().detach()

    if (arrayIds.areas.length > 0) {
      if (data.general) {
        await typeClient.areas().sync(arrayIds.areas)
      } else {
        await typeClient.areas().sync(arrayIds.areas, (row) => {
          let element = rules.areas.find(item => `${item._id}` === `${row.area_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.packages.length > 0) {
      if (data.general) {
        await typeClient.packages().sync(arrayIds.packages)
      } else {
        await typeClient.packages().sync(arrayIds.packages, (row) => {
          let element = rules.package.find(item => `${item._id}` === `${row.package_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.services.length > 0) {
      if (data.general) {
        await typeClient.services().sync(arrayIds.services)
      } else {
        await typeClient.services().sync(arrayIds.services, (row) => {
          let element = rules.service.find(item => `${item._id}` === `${row.service_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.classes.length > 0) {
      if (data.general) {
        await typeClient.classes().sync(arrayIds.classes)
      } else {
        await typeClient.classes().sync(arrayIds.classes, (row) => {
          let element = rules.class.find(item => `${item._id}` === `${row.class_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    if (arrayIds.plans.length > 0) {
      if (data.general) {
        await typeClient.plans().sync(arrayIds.plans)
      } else {
        await typeClient.plans().sync(arrayIds.plans, (row) => {
          let element = rules.plan.find(item => `${item._id}` === `${row.plan_id}`)
          row.type_comparison = element.type_comparison
          row.time_cycle = element.time_cycle
          row.time_amount = element.time_amount
          row.percentage = element.percentage
          row.percentage_amount = element.percentage_amount
        })
      }
    }

    return response.status(201).json({
      typeClient,
      ...new MessageFrontEnd('Tipo de cliente editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    try {
      await typeClientRespository.findOneTypeClientWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let typeClient = await TypeClient.findOrFail(params._id)
    let message = (typeClient.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    typeClient.enabled = !typeClient.enabled
    typeClient.updated_by = auth.user._id
    await typeClient.save()

    return response.status(200).json({
      typeClient,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = TypeClientController
