'use strict'

class AccountEnterpriseStore {
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
      phone: 'required|array',
      'phone.*.type': 'required|boolean',
      'phone.*.number': 'required|string',
      email: 'required|array',
      'email.*.type': 'required|boolean',
      'email.*.email': 'required|string|email',
      address: 'required|array',
      'address.*.type': 'required|boolean',
      'address.*.address': 'required|string|min:15|max:600',
      'address.*.location': 'accepted|array|min:2|max:2',
      'address.*.location.*': 'required|number',
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

      'phone.required': 'Debe proporcionar al menos un telefono',
      'phone.array': 'Debe poporcionar un arreglo',

      'phone.*.type.required': 'Seleccione si es el principal o secundario',
      'phone.*.type.boolean': 'Debe proporcionar un dato booleano',
      'phone.*.number.required': 'Debe proporcionar un numero',
      'phone.*.number.string': 'Debe proporcionar un dato alfanumerico',
      
      'email.required': 'Debe proporcionar al menos un email',
      'email.array': 'Debe poporcionar un arreglo',

      'email.*.type.required': 'Seleccione si es el principal o secundario',
      'email.*.type.boolean': 'Debe proporcionar un dato booleano',
      'email.*.email.required': 'Debe proporcionar una dirección de correo electrónico.',
      'email.*.email.string': 'Debe proporcionar un dato alfanumerico',
      'email.*.email.email': 'Debe proporcionar una dirección de correo electrónico válida.',

      'address.required': 'Debe proporcionar al menos una dirección',
      'address.array': 'Debe poporcionar un arreglo',

      'address.*.type.required': 'Seleccione si es la principal o secundaria',
      'address.*.type.boolean': 'Debe proporcionar un dato booleano',
      'address.*.address.required': 'Debe proporcionar una dirección.',
      'address.*.address.string': 'Debe proporcionar un dato alfanumerico',
      'address.*.address.min': 'Debe proporcionar una dirección con al menos quince (15) caracteres',
      'address.*.address.max': 'Debe proporcionar una dirección con un máximo de seiscientos (600) caracteres',
      'address.*.location.array': 'Debe poporcionar un arreglo',
      'address.*.location.min': 'Debe proporcionar al menos dos (2) datos',
      'address.*.location.max': 'Debe proporcionar un  máximo de dos (2) datos',
      'address.*.location.*.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountEnterpriseStore
