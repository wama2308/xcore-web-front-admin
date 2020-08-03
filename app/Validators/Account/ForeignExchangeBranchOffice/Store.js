'use strict'

class AccountForeignExchangeBranchOfficeStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      foreign_exchange_id: 'required|string|objectId',
      rate: 'required|number',
    }

    return rules
  }

  get messages() {
    return {
      'foreign_exchange_id.required': 'Seleccione la divisa que se utilizará',
      'foreign_exchange_id.string': 'Debe proporcionar un dato alfanumerico',
      'foreign_exchange_id.objectId': 'Debe proporcionar un Objeto valido',

      'rate.required': 'Agregue la tasa a utilizar',
      'rate.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountForeignExchangeBranchOfficeStore
