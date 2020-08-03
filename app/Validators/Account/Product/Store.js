'use strict'

class AccountProductStore {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      name: 'required|string|min:2|max:100',
      description: 'required|string|min:15|max:600',
      code: 'required|string|min:2|max:30',
      photo: 'accepted|string',
      quantity: 'required|number',
      limit_stock: 'required|number',
      price_shop: 'required|number',
      price_sale: 'required|number',
      tax_id: 'required|string|objectId',
      discount_id: 'accepted|string|objectId',
      type_supply_id: 'required|string|objectId',
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

      'code.required': 'Debe proporcionar un codigo',
      'code.string': 'Debe proporcionar un dato alfanumerico',
      'code.min': 'Debe proporcionar un nombre con al menos dos (2) caracteres',
      'code.max': 'Debe proporcionar un nombre con un máximo de treinta (30) caracteres',

      'photo.string': 'Debe proporcionar un dato alfanumerico',

      'quantity.required': 'Debe proporcionar una cantidad de productos',
      'quantity.number': 'Debe proporcionar un dato numerico',

      'limit_stock.required': 'Debe proporcionar una cantidad de productos minima para aceptable',
      'limit_stock.number': 'Debe proporcionar un dato numerico',

      'price_shop.required': 'Debe proporcionar un precio de compra',
      'price_shop.number': 'Debe proporcionar un dato numerico',

      'price_sale.required': 'Debe proporcionar un precio de venta',
      'price_sale.number': 'Debe proporcionar un dato numerico',

      'discount_id.string': 'Debe proporcionar un dato alfanumerico',
      'discount_id.objectId': 'Debe proporcionar un Objeto valido',

      'tax_id.required': 'Seleccione el impuesto sobre el producto',
      'tax_id.string': 'Debe proporcionar un dato alfanumerico',
      'tax_id.objectId': 'Debe proporcionar un Objeto valido',

      'type_supply_id.required': 'Seleccione el tipo de producto',
      'type_supply_id.string': 'Debe proporcionar un dato alfanumerico',
      'type_supply_id.objectId': 'Debe proporcionar un Objeto valido',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountProductStore
