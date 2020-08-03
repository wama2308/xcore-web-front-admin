'use strict'

class AccountPlanStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      amount: 'required|number',
      schedule_id: 'required|string|objectId',
      tax_id: 'required|string|objectId',
      discount_id: 'accepted|string|objectId',
      corporate_group: 'required|boolean',
      penalty: 'required|boolean',
      cycle: 'required|boolean',
      time_cycle: 'required|number',
      date_change: 'required|boolean',
      expiration: 'required|boolean',
      additional_day: 'required|boolean',
      flexibility: 'required|boolean',
      locker: 'required|boolean',
      attendance_limit: 'required|boolean',
      inscription: 'required|boolean',
      partial_payments: 'required|boolean',
    }

    if (request.input('attendance_limit')) {
      rules.type_limit = 'required|boolean',
      rules.limit_amount = 'required|number'
    }

    if (request.input('additional_day')) {
      rules.additional_day_array = 'required|array'
      rules.amount_additional_day = 'required|number'
    }

    if (request.input('locker')) {
      rules.amount_locker = 'required|number'
    }

    if (request.input('flexibility')) {
      rules.flexibility_day = 'required|number'
    }

    if (request.input('inscription')) {
      rules.amount_inscription = 'required|number'
    }

    if (request.input('expiration')) {
      rules.expiration_date = 'required|date'
    }

    if (request.input('penalty')) {
      rules.type_penalties = 'required|array'
    }

    if (request.input('partial_payments')) {
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

      'schedule_id.required': 'Seleccione el horario de la clase',
      'schedule_id.string': 'Debe proporcionar un dato alfanumerico',
      'schedule_id.objectId': 'Debe proporcionar un Objeto valido',

      'date_change.required': 'Seleccione Si cambiará de fecha o no',
      'date_change.boolean': 'Debe proporcionar un dato booleano',

      'penalty.required': 'Seleccione si es tendra penalizaciones o no',
      'penalty.boolean': 'Debe proporcionar un dato booleano',

      'type_penalties.required': 'Debe poporcionar penalizaciones',
      'type_penalties.array': 'Debe poporcionar un arreglo de penalizaciones',

      'cycle.required': 'Seleccione si mensual o diaria',
      'cycle.boolean': 'Debe proporcionar un dato booleano',

      'time_cycle.required': 'Debe proporcionar una cantidad de tiempo',
      'time_cycle.number': 'Debe proporcionar un dato numerico',

      'tax_id.required': 'Seleccione el impuesto sobre la clase',
      'tax_id.string': 'Debe proporcionar un dato alfanumerico',
      'tax_id.objectId': 'Debe proporcionar un Objeto valido',

      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'inscription.required': 'Seleccione si requiere una incripcion o no',
      'inscription.boolean': 'Debe proporcionar un dato booleano',

      'amount_inscription.required': 'Debe proporcionar un monto de inscripcion',
      'amount_inscription.number': 'Debe proporcionar un dato numerico',

      'corporate_group.required': 'Seleccione si es para un grupo corporativo o no',
      'corporate_group.boolean': 'Debe proporcionar un dato booleano',

      'partial_payments.required': 'Seleccione si puede tener pagos parciales o no',
      'partial_payments.boolean': 'Debe proporcionar un dato booleano',

      'days_partial_payments.required': 'Debe proporcionar los dias para el pago parcial',
      'days_partial_payments.number': 'Debe proporcionar un dato numerico',

      'expiration.required': 'Seleccione si expirará o no',
      'expiration.boolean': 'Debe proporcionar un dato booleano',

      'expiration_date.required': 'Debe proporcionar una fecha',
      'expiration_date.date': 'Debe proporcionar una fecha valida',

      'additional_day.required': 'Seleccione si se permitirá la entrada en dias adicionales',
      'additional_day.boolean': 'Debe proporcionar un dato booleano',

      'additional_day_array.required': 'Debe proporcionar el array de días adicionales',
      'additional_day_array.array': 'Debe poporcionar un arreglo de días',

      'amount_additional_day.required': 'Debe proporcionar una el monto por los días adicionales',
      'amount_additional_day.number': 'Debe proporcionar un dato numerico',

      'flexibility.required': 'Seleccione si se permitirá flexibilidad de pago',
      'flexibility.boolean': 'Debe proporcionar un dato booleano',

      'flexibility_day.required': 'Debe proporcionar la cantidad de días de flexibilidad',
      'flexibility_day.number': 'Debe proporcionar un dato numerico',

      'locker.required': 'Seleccione si se permitirá un Locker/Armario/Casillero',
      'locker.boolean': 'Debe proporcionar un dato booleano',

      'amount_locker.required': 'Debe proporcionar el monto por el uso del Locker/Armario/Casillero',
      'amount_locker.number': 'Debe proporcionar un dato numerico',

      'attendance_limit.required': 'Seleccione si tendrá un limite de accesos',
      'attendance_limit.boolean': 'Debe proporcionar un dato booleano',

      'type_limit.required': 'Seleccione si el limite de accesos es mensual o diario',
      'type_limit.boolean': 'Debe proporcionar un dato booleano',

      'limit_amount.required': 'Debe proporcionar la cantidad de accesos limites',
      'limit_amount.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountPlanStore
