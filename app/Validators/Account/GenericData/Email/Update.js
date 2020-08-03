'use strict'

class AccountGenericDataEmailUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      type: 'required|boolean',
      email: 'required|string|email',
    }

    return rules
  }

  get messages() {
    return {
      'type.required': 'Proporcione si email principal o secundario',
      'type.boolean': 'Debe proporcionar un dato booleano',

      'email.required': 'Proporcione un email',
      'email.string': 'Debe proporcionar un dato alfanumerico',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGenericDataEmailUpdate
