'use strict'

class AccountPersonUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      names: 'required|string|min:2|max:100',
      surnames: 'required|string|min:2|max:100',
      dni: 'required|number',
      birthday: 'required|date',
      type_identity_id: 'required|string|objectId',
      civil_state_id: 'required|string|objectId',
      sex_id: 'required|string|objectId',
    }

    return rules
  }

  get messages() {
    return {
      'names.required': 'Debe proporcionar un nombre',
      'names.string': 'Debe proporcionar un dato alfanumerico',
      'names.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'names.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'surnames.required': 'Debe proporcionar un apellido',
      'surnames.string': 'Debe proporcionar un dato alfanumerico',
      'surnames.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'surnames.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'dni.required': 'Debe proporcionar un dni',
      'dni.number': 'Debe proporcionar un dato numerico',

      'birthday.required': 'Debe proporcionar la fecha de nacimiento',
      'birthday.date': 'Debe proporcionar una fecha valida',
      
      'type_identity_id.required': 'Seleccione el tipo de identidad',
      'type_identity_id.string': 'Debe proporcionar un dato alfanumerico',
      'type_identity_id.objectId': 'Debe proporcionar un Objeto valido',

      'civil_state_id.required': 'Seleccione el estado civil',
      'civil_state_id.string': 'Debe proporcionar un dato alfanumerico',
      'civil_state_id.objectId': 'Debe proporcionar un Objeto valido',

      'sex_id.required': 'Seleccione el sexo de la persona',
      'sex_id.string': 'Debe proporcionar un dato alfanumerico',
      'sex_id.objectId': 'Debe proporcionar un Objeto valido',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountPersonUpdate
