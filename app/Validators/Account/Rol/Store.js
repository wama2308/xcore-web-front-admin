'use strict'

class AccountRolStore {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      name: 'required|string|min:2|max:100',
      description: 'required|string|max:600',
      modules: 'required|array',
      'modules.*': 'required|string',
    }
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un maximo de cien (100) caracteres',

      'description.required': 'Debe proporcionar una descripcion',
      'description.string': 'Debe proporcionar un dato alfanumerico',
      'description.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',

      'modules.required': 'Debe proporcionar modulos.',
      'modules.array': 'Se debe proporcionar un array con los modulos',

      'modules.*.required': 'Debe seleccionar un modulos y sus permisos',
      'modules.*.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountRolStore
