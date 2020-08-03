'use strict'

class AccountRewardStore {
  get validateAll() {
    return true
  }

  get rules() {
    const business_id = this.ctx.request.header('business_id')
    const branch_office_id  = this.ctx.request.header('branch_office_id')

    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      type_person: 'required|number',
      rule: 'required|number',
    }

    if (request.input('type_person') == 0) {
      rules = {
        ...rules,
        group_or_individual: 'required|boolean',
      }
    }

    switch (request.input('rule')) {
      case 0:
        rules = {
          ...rules,
          discount_all: 'required|boolean',
        }

        if (request.input('discount_all') == false) {
          rules = {
            ...rules,
            class: 'accepted|array',
            'class.*._id': 'required|string|objectId',
            'class.*.discount_id': 'required|string|objectId',
            service: 'accepted|array',
            'service.*._id': 'required|string|objectId',
            'service.*.discount_id': 'required|string|objectId',
            package: 'accepted|array',
            'package.*._id': 'required|string|objectId',
            'package.*.discount_id': 'required|string|objectId',
            plan: 'accepted|array',
            'plan.*._id': 'required|string|objectId',
            'plan.*.discount_id': 'required|string|objectId',
            product: 'accepted|array',
            'product.*._id': 'required|string|objectId',
            'product.*.discount_id': 'required|string|objectId',
          }
        }

        if (request.input('discount_all') == true) {
          rules = {
            ...rules,
            discount_id: 'required|string|objectId',
            class: 'accepted|array',
            'class.*._id': 'required|string|objectId',
            service: 'accepted|array',
            'service.*._id': 'required|string|objectId',
            package: 'accepted|array',
            'package.*._id': 'required|string|objectId',
            plan: 'accepted|array',
            'plan.*._id': 'required|string|objectId',
            product: 'accepted|array',
            'product.*._id': 'required|string|objectId',
          }
        }

        break;

      case 1:
        rules = {
          ...rules,
          amount: 'required|number',
        }
        break;

      case 2:
        rules = {
          ...rules,
          product: 'required|array',
          'product.*._id': 'required|string|objectId',
          'product.*.quantity': 'required|number',
        }
        break;

      case 3:
        rules = {
          ...rules,
          service: 'required|array',
          'service.*._id': 'required|string|objectId',
          'service.*.quantity': 'required|number',
        }
        break;

      case 4:
        rules = {
          ...rules,
          package: 'required|array',
          'package.*._id': 'required|string|objectId',
          'package.*.quantity': 'required|number',
        }
        break;

      case 5:
        rules = {
          ...rules,
          class: 'required|array',
          'class.*._id': 'required|string|objectId',
          'class.*.quantity': 'required|number',
        }
        break;

      case 6:
        rules = {
          ...rules,
          plan: 'required|array',
          'plan.*._id': 'required|string|objectId',
          'plan.*.quantity': 'required|number',
        }
        break;

      case 7:
        rules = {
          ...rules,
          specify: 'required|string|min:5|max:250',
        }
        break;

      default:
        break;
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

      'type_person.required': 'Debe proporcionar el tipo de persona',
      'type_person.number': 'Debe proporcionar un dato numerico',

      'rule.required': 'Debe proporcionar la regla',
      'rule.number': 'Debe proporcionar un dato numerico',

      'group_or_individual.required': 'Debe proporcionar si se es para grupos o individuos o no',
      'group_or_individual.boolean': 'Debe proporcionar un dato booleano',

      'amount.required': 'Debe proporcionar el monto que conlleva',
      'amount.number': 'Debe proporcionar un dato numerico',

      'specify.required': 'Debe proporcionar una especificación',
      'specify.string': 'Debe proporcionar un dato alfanumerico',
      'specify.min': 'Debe proporcionar un nombre con al menos cinco (5) caracteres',
      'specify.max': 'Debe proporcionar un nombre con un máximo de doscientos cincuenta (250) caracteres',

      'discount_all.required': 'Debe proporcionar si es un descuento para todos o no',
      'discount_all.boolean': 'Debe proporcionar un dato booleano',

      'discount_id.required': 'Debe proporcionar un descuento',
      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'class.required': 'Debe proporcionar clases',
      'class.array': 'Debe poporcionar un arreglo',
      'class.*._id.required': 'Debe proporcionar una clase',
      'class.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*._id.objectId': 'Debe proporcionar un Objeto valido',
      'class.*.discount_id.required': 'Debe proporcionar un descuento',
      'class.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',
      'class.*.quantity.required': 'Debe proporcionar la cantidad',
      'class.*.quantity.number': 'Debe proporcionar un dato numerico',

      'plan.required': 'Debe proporcionar planes',
      'plan.array': 'Debe poporcionar un arreglo',
      'plan.*._id.required': 'Debe proporcionar un plan',
      'plan.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'plan.*._id.objectId': 'Debe proporcionar un Objeto valido',
      'plan.*.discount_id.required': 'Debe proporcionar un descuento',
      'plan.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'plan.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',
      'plan.*.quantity.required': 'Debe proporcionar la cantidad',
      'plan.*.quantity.number': 'Debe proporcionar un dato numerico',

      'areas.required': 'Debe proporcionar areas',
      'areas.array': 'Debe poporcionar un arreglo',
      'areas.*._id.required': 'Debe proporcionar un area',
      'areas.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*._id.objectId': 'Debe proporcionar un Objeto valido',
      'areas.*.discount_id.required': 'Debe proporcionar un descuento',
      'areas.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',
      'areas.*.quantity.required': 'Debe proporcionar la cantidad',
      'areas.*.quantity.number': 'Debe proporcionar un dato numerico',

      'service.required': 'Debe proporcionar servicios',
      'service.array': 'Debe poporcionar un arreglo',
      'service.*._id.required': 'Debe proporcionar un servicio',
      'service.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'service.*._id.objectId': 'Debe proporcionar un Objeto valido',
      'service.*.discount_id.required': 'Debe proporcionar un descuento',
      'service.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'service.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',
      'service.*.quantity.required': 'Debe proporcionar la cantidad',
      'service.*.quantity.number': 'Debe proporcionar un dato numerico',

      'product.required': 'Debe proporcionar productos',
      'product.array': 'Debe poporcionar un arreglo',
      'product.*._id.required': 'Debe proporcionar un producto',
      'product.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'product.*._id.objectId': 'Debe proporcionar un Objeto valido',
      'product.*.discount_id.required': 'Debe proporcionar un descuento',
      'product.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'product.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',
      'product.*.quantity.required': 'Debe proporcionar la cantidad',
      'product.*.quantity.number': 'Debe proporcionar un dato numerico',

      'package.required': 'Debe proporcionar paquetes',
      'package.array': 'Debe poporcionar un arreglo',
      'package.*._id.required': 'Debe proporcionar un paquete',
      'package.*._id.string': 'Debe proporcionar un dato alfanumerico',
      'package.*._id.objectId': 'Debe proporcionar un Objeto valido',
      'package.*.discount_id.required': 'Debe proporcionar un descuento',
      'package.*.discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'package.*.discount_id.objectId': 'Debe proporcionar un Objeto valido',
      'package.*.quantity.required': 'Debe proporcionar la cantidad',
      'package.*.quantity.number': 'Debe proporcionar un dato numerico',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountRewardStore
