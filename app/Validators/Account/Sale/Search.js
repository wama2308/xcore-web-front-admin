"use strict";

class AccountSaleSearch {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      search: "required|string",
    };
  }

  get messages() {
    return {
      "search.required": "Debe ingresar informacion para la busqueda",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages);
  }
}

module.exports = AccountSaleSearch;
