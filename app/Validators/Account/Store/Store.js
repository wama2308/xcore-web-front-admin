'use strict'

class AccountStoreStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      internal: 'required|boolean',
      address: 'required|string|min:15|max:600'
    }

    if (request.input('internal')) {
      rules.location = 'required|array'
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

      'internal.required': 'Seleccione si es un almacen interno o externo',
      'internal.boolean': 'Debe proporcionar un dato boolean',

      'address.required': 'Debe proporcionar una dirección',
      'address.string': 'Debe proporcionar un dato alfanumerico',
      'address.min': 'Debe proporcionar un nombre con al menos quince (15) caracteres',
      'address.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountStoreStore
