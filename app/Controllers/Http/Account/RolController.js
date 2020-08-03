'use strict'

const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const Rol = use('App/Models/Rol')
const rolRepository = use('App/Repositories/RolRepository')
const User = use('App/Models/User')
const Module = use('App/Models/GeneralConfiguration/Module')
const Permit = use('App/Models/GeneralConfiguration/Permit')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

const getPivotPermits = async (permits, _id) => {
  if (permits) {
    let permit, arrayPermit = [];
    for (let element of permits) {
      permit = await Permit.find(element);
      arrayPermit.push({
        label: permit.name,
        value: `${_id}-${permit._id}`,
      })
    }
    permits = arrayPermit
  }
  
  return permits;
};

const getPivotOnlyPermits = async (permits, _id) => {
  if (permits) {
    let permit, arrayPermit = [];
    for (let element of permits) {
      permit = await Permit.find(element);
      arrayPermit.push(`${_id}-${permit._id}`)
    }
    permits = arrayPermit
  }
  
  return permits;
};

class RolController {

  async index({ request, response }) {
    let roles = await rolRepository.datatable(request)

    return response.status(200).json(roles)
  }

  async indexDisabled({ request, response }) {
    let roles = await rolRepository.datatable(request, false)

    return response.status(200).json(roles)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let rols, aux = [], auxModules = [], simpleModules = [], simplePermits = [];

    try {
      rols = await rolRepository.allRol(branch_office_id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    rols = rols.toJSON()

    for (let rol of rols) {
      auxModules = []
      for (let module of rol.modules) {
        simpleModules.push(module._id)
        simplePermits.push(...await getPivotOnlyPermits(module.pivot.permits, module._id))
        auxModules.push({
          'label': module.name,
          'value': module._id,
          'children': await getPivotPermits(module.pivot.permits, module._id)
        })
      }

      rol.modules = auxModules
      rol.simpleModules = simpleModules
      rol.simplePermits = simplePermits
      aux.push({
        'label': rol.name,
        'value': rol._id,
        'info': rol
      })
    }
    rols = aux

    return response.status(200).json(rols)
  }

  async show({ guard, params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let rol, aux = [], arrayPermits = [];

    try {
      rol = await rolRepository.findOneRol(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    rol = rol.toJSON()

    for (const element of rol.modules) {
      if (element.pivot && element.pivot.permits) {
        element.permits = await getPivotOnlyPermits(element.pivot.permits, element._id);
      }
      arrayPermits.push(...element.permits)
      aux.push(element._id)
      // aux.push({
      //   'label': element.name,
      //   'value': element._id,
      //   'children': element.permits
      // })
    }

    rol.modules = aux
    rol.permits = arrayPermits

    return response.status(200).json({
      message: 'Ok',
      rol
    })
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    const data = request.only([
      'name',
      'description',
    ])

    let arrayData = request.only([
      'modules',
    ])

    let aux, spl, arrayIds = [], arrayModules = [];

    for (let module of arrayData.modules) {
      spl = module.split("-")
      aux = await Module.findOrFail(spl[0]);
      await Permit.findOrFail(spl[1]);
      arrayIds.push(aux._id)
      if (arrayModules.length < 1) {
        arrayModules.push({
          'module_id': spl[0],
          'permits': [
            spl[1]
          ]
        })
      } else {
        let resul = arrayModules.find(item => item.module_id === spl[0])
        if (resul) {
          arrayModules.find(item => {
            if (item.module_id === spl[0]){
              item.permits.push(spl[1])
            }
          })
        } else {
          arrayModules.push({
            'module_id': spl[0],
            'permits': [
              spl[1]
            ]
          })
        }
      }
    }

    let branch_office = await BranchOffice.findOrFail(branch_office_id)
    let newRol = await branch_office
      .roles()
      .create({
        ...data,
        'created_by': auth.user._id
      })

    await newRol.modules().sync(arrayIds, (row) => {
      let element = arrayModules.find(item =>
        `${item.module_id}` == `${row.module_id}`
      )

      row.permits = element.permits
    })

    return response.status(201).send({
      newRol,
      ...new MessageFrontEnd('Rol creado con exito')
    })
  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let rol
    try {
      rol = await rolRepository.findOneRol(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    const data = request.only([
      'name',
      'description',
    ])

    let arrayData = request.only([
      'modules',
    ])

    let aux, spl, arrayIds = [], arrayModules = [];

    for (let module of arrayData.modules) {
      spl = module.split("-")
      aux = await Module.findOrFail(spl[0]);
      await Permit.findOrFail(spl[1]);
      arrayIds.push(aux._id)
      if (arrayModules.length < 1) {
        arrayModules.push({
          'module_id': spl[0],
          'permits': [
            spl[1]
          ]
        })
      } else {
        let resul = arrayModules.find(item => item.module_id === spl[0])
        if (resul) {
          arrayModules.find(item => {
            if (item.module_id === spl[0]){
              item.permits.push(spl[1])
            }
          })
        } else {
          arrayModules.push({
            'module_id': spl[0],
            'permits': [
              spl[1]
            ]
          })
        }
      }
    }

    rol.merge({
      ...data,
      'updated_by': auth.user._id
    })
    await rol.save()
    await rol.modules().detach();
    await rol.modules().sync(arrayIds, (row) => {
      let element = arrayModules.find(item =>
        `${item.module_id}` == `${row.module_id}`
      )

      row.permits = element.permits
    })


    return response.status(200).json({
      rol,
      ...new MessageFrontEnd('Rol editado con exito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let rol
    try {
      rol = await rolRepository.findOneRolWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let message = (rol.enabled) ? 'Eliminado con exito' : 'Habilidato con exito'

    rol.enabled = !rol.enabled
    rol.updated_by = auth.user._id

    await rol.save()

    return response.status(200).json({
      rol,
      ...new MessageFrontEnd(message)
    })
  }

  async asociateRol({ params, response }) {

    const rol = await Rol.findOrFail(params._id)
    const user = await User.findOrFail(params.user_id)

    // const rol_user = await user
    //   .roles()
    //   .attach([rol._id])

    // return response.status(200).json(rol_user)
  }
}

module.exports = RolController
