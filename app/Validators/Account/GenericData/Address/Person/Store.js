'use strict'

class AccountGenericDataAddressStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      type: 'required|boolean',
      work: 'required|boolean',
      address: 'required|string',
    }

    return rules
  }

  get messages() {
    return {
      'type.required': 'Proporcione si es una dirección principal o una secundaria',
      'type.boolean': 'Debe proporcionar un dato booleano',

      'work.required': 'Proporcione si es una dirección de trabajo o no',
      'work.boolean': 'Debe proporcionar un dato booleano',

      'address.required': 'Proporcione la dirección',
      'address.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGenericDataAddressStore
