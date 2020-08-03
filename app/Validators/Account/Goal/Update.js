'use strict'

class AccountGoalUpdate {
  
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      rol_id: 'required|string|objectId',
      period: 'required|boolean',
      period_cycle: 'required|number',
      terms: 'required|array',
      incentives: 'required|array'
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

      'rol_id.required': 'Seleccione el rol de los que estarán bajo estas reglas',
      'rol_id.string': 'Debe proporcionar un dato alfanumerico',
      'rol_id.objectId': 'Debe proporcionar un Objeto valido',

      'period.required': 'Seleccione si es un periodo de días o mensual',
      'period.boolean': 'Debe proporcionar un dato booleano',

      'period_cycle.required': 'Debe proporcionar una cantidad de periodo',
      'period_cycle.number': 'Debe proporcionar un dato numerico',

      'quantity.required': 'Debe proporcionar una cantidad',
      'quantity.number': 'Debe proporcionar un dato numerico',

      'terms.required': 'Debe poporcionar la(s) condiciones a seguir',
      'terms.array': 'Debe poporcionar un arreglo',

      'incentives.required': 'Debe poporcionar el/los insentivos',
      'incentives.array': 'Debe poporcionar un arreglo',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountGoalUpdate
