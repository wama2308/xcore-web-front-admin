'use strict'

class AccountDiscountUpdate {
  get validateAll () {
    return true
  }
  
  get rules () {
    return {
      name: 'required|string|min:2|max:100',
      type: 'required|string',
      value: 'required|number',
      start_date: 'required',
      final_date: 'required',

      class: 'accepted|array',
      'class.*.class_id': 'required|string|objectId',
      all_class: 'required|boolean',
      plans: 'accepted|array',
      'plans.*.plans_id': 'required|string|objectId',
      all_plans: 'required|boolean',
      areas: 'accepted|array',
      'areas.*.areas_id': 'required|string|objectId',
      all_areas: 'required|boolean',
      services: 'accepted|array',
      'services.*.services_id': 'required|string|objectId',
      all_services: 'required|boolean',
      products: 'accepted|array',
      'products.*.products_id': 'required|string|objectId',
      all_products: 'required|boolean',
      packages: 'accepted|array',
      'packages.*.packages_id': 'required|string|objectId',
      all_packages: 'required|boolean',

    }
  }

  get messages () {
    return {
      'name.required': 'Debe proporcionar un nombre',
      'name.string': 'Debe proporcionar un dato alfanumerico',
      'name.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'name.max': 'Debe proporcionar un nombre con un máximo de cien (100) caracteres',

      'type.required': 'Debe proporcionar el tipo de descuento',
      'type.string': 'Debe proporcionar un dato alfanumerico',

      'value.required': 'Debe proporcionar el valor del descuento',
      'value.number': 'Debe proporcionar un dato numerico',

      'start_date.required': 'Debe proporcionar la fecha inicial',
      'final_date.required': 'Debe proporcionar la fecha final',

      'class.array': 'Debe poporcionar un arreglo',
      'class.*.class_id.required': 'Debe proporcionar una clase',
      'class.*.class_id.string': 'Debe proporcionar un dato alfanumerico',
      'class.*.class_id.objectId': 'Debe proporcionar un Objeto valido',

      'all_class.required': 'Debe proporcionar si seran todas las clases o no',
      'all_class.boolean': 'Debe proporcionar un dato booleano',

      'plans.array': 'Debe poporcionar un arreglo',
      'plans.*.plans_id.required': 'Debe proporcionar un plan',
      'plans.*.plans_id.string': 'Debe proporcionar un dato alfanumerico',
      'plans.*.plans_id.objectId': 'Debe proporcionar un Objeto valido',

      'all_plans.required': 'Debe proporcionar si seran todos los planes o no',
      'all_plans.boolean': 'Debe proporcionar un dato booleano',

      'areas.array': 'Debe poporcionar un arreglo',
      'areas.*.areas_id.required': 'Debe proporcionar un area',
      'areas.*.areas_id.string': 'Debe proporcionar un dato alfanumerico',
      'areas.*.areas_id.objectId': 'Debe proporcionar un Objeto valido',

      'all_areas.required': 'Debe proporcionar si seran todas las areas o no',
      'all_areas.boolean': 'Debe proporcionar un dato booleano',

      'services.array': 'Debe poporcionar un arreglo',
      'services.*.services_id.required': 'Debe proporcionar un servicio',
      'services.*.services_id.string': 'Debe proporcionar un dato alfanumerico',
      'services.*.services_id.objectId': 'Debe proporcionar un Objeto valido',

      'all_services.required': 'Debe proporcionar si seran todas los servicios o no',
      'all_services.boolean': 'Debe proporcionar un dato booleano',

      'products.array': 'Debe poporcionar un arreglo',
      'products.*.products_id.required': 'Debe proporcionar un producto',
      'products.*.products_id.string': 'Debe proporcionar un dato alfanumerico',
      'products.*.products_id.objectId': 'Debe proporcionar un Objeto valido',

      'all_products.required': 'Debe proporcionar si seran todas los productos o no',
      'all_products.boolean': 'Debe proporcionar un dato booleano',

      'packages.array': 'Debe poporcionar un arreglo',
      'packages.*.packages_id.required': 'Debe proporcionar un paquete',
      'packages.*.packages_id.string': 'Debe proporcionar un dato alfanumerico',
      'packages.*.packages_id.objectId': 'Debe proporcionar un Objeto valido',

      'all_packages.required': 'Debe proporcionar si seran todas los paquetes o no',
      'all_packages.boolean': 'Debe proporcionar un dato booleano',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountDiscountUpdate
