'use strict'

class AccountPenaltyUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      percentage: 'required|boolean',
      amount: 'required|number',
      time_type: 'required|number',
      time_amount: 'required|number',
      type_user: 'required|boolean',
      categories: 'required|array',
      type_of_comparison: 'required|number',
    }
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'description.required': 'Debe proporcionar una descripcion',
      'description.min': 'Debe proporcionar un nombre con al menos quince (15) caracteres',
      'description.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',

      'percentage.required': 'Seleccione si es porcentaje o no',
      'percentage.boolean': 'Debe proporcionar un dato booleano',

      'amount.required': 'Debe proporcionar una cantidad',
      'amount.number': 'Debe proporcionar un dato numerico',

      'time_type.required': 'Debe proporcionar un tipo de tiempo',
      'time_type.number': 'Debe proporcionar un dato numerico',

      'time_amount.required': 'Debe proporcionar una cantidad de tiempo',
      'time_amount.number': 'Debe proporcionar un dato numerico',

      'type_user.required': 'Seleccione si es un trabajado o es un cliente',
      'type_user.boolean': 'Debe proporcionar un dato booleano',

      'categories.required': 'Seleccione las categoria',
      'categories.array': 'Debe poporcionar un arreglo',

      'type_of_comparison.required': 'Debe proporcionar el tipo de comparación',
      'type_of_comparison.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountPenaltyUpdate
