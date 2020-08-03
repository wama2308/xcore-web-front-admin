'use strict'

class AccountEnterpriseUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      type_identity_id: 'required|string|objectId',
      person_id: 'required|string|objectId',
      nif: 'required|string',
      retainer: 'required|boolean',
    }

    if (request.input('retainer')) {
      rules = {
        ...rules,
        percentage_amount: 'required|number',
      }
    }

    return rules
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.string': 'Debe proporcionar un dato alfanumerico',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'description.required': 'Debe proporcionar una descripcion',
      'description.string': 'Debe proporcionar un dato alfanumerico',
      'description.min': 'Debe proporcionar un nombre con al menos quince (15) caracteres',
      'description.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',
      
      'type_identity_id.required': 'Seleccione el tipo de identidad',
      'type_identity_id.string': 'Debe proporcionar un dato alfanumerico',
      'type_identity_id.objectId': 'Debe proporcionar un Objeto valido',

      'nif.required': 'Debe proporcionar un nif',
      'nif.number': 'Debe proporcionar un dato numerico',
      
      'person_id.required': 'Seleccione la persona con la cual se comunicaran',
      'person_id.string': 'Debe proporcionar un dato alfanumerico',
      'person_id.objectId': 'Debe proporcionar un Objeto valido',

      'retainer.required': 'Debe proporcionar si es un agente retenedor de I.V.A',
      'retainer.boolean': 'Debe proporcionar un dato booleano',

      'percentage_amount.required': 'Debe proporcionar la cantidad retenedora de I.V.A',
      'percentage_amount.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountEnterpriseUpdate
