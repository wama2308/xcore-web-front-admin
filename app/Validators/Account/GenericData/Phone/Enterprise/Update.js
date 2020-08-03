'use strict'

class AccountGenericDataPhoneEnterpriseUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      type: 'required|boolean',
      number: 'required|string',
    }

    return rules
  }

  get messages() {
    return {
      'type.required': 'Proporcione si el telefono es principal o secundario',
      'type.boolean': 'Debe proporcionar un dato booleano',

      'number.required': 'Proporcione telefono de contacto',
      'number.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGenericDataPhoneEnterpriseUpdate
