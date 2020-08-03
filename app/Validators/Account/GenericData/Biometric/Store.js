'use strict'

class AccountGenericDataBiometricStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      hand: 'required|boolean',
      finger_id: 'required|string|objectId',
      finge_print: 'required|string',
    }

    return rules
  }

  get messages() {
    return {
      'hand.required': 'Proporcione si es la mano derecha o izquierda',
      'hand.boolean': 'Debe proporcionar un dato booleano',

      'finger_id.required': 'Seleccione el dedo',
      'finger_id.string': 'Debe proporcionar un dato alfanumerico',
      'finger_id.objectId': 'Debe proporcionar un Objeto valido',

      'finge_print.required': 'Proporcione la huella',
      'finge_print.string': 'Debe proporcionar un dato alfanumerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGenericDataBiometricStore
