'use strict'

class AccountGroupUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      code: 'required|string|min:2|max:30',
      corporate: 'required|boolean',
      person_id: 'required|string|objectId',
      schedule_id: 'accepted|string|objectId',
      discount_id: 'accepted|string|objectId',
      class: 'accepted|array',
      'class.*._id': 'required|string|objectId',
      plans: 'accepted|array',
      'plans.*._id': 'required|string|objectId',
      areas: 'accepted|array',
      'areas.*._id': 'required|string|objectId',
      services: 'accepted|array',
      'services.*._id': 'required|string|objectId',
      products: 'accepted|array',
      'products.*._id': 'required|string|objectId',
    }

    if (request.input('corporate')) {
      rules = {
        ...rules,
        enterprise_id: 'required|string|objectId',
      }
    }

    return rules
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.string': 'Debe proporcionar un dato alfanumerico',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'description.required': 'Debe proporcionar una descripcion',
      'description.string': 'Debe proporcionar un dato alfanumerico',
      'description.min': 'Debe proporcionar un nombre con al menos quince (15) caracteres',
      'description.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',

      'code.required': 'Debe proporcionar un codigo',
      'code.string': 'Debe proporcionar un dato alfanumerico',
      'code.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'code.max': 'Debe proporcionar un nombre con un máximo de treinta (30) caracteres',

      'corporate.required': 'Seleccione si es el corporativo o no',
      'corporate.boolean': 'Debe proporcionar un dato booleano',

      'person_id.required': 'Seleccione la persona encargada',
      'person_id.string': 'Debe proporcionar un dato alfanumerico',
      'person_id.objectId': 'Debe proporcionar un Objeto valido',

      'enterprise_id.required': 'Seleccione la empresa a la que pertenece',
      'enterprise_id.string': 'Debe proporcionar un dato alfanumerico',
      'enterprise_id.objectId': 'Debe proporcionar un Objeto valido',

      'schedule_id.string': 'Debe proporcionar un dato alfanumerico',
      'schedule_id.objectId': 'Debe proporcionar un Objeto valido',

      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'class.array': 'Debe poporcionar un arreglo',
      'class.*._id.required': 'Proporcione una clase',
      'class.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'plans.array': 'Debe poporcionar un arreglo',
      'plans.*._id.required': 'Proporcione un plan',
      'plans.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'plans.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'areas.array': 'Debe poporcionar un arreglo',
      'areas.*._id.required': 'Proporcione un area',
      'areas.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'services.array': 'Debe poporcionar un arreglo',
      'services.*._id.required': 'Proporcione un servicio',
      'services.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'services.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'products.array': 'Debe poporcionar un arreglo',
      'products.*._id.required': 'Proporcione un producto',
      'products.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'products.*._id.objectId': 'Debe proporcionar un Objeto valido',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGroupUpdate
