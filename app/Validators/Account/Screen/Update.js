'use strict'

class AccountScreenUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      serial: 'required|string',
      brand: 'required|string',
      model: 'required|string',
      ip: 'required|string',
      mac: 'required|string'
    }
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

      'serial.required': 'Debe proporcionar un serial',
      'serial.string': 'Debe proporcionar un dato alfanumerico',

      'brand.required': 'Debe proporcionar una marca',
      'brand.string': 'Debe proporcionar un dato alfanumerico',

      'model.required': 'Debe proporcionar un modelo',
      'model.string': 'Debe proporcionar un dato alfanumerico',

      'ip.required': 'Debe proporcionar una dirección IP',
      'ip.string': 'Debe proporcionar un dato alfanumerico',

      'mac.required': 'Debe proporcionar una dirección MAC',
      'mac.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountScreenUpdate
