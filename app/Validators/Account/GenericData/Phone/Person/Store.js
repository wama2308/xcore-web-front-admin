'use strict'

class AccountGenericDataPhoneStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      type: 'required|boolean',
      emergency: 'required|boolean',
      number: 'required|string',
    }

    if (request.input('emergency')) {
      rules = {
        ...rules,
        names: 'required|string',
        surnames: 'required|string'
      }
    }

    return rules
  }

  get messages() {
    return {
      'type.required': 'Proporcione si el telefono es principal o secundario',
      'type.boolean': 'Debe proporcionar un dato booleano',

      'emergency.required': 'Proporcione si un telefono de emergencia o no',
      'emergency.boolean': 'Debe proporcionar un dato booleano',

      'number.required': 'Proporcione telefono de contacto',
      'number.string': 'Debe proporcionar un dato alfanumerico',

      'names.required': 'Proporcione el nombre de la persona de contacto de emergencia',
      'names.string': 'Debe proporcionar un dato alfanumerico',

      'surnames.required': 'Proporcione el apellido de la persona de contacto de emergencia',
      'surnames.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGenericDataPhoneStore
