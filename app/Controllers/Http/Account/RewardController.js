'use strict'

const Reward = use('App/Models/Reward')
const Class = use('App/Models/Class')
const Product = use('App/Models/Product')
const Service = use('App/Models/Service')
const Package = use('App/Models/Package')
const Discount = use('App/Models/Discount')
const Plan = use('App/Models/Plan')
const Rule = use('App/Models/GeneralConfiguration/Rule')
const BranchOffice = use('App/Models/BranchOffice')
const rewardRepository = use('App/Repositories/RewardRepository')
const ruleRepository = use('App/Repositories/RuleRepository')
const classRepository = use('App/Repositories/ClassRepository')
const packageRepository = use('App/Repositories/PackageRepository')
const planRepository = use('App/Repositories/PlanRepository')
const serviceRepository = use('App/Repositories/ServiceRepository')
const productRespository = use('App/Repositories/ProductRepository')
const discountRepository = use('App/Repositories/DiscountRepository')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

/**
 * type_person = integer
 * 0 = Cliente
 * 1 = Personal
 * 2 = Todos
 * 
 * Rule = integer
 * 0 = Descuento
 * 1 = Monetario
 * 2 = Producto
 * 3 = Servicios
 * 4 = Paquetes
 * 5 = Clases
 * 6 = Planes
 * 7 = Otro
 */

const getPivotDiscount = async (discount_id) => {
  let discount = await Discount.find(discount_id)
  if (discount) {
    discount = discount.toJSON()
    discount = {
      label: discount.name,
      value: discount._id,
      info: discount
    }
  }
  return discount
}

class RewardController {

  async index({ request, response }) {
    let reward = await rewardRepository.datatable(request)

    return response.status(200).json(reward)
  }

  async indexDisabled({ request, response }) {
    let reward = await rewardRepository.datatable(request, false)

    return response.status(200).json(reward)
  }

  async show({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let reward
    try {
      reward = await rewardRepository.findOneReward(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    reward = reward.toJSON()

    if (reward.discount) {
      reward.discount = {
        'label': reward.discount.name,
        'value': reward.discount._id,
        'info': reward.discount,
      }
    }

    for (const element of reward.classes) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id)
      }
    }

    for (const element of reward.services) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id)
      }
    }

    for (const element of reward.packages) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id)
      }
    }

    for (const element of reward.plans) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id)
      }
    }

    for (const element of reward.products) {
      if (element.pivot && element.pivot.discount_id) {
        element.discount = await getPivotDiscount(element.pivot.discount_id)
      }
    }

    return response.status(200).json({
      message: "Ok",
      reward
    })
  }

  async store({ request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const { discount_id, group_or_individual } = request.only(['discount_id', 'group_or_individual'])

    let data = request.only([
      'name',
      'description',
      'type_person',
      'discount_all',
      'rule'
    ])

    let dataRules = request.only([
      'rule',
      'class',
      'service',
      'package',
      'plan',
      'product'
    ])

    if (data.type_person == 0) {
      data = {
        ...data,
        group_or_individual
      }
    }

    let classes = [],
      plan = [],
      service = [],
      packege = [],
      product = [],
      discount,
      ids,
      discount_array = [],
      aux;

    switch (dataRules.rule) {
      case 0: {
        if (data.discount_all && (data.discount_all === true)) {
          try {
            discount = await discountRepository.byId(discount_id, branch_office_id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }

        if (dataRules.class && (dataRules.class.length > 0)) {
          discount_array = []
          for (let obj of dataRules.class) {
            try {
              aux = await classRepository.findOneClass(branch_office_id, obj._id)
              classes.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.class = discount_array
        }

        if (dataRules.service && (dataRules.service.length > 0)) {
          discount_array = []
          for (let obj of dataRules.service) {
            try {
              aux = await serviceRepository.findOneService(branch_office_id, obj._id)
              service.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.service = discount_array
        }

        if (dataRules.package && (dataRules.package.length > 0)) {
          discount_array = []
          for (let obj of dataRules.package) {
            try {
              aux = await packageRepository.findOnePackage(branch_office_id, obj._id)
              packege.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.package = discount_array
        }

        if (dataRules.plan && (dataRules.plan.length > 0)) {
          discount_array = []
          for (let obj of dataRules.plan) {
            try {
              aux = await planRepository.findOnePlan(branch_office_id, obj._id)
              plan.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.plan = discount_array
        }

        if (dataRules.product && (dataRules.product.length > 0)) {
          discount_array = []
          for (let obj of dataRules.product) {
            try {
              aux = await productRespository.findOneProduct(branch_office_id, obj._id)
              product.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.product = discount_array
        }
      }
        break;

      case 1: {
        data = {
          ...data,
          ...request.only(['amount'])
        }
      }
        break;

      case 2: {
        for (let obj of dataRules.product) {
          try {
            ids = await productRespository.findOneProduct(branch_office_id, obj._id)
            product.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 3: {
        for (let obj of dataRules.service) {
          try {
            ids = await serviceRepository.findOneService(branch_office_id, obj._id)
            service.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 4: {
        for (let obj of dataRules.package) {
          try {
            ids = await packageRepository.findOnePackage(branch_office_id, obj._id)
            packege.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 5: {
        for (let obj of dataRules.class) {
          try {
            ids = await classRepository.findOneClass(branch_office_id, obj._id)
            classes.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 6: {
        for (let obj of dataRules.plan) {
          try {
            ids = await planRepository.findOnePlan(branch_office_id, obj._id)
            plan.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 7: {
        data = {
          ...data,
          ...request.only(['specify'])
        }
      }
        break;

      default:
        return response.status(404).json({
          ...new MessageFrontEnd('Regla no encontrada', 'Alerta')
        })
    }

    const branch_office = await BranchOffice.findOrFail(branch_office_id)
    let reward = await branch_office
      .rewards()
      .create({
        ...data,
        'created_by': user._id
      })

    switch (dataRules.rule) {
      case 0: {
        if (data.discount_all && (data.discount_all == true)) {
          await reward.discount().associate(discount)

          if (classes && classes.length > 0) {
            await reward.classes().sync(classes)
          }

          if (plan && plan.length > 0) {
            await reward.plans().sync(plan)
          }

          if (service && service.length > 0) {
            await reward.services().sync(service)
          }

          if (packege && packege.length > 0) {
            await reward.packages().sync(packege)
          }

          if (product && product.length > 0) {
            await reward.products().sync(product)
          }

        } else {
          if (classes && classes.length > 0) {
            const dat = dataRules.class
            await reward.classes().sync(classes, (row) => {
              let element = dat.find(item => item._id === `${row.class_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (plan && plan.length > 0) {
            const dat = dataRules.plan
            await reward.plans().sync(plan, (row) => {
              let element = dat.find(item => item._id === `${row.plan_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (service && service.length > 0) {
            const dat = dataRules.service
            await reward.services().sync(service, (row) => {
              let element = dat.find(item => item._id === `${row.service_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (packege && packege.length > 0) {
            const dat = dataRules.package
            await reward.packages().sync(packege, (row) => {
              let element = dat.find(item => item._id === `${row.package_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (product && product.length > 0) {
            const dat = dataRules.product
            await reward.products().sync(product, (row) => {
              let element = dat.find(item => item._id === `${row.product_id}`)
              row.discount_id = element.discount_id
            })
          }
        }
      }
        break;

      case 2: {
        const dat = dataRules.product
        await reward.products().sync(product, (row) => {
          let element = dat.find(item => item._id === `${row.product_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 3: {
        const dat = dataRules.service
        await reward.services().sync(service, (row) => {
          let element = dat.find(item => item._id === `${row.service_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 4: {
        const dat = dataRules.package
        await reward.packages().sync(packege, (row) => {
          let element = dat.find(item => item._id === `${row.package_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 5: {
        const dat = dataRules.class
        await reward.classes().sync(classes, (row) => {
          let element = dat.find(item => item._id === `${row.class_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 6: {
        const dat = dataRules.plan
        await reward.plans().sync(plan, (row) => {
          let element = dat.find(item => item._id === `${row.plan_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      default:
        break;
    }

    return response.status(201).json({
      reward,
      ...new MessageFrontEnd('Recompensa creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const { discount_id, group_or_individual } = request.only(['discount_id', 'group_or_individual'])

    let reward
    try {
      reward = await rewardRepository.findOneReward(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let data = request.only([
      'name',
      'description',
      'type_person',
      'discount_all',
      'rule'
    ])

    let dataRules = request.only([
      'rule',
      'class',
      'service',
      'package',
      'plan',
      'product'
    ])

    if (data.type_person == 0) {
      data = {
        ...data,
        group_or_individual
      }
    }

    let classes = [],
      plan = [],
      service = [],
      packege = [],
      product = [],
      discount,
      ids,
      discount_array = [],
      aux;

    switch (dataRules.rule) {
      case 0: {
        if (data.discount_all && (data.discount_all === true)) {
          try {
            discount = await discountRepository.byId(discount_id, branch_office_id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }

        if (dataRules.class && (dataRules.class.length > 0)) {
          discount_array = []
          for (let obj of dataRules.class) {
            try {
              aux = await classRepository.findOneClass(branch_office_id, obj._id)
              classes.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.class = discount_array
        }

        if (dataRules.service && (dataRules.service.length > 0)) {
          discount_array = []
          for (let obj of dataRules.service) {
            try {
              aux = await serviceRepository.findOneService(branch_office_id, obj._id)
              service.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.service = discount_array
        }

        if (dataRules.package && (dataRules.package.length > 0)) {
          discount_array = []
          for (let obj of dataRules.package) {
            try {
              aux = await packageRepository.findOnePackage(branch_office_id, obj._id)
              packege.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.package = discount_array
        }

        if (dataRules.plan && (dataRules.plan.length > 0)) {
          discount_array = []
          for (let obj of dataRules.plan) {
            try {
              aux = await planRepository.findOnePlan(branch_office_id, obj._id)
              plan.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.plan = discount_array
        }

        if (dataRules.product && (dataRules.product.length > 0)) {
          discount_array = []
          for (let obj of dataRules.product) {
            try {
              aux = await productRespository.findOneProduct(branch_office_id, obj._id)
              product.push(aux._id)
              if (!data.discount_all) {
                aux = await discountRepository.byId(obj.discount_id, branch_office_id)
                discount_array.push({
                  '_id': obj._id,
                  'discount_id': aux._id
                })
              }
            } catch (error) {
              return response.status(error.status).json({
                ...new MessageFrontEnd(error.message, 'Alerta')
              })
            }
          }
          dataRules.product = discount_array
        }
      }
        break;

      case 1: {
        data = {
          ...data,
          ...request.only(['amount'])
        }
      }
        break;

      case 2: {
        for (let obj of dataRules.product) {
          try {
            ids = await productRespository.findOneProduct(branch_office_id, obj._id)
            product.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 3: {
        for (let obj of dataRules.service) {
          try {
            ids = await serviceRepository.findOneService(branch_office_id, obj._id)
            service.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 4: {
        for (let obj of dataRules.package) {
          try {
            ids = await packageRepository.findOnePackage(branch_office_id, obj._id)
            packege.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 5: {
        for (let obj of dataRules.class) {
          try {
            ids = await classRepository.findOneClass(branch_office_id, obj._id)
            classes.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 6: {
        for (let obj of dataRules.plan) {
          try {
            ids = await planRepository.findOnePlan(branch_office_id, obj._id)
            plan.push(ids._id)
          } catch (error) {
            return response.status(error.status).json({
              ...new MessageFrontEnd(error.message, 'Alerta')
            })
          }
        }
      }
        break;

      case 7: {
        data = {
          ...data,
          ...request.only(['specify'])
        }
      }
        break;

      default:
        return response.status(404).json({
          ...new MessageFrontEnd('Regla no encontrada', 'Alerta')
        })
    }

    reward.merge({
      ...data,
      'updated_by': auth.user._id
    })
    await reward.save()

    await reward.classes().detach()
    await reward.plans().detach()
    await reward.services().detach()
    await reward.packages().detach()
    await reward.products().detach()

    await reward.discount().dissociate()

    switch (dataRules.rule) {
      case 0: {
        if (data.discount_all && (data.discount_all == true)) {
          await reward.discount().associate(discount)

          if (classes && classes.length > 0) {
            await reward.classes().sync(classes)
          }

          if (plan && plan.length > 0) {
            await reward.plans().sync(plan)
          }

          if (service && service.length > 0) {
            await reward.services().sync(service)
          }

          if (packege && packege.length > 0) {
            await reward.packages().sync(packege)
          }

          if (product && product.length > 0) {
            await reward.products().sync(product)
          }

        } else {
          if (classes && classes.length > 0) {
            const dat = dataRules.class
            await reward.classes().sync(classes, (row) => {
              let element = dat.find(item => item._id === `${row.class_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (plan && plan.length > 0) {
            const dat = dataRules.plan
            await reward.plans().sync(plan, (row) => {
              let element = dat.find(item => item._id === `${row.plan_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (service && service.length > 0) {
            const dat = dataRules.service
            await reward.services().sync(service, (row) => {
              let element = dat.find(item => item._id === `${row.service_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (packege && packege.length > 0) {
            const dat = dataRules.package
            await reward.packages().sync(packege, (row) => {
              let element = dat.find(item => item._id === `${row.package_id}`)
              row.discount_id = element.discount_id
            })
          }

          if (product && product.length > 0) {
            const dat = dataRules.product
            await reward.products().sync(product, (row) => {
              let element = dat.find(item => item._id === `${row.product_id}`)
              row.discount_id = element.discount_id
            })
          }
        }
      }
        break;

      case 2: {
        const dat = dataRules.product
        await reward.products().sync(product, (row) => {
          let element = dat.find(item => item._id === `${row.product_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 3: {
        const dat = dataRules.service
        await reward.services().sync(service, (row) => {
          let element = dat.find(item => item._id === `${row.service_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 4: {
        const dat = dataRules.package
        await reward.packages().sync(packege, (row) => {
          let element = dat.find(item => item._id === `${row.package_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 5: {
        const dat = dataRules.class
        await reward.classes().sync(classes, (row) => {
          let element = dat.find(item => item._id === `${row.class_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      case 6: {
        const dat = dataRules.plan
        await reward.plans().sync(plan, (row) => {
          let element = dat.find(item => item._id === `${row.plan_id}`)
          row.quantity = element.quantity
        })
      }
        break;

      default:
        break;
    }

    return response.status(200).json({
      reward,
      ...new MessageFrontEnd('Recompensa editada con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const user = auth.user
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let reward
    try {
      reward = await rewardRepository.findOneRewardWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let message = (reward.enabled) ? 'Eliminada con exito' : 'Habilidata con exito'

    reward.enabled = !reward.enabled
    reward.updated_at = auth.user._id
    await reward.save()

    return response.status(200).json({
      reward,
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = RewardController
