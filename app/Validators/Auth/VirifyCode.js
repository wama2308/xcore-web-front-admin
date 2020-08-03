'use strict'

class VirifyCode {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email',
      code: 'required|max:9',
    }
  }

  get messages () {
    return {
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
      'code.required': 'Debe proporcionar un código.',
      'code.max': 'El código no pude tener mas de 9 caracteres',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = VirifyCode
