'use strict'

class AccountServiceStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      amount: 'required|number',
      tax_id: 'required|string|objectId',
      discount_id: 'accepted|string|objectId',
      quotas: 'required|number',
      screens: 'array',
      corporate_group: 'required|boolean',
      schedule_id: 'required|string|objectId',
      gifted_service: 'required|number',
      cumulative_service: 'required|number',
      reserve: 'required|boolean',
      penalty: 'required|boolean',
      icon: 'required|string',
      name_icon: 'required|string',
      expiration: 'required|boolean',
      partial_payment: 'required|boolean',
      additional_day: 'required|boolean',
    }

    if (request.input('reserve')) {
      rules = {
        'type_reserve.web': 'required|boolean',
        'type_reserve.movil': 'required|boolean',
        'type_reserve.branch': 'required|boolean'
      }
    }

    if (request.input('additional_day')) {
      rules.additional_day_array = 'required|array'
      rules.amount_additional_day = 'required|number'
    }

    if (request.input('expiration')) {
      rules.expiration_date = 'required|date'
    }

    if (request.input('penalty')) {
      rules.type_penalties = 'required|array'
    }

    if (request.input('partial_payment')) {
      rules.days_partial_payments = 'required|number'
    }

    return rules
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'description.required': 'Debe proporcionar una descripcion',
      'description.min': 'Debe proporcionar un nombre con al menos quince (15) caracteres',
      'description.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',
      
      'amount.required': 'Debe proporcionar un monto',
      'amount.number': 'Debe proporcionar un dato numerico',

      'tax_id.required': 'Seleccione el tipo de impuesto',
      'tax_id.string': 'Debe proporcionar un dato alfanumerico',
      'tax_id.objectId': 'Debe proporcionar un Objeto valido',

      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'quotas.required': 'Debe proporcionar una cantidad de servicios',
      'quotas.number': 'Debe proporcionar un dato numerico',

      'screens.array': 'Debe poporcionar un arreglo de pantallas',

      'corporate_group.required': 'Seleccione si es corporativo o no',
      'corporate_group.boolean': 'Debe proporcionar un dato booleano',

      'schedule_id.required': 'Seleccione el horario de la clase',
      'schedule_id.string': 'Debe proporcionar un dato alfanumerico',
      'schedule_id.objectId': 'Debe proporcionar un Objeto valido',

      'gifted_service.required': 'Seleccione la cantidad de servicios que se podran obsequiar',
      'gifted_service.number': 'Debe proporcionar un dato numerico',

      'cumulative_service.required': 'Seleccione la cantidad de servicios que se podran acumular',
      'cumulative_service.number': 'Debe proporcionar un dato numerico',

      'reserve.required': 'Seleccione si se podrá reservado o no',
      'reserve.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.web.required': 'Seleccione si se podrá reservado o no desde la wed',
      'type_reserve.web.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.movil.required': 'Seleccione si se podrá reservado o no desde la app movil',
      'type_reserve.movil.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.branch.required': 'Seleccione si se podrá reservado o no desde la sucursal',
      'type_reserve.branch.boolean': 'Debe proporcionar un dato booleano',

      'penalty.required': 'Seleccione si es tendra penalizaciones o no',
      'penalty.boolean': 'Debe proporcionar un dato booleano',

      'type_penalties.required': 'Debe poporcionar penalizaciones',
      'type_penalties.array': 'Debe poporcionar un arreglo de penalizaciones',

      'icon.required': 'Debe proporcionar un icono',
      'icon.string': 'Debe proporcionar un dato alfanumerico',

      'name_icon.required': 'Debe proporcionar un nombre de icono',
      'name_icon.string': 'Debe proporcionar un dato alfanumerico',

      'expiration.required': 'Seleccione si es tendra fecha de expiración o no',
      'expiration.boolean': 'Debe proporcionar un dato booleano',

      'expiration_date.required': 'Debe proporcionar la fecha de expiración',
      'expiration_date.date': 'Debe proporcionar un dato de fecha',

      'partial_payment.required': 'Seleccione si es tendra pagos parciales',
      'partial_payment.boolean': 'Debe proporcionar un dato booleano',

      'days_partial_payments.required': 'Seleccione la cantidad la cantidad de días entre pagos parciales',
      'days_partial_payments.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountServiceStore
