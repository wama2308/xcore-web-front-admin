'use strict'

class BusinessUpdate {

  get validateAll () {
    return true
  }
  
  get rules () {
    return {
      email: 'required|email',
      name: 'required|string|min:2|max:100',
      logo: 'required|string',
    }
  }

  get messages () {
    return {
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
      'email.unique': 'Este correo electrónico ya está registrado',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = BusinessUpdate
