'use strict'

class AccountTermStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      ruler_id: 'required|string|objectId',
      percentage: 'required|boolean',
      amount: 'required|number',
      quantity: 'required|number',
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

      'ruler_id.required': 'Seleccione una regla a seguir',
      'ruler_id.string': 'Debe proporcionar un dato alfanumerico',
      'ruler_id.objectId': 'Debe proporcionar un Objeto valido',

      'percentage.required': 'Seleccione si es por porcentaje o no',
      'percentage.boolean': 'Debe proporcionar un dato booleano',

      'amount.required': 'Debe proporcionar una cantidad',
      'amount.number': 'Debe proporcionar un dato numerico',

      'quantity.required': 'Debe proporcionar una cantidad',
      'quantity.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountTermStore
