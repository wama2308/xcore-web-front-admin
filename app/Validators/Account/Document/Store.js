'use strict'

class AccountDocumentStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      format: 'required|string',
      type_document_id: 'required|string|objectId',
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

      'format.required': 'Debe proporcionar el formato',
      'format.string': 'Debe proporcionar un dato alfanumerico',

      'type_document_id.required': 'Debe proporcionar un tipo de documento',
      'type_document_id.string': 'Debe proporcionar un dato alfanumerico',
      'type_document_id.objectId': 'Debe proporcionar un Objeto valido',

    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountDocumentStore
