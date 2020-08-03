'use strict'

class AccountPackageStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      image: 'accepted|string',
      amount: 'required|number',
      tax_id: 'required|string|objectId',
      class: 'accepted|array',
      'class.*.class_id': 'required|string|objectId',
      plans: 'accepted|array',
      'plans.*.plans_id': 'required|string|objectId',
      areas: 'accepted|array',
      'areas.*.areas_id': 'required|string|objectId',
      services: 'accepted|array',
      'services.*.services_id': 'required|string|objectId',
      products: 'accepted|array',
      'products.*.products_id': 'required|string|objectId',
      penalty: 'required|boolean',
      expiration_date: 'required|date',
      corporate_group: 'required|boolean',
      partial_payment: 'required|boolean',
      discount_general: 'required|boolean'
    }

    if (request.input('discount_general')) {
      rules.discount_id = 'required|string|objectId'
    } else {
      rules.discount_individual = 'required|boolean'
    }

    if (request.input('discount_individual')) {
      rules = {
        ...rules,
        'products.*.discount_id': 'required|string|objectId',
        'services.*.discount_id': 'required|string|objectId',
        'areas.*.discount_id': 'required|string|objectId',
        'plans.*.discount_id': 'required|string|objectId',
        'class.*.discount_id': 'required|string|objectId'
      }
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

      'image.string': 'Debe proporcionar un dato alfanumerico',

      'amount.required': 'Debe proporcionar un monto',
      'amount.number': 'Debe proporcionar un dato numerico',

      'tax_id.required': 'Debe proporcionar un impuesto',
      'tax_id.string': 'Debe proporcionar un dato alfanumerico',
      'tax_id.objectId': 'Debe proporcionar un Objeto valido',

      'class.array': 'Debe poporcionar un arreglo',
      'class.*.class_id.required': 'Debe proporcionar una clase',
      'class.*.class_id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*.class_id.objectId': 'Debe proporcionar un Objeto valido',
      'class.*.discount_id.required': 'Debe proporcionar un descuento',
      'class.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'plans.array': 'Debe poporcionar un arreglo',
      'plans.*.plans_id.required': 'Debe proporcionar un plan',
      'plans.*.plans_id.string': 'Debe proporcionar un dato alfanumerico',
      'plans.*.plans_id.objectId': 'Debe proporcionar un Objeto valido',
      'plans.*.discount_id.required': 'Debe proporcionar un descuento',
      'plans.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'plans.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'areas.array': 'Debe poporcionar un arreglo',
      'areas.*.areas_id.required': 'Debe proporcionar un area',
      'areas.*.areas_id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*.areas_id.objectId': 'Debe proporcionar un Objeto valido',
      'areas.*.discount_id.required': 'Debe proporcionar un descuento',
      'areas.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'services.array': 'Debe poporcionar un arreglo',
      'services.*.services_id.required': 'Debe proporcionar un servicio',
      'services.*.services_id.string': 'Debe proporcionar un dato alfanumerico',
      'services.*.services_id.objectId': 'Debe proporcionar un Objeto valido',
      'services.*.discount_id.required': 'Debe proporcionar un descuento',
      'services.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'services.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'products.array': 'Debe poporcionar un arreglo',
      'products.*.products_id.required': 'Debe proporcionar un producto',
      'products.*.products_id.string': 'Debe proporcionar un dato alfanumerico',
      'products.*.products_id.objectId': 'Debe proporcionar un Objeto valido',
      'products.*.discount_id.required': 'Debe proporcionar un descuento',
      'products.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'products.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'penalty.required': 'Debe proporcionar si habrán penalizaciones o no',
      'penalty.boolean': 'Debe proporcionar un dato booleano',

      'type_penalties.required': 'Debe proporcionar las penalizaciones',
      'type_penalties.array': 'Debe poporcionar un arreglo',

      'expiration_date.required': 'Debe proporcionar la fecha de vencimiento del paquete ',
      'expiration_date.date': 'Debe proporcionar una fecha valida',

      'corporate_group.required': 'Seleccione si es para un grupo corporativo o no',
      'corporate_group.boolean': 'Debe proporcionar un dato booleano',

      'partial_payment.required': 'Seleccione si puede tener pagos parciales o no',
      'partial_payment.boolean': 'Debe proporcionar un dato booleano',

      'number_days.required': 'Debe proporcionar los dias para el pago parcial',
      'number_days.number': 'Debe proporcionar un dato numerico',

      'discount_general.required': 'Debe proporcionar si tendra un descuento general o no',
      'discount_general.boolean': 'Debe proporcionar un dato booleano',

      'discount_id.required': 'Debe proporcionar un descuento',
      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'discount_individual.required': 'Debe proporcionar si tendra un descuento individual o no',
      'discount_individual.boolean': 'Debe proporcionar un dato booleano',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountPackageStore
