'use strict'

class AccountTypeClientUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'string|max:600',
      stars: 'required|number',
      general: 'required|boolean',
      type_comparison: 'number',
      time_cycle: 'boolean',
      time_amount: 'number',
      percentage: 'boolean',
      percentage_amount: 'number',
      restart_season: 'boolean',
      areas: 'array',
      'areas.*._id': 'required|string|objectId',
      'areas.*.type_comparison': 'required|number',
      'areas.*.time_cycle': 'required|boolean',
      'areas.*.time_amount': 'required|number',
      'areas.*.percentage': 'required|boolean',
      'areas.*.percentage_amount': 'required|number',
      package: 'array',
      'package.*._id': 'required|string|objectId',
      'package.*.type_comparison': 'required|number',
      'package.*.time_cycle': 'required|boolean',
      'package.*.time_amount': 'required|number',
      'package.*.percentage': 'required|boolean',
      'package.*.percentage_amount': 'required|number',
      service: 'array',
      'service.*._id': 'required|string|objectId',
      'service.*.type_comparison': 'required|number',
      'service.*.time_cycle': 'required|boolean',
      'service.*.time_amount': 'required|number',
      'service.*.percentage': 'required|boolean',
      'service.*.percentage_amount': 'required|number',
      class: 'array',
      'class.*._id': 'required|string|objectId',
      'class.*.type_comparison': 'required|number',
      'class.*.time_cycle': 'required|boolean',
      'class.*.time_amount': 'required|number',
      'class.*.percentage': 'required|boolean',
      'class.*.percentage_amount': 'required|number',
      plan: 'array',
      'plan.*._id': 'required|string|objectId',
      'plan.*.type_comparison': 'required|number',
      'plan.*.time_cycle': 'required|boolean',
      'plan.*.time_amount': 'required|number',
      'plan.*.percentage': 'required|boolean',
      'plan.*.percentage_amount': 'required|number',
    }

    if (request.input('restart_season')) {
      rules.restart_season_time = 'required|boolean'
      rules.restart_season_amount = 'required|number'
    }

    return rules
  }

  get messages() {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'description.max': 'Debe proporcionar un nombre con un máximo de seiscientos (600) caracteres',

      'stars.required': 'Debe proporcionar una cantidad de estrellas',
      'stars.number': 'Debe proporcionar un dato numerico',

      'general.required': 'Debe seleccionar si van a ser validaciones generales o no',
      'general.boolean': 'Debe proporcionar un dato booleano',

      'type_comparison.number': 'Debe proporcionar un dato numerico',

      'time_cycle.boolean': 'Debe proporcionar un dato booleano',
      'time_amount.number': 'Debe proporcionar un dato numerico',

      'percentage.boolean': 'Debe proporcionar un dato booleano',
      'percentage_amount.number': 'Debe proporcionar un dato numerico',

      'restart_season.boolean': 'Debe proporcionar un dato booleano',

      'areas.*._id.required': 'Seleccione el area a usar',
      'areas.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'areas.*.type_comparison.required': 'Seleccione el tipo de comparación',
      'areas.*.type_comparison.number': 'Debe proporcionar un dato numerico',

      'areas.*.time_cycle.required': 'Seleccione si es por mensual o por día',
      'areas.*.time_cycle.boolean': 'Debe proporcionar un dato booleano',

      'areas.*.time_amount.required': 'Debe proporcionar la cantidad de tiempo',
      'areas.*.time_amount.number': 'Debe proporcionar un dato numerico',

      'areas.*.percentage.required': 'Seleccione si es por porcentaje o un monto especifico',
      'areas.*.percentage.boolean': 'Debe proporcionar un dato booleano',

      'areas.*.percentage_amount.required': 'Debe proporcionar el monto o porcentaje a usar',
      'areas.*.percentage_amount.number': 'Debe proporcionar un dato numerico',

      'package.*._id.required': 'Seleccione el paquete a usar',
      'package.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'package.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'package.*.type_comparison.required': 'Seleccione el tipo de comparación',
      'package.*.type_comparison.number': 'Debe proporcionar un dato numerico',

      'package.*.time_cycle.required': 'Seleccione si es por mensual o por día',
      'package.*.time_cycle.boolean': 'Debe proporcionar un dato booleano',

      'package.*.time_amount.required': 'Debe proporcionar la cantidad de tiempo',
      'package.*.time_amount.number': 'Debe proporcionar un dato numerico',

      'package.*.percentage.required': 'Seleccione si es por porcentaje o un monto especifico',
      'package.*.percentage.boolean': 'Debe proporcionar un dato booleano',

      'package.*.percentage_amount.required': 'Debe proporcionar el monto o porcentaje a usar',
      'package.*.percentage_amount.number': 'Debe proporcionar un dato numerico',

      'class.*._id.required': 'Seleccione la clase a usar',
      'class.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'class.*.type_comparison.required': 'Seleccione el tipo de comparación',
      'class.*.type_comparison.number': 'Debe proporcionar un dato numerico',

      'class.*.time_cycle.required': 'Seleccione si es por mensual o por día',
      'class.*.time_cycle.boolean': 'Debe proporcionar un dato booleano',

      'class.*.time_amount.required': 'Debe proporcionar la cantidad de tiempo',
      'class.*.time_amount.number': 'Debe proporcionar un dato numerico',

      'class.*.percentage.required': 'Seleccione si es por porcentaje o un monto especifico',
      'class.*.percentage.boolean': 'Debe proporcionar un dato booleano',

      'class.*.percentage_amount.required': 'Debe proporcionar el monto o porcentaje a usar',
      'class.*.percentage_amount.number': 'Debe proporcionar un dato numerico',

      'service.*._id.required': 'Seleccione el servicio a usar',
      'service.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'service.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'service.*.type_comparison.required': 'Seleccione el tipo de comparación',
      'service.*.type_comparison.number': 'Debe proporcionar un dato numerico',

      'service.*.time_cycle.required': 'Seleccione si es por mensual o por día',
      'service.*.time_cycle.boolean': 'Debe proporcionar un dato booleano',

      'service.*.time_amount.required': 'Debe proporcionar la cantidad de tiempo',
      'service.*.time_amount.number': 'Debe proporcionar un dato numerico',

      'service.*.percentage.required': 'Seleccione si es por porcentaje o un monto especifico',
      'service.*.percentage.boolean': 'Debe proporcionar un dato booleano',

      'service.*.percentage_amount.required': 'Debe proporcionar el monto o porcentaje a usar',
      'service.*.percentage_amount.number': 'Debe proporcionar un dato numerico',

      'plan.*._id.required': 'Seleccione el plan a usar',
      'plan.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'plan.*._id.objectId': 'Debe proporcionar un Objeto valido',

      'plan.*.type_comparison.required': 'Seleccione el tipo de comparación',
      'plan.*.type_comparison.number': 'Debe proporcionar un dato numerico',

      'plan.*.time_cycle.required': 'Seleccione si es por mensual o por día',
      'plan.*.time_cycle.boolean': 'Debe proporcionar un dato booleano',

      'plan.*.time_amount.required': 'Debe proporcionar la cantidad de tiempo',
      'plan.*.time_amount.number': 'Debe proporcionar un dato numerico',

      'plan.*.percentage.required': 'Seleccione si es por porcentaje o un monto especifico',
      'plan.*.percentage.boolean': 'Debe proporcionar un dato booleano',

      'plan.*.percentage_amount.required': 'Debe proporcionar el monto o porcentaje a usar',
      'plan.*.percentage_amount.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountTypeClientUpdate
