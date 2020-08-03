'use strict'

class AccountLotUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    const request = this.ctx.request
    let rules = {
      quantity: 'required|number',
      limit_stock: 'required|number',
      price_shop: 'required|number',
      price_sale: 'required|number',
      discount_id: 'accepted|string|objectId',
      tax_id: 'required|string|objectId',
    }

    return rules
  }

  get messages() {
    return {
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
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = AccountLotUpdate
