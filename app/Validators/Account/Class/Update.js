'use strict'

class AccountClassUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      reserve: 'required|boolean',
      amount: 'required|number',
      schedule_id: 'required|string|objectId',
      screens: 'array',
      penalty: 'required|boolean',
      quotas: 'required|number',
      cumulative_class: 'required|number',
      gifted_class: 'required|number',
      icon: 'required|string',
      name_icon: 'required|string',
      expiration_cycle: 'required|boolean',
      expiration_time: 'required|number',
      tax_id: 'required|string|objectId',
      discount_id: 'accepted|string|objectId',
      inscription: 'required|boolean',
      corporate_group: 'required|boolean',
      multiple_assistance: 'required|boolean',
      number_class: 'required|number',
      partial_payment: 'required|boolean'
    }

    if (request.input('reserve')) {
      rules = {
        'type_reserve.web': 'required|boolean',
        'type_reserve.movil': 'required|boolean',
        'type_reserve.branch': 'required|boolean'
      }
    }

    if (request.input('inscription')) {
      rules.amount_inscription = 'required|number'
    }

    if (request.input('penalty')) {
      rules.type_penalties = 'required|array'
    }

    if (request.input('partial_payment')) {
      rules.number_days = 'required|number'
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
      
      'reserve.required': 'Seleccione si es reservado o no',
      'reserve.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.web.required': 'Seleccione si se podrá reservado o no desde la wed',
      'type_reserve.web.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.movil.required': 'Seleccione si se podrá reservado o no desde la app movil',
      'type_reserve.movil.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.branch.required': 'Seleccione si se podrá reservado o no desde la sucursal',
      'type_reserve.branch.boolean': 'Debe proporcionar un dato booleano',

      'amount.required': 'Debe proporcionar un monto',
      'amount.number': 'Debe proporcionar un dato numerico',

      'schedule_id.required': 'Seleccione el horario de la clase',
      'schedule_id.string': 'Debe proporcionar un dato alfanumerico',
      'schedule_id.objectId': 'Debe proporcionar un Objeto valido',

      'type_id.required': 'Seleccione el tipo de la clase',
      'type_id.string': 'Debe proporcionar un dato alfanumerico',
      'type_id.objectId': 'Debe proporcionar un Objeto valido',

      'screens.array': 'Debe poporcionar un arreglo de pantallas',

      'penalty.required': 'Seleccione si es tendra penalizaciones o no',
      'penalty.boolean': 'Debe proporcionar un dato booleano',

      'type_penalties.required': 'Debe poporcionar penalizaciones',
      'type_penalties.array': 'Debe poporcionar un arreglo de penalizaciones',

      'quotas.required': 'Debe proporcionar una cantidad de cupos',
      'quotas.number': 'Debe proporcionar un dato numerico',

      'cumulative_class.required': 'Debe proporcionar una cantidad de clases acumulativas',
      'cumulative_class.number': 'Debe proporcionar un dato numerico',

      'gifted_class.required': 'Debe proporcionar una cantidad de clases a obsequiar',
      'gifted_class.number': 'Debe proporcionar un dato numerico',

      'icon.required': 'Debe proporcionar el icono a guardar',
      'icon.string': 'Debe proporcionar un dato alfanumerico',

      'name_icon.required': 'Debe proporcionar el nombre para los iconos',
      'name_icon.string': 'Debe proporcionar un dato alfanumerico',

      'expiration_cycle.required': 'Seleccione si es expiración mensual o diaria',
      'expiration_cycle.boolean': 'Debe proporcionar un dato booleano',

      'expiration_time.required': 'Debe proporcionar una cantidad de tiempo',
      'expiration_time.number': 'Debe proporcionar un dato numerico',

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

      'multiple_assistance.required': 'Seleccione si puede acceder a multiples clases o no',
      'multiple_assistance.boolean': 'Debe proporcionar un dato booleano',

      'number_class.required': 'Debe proporcionar una cantidad de clases',
      'number_class.number': 'Debe proporcionar un dato numerico',

      'partial_payment.required': 'Seleccione si puede tener pagos parciales o no',
      'partial_payment.boolean': 'Debe proporcionar un dato booleano',

      'number_days.required': 'Debe proporcionar los dias para el pago parcial',
      'number_days.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountClassUpdate
