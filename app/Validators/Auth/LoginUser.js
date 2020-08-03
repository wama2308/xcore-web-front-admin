'use strict'

class LoginUser {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email', //|exist:users,email
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válido.',
      'email.exist': 'Correo electrónico no válido.',
      'password.required': 'Debes proporcionar una contraseña.',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = LoginUser
