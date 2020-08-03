'use strict'

class AuthRecoveryPassword {

  get validateAll() {
    return true
  }

  get rules() {
    return {
      email: 'required|email|exist:users,email',
    }
  }

  get messages() {
    return {
      'email.exist': "Dirección de correo electrónico no registrado",
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = AuthRecoveryPassword
