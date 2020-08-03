'use strict'

class AccountForeignExchangeBranchOfficeUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      rate: 'required|number',
    }

    return rules
  }

  get messages() {
    return {
      'rate.required': 'Agregue la tasa a utilizar',
      'rate.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountForeignExchangeBranchOfficeUpdate
