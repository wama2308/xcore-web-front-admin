'use strict'

class GenerateCode {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email',
    }
  }

  get messages () {
    return {
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = GenerateCode
