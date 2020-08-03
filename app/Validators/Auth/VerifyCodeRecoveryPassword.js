'use strict'

class AuthVerifyCodeRecoveryPassword {

  get validateAll() {
    return true
  }

  get rules() {
    return {
      email: 'required|email|exist:users,email',
      code: 'required|max:9'
    }
  }

  get messages() {
    return {
      'email.exist': "Dirección de correo electrónico no registrado",
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
      'code.required': 'Debe proporcionar un código.',
      'code.max': 'Debe proporcionar un maxímo de nueve (9) caracteres'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = AuthVerifyCodeRecoveryPassword
