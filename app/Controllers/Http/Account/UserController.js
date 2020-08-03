'use strict'

const Business = use('App/Models/Business')
const BranchOffice = use('App/Models/BranchOffice')
const User = use('App/Models/User')
const Hash = use('Hash')
const shortid = require('shortid')
const Encryption = use('Encryption')
const userRepository = use('App/Repositories/UserRepository')
const rolRepository = use('App/Repositories/RolRepository')
const Rol = use('App/Models/Rol')
const Module = use('App/Models/GeneralConfiguration/Module')
const Permit = use('App/Models/GeneralConfiguration/Permit')
const MessageFrontEnd = use('App/Utils/MessageFrontEnd')

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

class UserController {

  async index({ request, response }) {
    const users = await userRepository.datatableUserBranchOffice(request)

    return response.status(200).json(users)
  }

  async indexDisabled({ request, response }) {
    const users = await userRepository.datatableUserBranchOffice(request, false)

    return response.status(200).json(users)
  }

  async select({ request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    const users = await userRepository.allEnabled(business_id)
    const select = (users && users.rows) ? users.toJSON().map(item => {
      return {
        "label": `${item.username} | ${item.names} ${item.surnames} | ${item.email}`,
        "value": item._id
      }
    }) : []
    return response.status(200).json(select)
  }

  async show({ params, request, response }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let aux, auxPermit, spl, arrayModules = [], rol;
    let user, arrayAux = [];
    try {
      user = await userRepository.findOneUser(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }
    user = user.toJSON()
    
    user.specialModules = []
    
    try {
      rol = await rolRepository.findOneRol(branch_office_id, user.branchOffices[0].pivot.rol)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    rol = rol.toJSON()
    for (let element of rol.modules) {
      if (element.pivot && element.pivot.permits) {
        element.permits = await getPivotPermits(element.pivot.permits, element._id);
      }

      arrayAux.push({
        'label': element.name,
        'value': element._id,
        'children': element.permits
      })
    }
    
    user.rol = {
      '_id': rol._id,
      'name': rol.name,
      'modules': arrayAux
    }

    user.rol.modules = arrayAux
    user.rol = {
      'label': user.rol.name,
      'value': user.rol._id,
      'info': user.rol
    }

    for (let module of user.branchOffices[0].pivot.special_permits) {
      spl = module.split("-")
      aux = await Module.findOrFail(spl[0]);
      auxPermit = await Permit.findOrFail(spl[1]);
      if (arrayModules.length < 1) {
        user.specialModules.push(spl[0])
        console.log("1");

        arrayModules.push({
          'label': aux.name,
          'value': aux._id,
          'permits': [
            {
              'label': auxPermit.name,
              'value': auxPermit._id,
            }
          ]
        })
      } else {
        let resul = arrayModules.find(item => `${item.value}` === spl[0])
        if (resul) {
          console.log("3");
          arrayModules.find(item => {
            if (item.module_id === spl[0]) {
              item.permits.push({
                'label': auxPermit.name,
                'value': auxPermit._id,
              })
            }
          })
        } else {
          console.log("2");
          user.specialModules.push(spl[0])
          arrayModules.push({
            'label': aux.name,
            'value': aux._id,
            'permits': [
              {
                'label': auxPermit.name,
                'value': auxPermit._id,
              }
            ]
          })
        }
      }
    }

    user.specialPermits = user.branchOffices[0].pivot.special_permits
    user.special_permits = arrayModules

    return response.status(200).json(user)
  }

  async store({ request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let user, spl, rol, exists;
    const data = request.only([
      'email',
    ])
    
    let rules = request.only([
      'special_permits',
      'rol_id'
    ])

    try {
      // await userRepository.byEmailExists(branch_office_id, data.email)
      exists = await userRepository.byEmailOnlyExists(data.email)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    rol = await Rol.findOrFail(rules.rol_id)

    if (data.special_permits && (data.special_permits.length != 0)) {
      for (let module of data.special_permits) {
        spl = module.split("-")
        await Module.findOrFail(spl[0]);
        await Permit.findOrFail(spl[1]);
      }
    }

    let business = await Business.findOrFail(business_id)
    let branch_office = await BranchOffice.findOrFail(branch_office_id)

    const code = shortid.generate()
    const code_encrypted = Encryption.encrypt(code)

    if (!exists) {
      user = await User
        .create({
          ...data,
          'check': {
            'code': code_encrypted,
            'created_at': new Date,
          },
          'business_default': business._id,
          'branch_office_default': branch_office._id,
          'created_by': auth.user._id
        })
    } else {
      user = await User.find(exists._id)
    }
    
    await user.business().attach([business._id], (row) => {
      row.is_master = false
    })

    await user.branchOffices().attach([branch_office._id], (row) => {
      row.enabled = true
      row.rol = rol._id
      row.special_permits = rules.special_permits
    })

    return response.status(200).json({
      code,
      ...new MessageFrontEnd('Usuario registrado con éxito')
    })

  }

  async update({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')
    let user, spl, rol;
    
    let rules = request.only([
      'rol_id',
      'special_permits',
    ])

    try {
      user = await userRepository.findOneUser(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    rol = await Rol.findOrFail(rules.rol_id)

    if (rules.special_permits && (rules.special_permits.length != 0)) {
      for (let module of rules.special_permits) {
        spl = module.split("-")
        await Module.findOrFail(spl[0]);
        await Permit.findOrFail(spl[1]);
      }
    }

    let business = await Business.findOrFail(business_id)
    let branch_office = await BranchOffice.findOrFail(branch_office_id)

    user.merge({
      'updated_at': auth.user._id
    })

    await user.branchOffices().attach([branch_office._id], (row) => {
      row.enabled = true
      row.rol = rol._id
      row.special_permits = rules.special_permits
    })

    return response.status(200).json({
      ...new MessageFrontEnd('Usuario editado con éxito')
    })
  }

  async changeStatus({ params, request, response, auth }) {
    const business_id = request.header('business_id')
    const branch_office_id = request.header('branch_office_id')

    let user, pass;
    try {
      user = await userRepository.findOneUserWithoutStatus(branch_office_id, params._id)
    } catch (error) {
      return response.status(error.status).json({
        ...new MessageFrontEnd(error.message, 'Alerta')
      })
    }

    let branch_office = await BranchOffice.findOrFail(branch_office_id)

    user.merge({
      'update_by': auth.user._id
    })

    await user.save()
    
    await user.branchOffices().attach([branch_office._id], (row) => {
      row.enabled = !row.enabled
      row.rol = row.rol
      row.special_permits = row.special_permits
    })

    let message = (pass) ? 'Eliminado con exito' : 'Habilidato con exito'

    return response.status(200).json({
      ...new MessageFrontEnd(message)
    })
  }

}

module.exports = UserController
