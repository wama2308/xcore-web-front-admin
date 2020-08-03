'use strict'

class AccountAreaUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      photos: 'required|array',
      required_manager: 'required|boolean',
      reserve: 'required|boolean',
      schedule_id: 'required|string|objectId',
      capacity: 'required|number',
      gift_areas: 'required|number',
      icon: 'required|string',
      name_icon: 'required|string',
      tax_id: 'required|string|objectId',
      phone: 'required|array',
      internal: 'required|boolean',
      penalty: 'required|boolean',
      required_maintenance: 'required|boolean',
      amount: 'required|number',
      partial_payment: 'required|boolean',
      discount_id: 'accepted|string|objectId',
      goods: 'accepted|array',
      'goods.*.goods_id': 'required|string|objectId',
      'goods.*.quantity': 'required|number',
    }

    if (request.input('reserve')) {
      rules = {
        ...rules,
        'type_reserve.web': 'required|boolean',
        'type_reserve.movil': 'required|boolean',
        'type_reserve.branch': 'required|boolean'
      }
    }

    if (!request.input('internal')) {
      rules.location = 'required|array'
    }

    if (request.input('required_manager')) {
      rules.manager = 'required|string|objectId'
    }

    if (request.input('partial_payment')) {
      rules.number_days = 'required|number'
    }

    if (request.input('required_maintenance')) {
      rules.maintenance_time = 'required|string'
      rules.responsible_maintenance = 'required|string|objectId'
    }

    if (request.input('penalty')) {
      rules.type_penalties = 'required|array'
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

      'photos.required': 'Debe proporcionar fotos',
      'photos.array': 'Debe poporcionar un arreglo',

      'required_manager.required': 'Debe proporcionar si habrá o no un gerente',
      'required_manager.boolean': 'Debe proporcionar un dato booleano',

      'manager.required': 'Debe proporcionar un gerente',
      'manager.string': 'Debe proporcionar un dato alfanumerico',
      'manager.objectId': 'Debe proporcionar un Objeto valido',

      'reserve.required': 'Debe proporcionar si se podrá reservar o no',
      'reserve.boolean': 'Debe proporcionar un dato booleano',

      'type_reserve.web.required': 'Debe proporcionar si se podrá reservar desde la web o no',
      'type_reserve.web.boolean': 'Debe proporcionar un dato booleano',
      'type_reserve.movil.required': 'Debe proporcionar si se podrá reservar desde la app movil o no',
      'type_reserve.movil.boolean': 'Debe proporcionar un dato booleano',
      'type_reserve.branch.required': 'Debe proporcionar si se podrá reservar desde la sucursal o no',
      'type_reserve.branch.boolean': 'Debe proporcionar un dato booleano',

      'schedule_id.required': 'Debe proporcionar un horario',
      'schedule_id.string': 'Debe proporcionar un dato alfanumerico',
      'schedule_id.objectId': 'Debe proporcionar un Objeto valido',

      'capacity.required': 'Debe proporcionar la capacidad',
      'capacity.number': 'Debe proporcionar un dato numerico',

      'gift_areas.required': 'Debe proporcionar una cantidad de areas que pueden ser obsequiables',
      'gift_areas.number': 'Debe proporcionar un dato numerico',

      'icon.required': 'Debe proporcionar un icono',
      'icon.string': 'Debe proporcionar un dato alfanumerico',

      'name_icon.required': 'Debe proporcionar un nombre para el icono',
      'name_icon.string': 'Debe proporcionar un dato alfanumerico',

      'tax_id.required': 'Debe proporcionar un impuesto',
      'tax_id.string': 'Debe proporcionar un dato alfanumerico',
      'tax_id.objectId': 'Debe proporcionar un Objeto valido',

      'phone.required': 'Debe proporcionar telefono(s)',
      'phone.array': 'Debe poporcionar un arreglo',

      'internal.required': 'Debe proporcionar es interna o no',
      'internal.boolean': 'Debe proporcionar un dato booleano',

      'location.required': 'Debe proporcionar la localización externa',
      'location.array': 'Debe poporcionar un arreglo',

      'penalty.required': 'Debe proporcionar si habrán penalizaciones o no',
      'penalty.boolean': 'Debe proporcionar un dato booleano',

      'type_penalties.required': 'Debe proporcionar las penalizaciones',
      'type_penalties.array': 'Debe poporcionar un arreglo',

      'required_maintenance.required': 'Debe proporcionar si requiere mantenimiento o no',
      'required_maintenance.boolean': 'Debe proporcionar un dato booleano',

      'maintenance_time.required': 'Debe proporcionar el tiempo de mantenimiento',
      'maintenance_time.string': 'Debe proporcionar un dato alfanumerico',

      'responsible_maintenance.required': 'Debe proporcionar el encargado de mantenimiento',
      'responsible_maintenance.string': 'Debe proporcionar un dato alfanumerico',
      'responsible_maintenance.objectId': 'Debe proporcionar un Objeto valido',

      'amount.required': 'Debe proporcionar el monto que conlleva',
      'amount.number': 'Debe proporcionar un dato numerico',

      'partial_payment.required': 'Debe proporcionar si tendrá pagos parciales o no',
      'partial_payment.boolean': 'Debe proporcionar un dato booleano',

      'number_days.required': 'Debe proporcionar el numero de días de los pagos parciales',
      'number_days.number': 'Debe proporcionar un dato numerico',

      'discount_id.required': 'Debe proporcionar un descuento',
      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'goods.required': 'Debe proporcionar los bienes',
      'goods.array': 'Debe poporcionar un arreglo',

      'goods.*.goods_id.required': 'Debe proporcionar un bien',
      'goods.*.goods_id.string': 'Debe proporcionar un dato alfanumerico',
      'goods.*.goods_id.objectId': 'Debe proporcionar un Objeto valido',

      'goods.*.quantity.required': 'Debe proporcionar una cantidad',
      'goods.*.quantity.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountAreaUpdate
