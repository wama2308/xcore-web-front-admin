'use strict'

class AccountUserStore {

  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|string|email', //|exist:users,email
      rol_id: 'required|string|objectId',
      special_permits: 'array',
      'special_permits.*': 'required|string',
    }
  }

  get messages () {
    return {
      'email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.email': 'Debe proporcionar una dirección de correo electrónico válida.',
      
      'rol_id.required': 'Seleccione el cargo que ocupara',
      'rol_id.string': 'Debe proporcionar un dato alfanumerico',
      'rol_id.objectId': 'Debe proporcionar un Objeto valido',

      'special_permits.array': 'Se debe proporcionar un array con los modulos',

      'special_permits.*.required': 'Debe seleccionar un modulo y su permiso',
      'special_permits.*.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = AccountUserStore
