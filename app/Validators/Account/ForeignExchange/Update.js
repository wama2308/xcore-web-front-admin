'use strict'

class AccountForeignExchangeUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      acronym: 'required|string|max:10',
      currency_symbol: 'required|string|max:10',
      rate: 'required|number',
    }

    return rules
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.string': 'Debe proporcionar un dato alfanumerico',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'acronym.required': 'Debe proporcionar un acronimo',
      'acronym.string': 'Debe proporcionar un dato alfanumerico',
      'acronym.max': 'Debe proporcionar un nombre con un máximo de diez (10) caracteres',

      'currency_symbol.required': 'Debe proporcionar un acronimo',
      'currency_symbol.string': 'Debe proporcionar un dato alfanumerico',
      'currency_symbol.max': 'Debe proporcionar un nombre con un máximo de diez (10) caracteres',

      'rate.required': 'Agregue la tasa a utilizar',
      'rate.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountForeignExchangeUpdate
