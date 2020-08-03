'use strict'

class AuthChangePasswordRecovery {

  get validateAll() {
    return true
  }

  get rules() {
    return {
      email: 'required|string|email|exist:users,email',
      password: 'required|string|min:6|max:18|levelPassword',
      password_confirmation: 'required_if:password|string|same:password',
    }
  }

  get messages() {
    return {
      'email.exist': "Dirección de correo electrónico no registrado",
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
      'password.levelPassword': 'Debes proporcionar una contraseña valida que contenga al menos un (1) numero, una (1) letra y un (1) caracter especial.',
      'password.required': 'Debes proporcionar una contraseña.',
      'password.min': 'Debes proporcionar una contraseña de seis (6) caracteres minimos.',
      'password.max': 'Debes proporcionar una contraseña de dieciocho (18) caracteres maximos.',
      'password_confirmation.required_if': 'Por favor confirme la contraseña.',
      'password_confirmation.same': 'Las contraseña no coinciden.',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = AuthChangePasswordRecovery
