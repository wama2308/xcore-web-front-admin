'use strict'

const Category = use('App/Models/GeneralConfiguration/Category')
const Module = use('App/Models/GeneralConfiguration/Module')
const Permit = use('App/Models/GeneralConfiguration/Permit')
const moduleRepository = use('App/Repositories/ModuleRepository')
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

class ModuleController {

  async index({ request, response }) {
    let modules = await moduleRepository.list(request)
    let aux = []
    modules = modules.toJSON()
    modules = modules.modules

    for (const element of modules) {
      if (element.pivot && element.pivot.permits) {
        element.permits = await getPivotPermits(element.pivot.permits, element._id);
      }

      aux.push({
        'label': element.name,
        'value': element._id,
        'children': element.permits
      })
    }
    
    modules = aux

    return response.status(200).json(modules)
  }

  async show({ params, request, response }) {
    let modules = await moduleRepository.findOneModule(request, params._id)

    modules = modules.toJSON()
    modules = modules.modules

    for (let element of modules) {
      if (element.pivot && element.pivot.permits) {
        element.permits = await getPivotPermits(element.pivot.permits, element._id);
      }

      modules = {
        'label': element.name,
        'value': element._id,
        'children': element.permits
      }
    }

    return response.status(200).json(modules)
  }

}

module.exports = ModuleController
